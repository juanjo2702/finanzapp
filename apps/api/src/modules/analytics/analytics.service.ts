import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsSummary, CategoryClassification, Currency } from '@finanzapp/shared-types';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary(userId: string): Promise<AnalyticsSummary> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: { where: { isArchived: false } } },
    });

    const baseCurrency = (user?.baseCurrency as Currency) || Currency.BOB;

    // 1. Calculate Net Worth across active accounts
    const netWorthInBaseCurrency = (user?.accounts || []).reduce((acc, curr) => {
      // If same currency 1:1, else approximate (in future using live exchange rate service)
      const rate = curr.currency === 'USD' ? 6.96 : curr.currency === 'USDT' ? 10.5 : 1.0;
      return acc + curr.balance * rate;
    }, 0);

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // 2. Fetch all transactions for this month
    const thisMonthTransactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: { gte: monthStart, lte: monthEnd },
      },
      include: { category: true },
    });

    let totalIncomeThisMonth = 0;
    let totalExpensesThisMonth = 0;
    let needsAmount = 0;
    let wantsAmount = 0;
    let savingsAmount = 0;

    for (const t of thisMonthTransactions) {
      if (t.type === 'INCOME') {
        totalIncomeThisMonth += t.baseAmount;
      } else if (t.type === 'EXPENSE') {
        totalExpensesThisMonth += t.baseAmount;

        const classification = t.category?.classification;
        if (classification === 'NEEDS') {
          needsAmount += t.baseAmount;
        } else if (classification === 'WANTS') {
          wantsAmount += t.baseAmount;
        } else if (classification === 'SAVINGS_DEBT') {
          savingsAmount += t.baseAmount;
        } else {
          needsAmount += t.baseAmount; // Default fallback
        }
      }
    }

    const netSavingsThisMonth = totalIncomeThisMonth - totalExpensesThisMonth;
    const savingsRatePercentage = totalIncomeThisMonth > 0 ? (netSavingsThisMonth / totalIncomeThisMonth) * 100 : 0;

    const totalTrackedExpense = needsAmount + wantsAmount + savingsAmount || 1;
    const needsPercentage = (needsAmount / totalTrackedExpense) * 100;
    const wantsPercentage = (wantsAmount / totalTrackedExpense) * 100;
    const savingsPercentage = (savingsAmount / totalTrackedExpense) * 100;

    // Runway calculation: (Liquid Net Worth / Daily average expense)
    const daysPassedInMonth = Math.max(now.getDate(), 1);
    const dailyBurnRate = totalExpensesThisMonth / daysPassedInMonth;
    const cashFlowRunwayDays = dailyBurnRate > 0 ? Math.round(netWorthInBaseCurrency / dailyBurnRate) : 999;

    return {
      netWorthInBaseCurrency: Number(netWorthInBaseCurrency.toFixed(2)),
      totalIncomeThisMonth: Number(totalIncomeThisMonth.toFixed(2)),
      totalExpensesThisMonth: Number(totalExpensesThisMonth.toFixed(2)),
      netSavingsThisMonth: Number(netSavingsThisMonth.toFixed(2)),
      savingsRatePercentage: Number(savingsRatePercentage.toFixed(1)),
      rule503020: {
        needsAmount: Number(needsAmount.toFixed(2)),
        needsPercentage: Number(needsPercentage.toFixed(1)),
        wantsAmount: Number(wantsAmount.toFixed(2)),
        wantsPercentage: Number(wantsPercentage.toFixed(1)),
        savingsAmount: Number(savingsAmount.toFixed(2)),
        savingsPercentage: Number(savingsPercentage.toFixed(1)),
      },
      cashFlowRunwayDays,
      currency: baseCurrency,
    };
  }

  async getCashFlowMonthlyHistory(userId: string, monthsCount = 6) {
    const history = [];
    const now = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const targetDate = subMonths(now, i);
      const mStart = startOfMonth(targetDate);
      const mEnd = endOfMonth(targetDate);
      const label = format(mStart, 'MMM yyyy');

      const transactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          transactionDate: { gte: mStart, lte: mEnd },
        },
      });

      let income = 0;
      let expenses = 0;

      for (const t of transactions) {
        if (t.type === 'INCOME') income += t.baseAmount;
        if (t.type === 'EXPENSE') expenses += t.baseAmount;
      }

      history.push({
        month: label,
        income: Number(income.toFixed(2)),
        expenses: Number(expenses.toFixed(2)),
        netSavings: Number((income - expenses).toFixed(2)),
      });
    }

    return history;
  }

  async getCategoryBreakdown(userId: string) {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const expenses = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        transactionDate: { gte: monthStart, lte: monthEnd },
      },
      include: { category: true },
    });

    const categoryMap = new Map<string, { name: string; color: string; icon: string; amount: number; classification: string }>();

    let total = 0;
    for (const exp of expenses) {
      const catName = exp.category?.name || 'Sin Categoría';
      const catColor = exp.category?.color || '#94a3b8';
      const catIcon = exp.category?.icon || 'tag';
      const classification = exp.category?.classification || 'NEEDS';

      const current = categoryMap.get(catName) || { name: catName, color: catColor, icon: catIcon, amount: 0, classification };
      current.amount += exp.baseAmount;
      total += exp.baseAmount;
      categoryMap.set(catName, current);
    }

    return Array.from(categoryMap.values()).map((c) => ({
      ...c,
      amount: Number(c.amount.toFixed(2)),
      percentage: total > 0 ? Number(((c.amount / total) * 100).toFixed(1)) : 0,
    }));
  }

  async getSankeyData(userId: string) {
    const summary = await this.getDashboardSummary(userId);
    const breakdown = await this.getCategoryBreakdown(userId);

    // Sankey Nodes and Links representation
    const nodes = [
      { name: 'Ingresos Totales' },
      { name: 'Necesidades (50%)' },
      { name: 'Deseos (30%)' },
      { name: 'Ahorros / Deuda (20%)' },
      ...breakdown.map((b) => ({ name: b.name })),
    ];

    const links = [
      { source: 0, target: 1, value: summary.rule503020.needsAmount || 1 },
      { source: 0, target: 2, value: summary.rule503020.wantsAmount || 1 },
      { source: 0, target: 3, value: summary.rule503020.savingsAmount || 1 },
    ];

    return { nodes, links };
  }
}
