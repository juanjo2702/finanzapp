'use client';

import React, { useState } from 'react';
import { Scale, ArrowUpRight, ArrowDownLeft, Plus, CheckCircle2, User, DollarSign, Calendar, MessageSquare } from 'lucide-react';

interface DebtLoanItem {
  id: string;
  title: string;
  counterpartName: string;
  type: 'I_OWE' | 'THEY_OWE_ME';
  totalAmount: number;
  paidAmount: number;
  currency: string;
  dueDate?: string;
  notes?: string;
  isSettled: boolean;
}

interface DebtTrackerProps {
  initialDebts: DebtLoanItem[];
}

export const DebtLoanTracker: React.FC<DebtTrackerProps> = ({ initialDebts }) => {
  const [debts, setDebts] = useState<DebtLoanItem[]>(initialDebts);
  const [activeTab, setActiveTab] = useState<'THEY_OWE_ME' | 'I_OWE'>('THEY_OWE_ME');
  const [showAddModal, setShowAddModal] = useState(false);

  // Partial Payment Modal State
  const [abonoModalItem, setAbonoModalItem] = useState<DebtLoanItem | null>(null);
  const [abonoAmount, setAbonoAmount] = useState('');

  // New Debt Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCounterpart, setNewCounterpart] = useState('');
  const [newType, setNewType] = useState<'THEY_OWE_ME' | 'I_OWE'>('THEY_OWE_ME');
  const [newTotal, setNewTotal] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const totalTheyOweMe = debts
    .filter((d) => d.type === 'THEY_OWE_ME' && !d.isSettled)
    .reduce((acc, curr) => acc + (curr.totalAmount - curr.paidAmount), 0);

  const totalIOwe = debts
    .filter((d) => d.type === 'I_OWE' && !d.isSettled)
    .reduce((acc, curr) => acc + (curr.totalAmount - curr.paidAmount), 0);

  const netDebtBalance = totalTheyOweMe - totalIOwe;

  const handleRegisterAbono = (e: React.FormEvent) => {
    e.preventDefault();
    if (!abonoModalItem || !abonoAmount) return;

    const amountNum = parseFloat(abonoAmount);
    setDebts((prev) =>
      prev.map((item) => {
        if (item.id === abonoModalItem.id) {
          const newPaid = item.paidAmount + amountNum;
          const isSettled = newPaid >= item.totalAmount;
          return { ...item, paidAmount: newPaid, isSettled };
        }
        return item;
      }),
    );

    setAbonoModalItem(null);
    setAbonoAmount('');
  };

  const handleCreateDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCounterpart || !newTotal) return;

    const newItem: DebtLoanItem = {
      id: `debt-${Date.now()}`,
      title: newTitle,
      counterpartName: newCounterpart,
      type: newType,
      totalAmount: parseFloat(newTotal),
      paidAmount: 0,
      currency: 'BOB',
      dueDate: newDueDate || undefined,
      notes: newNotes || undefined,
      isSettled: false,
    };

    setDebts([newItem, ...debts]);
    setShowAddModal(false);
    setNewTitle('');
    setNewCounterpart('');
    setNewTotal('');
  };

  const filtered = debts.filter((d) => d.type === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Me Deben */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Me Deben (Por Cobrar)
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            Bs. {totalTheyOweMe.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Dinero prestado a amigos, familia o proyectos</p>
        </div>

        {/* Yo Debo */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Yo Debo (Por Pagar)
            </span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">
            Bs. {totalIOwe.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Tarjetas de crédito, préstamos y compromisos</p>
        </div>

        {/* Balance Neto */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Balance Neto de Deudas
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <p
            className={`text-2xl font-bold mt-2 ${
              netDebtBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {netDebtBalance >= 0 ? '+' : '-'} Bs.{' '}
            {Math.abs(netDebtBalance).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {netDebtBalance >= 0 ? 'Te deben más de lo que debes' : 'Tienes más pasivos por liquidar'}
          </p>
        </div>
      </div>

      {/* Segmented Control & Actions */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
          <button
            onClick={() => setActiveTab('THEY_OWE_ME')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'THEY_OWE_ME'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ArrowDownLeft className="h-3.5 w-3.5" />
            <span>Me Deben ({debts.filter((d) => d.type === 'THEY_OWE_ME' && !d.isSettled).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('I_OWE')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'I_OWE'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Yo Debo ({debts.filter((d) => d.type === 'I_OWE' && !d.isSettled).length})</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Deuda o Préstamo</span>
        </button>
      </div>

      {/* Debts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const remaining = Math.max(item.totalAmount - item.paidAmount, 0);
          const progress = item.totalAmount > 0 ? (item.paidAmount / item.totalAmount) * 100 : 0;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                item.isSettled
                  ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    {item.isSettled && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Liquidado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>{item.counterpartName}</span>
                    {item.dueDate && (
                      <>
                        <span>&bull;</span>
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Vence: {item.dueDate}</span>
                      </>
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Restante</span>
                  <span
                    className={`text-lg font-extrabold ${
                      item.type === 'THEY_OWE_ME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                    }`}
                  >
                    Bs. {remaining.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Abonado: Bs. {item.paidAmount.toFixed(2)}</span>
                  <span>Total: Bs. {item.totalAmount.toFixed(2)} ({progress.toFixed(0)}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(progress, 100)}%` }}
                    className={`h-full ${item.type === 'THEY_OWE_ME' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

              {item.notes && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex items-center gap-1.5">
                  <MessageSquare className="h-3 w-3 text-slate-400" />
                  <span>{item.notes}</span>
                </p>
              )}

              {/* Action buttons */}
              {!item.isSettled && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setAbonoModalItem(item);
                      setAbonoAmount(remaining.toString());
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                  >
                    + Registrar Abono
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Abono Modal */}
      {abonoModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Registrar Abono o Liquidación
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {abonoModalItem.title} &middot; {abonoModalItem.counterpartName}
            </p>

            <form onSubmit={handleRegisterAbono} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Monto del Abono (Bs)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={abonoAmount}
                  onChange={(e) => setAbonoAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAbonoModalItem(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm"
                >
                  Guardar Abono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Debt Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Registrar Nueva Deuda o Préstamo
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Lleva el control de compromisos de pago propios o con terceros
            </p>

            <form onSubmit={handleCreateDebt} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tipo</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="THEY_OWE_ME">📥 Me Deben (Préstamo a cobrar)</option>
                  <option value="I_OWE">📤 Yo Debo (Deuda / Tarjeta / Préstamo)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Motivo / Concepto
                </label>
                <input
                  type="text"
                  placeholder="Ej: Préstamo viaje, Tarjeta BCP, Arreglo auto"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Persona o Entidad
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Carlos, Banco BNB"
                    value={newCounterpart}
                    onChange={(e) => setNewCounterpart(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Monto Total (Bs)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newTotal}
                    onChange={(e) => setNewTotal(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Fecha estimada de liquidación (Opcional)
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
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
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
