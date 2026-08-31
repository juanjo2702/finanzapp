import { BankProvider, Currency, ParsedBankTransaction, TransactionType } from '@finanzapp/shared-types';

export class BankStatementParser {
  /**
   * Parse CSV / Text bank statements exported from online banking
   */
  static parseCsv(csvContent: string): ParsedBankTransaction[] {
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const transactions: ParsedBankTransaction[] = [];

    // Simple robust line-by-line CSV extractor
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip header if contains date/fecha/monto/description
      if (/fecha|date|descripcion|monto|amount/i.test(line) && i === 0) {
        continue;
      }

      const cols = line.split(/[,;\t]/).map((c) => c.replace(/["']/g, '').trim());
      if (cols.length >= 3) {
        // Expected format: [Date, Description/Merchant, Amount, Currency (optional)]
        const rawDate = cols[0];
        const description = cols[1];
        const rawAmount = cols[2];
        const rawCurrency = cols[3]?.toUpperCase() || 'BOB';

        const amountNum = parseFloat(rawAmount.replace(/[^0-9.-]/g, ''));
        if (!isNaN(amountNum) && amountNum !== 0) {
          const type = amountNum < 0 ? TransactionType.EXPENSE : TransactionType.INCOME;
          const positiveAmount = Math.abs(amountNum);
          const parsedDate = new Date(rawDate);

          transactions.push({
            bankProvider: BankProvider.MANUAL,
            amount: positiveAmount,
            currency: rawCurrency.includes('USD') ? Currency.USD : Currency.BOB,
            type,
            merchantName: description || 'Movimiento Bancario',
            transactionDate: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
            confidenceScore: 0.85,
            rawText: line,
          });
        }
      }
    }

    return transactions;
  }
}
