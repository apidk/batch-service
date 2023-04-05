export class BatchResponseDto {
  constructor(
    public readonly responses: Array<{
      success: boolean;
      statusCode: number;
      responseBody: Record<string, any>;
    }>,
  ) {}
}
