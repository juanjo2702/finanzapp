'use client';

import React, { useState } from 'react';
import { Navbar, ActiveTab } from '../components/Navbar';
import { SummaryCards } from '../components/SummaryCards';
import { PaydayCycleWidget } from '../components/PaydayCycleWidget';
import { Rule503020Card } from '../components/Rule503020Card';
import { CashflowChart } from '../components/CashflowChart';
import { AccountsWidget } from '../components/AccountsWidget';
import { SmsParserSimulator } from '../components/SmsParserSimulator';
import { TransactionList } from '../components/TransactionList';
import { FixedExpensesHub } from '../components/FixedExpensesHub';
import { DebtLoanTracker } from '../components/DebtLoanTracker';
import { CouplesSharedSpace } from '../components/CouplesSharedSpace';
import { SavingsGoalsHub } from '../components/SavingsGoalsHub';
import {
  INITIAL_SUMMARY,
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  CASHFLOW_HISTORY,
  INITIAL_FIXED_EXPENSES,
  INITIAL_DEBTS_LOANS,
  INITIAL_COUPLES_EXPENSES,
  INITIAL_SAVINGS_GOALS,
} from '../lib/mock-data';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('OVERVIEW');
  const [summary, setSummary] = useState(INITIAL_SUMMARY);
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // New Transaction Manual Modal State
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [txType, setTxType] = useState<'EXPENSE' | 'INCOME' | 'TRANSFER'>('EXPENSE');
  const [txMerchant, setTxMerchant] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txAccountId, setTxAccountId] = useState(INITIAL_ACCOUNTS[0].id);
  const [txCategory, setTxCategory] = useState('Supermercado & Víveres');
  const [txClassification, setTxClassification] = useState<'NEEDS' | 'WANTS' | 'SAVINGS_DEBT'>('NEEDS');

  const handleUpdatePayday = (newDay: number) => {
    setSummary((prev) => ({
      ...prev,
      customPaydayDay: newDay,
      daysUntilNextPayday: Math.abs(newDay - new Date().getDate()) || 30,
    }));
  };

  const handleAddManualTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txMerchant || !txAmount) return;

    const amountNum = parseFloat(txAmount);
    const selectedAccount = accounts.find((a) => a.id === txAccountId) || accounts[0];

    const newTx = {
      id: `tx-manual-${Date.now()}`,
      merchantName: txMerchant,
      accountName: selectedAccount.name,
      categoryName: txCategory,
      categoryColor: txClassification === 'NEEDS' ? '#16a34a' : txClassification === 'WANTS' ? '#ec4899' : '#10b981',
      classification: txClassification,
      amount: amountNum,
      currency: selectedAccount.currency,
      type: txType,
      source: 'MANUAL',
      date: new Date().toISOString(),
      notes: 'Registrado manualmente',
    };

    handleAddParsedTransaction(newTx);
    setShowAddTxModal(false);
    setTxMerchant('');
    setTxAmount('');
  };

  // Dynamic transaction insertion handler
  const handleAddParsedTransaction = (newTx: any) => {
    setTransactions((prev) => [newTx, ...prev]);

    setSummary((prev) => {
      const isExpense = newTx.type === 'EXPENSE';
      const newExpenses = isExpense ? prev.totalExpensesThisMonth + newTx.amount : prev.totalExpensesThisMonth;
      const newIncome = !isExpense ? prev.totalIncomeThisMonth + newTx.amount : prev.totalIncomeThisMonth;
      const newSavings = newIncome - newExpenses;

      let needs = prev.rule503020.needsAmount;
      let wants = prev.rule503020.wantsAmount;
      let savings = prev.rule503020.savingsAmount;

      if (newTx.classification === 'NEEDS') needs += newTx.amount;
      else if (newTx.classification === 'WANTS') wants += newTx.amount;
      else if (newTx.classification === 'SAVINGS_DEBT') savings += newTx.amount;

      const totalTracked = needs + wants + savings || 1;

      return {
        ...prev,
        totalExpensesThisMonth: Number(newExpenses.toFixed(2)),
        totalIncomeThisMonth: Number(newIncome.toFixed(2)),
        netSavingsThisMonth: Number(newSavings.toFixed(2)),
        savingsRatePercentage: Number(((newSavings / (newIncome || 1)) * 100).toFixed(1)),
        rule503020: {
          needsAmount: Number(needs.toFixed(2)),
          needsPercentage: Number(((needs / totalTracked) * 100).toFixed(1)),
          wantsAmount: Number(wants.toFixed(2)),
          wantsPercentage: Number(((wants / totalTracked) * 100).toFixed(1)),
          savingsAmount: Number(savings.toFixed(2)),
          savingsPercentage: Number(((savings / totalTracked) * 100).toFixed(1)),
        },
      };
    });

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.name === newTx.accountName) {
          return {
            ...acc,
            balance: newTx.type === 'EXPENSE' ? acc.balance - newTx.amount : acc.balance + newTx.amount,
          };
        }
        return acc;
      }),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased pb-20 transition-colors duration-200">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenAddExpense={() => setShowAddTxModal(true)}
        onOpenSmsSimulator={() => {
          setActiveTab('OVERVIEW');
          setTimeout(() => {
            const el = document.getElementById('sms-simulator-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. Custom Payday / Monthly Cycle Card */}
            <PaydayCycleWidget
              customPayday={summary.customPaydayDay}
              daysRemaining={summary.daysUntilNextPayday}
              dailySafeSpend={summary.dailySafeSpendBudget}
              onUpdatePayday={handleUpdatePayday}
            />

            {/* 2. KPIs Summary */}
            <SummaryCards summary={summary} />

            {/* 3. Bank SMS / Push Real-time Simulator */}
            <div id="sms-simulator-section">
              <SmsParserSimulator onAddParsedTransaction={handleAddParsedTransaction} />
            </div>

            {/* 4. 50/30/20 Rule & Accounts Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Rule503020Card rule={summary.rule503020} />
              </div>
              <div className="lg:col-span-1">
                <AccountsWidget accounts={accounts} />
              </div>
            </div>

            {/* 5. Cash Flow Graph & Transactions Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CashflowChart history={CASHFLOW_HISTORY} />
              </div>
              <div className="lg:col-span-2">
                <TransactionList transactions={transactions} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FIXED EXPENSES & SUBSCRIPTIONS */}
        {activeTab === 'FIXED_EXPENSES' && (
          <FixedExpensesHub initialExpenses={INITIAL_FIXED_EXPENSES} />
        )}

        {/* TAB 3: DEBTS & LOANS (I Owe vs They Owe Me) */}
        {activeTab === 'DEBTS' && (
          <DebtLoanTracker initialDebts={INITIAL_DEBTS_LOANS} />
        )}

        {/* TAB 4: COUPLES & SHARED HOUSEHOLD */}
        {activeTab === 'COUPLES' && (
          <CouplesSharedSpace initialExpenses={INITIAL_COUPLES_EXPENSES} partnerName="Sofia" />
        )}

        {/* TAB 5: SAVINGS GOALS & EMERGENCY FUND */}
        {activeTab === 'SAVINGS' && (
          <SavingsGoalsHub initialGoals={INITIAL_SAVINGS_GOALS} />
        )}
      </main>

      {/* Manual Transaction Modal */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Registrar Nuevo Movimiento</h3>
            <p className="text-xs text-slate-500 mb-4">Gasto, Ingreso o Transferencia con impacto en balance</p>

            <form onSubmit={handleAddManualTransaction} className="space-y-3.5">
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setTxType('EXPENSE')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
                    txType === 'EXPENSE' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Gasto
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('INCOME')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
                    txType === 'INCOME' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Ingreso
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Comercio o Concepto
                </label>
                <input
                  type="text"
                  placeholder="Ej: Hipermaxi, Farmacorp, Almuerzo"
                  value={txMerchant}
                  onChange={(e) => setTxMerchant(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Monto (Bs)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cuenta</label>
                  <select
                    value={txAccountId}
                    onChange={(e) => setTxAccountId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.currency})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Categoría</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Supermercado & Víveres">Supermercado & Víveres</option>
                    <option value="Restaurantes & Cafés">Restaurantes & Cafés</option>
                    <option value="Transporte & Combustible">Transporte & Combustible</option>
                    <option value="Servicios Básicos">Servicios Básicos</option>
                    <option value="Salud & Farmacia">Salud & Farmacia</option>
                    <option value="Suscripciones Digitales">Suscripciones Digitales</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Pilar 50/30/20
                  </label>
                  <select
                    value={txClassification}
                    onChange={(e) => setTxClassification(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="NEEDS">50% Necesidades</option>
                    <option value="WANTS">30% Deseos / Ocio</option>
                    <option value="SAVINGS_DEBT">20% Ahorro / Deuda</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm"
                >
                  Guardar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
