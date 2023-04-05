import { Body, Controller, Get, Post } from '@nestjs/common';
import { BatchService } from './Application/batch.service';
import { BatchRequestDto } from './DTO/batch-request-dto';

@Controller()
export class AppController {
  constructor(private readonly batchService: BatchService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post('/batch')
  async batch(@Body() dto: BatchRequestDto) {
    return this.batchService.processBatch(dto);
  }
}
