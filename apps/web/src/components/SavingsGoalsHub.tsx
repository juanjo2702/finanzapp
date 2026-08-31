'use client';

import React, { useState } from 'react';
import { Target, ShieldCheck, Plus, Sparkles, TrendingUp, Calendar, Check } from 'lucide-react';

interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadlineDate?: string;
  color: string;
  icon: string;
  monthlyRequiredContribution: number;
}

interface SavingsProps {
  initialGoals: SavingsGoal[];
}

export const SavingsGoalsHub: React.FC<SavingsProps> = ({ initialGoals }) => {
  const [goals, setGoals] = useState<SavingsGoal[]>(initialGoals);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add contribution modal
  const [contribGoal, setContribGoal] = useState<SavingsGoal | null>(null);
  const [contribAmount, setContribAmount] = useState('');

  // New Goal Form
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCurrent, setNewCurrent] = useState('');
  const [newCurrency, setNewCurrency] = useState('BOB');
  const [newDeadline, setNewDeadline] = useState('2026-12-31');

  const totalSaved = goals.reduce((acc, curr) => {
    const amountInBob = curr.currency === 'USD' ? curr.currentAmount * 6.96 : curr.currentAmount;
    return acc + amountInBob;
  }, 0);

  const totalTarget = goals.reduce((acc, curr) => {
    const amountInBob = curr.currency === 'USD' ? curr.targetAmount * 6.96 : curr.targetAmount;
    return acc + amountInBob;
  }, 0);

  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contribGoal || !contribAmount) return;

    const added = parseFloat(contribAmount);
    setGoals((prev) =>
      prev.map((g) => (g.id === contribGoal.id ? { ...g, currentAmount: g.currentAmount + added } : g)),
    );

    setContribGoal(null);
    setContribAmount('');
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTarget) return;

    const targetNum = parseFloat(newTarget);
    const currentNum = parseFloat(newCurrent || '0');

    const newGoal: SavingsGoal = {
      id: `sg-${Date.now()}`,
      title: newTitle,
      targetAmount: targetNum,
      currentAmount: currentNum,
      currency: newCurrency,
      deadlineDate: newDeadline,
      color: '#10b981',
      icon: 'target',
      monthlyRequiredContribution: (targetNum - currentNum) / 6 || 100,
    };

    setGoals([...goals, newGoal]);
    setShowAddModal(false);
    setNewTitle('');
    setNewTarget('');
    setNewCurrent('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-slate-900/40 border border-emerald-500/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Metas de Ahorro & Fondo de Emergencia
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Progreso acumulado: Bs. {totalSaved.toLocaleString('es-BO', { minimumFractionDigits: 2 })} de Bs.{' '}
                {totalTarget.toLocaleString('es-BO', { minimumFractionDigits: 2 })} ({overallProgress.toFixed(1)}%)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Meta de Ahorro</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5">
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
          const isFinished = goal.currentAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
                    className="h-9 w-9 rounded-xl flex items-center justify-center font-bold"
                  >
                    <Target className="h-4 w-4" />
                  </div>
                  {isFinished ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <Check className="h-3 w-3" /> ¡Completada!
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {progress.toFixed(0)}% Logrado
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{goal.title}</h4>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {goal.currency === 'USD' ? '$' : 'Bs.'} {goal.currentAmount.toLocaleString('es-BO')}
                  </span>
                  <span className="text-xs text-slate-400">
                    Meta: {goal.currency === 'USD' ? '$' : 'Bs.'} {goal.targetAmount.toLocaleString('es-BO')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2.5">
                  <div
                    style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: goal.color }}
                    className="h-full transition-all duration-500"
                  />
                </div>

                <div className="mt-3.5 space-y-1 text-[11px] text-slate-500">
                  {goal.deadlineDate && (
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>Fecha objetivo: {goal.deadlineDate}</span>
                    </p>
                  )}
                  {!isFinished && (
                    <p className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <TrendingUp className="h-3 w-3" />
                      <span>
                        Ahorro sugerido: {goal.currency === 'USD' ? '$' : 'Bs.'}{' '}
                        {goal.monthlyRequiredContribution.toFixed(0)} / mes
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => {
                    setContribGoal(goal);
                    setContribAmount('200');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                >
                  + Aportar Saldo
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Contribution Modal */}
      {contribGoal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Aportar a Meta de Ahorro</h3>
            <p className="text-xs text-slate-500 mb-4">{contribGoal.title}</p>

            <form onSubmit={handleAddContribution} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Monto a destinar ({contribGoal.currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={contribAmount}
                  onChange={(e) => setContribAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setContribGoal(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm"
                >
                  Confirmar Aporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Nueva Meta de Ahorro</h3>
            <p className="text-xs text-slate-500 mb-4">Define tu objetivo para calcular el plan mensual</p>

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre de la meta
                </label>
                <input
                  type="text"
                  placeholder="Ej: Fondo de emergencia, Viaje, Auto, Maestría"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Monto Objetivo</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Moneda</label>
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="BOB">BOB (Bs)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Monto Actual ya ahorrado
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newCurrent}
                    onChange={(e) => setNewCurrent(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Fecha límite meta
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
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
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm"
                >
                  Crear Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
