import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BatchService } from './Application/batch.service';
import { HttpGateway } from './Infrastructure/http-gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [BatchService, HttpGateway],
})
export class AppModule {}
