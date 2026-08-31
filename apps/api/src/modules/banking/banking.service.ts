import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiCategorizerService } from '../ai-categorizer/ai-categorizer.service';
import { BoliviaSmsParser } from './parsers/bolivia-sms-parser';
import { BankStatementParser } from './parsers/bank-statement-parser';
import { ParseSmsDto, TransactionSource, TransactionType } from '@finanzapp/shared-types';

@Injectable()
export class BankingService {
  constructor(
    private prisma: PrismaService,
    private aiCategorizer: AiCategorizerService,
  ) {}

  async parseSmsOrNotification(userId: string, dto: ParseSmsDto) {
    const parsed = BoliviaSmsParser.parse(dto.rawMessage);

    if (!parsed) {
      throw new BadRequestException('No se pudo extraer información financiera válida del mensaje proporcionado.');
    }

    // 1. Run AI categorization on detected merchant
    const aiResult = this.aiCategorizer.categorize(parsed.merchantName);

    // 2. Find matching category in DB or system default
    const matchedCategory = await this.prisma.category.findFirst({
      where: {
        OR: [
          { name: { contains: aiResult.suggestedCategory, mode: 'insensitive' }, userId },
          { name: { contains: aiResult.suggestedCategory, mode: 'insensitive' }, isSystem: true },
        ],
      },
    });

    // 3. Find target account
    let targetAccount = null;
    if (dto.accountIdHint) {
      targetAccount = await this.prisma.account.findFirst({
        where: { id: dto.accountIdHint, userId },
      });
    }

    if (!targetAccount) {
      // Find first account with matching currency
      targetAccount = await this.prisma.account.findFirst({
        where: { userId, currency: parsed.currency as any, isArchived: false },
        orderBy: { balance: 'desc' },
      });
    }

    return {
      parsedTransaction: parsed,
      aiCategorization: aiResult,
      suggestedCategory: matchedCategory,
      suggestedAccount: targetAccount,
      canAutoConfirm: !!(targetAccount && matchedCategory),
    };
  }

  async processAndSaveParsedTransaction(
    userId: string,
    data: {
      accountId: string;
      categoryId?: string;
      amount: number;
      currency: string;
      merchantName: string;
      notes?: string;
      rawPayload?: string;
    },
  ) {
    const account = await this.prisma.account.findFirst({
      where: { id: data.accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Cuenta seleccionada no encontrada');
    }

    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          userId,
          accountId: data.accountId,
          categoryId: data.categoryId,
          amount: data.amount,
          currency: (data.currency || 'BOB') as any,
          exchangeRate: 1.0,
          baseAmount: data.amount,
          type: TransactionType.EXPENSE as any,
          merchantName: data.merchantName,
          notes: data.notes || 'Registrado automáticamente desde Notificación Bancaria',
          source: TransactionSource.SMS_PARSER as any,
          rawPayload: data.rawPayload,
          transactionDate: new Date(),
        },
        include: { account: true, category: true },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: { decrement: data.amount } },
      });

      return transaction;
    });
  }

  async parseStatementFile(userId: string, csvContent: string) {
    const items = BankStatementParser.parseCsv(csvContent);

    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const ai = this.aiCategorizer.categorize(item.merchantName);
        const cat = await this.prisma.category.findFirst({
          where: {
            OR: [
              { name: { contains: ai.suggestedCategory, mode: 'insensitive' }, userId },
              { name: { contains: ai.suggestedCategory, mode: 'insensitive' }, isSystem: true },
            ],
          },
        });
        return {
          ...item,
          suggestedCategoryId: cat?.id,
          suggestedCategoryName: cat?.name || ai.suggestedCategory,
        };
      }),
    );

    return {
      totalFound: items.length,
      transactions: enrichedItems,
    };
  }
}
