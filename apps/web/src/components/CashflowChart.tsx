'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';

interface CashflowChartProps {
  history: Array<{ month: string; income: number; expenses: number }>;
}

export const CashflowChart: React.FC<CashflowChartProps> = ({ history }) => {
  const maxVal = Math.max(...history.flatMap((h) => [h.income, h.expenses]), 10000);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Flujo de Caja Mensual</h3>
            <p className="text-xs text-slate-500">Ingresos vs Gastos últimos 6 meses</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Ingresos
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" /> Gastos
          </span>
        </div>
      </div>

      {/* Responsive Bar Graphic */}
      <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-100 dark:border-slate-800">
        {history.map((item, idx) => {
          const incomeHeight = (item.income / maxVal) * 100;
          const expenseHeight = (item.expenses / maxVal) * 100;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                {/* Income Bar */}
                <div
                  style={{ height: `${incomeHeight}%` }}
                  className="w-full max-w-[18px] bg-emerald-500/90 rounded-t-md group-hover:bg-emerald-400 transition-all relative"
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap pointer-events-none transition-opacity z-10">
                    Bs. {item.income}
                  </span>
                </div>
                {/* Expense Bar */}
                <div
                  style={{ height: `${expenseHeight}%` }}
                  className="w-full max-w-[18px] bg-rose-500/90 rounded-t-md group-hover:bg-rose-400 transition-all relative"
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap pointer-events-none transition-opacity z-10">
                    Bs. {item.expenses}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-1">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
