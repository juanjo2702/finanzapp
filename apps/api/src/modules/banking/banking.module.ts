import { Module } from '@nestjs/common';
import { BankingService } from './banking.service';
import { BankingController } from './banking.controller';
import { AiCategorizerService } from '../ai-categorizer/ai-categorizer.service';

@Module({
  controllers: [BankingController],
  providers: [BankingService, AiCategorizerService],
  exports: [BankingService, AiCategorizerService],
})
export class BankingModule {}
