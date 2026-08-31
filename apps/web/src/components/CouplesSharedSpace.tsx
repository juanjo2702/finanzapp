'use client';

import React, { useState } from 'react';
import { Users, Heart, ArrowRight, CheckCircle2, Plus, Sparkles, Sliders } from 'lucide-react';

interface CoupleExpense {
  id: string;
  title: string;
  totalAmount: number;
  currency: string;
  category: string;
  paidBy: 'USER' | 'PARTNER';
  userShareRatio: number;
  partnerShareRatio: number;
  date: string;
  isSettled: boolean;
}

interface CouplesProps {
  initialExpenses: CoupleExpense[];
  partnerName?: string;
}

export const CouplesSharedSpace: React.FC<CouplesProps> = ({
  initialExpenses,
  partnerName = 'Sofia',
}) => {
  const [expenses, setExpenses] = useState<CoupleExpense[]>(initialExpenses);
  const [splitRatio, setSplitRatio] = useState<number>(50); // 50% vs 50%
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSettledNotification, setIsSettledNotification] = useState(false);

  // New shared expense form
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Alimentación');
  const [newPaidBy, setNewPaidBy] = useState<'USER' | 'PARTNER'>('USER');

  // Calculation of balance
  // User paid total (unsettled)
  const userPaidUnsettled = expenses
    .filter((e) => !e.isSettled && e.paidBy === 'USER')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Partner paid total (unsettled)
  const partnerPaidUnsettled = expenses
    .filter((e) => !e.isSettled && e.paidBy === 'PARTNER')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalSharedUnsettled = userPaidUnsettled + partnerPaidUnsettled;
  const userExpectedShare = totalSharedUnsettled * (splitRatio / 100);
  const partnerExpectedShare = totalSharedUnsettled * ((100 - splitRatio) / 100);

  // Net debt: if positive, partner owes user; if negative, user owes partner
  const netOwedToUser = userPaidUnsettled - userExpectedShare;

  const handleSettleAll = () => {
    setExpenses((prev) => prev.map((e) => ({ ...e, isSettled: true })));
    setIsSettledNotification(true);
    setTimeout(() => setIsSettledNotification(false), 3000);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    const newItem: CoupleExpense = {
      id: `cpl-${Date.now()}`,
      title: newTitle,
      totalAmount: parseFloat(newAmount),
      currency: 'BOB',
      category: newCategory,
      paidBy: newPaidBy,
      userShareRatio: splitRatio / 100,
      partnerShareRatio: (100 - splitRatio) / 100,
      date: new Date().toISOString().split('T')[0],
      isSettled: false,
    };

    setExpenses([newItem, ...expenses]);
    setShowAddModal(false);
    setNewTitle('');
    setNewAmount('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner with Partner Info */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-slate-900/40 border border-pink-500/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
              <Heart className="h-6 w-6 fill-white/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Finanzas Compartidas &middot; Juan José & {partnerName}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                  Modo Pareja Activo
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Control de gastos del hogar, división justa y liquidación sin fricción
              </p>
            </div>
          </div>

          {/* Contribution Ratio Selector */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Sliders className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500 font-medium">Aporte:</span>
            <button
              onClick={() => setSplitRatio(50)}
              className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                splitRatio === 50
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              50/50
            </button>
            <button
              onClick={() => setSplitRatio(60)}
              className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                splitRatio === 60
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              60/40
            </button>
            <button
              onClick={() => setSplitRatio(70)}
              className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                splitRatio === 70
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              70/30
            </button>
          </div>
        </div>

        {/* Live Balance Card */}
        <div className="mt-5 p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 flex items-center justify-center font-bold text-sm">
              ⚖️
            </div>
            <div>
              <p className="text-xs text-slate-500">Balance Actual de Gastos Pendientes:</p>
              {Math.abs(netOwedToUser) < 1 ? (
                <p className="text-base font-bold text-emerald-600">¡Están completamente al día! (Bs. 0.00)</p>
              ) : netOwedToUser > 0 ? (
                <p className="text-base font-bold text-emerald-600">
                  {partnerName} te debe{' '}
                  <span className="text-lg">Bs. {netOwedToUser.toFixed(2)}</span> para equilibrar
                </p>
              ) : (
                <p className="text-base font-bold text-rose-600">
                  Tú le debes a {partnerName}{' '}
                  <span className="text-lg">Bs. {Math.abs(netOwedToUser).toFixed(2)}</span> para equilibrar
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSettleAll}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Saldar Cuenta (1-Click)</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Nuevo Gasto de Pareja</span>
            </button>
          </div>
        </div>
      </div>

      {isSettledNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ¡Cuentas saldadas exitosamente! Se registró la conciliación del periodo.
        </div>
      )}

      {/* Shared Expenses List */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Historial de Gastos Compartidos del Hogar
        </h4>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {expenses.map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center font-bold text-xs">
                  {item.paidBy === 'USER' ? 'JR' : 'SO'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Pagado por: {item.paidBy === 'USER' ? 'Juan José' : partnerName}
                    </span>
                    <span>&bull;</span>
                    <span>{item.category}</span>
                    <span>&bull;</span>
                    <span>{item.date}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Bs. {item.totalAmount.toFixed(2)}
                </span>
                <p className="text-[10px] text-slate-400">
                  {item.isSettled ? (
                    <span className="text-emerald-500 font-bold">Conciliado</span>
                  ) : (
                    <span>Pendiente de saldar</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Couple Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Registrar Gasto de Pareja / Hogar
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Se dividirá automáticamente según la regla configurada ({splitRatio}% / {100 - splitRatio}%)
            </p>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Descripción del gasto
                </label>
                <input
                  type="text"
                  placeholder="Ej: Supermercado, Alquiler, Restaurante, Salida"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Monto Total (Bs)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">¿Quién lo pagó?</label>
                  <select
                    value={newPaidBy}
                    onChange={(e) => setNewPaidBy(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="USER">Juan José (Yo)</option>
                    <option value="PARTNER">{partnerName}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white rounded-xl shadow-sm"
                >
                  Guardar Gasto Compartido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
