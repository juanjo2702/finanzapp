import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BankingService } from './banking.service';
import { ParseSmsDto } from '@finanzapp/shared-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Banking & Automation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('banking')
export class BankingController {
  constructor(private bankingService: BankingService) {}

  @Post('parse-notification')
  @ApiOperation({ summary: 'Parsear y categorizar SMS o Notificación Push bancaria (BCP, BNB, Unión, Bisa, BMSC, QR)' })
  async parseNotification(@CurrentUser() user: any, @Body() dto: ParseSmsDto) {
    return this.bankingService.parseSmsOrNotification(user.id, dto);
  }

  @Post('confirm-parsed-transaction')
  @ApiOperation({ summary: 'Confirmar y guardar la transacción parseada automáticamente' })
  async confirmTransaction(
    @CurrentUser() user: any,
    @Body()
    body: {
      accountId: string;
      categoryId?: string;
      amount: number;
      currency: string;
      merchantName: string;
      notes?: string;
      rawPayload?: string;
    },
  ) {
    return this.bankingService.processAndSaveParsedTransaction(user.id, body);
  }

  @Post('parse-statement')
  @ApiOperation({ summary: 'Parsear extracto bancario CSV / Tabular' })
  async parseStatement(@CurrentUser() user: any, @Body() body: { csvContent: string }) {
    return this.bankingService.parseStatementFile(user.id, body.csvContent);
  }
}
