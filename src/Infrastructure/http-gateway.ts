import { Injectable } from '@nestjs/common';
import { BatchResponseDto } from '../DTO/batch-response-dto';
import Bottleneck from 'bottleneck';

interface RequestParametersInterface {
  url: string;
  method: string;
  body: Record<string, any>;
}
interface ResponseInterface {
  success: boolean;
  statusCode: number;
  responseBody: Record<string, any>;
}

const REJECTED_STATUS = 'rejected';
const JSON_HEADER = 'application/json';
const RETRYABLE_STATUS_CODES = [500, 502, 503, 504];

const groupLimiter = new Bottleneck.Group({
  reservoir: 5,
  reservoirRefreshAmount: 5,
  reservoirRefreshInterval: 1000 * 10, // 10 seconds
  // 5 requests per 10 seconds
  maxConcurrent: 5,
  minTime: 1,
});

@Injectable()
export class HttpGateway {
  async executeBatchRequests(
    batchParameters: Array<RequestParametersInterface>,
  ) {
    const results = await Promise.allSettled(
      batchParameters.map((parameter) => {
        const hostname = new URL(parameter.url).hostname;

        // in the real world scenario we should consider using the external data
        // storage, like redis instead of in-memory storage
        return groupLimiter.key(hostname).wrap(this.doRequest.bind(this))(
          parameter,
        );
      }),
    );

    return this.processResults(results);
  }

  async doRequest(parameters: RequestParametersInterface): Promise<{
    success: boolean;
    statusCode: number;
    responseBody: Record<string, any>;
  }> {
    console.info('Executing request to:', parameters.url);

    let result = await this.executeRequest(parameters);

    // Idempotency is not considered here
    if (!result.ok && RETRYABLE_STATUS_CODES.includes(result.status)) {
      result = await this.executeRequest(parameters);
    }

    const success = result.ok;
    const statusCode = result.status;

    let responseBody;
    if (result.headers.get('Content-Type')?.includes(JSON_HEADER)) {
      responseBody = await result.json();
    } else {
      responseBody = await result.text();
    }

    return {
      success,
      statusCode,
      responseBody,
    };
  }

  private async executeRequest(
    parameters: RequestParametersInterface,
  ): Promise<Response> {
    return fetch(parameters.url, {
      headers: {
        'Content-Type': JSON_HEADER,
      },
      method: parameters.method,
      // Include the request body only if it's not a GET request
      ...(parameters.method !== 'GET' && {
        body: JSON.stringify(parameters.body),
      }),
    });
  }

  private processResults(
    results: Array<
      PromiseFulfilledResult<ResponseInterface> | PromiseRejectedResult
    >,
  ): BatchResponseDto {
    const responses = results.map((result) => {
      if (result.status === REJECTED_STATUS) {
        // Logger can be added instead of the console
        console.error('Rejection while processing request');
        console.error(result.reason.message);
        console.error(result.reason.stack);

        return {
          success: false,
          statusCode: 500,
          responseBody: {},
        };
      }

      return result.value;
    });

    return new BatchResponseDto(responses);
  }
}
