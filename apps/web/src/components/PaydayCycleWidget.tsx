'use client';

import React, { useState } from 'react';
import { Calendar, DollarSign, Clock, AlertCircle, Edit3, Check } from 'lucide-react';

interface PaydayCycleProps {
  customPayday: number;
  daysRemaining: number;
  dailySafeSpend: number;
  onUpdatePayday?: (newDay: number) => void;
}

export const PaydayCycleWidget: React.FC<PaydayCycleProps> = ({
  customPayday = 25,
  daysRemaining = 6,
  dailySafeSpend = 175.5,
  onUpdatePayday,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(customPayday);

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdatePayday) onUpdatePayday(selectedDay);
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 dark:from-indigo-950/40 dark:via-slate-900/90 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-500/30 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30 shadow-2xs">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mi Ciclo Mensual de Sueldo</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900">
                Cobro día {selectedDay}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Tu mes financiero se calcula desde tu fecha de cobro, no del 1 al 30
            </p>
          </div>
        </div>

        {/* Change Payday Button */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-slate-100 p-1 focus:outline-none"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    Día {d} de cada mes
                  </option>
                ))}
              </select>
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Cambiar fecha de cobro</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Metric Pills with crisp light and dark contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Countdown */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span className="font-semibold">Próximo Sueldo</span>
            <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400">
            {daysRemaining} días restantes
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">El próximo día {selectedDay} se reinicia tu presupuesto</p>
        </div>

        {/* Daily safe spend */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span className="font-semibold">Límite Diario Recomendado</span>
            <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
            Bs. {dailySafeSpend.toFixed(2)} / día
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Monto seguro para llegar sin déficit a tu sueldo</p>
        </div>

        {/* Status */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span className="font-semibold">Ritmo de Gasto</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1">
            ✅ Bajo Control (62% Disponible)
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">A este ritmo terminarás el ciclo con ahorro positivo</p>
        </div>
      </div>
    </div>
  );
};
