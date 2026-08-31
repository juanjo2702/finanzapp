import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBudgetDto, BudgetModel } from '@finanzapp/shared-types';
import { startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const budgets = await this.prisma.budget.findMany({
      where: { userId },
      include: { category: true },
    });

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Calculate actual spent per category in this month
    const results = await Promise.all(
      budgets.map(async (b) => {
        const aggregate = await this.prisma.transaction.aggregate({
          where: {
            userId,
            categoryId: b.categoryId,
            type: 'EXPENSE',
            transactionDate: {
              gte: b.startDate || monthStart,
              lte: b.endDate || monthEnd,
            },
          },
          _sum: { baseAmount: true },
        });

        const spentAmount = aggregate._sum.baseAmount || 0;
        const progressPercentage = b.limitAmount > 0 ? Math.min((spentAmount / b.limitAmount) * 100, 100) : 0;

        return {
          ...b,
          spentAmount,
          remainingAmount: Math.max(b.limitAmount - spentAmount, 0),
          isExceeded: spentAmount > b.limitAmount,
          progressPercentage: Number(progressPercentage.toFixed(1)),
        };
      }),
    );

    return results;
  }

  async create(userId: string, dto: CreateBudgetDto) {
    return this.prisma.budget.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        limitAmount: dto.limitAmount,
        period: dto.period as any,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
      include: { category: true },
    });
  }

  async delete(userId: string, id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      throw new NotFoundException('Presupuesto no encontrado');
    }

    return this.prisma.budget.delete({ where: { id } });
  }
}
