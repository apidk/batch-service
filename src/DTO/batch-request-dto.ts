import { ApiProperty } from '@nestjs/swagger';

// Possible improvement: add validation
export class BatchRequestDto {
  @ApiProperty({
    description: 'The URL to call',
    minLength: 1,
    default: 'https://awesome-api.com',
  })
  url: string;

  @ApiProperty({
    description: 'The request method',
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    default: 'POST',
  })
  verb: string;

  @ApiProperty({
    description: 'Array of the request parameters',
    type: 'array',
    items: {
      type: 'object',
    },
  })
  payloads: Array<Record<string, any>>;

  @ApiProperty({
    description: 'Request body object',
    type: 'object',
  })
  body: Record<string, any>;
}
