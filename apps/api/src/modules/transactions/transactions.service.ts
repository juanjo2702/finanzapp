import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto, TransactionFilterDto, TransactionType } from '@finanzapp/shared-types';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filter: TransactionFilterDto) {
    const where: any = { userId };

    if (filter.accountId) where.accountId = filter.accountId;
    if (filter.categoryId) where.categoryId = filter.categoryId;
    if (filter.type) where.type = filter.type as any;

    if (filter.startDate || filter.endDate) {
      where.transactionDate = {};
      if (filter.startDate) where.transactionDate.gte = new Date(filter.startDate);
      if (filter.endDate) where.transactionDate.lte = new Date(filter.endDate);
    }

    if (filter.search) {
      where.OR = [
        { merchantName: { contains: filter.search, mode: 'insensitive' } },
        { notes: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const page = Number(filter.page) || 1;
    const limit = Number(filter.limit) || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { transactionDate: 'desc' },
        include: {
          account: true,
          category: true,
          destinationAccount: true,
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { account: true, category: true, destinationAccount: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }

    return transaction;
  }

  async create(userId: string, dto: CreateTransactionDto) {
    const account = await this.prisma.account.findFirst({
      where: { id: dto.accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Cuenta de origen no encontrada');
    }

    if (dto.type === TransactionType.TRANSFER && !dto.destinationAccountId) {
      throw new BadRequestException('Se requiere una cuenta de destino para transferencias');
    }

    const exchangeRate = dto.exchangeRate || 1.0;
    const baseAmount = dto.amount * exchangeRate;

    // Use Prisma transaction to ensure balance consistency
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          userId,
          accountId: dto.accountId,
          categoryId: dto.categoryId,
          destinationAccountId: dto.destinationAccountId,
          amount: dto.amount,
          currency: dto.currency as any,
          exchangeRate,
          baseAmount,
          type: dto.type as any,
          merchantName: dto.merchantName,
          notes: dto.notes,
          transactionDate: new Date(dto.transactionDate),
          source: dto.source as any,
          isRecurring: dto.isRecurring || false,
          tags: dto.tags || [],
          rawPayload: dto.rawPayload,
        },
        include: {
          account: true,
          category: true,
          destinationAccount: true,
        },
      });

      // Update balances
      if (dto.type === TransactionType.EXPENSE) {
        await tx.account.update({
          where: { id: dto.accountId },
          data: { balance: { decrement: dto.amount } },
        });
      } else if (dto.type === TransactionType.INCOME) {
        await tx.account.update({
          where: { id: dto.accountId },
          data: { balance: { increment: dto.amount } },
        });
      } else if (dto.type === TransactionType.TRANSFER && dto.destinationAccountId) {
        await tx.account.update({
          where: { id: dto.accountId },
          data: { balance: { decrement: dto.amount } },
        });
        await tx.account.update({
          where: { id: dto.destinationAccountId },
          data: { balance: { increment: dto.amount } },
        });
      }

      return transaction;
    });
  }

  async delete(userId: string, id: string) {
    const transaction = await this.findOne(userId, id);

    return this.prisma.$transaction(async (tx) => {
      // Revert account balances
      if (transaction.type === 'EXPENSE') {
        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: transaction.amount } },
        });
      } else if (transaction.type === 'INCOME') {
        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { decrement: transaction.amount } },
        });
      } else if (transaction.type === 'TRANSFER' && transaction.destinationAccountId) {
        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: transaction.amount } },
        });
        await tx.account.update({
          where: { id: transaction.destinationAccountId },
          data: { balance: { decrement: transaction.amount } },
        });
      }

      return tx.transaction.delete({ where: { id } });
    });
  }
}
