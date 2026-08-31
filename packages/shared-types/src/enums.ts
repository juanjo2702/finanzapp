export enum Currency {
  BOB = 'BOB', // Boliviano
  USD = 'USD', // US Dollar
  EUR = 'EUR', // Euro
  USDT = 'USDT', // Tether Crypto
  BRL = 'BRL', // Brazilian Real
  ARS = 'ARS', // Argentine Peso
  CLP = 'CLP', // Chilean Peso
  PEN = 'PEN', // Peruvian Sol
}

export enum AccountType {
  CHECKING = 'CHECKING', // Cuenta Corriente
  SAVINGS = 'SAVINGS', // Caja de Ahorro
  CASH = 'CASH', // Efectivo / Billetera física
  CREDIT_CARD = 'CREDIT_CARD', // Tarjeta de Crédito
  DIGITAL_WALLET = 'DIGITAL_WALLET', // QR Simple, Tigo Money, etc.
  CRYPTO = 'CRYPTO', // Binance / Crypto Wallet
  INVESTMENT = 'INVESTMENT', // Fondo de Inversión / DPF
}

export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER',
}

export enum CategoryClassification {
  NEEDS = 'NEEDS', // 50% - Necesidades básicas (Alquiler, Servicios, Supermercado, Salud)
  WANTS = 'WANTS', // 30% - Deseos / Ocio (Restaurantes, Viajes, Suscripciones, Entretenimiento)
  SAVINGS_DEBT = 'SAVINGS_DEBT', // 20% - Ahorro, Inversión y Pago de Deuda
}

export enum TransactionSource {
  MANUAL = 'MANUAL',
  SMS_PARSER = 'SMS_PARSER',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  BANK_SYNC = 'BANK_SYNC',
  RECEIPT_OCR = 'RECEIPT_OCR',
  CSV_IMPORT = 'CSV_IMPORT',
}

export enum BudgetPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum BankProvider {
  // Bolivia
  BCP_BOLIVIA = 'BCP_BOLIVIA',
  BNB = 'BNB',
  BANCO_UNION = 'BANCO_UNION',
  BANCO_MERCANTIL_SANTA_CRUZ = 'BANCO_MERCANTIL_SANTA_CRUZ',
  BANCO_BISA = 'BANCO_BISA',
  BANCO_SOL = 'BANCO_SOL',
  BANCO_ECONOMICO = 'BANCO_ECONOMICO',
  BANCO_GANADERO = 'BANCO_GANADERO',
  // International Open Banking Adapters
  BELVO = 'BELVO',
  PROMETEO = 'PROMETEO',
  PLAID = 'PLAID',
  TELLER = 'TELLER',
  GOCARDLESS = 'GOCARDLESS',
  MANUAL = 'MANUAL',
}
