import { BankProvider, Currency, ParsedBankTransaction, TransactionType } from '@finanzapp/shared-types';

interface BankRegexDefinition {
  bank: BankProvider;
  pattern: RegExp;
  extract: (matches: RegExpMatchArray, rawText: string) => ParsedBankTransaction;
}

export class BoliviaSmsParser {
  private static readonly rules: BankRegexDefinition[] = [
    // 1. BCP Bolivia: "BCP: Compra con tarjeta ****1234 por Bs. 150.50 en Hipermaxi el 28/08/2026."
    {
      bank: BankProvider.BCP_BOLIVIA,
      pattern: /BCP:?\s*(?:Compra|Consumo)\s*(?:con tarjeta\s*\*+(\d{4}))?\s*por\s*(Bs\.?|USD|\$)\s*([\d,.]+)\s*en\s*([^.]+?)(?:\s*el\s*[\d\/]+|\.|$)/i,
      extract: (matches, rawText) => {
        const cardDigits = matches[1];
        const rawCurrency = matches[2]?.toUpperCase();
        const rawAmount = matches[3]?.replace(',', '');
        const merchant = matches[4]?.trim() || 'Comercio BCP';

        const currency = rawCurrency.includes('USD') || rawCurrency.includes('$') ? Currency.USD : Currency.BOB;
        const amount = parseFloat(rawAmount) || 0;

        return {
          bankProvider: BankProvider.BCP_BOLIVIA,
          amount,
          currency,
          type: TransactionType.EXPENSE,
          merchantName: merchant,
          transactionDate: new Date(),
          accountIdentifier: cardDigits ? `****${cardDigits}` : undefined,
          confidenceScore: 0.95,
          rawText,
        };
      },
    },

    // 2. BNB (Banco Nacional de Bolivia): "BNB: Compra de Bs 85.00 en CAFE TYPICA. Saldo Disp: Bs 2500"
    {
      bank: BankProvider.BNB,
      pattern: /BNB:?\s*(?:Compra|Debito|Consumo)\s*de\s*(Bs\.?|USD|\$)?\s*([\d,.]+)\s*en\s*([^.]+?)(?:\.\s*Saldo|\.|$)/i,
      extract: (matches, rawText) => {
        const rawCurrency = matches[1]?.toUpperCase() || 'BS';
        const rawAmount = matches[2]?.replace(',', '');
        const merchant = matches[3]?.trim() || 'Comercio BNB';

        const currency = rawCurrency.includes('USD') || rawCurrency.includes('$') ? Currency.USD : Currency.BOB;
        const amount = parseFloat(rawAmount) || 0;

        return {
          bankProvider: BankProvider.BNB,
          amount,
          currency,
          type: TransactionType.EXPENSE,
          merchantName: merchant,
          transactionDate: new Date(),
          confidenceScore: 0.95,
          rawText,
        };
      },
    },

    // 3. Banco Unión: "B.Union: Compra/Retiro de Bs. 200.00 en FARMACORP CALA CALA"
    {
      bank: BankProvider.BANCO_UNION,
      pattern: /B\.?\s*Union:?\s*(?:Compra|Retiro|Pago)\s*(?:de)?\s*(Bs\.?|USD|\$)?\s*([\d,.]+)\s*en\s*([^.]+?)(?:\.|$)/i,
      extract: (matches, rawText) => {
        const rawCurrency = matches[1]?.toUpperCase() || 'BS';
        const rawAmount = matches[2]?.replace(',', '');
        const merchant = matches[3]?.trim() || 'Banco Union Comercio';

        const currency = rawCurrency.includes('USD') || rawCurrency.includes('$') ? Currency.USD : Currency.BOB;
        const amount = parseFloat(rawAmount) || 0;

        return {
          bankProvider: BankProvider.BANCO_UNION,
          amount,
          currency,
          type: TransactionType.EXPENSE,
          merchantName: merchant,
          transactionDate: new Date(),
          confidenceScore: 0.9,
          rawText,
        };
      },
    },

    // 4. BISA: "BISA Notifica: Consumo tarjeta por Bs 320.00 en SURTIDOR AMERICA"
    {
      bank: BankProvider.BANCO_BISA,
      pattern: /BISA\s*Notifica:?\s*Consumo\s*tarjeta\s*por\s*(Bs\.?|USD|\$)?\s*([\d,.]+)\s*en\s*([^.]+?)(?:\.|$)/i,
      extract: (matches, rawText) => {
        const rawCurrency = matches[1]?.toUpperCase() || 'BS';
        const rawAmount = matches[2]?.replace(',', '');
        const merchant = matches[3]?.trim() || 'Comercio BISA';

        const currency = rawCurrency.includes('USD') ? Currency.USD : Currency.BOB;
        const amount = parseFloat(rawAmount) || 0;

        return {
          bankProvider: BankProvider.BANCO_BISA,
          amount,
          currency,
          type: TransactionType.EXPENSE,
          merchantName: merchant,
          transactionDate: new Date(),
          confidenceScore: 0.95,
          rawText,
        };
      },
    },

    // 5. Mercantil Santa Cruz (BMSC): "BMSC: Pago con QR de Bs 45.00 a POLLOS KINGDOM"
    {
      bank: BankProvider.BANCO_MERCANTIL_SANTA_CRUZ,
      pattern: /BMSC:?\s*(?:Pago\s*con\s*QR|Compra|Transferencia)\s*(?:de)?\s*(Bs\.?|USD|\$)?\s*([\d,.]+)\s*(?:a|en)\s*([^.]+?)(?:\.|$)/i,
      extract: (matches, rawText) => {
        const rawCurrency = matches[1]?.toUpperCase() || 'BS';
        const rawAmount = matches[2]?.replace(',', '');
        const merchant = matches[3]?.trim() || 'Comercio BMSC';

        const currency = rawCurrency.includes('USD') ? Currency.USD : Currency.BOB;
        const amount = parseFloat(rawAmount) || 0;

        return {
          bankProvider: BankProvider.BANCO_MERCANTIL_SANTA_CRUZ,
          amount,
          currency,
          type: TransactionType.EXPENSE,
          merchantName: merchant,
          transactionDate: new Date(),
          confidenceScore: 0.93,
          rawText,
        };
      },
    },

    // 6. Generic QR Simple / Interoperable Notification
    {
      bank: BankProvider.MANUAL,
      pattern: /(?:Pago\s*QR\s*(?:Simple)?|Transferencia\s*QR)\s*(?:realizado|enviado|efectuado)?(?:\s*con\s*exito|\s*exitoso)?\s*(?:por|de)?\s*(Bs\.?|USD|\$)?\s*([\d,.]+)\s*(?:a|en)\s*([^.]+?)(?:\.|$)/i,
      extract: (matches, rawText) => {
        const rawCurrency = matches[1]?.toUpperCase() || 'BS';
        const rawAmount = matches[2]?.replace(',', '');
        const merchant = matches[3]?.trim() || 'Pago QR Simple';

        const currency = rawCurrency.includes('USD') ? Currency.USD : Currency.BOB;
        const amount = parseFloat(rawAmount) || 0;

        return {
          bankProvider: BankProvider.MANUAL,
          amount,
          currency,
          type: TransactionType.EXPENSE,
          merchantName: merchant,
          transactionDate: new Date(),
          confidenceScore: 0.92,
          rawText,
        };
      },
    },
  ];

  static parse(messageText: string): ParsedBankTransaction | null {
    const text = messageText.trim();
    if (!text) return null;

    for (const rule of this.rules) {
      const match = text.match(rule.pattern);
      if (match) {
        return rule.extract(match, text);
      }
    }

    // Fallback: heuristic extractor for generic SMS with numbers and amounts
    const fallbackMatch = text.match(/(?:Bs\.?|USD|\$)\s*([\d,.]+)/i);
    if (fallbackMatch) {
      const rawAmount = fallbackMatch[1].replace(',', '');
      const amount = parseFloat(rawAmount);
      if (!isNaN(amount) && amount > 0) {
        return {
          bankProvider: BankProvider.MANUAL,
          amount,
          currency: text.includes('USD') || text.includes('$') ? Currency.USD : Currency.BOB,
          type: TransactionType.EXPENSE,
          merchantName: 'Transacción Bancaria Detectada',
          transactionDate: new Date(),
          confidenceScore: 0.5,
          rawText: text,
        };
      }
    }

    return null;
  }
}
