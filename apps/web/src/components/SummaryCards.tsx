'use client';

import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Clock, ShieldCheck } from 'lucide-react';

interface SummaryCardsProps {
  summary: {
    netWorthInBaseCurrency: number;
    totalIncomeThisMonth: number;
    totalExpensesThisMonth: number;
    netSavingsThisMonth: number;
    savingsRatePercentage: number;
    cashFlowRunwayDays: number;
    currency: string;
  };
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Patrimonio Neto */}
      <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Patrimonio Neto Total
          </span>
          <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bs. {summary.netWorthInBaseCurrency.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Consolidado multimoneda (BOB, USD, USDT)
          </p>
        </div>
      </div>

      {/* 2. Ingresos vs Gastos */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Gastos vs Ingresos (Mes)
          </span>
          <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <TrendingDown className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bs. {summary.totalExpensesThisMonth.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              + Bs. {summary.totalIncomeThisMonth.toLocaleString('es-BO')} Ingresos
            </span>
          </div>
        </div>
      </div>

      {/* 3. Ahorro Neto & Tasa */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Ahorro Neto del Mes
          </span>
          <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <PiggyBank className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            + Bs. {summary.netSavingsThisMonth.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {summary.savingsRatePercentage}% Tasa de Ahorro
            </span>
          </div>
        </div>
      </div>

      {/* 4. Autonomía Financiera (Runway) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Autonomía / Runway
          </span>
          <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
            {summary.cashFlowRunwayDays} días
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Meses cubiertos con tu liquidez actual sin nuevos ingresos.
          </p>
        </div>
      </div>
    </div>
  );
};
