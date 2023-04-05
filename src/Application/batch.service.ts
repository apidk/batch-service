import { Injectable } from '@nestjs/common';
import { BatchRequestDto } from '../DTO/batch-request-dto';
import { BatchResponseDto } from '../DTO/batch-response-dto';
import { HttpGateway } from '../Infrastructure/http-gateway';

@Injectable()
export class BatchService {
  constructor(private readonly httpGateway: HttpGateway) {}
  async processBatch(dto: BatchRequestDto): Promise<BatchResponseDto> {
    const apiRequestParameters = dto.payloads.map((payload) => {
      return {
        url: this.substituteUrlParameters(dto.url, payload),
        method: dto.verb,
        body: dto.body,
      };
    });

    return this.httpGateway.executeBatchRequests(apiRequestParameters);
  }

  private substituteUrlParameters(
    url: string,
    parameters: Record<string, any>,
  ): string {
    return Object.keys(parameters).reduce((url, key) => {
      return url.replace(`{${key}}`, parameters[key]);
    }, url);
  }
}
