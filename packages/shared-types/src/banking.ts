import { BankProvider, Currency, TransactionType } from './enums';

export interface ParsedBankTransaction {
  bankProvider: BankProvider;
  amount: number;
  currency: Currency;
  type: TransactionType;
  merchantName: string;
  transactionDate: Date;
  accountIdentifier?: string;
  referenceNumber?: string;
  suggestedCategoryName?: string;
  confidenceScore: number;
  rawText: string;
}

export interface BankNotificationPattern {
  id: string;
  bank: BankProvider;
  regex: RegExp | string;
  description: string;
  sampleMessage: string;
  extractors: {
    amountGroup: number;
    currencyGroup?: number;
    merchantGroup?: number;
    accountGroup?: number;
    type: TransactionType;
    defaultCurrency?: Currency;
  };
}

export interface BankStatementImportResult {
  totalProcessed: number;
  successfulImports: number;
  duplicatesSkipped: number;
  errors: Array<{ line: number; raw: string; error: string }>;
  parsedTransactions: ParsedBankTransaction[];
}
