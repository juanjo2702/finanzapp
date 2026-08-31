'use client';

import React from 'react';
import { Wallet, Sparkles, PlusCircle, LayoutDashboard, RefreshCw, Scale, Heart, Target } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export type ActiveTab = 'OVERVIEW' | 'FIXED_EXPENSES' | 'DEBTS' | 'COUPLES' | 'SAVINGS';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenAddExpense?: () => void;
  onOpenSmsSimulator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddExpense,
  onOpenSmsSimulator,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top brand & actions bar */}
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('OVERVIEW')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Finanzapp</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Cochabamba &middot; BOB, USD & Crypto
              </p>
            </div>
          </div>

          {/* Quick Actions, Theme Toggle & Profile */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenSmsSimulator}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Simulador SMS Bancos</span>
              <span className="md:hidden">SMS</span>
            </button>

            <button
              onClick={onOpenAddExpense}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-md shadow-emerald-600/20"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Nuevo Movimiento</span>
              <span className="sm:hidden">Nuevo</span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <ThemeToggle />

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* User Profile */}
            <div className="flex items-center space-x-2 pl-1">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-800 shadow">
                JR
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">Juan José</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Moneda: BOB (Bs)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modular Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          <button
            onClick={() => onSelectTab('OVERVIEW')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Panel General & Flujo</span>
          </button>

          <button
            onClick={() => onSelectTab('FIXED_EXPENSES')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'FIXED_EXPENSES'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Gastos Fijos & Suscripciones</span>
          </button>

          <button
            onClick={() => onSelectTab('DEBTS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'DEBTS'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Scale className="h-4 w-4" />
            <span>Deudas & Préstamos (Debo / Me Deben)</span>
          </button>

          <button
            onClick={() => onSelectTab('COUPLES')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'COUPLES'
                ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Heart className="h-4 w-4 text-pink-500" />
            <span>Modo Pareja & Hogar</span>
          </button>

          <button
            onClick={() => onSelectTab('SAVINGS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'SAVINGS'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Target className="h-4 w-4" />
            <span>Metas de Ahorro & Emergencia</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
