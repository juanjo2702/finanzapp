'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Smartphone } from 'lucide-react';

interface SmsSimulatorProps {
  onAddParsedTransaction?: (tx: any) => void;
}

const PRESET_MESSAGES = [
  {
    bank: 'BCP Bolivia',
    text: 'BCP: Compra con tarjeta ****4431 por Bs. 245.50 en Hipermaxi El Prado el 28/08/2026.',
  },
  {
    bank: 'BNB Bolivia',
    text: 'BNB: Compra de Bs 85.00 en CAFE TYPICA. Saldo Disp: Bs 2500',
  },
  {
    bank: 'Banco Unión',
    text: 'B.Union: Compra de Bs. 185.00 en FARMACORP CALA CALA.',
  },
  {
    bank: 'Banco BISA',
    text: 'BISA Notifica: Consumo tarjeta por Bs 320.00 en SURTIDOR AMERICA.',
  },
  {
    bank: 'QR Simple Interbancario',
    text: 'Pago QR Simple realizado con exito por Bs 65.00 a Pollos Kingdom Cochabamba.',
  },
];

export const SmsParserSimulator: React.FC<SmsSimulatorProps> = ({ onAddParsedTransaction }) => {
  const [inputText, setInputText] = useState(PRESET_MESSAGES[0].text);
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const handleParse = () => {
    const text = inputText.trim();

    const amountMatch = text.match(/(?:Bs\.?|USD|\$)\s*([\d,.]+)/i);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : 0;

    let merchant = 'Comercio Detectado';
    if (text.toLowerCase().includes('hipermaxi')) merchant = 'Hipermaxi El Prado';
    else if (text.toLowerCase().includes('typica')) merchant = 'Café Typica Cochabamba';
    else if (text.toLowerCase().includes('farmacorp')) merchant = 'Farmacorp Cala Cala';
    else if (text.toLowerCase().includes('surtidor')) merchant = 'Surtidor América';
    else if (text.toLowerCase().includes('kingdom')) merchant = 'Pollos Kingdom Cochabamba';

    let category = 'Gastos Varios';
    let categoryColor = '#3b82f6';
    let classification = 'NEEDS';

    if (/hipermaxi|supermercado|surtidor|farmacorp/i.test(merchant)) {
      category = /hipermaxi/i.test(merchant)
        ? 'Supermercado & Víveres'
        : /surtidor/i.test(merchant)
        ? 'Transporte & Combustible'
        : 'Salud & Medicamentos';
      categoryColor = /hipermaxi/i.test(merchant) ? '#16a34a' : /surtidor/i.test(merchant) ? '#f97316' : '#ef4444';
      classification = 'NEEDS';
    } else if (/typica|kingdom|restaurante|cafe/i.test(merchant)) {
      category = 'Restaurantes & Cafés';
      categoryColor = '#ec4899';
      classification = 'WANTS';
    }

    setParsedResult({
      amount: amount || 120.0,
      currency: text.includes('USD') || text.includes('$') ? 'USD' : 'BOB',
      merchantName: merchant,
      categoryName: category,
      categoryColor,
      classification,
      accountName: 'BCP Sueldo & QR',
      confidence: 0.95,
      source: 'SMS_PARSER',
    });
  };

  const handleConfirm = () => {
    if (parsedResult && onAddParsedTransaction) {
      onAddParsedTransaction({
        id: `tx-sim-${Date.now()}`,
        merchantName: parsedResult.merchantName,
        accountName: parsedResult.accountName,
        categoryName: parsedResult.categoryName,
        categoryColor: parsedResult.categoryColor,
        classification: parsedResult.classification,
        amount: parsedResult.amount,
        currency: parsedResult.currency,
        type: 'EXPENSE',
        source: 'SMS_PARSER',
        date: new Date().toISOString(),
        notes: 'Detectado automáticamente por el motor de notificaciones bancarias',
      });
      setIsSuccessMessage(true);
      setTimeout(() => {
        setIsSuccessMessage(false);
        setParsedResult(null);
      }, 2500);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 border border-amber-300 dark:border-amber-700/50 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xs font-bold">
            <Smartphone className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Simulador de Detección Automática de Bancos (Bolivia & Global)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Prueba cómo el sistema procesa SMS/Push de BNB, BCP, Bisa, Banco Unión o QR Simple
            </p>
          </div>
        </div>
      </div>

      {/* Preset pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {PRESET_MESSAGES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(preset.text);
              setParsedResult(null);
            }}
            className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 transition-colors shadow-2xs"
          >
            {preset.bank}
          </button>
        ))}
      </div>

      {/* Text input area */}
      <div className="flex flex-col sm:flex-row gap-2">
        <textarea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pega aquí el texto del SMS de tu banco..."
          className="flex-1 p-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
        />
        <button
          onClick={handleParse}
          className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Analizar</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Result Preview */}
      {parsedResult && (
        <div className="mt-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-400 dark:border-emerald-700 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Transacción Detectada con Éxito ({parsedResult.confidence * 100}% Confianza)
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              Auto-Categorizado con IA
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Comercio:</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100">{parsedResult.merchantName}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Monto Extraído:</span>
              <span className="font-extrabold text-rose-600">
                {parsedResult.currency === 'USD' ? '$' : 'Bs.'} {parsedResult.amount.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Categoría:</span>
              <span
                style={{ backgroundColor: `${parsedResult.categoryColor}20`, color: parsedResult.categoryColor }}
                className="font-bold px-2 py-0.5 rounded text-[11px] inline-block border border-current/20"
              >
                {parsedResult.categoryName}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Pilar 50/30/20:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{parsedResult.classification}</span>
            </div>
          </div>

          <div className="mt-3.5 flex justify-end">
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Confirmar & Registrar en Saldo</span>
            </button>
          </div>
        </div>
      )}

      {isSuccessMessage && (
        <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          ¡Gasto registrado automáticamente en tu cuenta y reflejado en el balance!
        </div>
      )}
    </div>
  );
};
