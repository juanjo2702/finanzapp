'use client';

import React from 'react';
import { CreditCard, Plus } from 'lucide-react';

interface AccountItem {
  id: string;
  name: string;
  type: string;
  currency: string;
  balance: number;
  institutionName?: string;
  accountNumberMask?: string;
  color?: string;
}

interface AccountsWidgetProps {
  accounts: AccountItem[];
}

export const AccountsWidget: React.FC<AccountsWidgetProps> = ({ accounts }) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cuentas & Billeteras</h3>
            <p className="text-xs text-slate-500">Saldos disponibles por cuenta</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-center space-x-3">
              <div
                style={{ backgroundColor: acc.color || '#2563eb' }}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm"
              >
                {acc.currency}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{acc.name}</p>
                <p className="text-[11px] text-slate-500">
                  {acc.institutionName || 'Billetera Local'} {acc.accountNumberMask}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {acc.currency === 'USD' ? '$' : acc.currency === 'USDT' ? '₮' : 'Bs.'}{' '}
                {acc.balance.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[10px] text-slate-400 uppercase font-medium">{acc.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
