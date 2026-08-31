'use client';

import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Search, Sparkles, Smartphone, Landmark, SlidersHorizontal } from 'lucide-react';

interface TransactionItem {
  id: string;
  merchantName: string;
  accountName: string;
  categoryName: string;
  categoryColor: string;
  classification: string;
  amount: number;
  currency: string;
  type: string;
  source: string;
  date: string;
  notes?: string;
}

interface TransactionListProps {
  transactions: TransactionItem[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'ALL' || tx.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Últimos Movimientos</h3>
          <p className="text-xs text-slate-500">Historial en tiempo real de gastos, ingresos y transferencias</p>
        </div>

        {/* Search & Filter pills */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar comercio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44 sm:w-56"
            />
          </div>

          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('EXPENSE')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'EXPENSE'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Gastos
            </button>
            <button
              onClick={() => setFilterType('INCOME')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'INCOME'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Ingresos
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.map((tx) => {
          const isExpense = tx.type === 'EXPENSE';

          return (
            <div
              key={tx.id}
              className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                    isExpense
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isExpense ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{tx.merchantName}</p>
                    {tx.source === 'SMS_PARSER' && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        <Smartphone className="h-2.5 w-2.5" /> SMS Auto
                      </span>
                    )}
                    {tx.source === 'PUSH_NOTIFICATION' && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        <Sparkles className="h-2.5 w-2.5" /> Push
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      style={{ backgroundColor: `${tx.categoryColor}15`, color: tx.categoryColor }}
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    >
                      {tx.categoryName}
                    </span>
                    <span className="text-[11px] text-slate-400">&bull;</span>
                    <span className="text-[11px] text-slate-500">{tx.accountName}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-sm font-bold ${
                    isExpense ? 'text-slate-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isExpense ? '-' : '+'} {tx.currency === 'USD' ? '$' : 'Bs.'}{' '}
                  {tx.amount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString('es-BO')}</p>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-400">
            No se encontraron movimientos con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
};
