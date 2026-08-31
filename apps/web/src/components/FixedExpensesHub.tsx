'use client';

import React, { useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  Clock,
  Plus,
  Tv,
  Home,
  Zap,
  Droplet,
  Wifi,
  Music,
  Sparkles,
  Dumbbell,
  TrendingUp,
  Coins,
  Landmark,
} from 'lucide-react';

interface FixedExpense {
  id: string;
  name: string;
  categoryName: string;
  type: string;
  amount: number;
  currency: string;
  billingFrequency: string;
  dueDayOfMonth: number;
  autoDeduct: boolean;
  color: string;
  icon: string;
  isPaidThisMonth: boolean;
}

interface FixedExpensesHubProps {
  initialExpenses: FixedExpense[];
}

export const FixedExpensesHub: React.FC<FixedExpensesHubProps> = ({ initialExpenses }) => {
  const [expenses, setExpenses] = useState<FixedExpense[]>(initialExpenses);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Modal form state
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState('INVESTMENT_DCA');
  const [newDay, setNewDay] = useState(25);
  const [newCurrency, setNewCurrency] = useState('BOB');

  const totalMonthlyCommitment = expenses.reduce((acc, curr) => {
    const amountInBob = curr.currency === 'USD' ? curr.amount * 6.96 : curr.amount;
    return acc + amountInBob;
  }, 0);

  const totalInvestments = expenses
    .filter((e) => e.type === 'INVESTMENT_DCA')
    .reduce((acc, curr) => {
      const amountInBob = curr.currency === 'USD' ? curr.amount * 6.96 : curr.amount;
      return acc + amountInBob;
    }, 0);

  const totalPaid = expenses
    .filter((e) => e.isPaidThisMonth)
    .reduce((acc, curr) => {
      const amountInBob = curr.currency === 'USD' ? curr.amount * 6.96 : curr.amount;
      return acc + amountInBob;
    }, 0);

  const pendingAmount = Math.max(totalMonthlyCommitment - totalPaid, 0);

  const togglePaidStatus = (id: string) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPaidThisMonth: !item.isPaidThisMonth } : item)),
    );
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAmount) return;

    const newItem: FixedExpense = {
      id: `fx-${Date.now()}`,
      name: newName,
      categoryName:
        newType === 'INVESTMENT_DCA'
          ? 'Inversión & Retiro'
          : newType === 'HOUSING'
          ? 'Vivienda'
          : newType === 'SUBSCRIPTION'
          ? 'Suscripciones'
          : 'Servicios',
      type: newType,
      amount: parseFloat(newAmount),
      currency: newCurrency,
      billingFrequency: 'MONTHLY',
      dueDayOfMonth: newDay,
      autoDeduct: false,
      color:
        newType === 'INVESTMENT_DCA'
          ? '#10b981'
          : newType === 'HOUSING'
          ? '#2563eb'
          : newType === 'SUBSCRIPTION'
          ? '#ec4899'
          : '#06b6d4',
      icon:
        newType === 'INVESTMENT_DCA'
          ? 'trending-up'
          : newType === 'HOUSING'
          ? 'home'
          : newType === 'SUBSCRIPTION'
          ? 'tv'
          : 'zap',
      isPaidThisMonth: false,
    };

    setExpenses([newItem, ...expenses]);
    setShowAddModal(false);
    setNewName('');
    setNewAmount('');
  };

  const filtered = expenses.filter((e) => {
    if (filterType === 'ALL') return true;
    return e.type === filterType;
  });

  const getIconComponent = (item: FixedExpense) => {
    if (item.type === 'INVESTMENT_DCA') {
      if (item.name.toLowerCase().includes('cripto') || item.name.toLowerCase().includes('usdt'))
        return <Coins className="h-4 w-4" />;
      if (item.name.toLowerCase().includes('safi')) return <Landmark className="h-4 w-4" />;
      return <TrendingUp className="h-4 w-4" />;
    }
    const lower = item.name.toLowerCase();
    if (lower.includes('alquiler') || lower.includes('hipoteca')) return <Home className="h-4 w-4" />;
    if (lower.includes('luz')) return <Zap className="h-4 w-4" />;
    if (lower.includes('agua')) return <Droplet className="h-4 w-4" />;
    if (lower.includes('internet')) return <Wifi className="h-4 w-4" />;
    if (lower.includes('netflix')) return <Tv className="h-4 w-4" />;
    if (lower.includes('spotify')) return <Music className="h-4 w-4" />;
    if (lower.includes('chatgpt')) return <Sparkles className="h-4 w-4" />;
    if (lower.includes('gimnasio')) return <Dumbbell className="h-4 w-4" />;
    return <RefreshCw className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 4 Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Compromisos */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Compromisos Mes
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Bs. {totalMonthlyCommitment.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Gastos fijos, inversiones y suscripciones
          </p>
        </div>

        {/* Inversiones Recurrentes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            📈 Inversión & Ahorro DCA
          </span>
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
            Bs. {totalInvestments.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-teal-700/80 dark:text-teal-400/80 mt-1">
            Aportes a DPF, Fondos SAFI y Cripto
          </p>
        </div>

        {/* Ya Pagado / Aportado */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Ya Cubierto Este Mes
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            Bs. {totalPaid.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-1">
            {expenses.filter((e) => e.isPaidThisMonth).length} de {expenses.length} conceptos cubiertos
          </p>
        </div>

        {/* Pendiente */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Pendiente de Pago / Aporte
          </span>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            Bs. {pendingAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Por liquidar antes del cierre</p>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filterType === 'ALL'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Todos ({expenses.length})
          </button>
          <button
            onClick={() => setFilterType('INVESTMENT_DCA')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filterType === 'INVESTMENT_DCA'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            📈 Inversiones & DPF
          </button>
          <button
            onClick={() => setFilterType('HOUSING')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filterType === 'HOUSING'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            🏠 Vivienda / Alquiler
          </button>
          <button
            onClick={() => setFilterType('FIXED_UTILITY')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filterType === 'FIXED_UTILITY'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            ⚡ Servicios Básicos
          </button>
          <button
            onClick={() => setFilterType('SUBSCRIPTION')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filterType === 'SUBSCRIPTION'
                ? 'bg-pink-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            📺 Suscripciones
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Configurar Gasto Fijo / Inversión</span>
        </button>
      </div>

      {/* Expenses Cards Grid with Crisp Light & Dark Backgrounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all ${
              item.isPaidThisMonth
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                : 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700/60 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  style={{ backgroundColor: `${item.color}18`, color: item.color }}
                  className="h-10 w-10 rounded-xl flex items-center justify-center font-bold border border-current/20 shadow-2xs"
                >
                  {getIconComponent(item)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{item.name}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.categoryName}</span>
                    <span>&bull;</span>
                    <span>Vence día {item.dueDayOfMonth} de cada mes</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {item.currency === 'USD' ? '$' : 'Bs.'} {item.amount.toFixed(2)}
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                  {item.billingFrequency}
                </p>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {item.isPaidThisMonth ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Cubierto este mes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 rounded-full">
                    <Clock className="h-3.5 w-3.5" /> Pendiente
                  </span>
                )}
              </div>

              <button
                onClick={() => togglePaidStatus(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  item.isPaidThisMonth
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                }`}
              >
                {item.isPaidThisMonth ? 'Marcar Pendiente' : 'Marcar Cubierto'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Configurar Gasto Fijo o Inversión Periódica
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Agrega compromisos mensuales (Alquiler, DPF, Cripto DCA, Luz, etc.)
            </p>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre del concepto
                </label>
                <input
                  type="text"
                  placeholder="Ej: Aporte DPF Banco BNB, Alquiler, Cripto DCA, Gimnasio"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Monto</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Moneda</label>
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="BOB">BOB (Bs)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tipo</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="INVESTMENT_DCA">📈 Inversión / DPF / Cripto</option>
                    <option value="HOUSING">🏠 Vivienda / Alquiler</option>
                    <option value="FIXED_UTILITY">⚡ Servicio Básico</option>
                    <option value="SUBSCRIPTION">📺 Suscripción Digital</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Día del mes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={newDay}
                    onChange={(e) => setNewDay(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
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
