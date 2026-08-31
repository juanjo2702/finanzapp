'use client';

import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

interface Rule503020Props {
  rule: {
    needsAmount: number;
    needsPercentage: number;
    wantsAmount: number;
    wantsPercentage: number;
    savingsAmount: number;
    savingsPercentage: number;
  };
}

export const Rule503020Card: React.FC<Rule503020Props> = ({ rule }) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Distribución Regla 50 / 30 / 20</h3>
            <p className="text-xs text-slate-500">Balance presupuestario de este mes</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
          <CheckCircle2 className="h-3 w-3" /> Saludable
        </span>
      </div>

      {/* Progress Multi-Bar */}
      <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner mb-5">
        <div
          style={{ width: `${Math.min(rule.needsPercentage, 100)}%` }}
          className="bg-blue-500 h-full transition-all duration-500"
          title={`Necesidades: ${rule.needsPercentage}%`}
        />
        <div
          style={{ width: `${Math.min(rule.wantsPercentage, 100)}%` }}
          className="bg-pink-500 h-full transition-all duration-500"
          title={`Deseos: ${rule.wantsPercentage}%`}
        />
        <div
          style={{ width: `${Math.min(rule.savingsPercentage, 100)}%` }}
          className="bg-emerald-500 h-full transition-all duration-500"
          title={`Ahorros: ${rule.savingsPercentage}%`}
        />
      </div>

      {/* 3 Pillars Detail */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Needs */}
        <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-blue-900 dark:text-blue-200">50% Necesidades</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{rule.needsPercentage}%</span>
          </div>
          <p className="text-base font-bold text-slate-800 dark:text-slate-100">
            Bs. {rule.needsAmount.toLocaleString('es-BO')}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Alquiler, súper, luz, agua, salud</p>
        </div>

        {/* Wants */}
        <div className="p-3.5 rounded-xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/40">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-pink-900 dark:text-pink-200">30% Deseos / Ocio</span>
            <span className="font-bold text-pink-600 dark:text-pink-400">{rule.wantsPercentage}%</span>
          </div>
          <p className="text-base font-bold text-slate-800 dark:text-slate-100">
            Bs. {rule.wantsAmount.toLocaleString('es-BO')}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Restaurantes, salidas, streaming</p>
        </div>

        {/* Savings & Debt */}
        <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-emerald-900 dark:text-emerald-200">20% Ahorro & Deuda</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{rule.savingsPercentage}%</span>
          </div>
          <p className="text-base font-bold text-slate-800 dark:text-slate-100">
            Bs. {rule.savingsAmount.toLocaleString('es-BO')}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Fondo emergencia, inversiones</p>
        </div>
      </div>
    </div>
  );
};
