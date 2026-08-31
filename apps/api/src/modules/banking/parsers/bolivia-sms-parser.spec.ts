import { BoliviaSmsParser } from './bolivia-sms-parser';
import { BankProvider, Currency, TransactionType } from '@finanzapp/shared-types';

describe('BoliviaSmsParser', () => {
  it('should correctly parse BCP transaction SMS', () => {
    const rawSms = 'BCP: Compra con tarjeta ****4431 por Bs. 245.50 en Hipermaxi el 28/08/2026.';
    const result = BoliviaSmsParser.parse(rawSms);

    expect(result).toBeDefined();
    expect(result?.bankProvider).toBe(BankProvider.BCP_BOLIVIA);
    expect(result?.amount).toBe(245.5);
    expect(result?.currency).toBe(Currency.BOB);
    expect(result?.type).toBe(TransactionType.EXPENSE);
    expect(result?.accountIdentifier).toBe('****4431');
    expect(result?.merchantName).toContain('Hipermaxi');
  });

  it('should correctly parse BNB transaction SMS', () => {
    const rawSms = 'BNB: Compra de Bs 85.00 en CAFE TYPICA. Saldo Disp: Bs 2500';
    const result = BoliviaSmsParser.parse(rawSms);

    expect(result).toBeDefined();
    expect(result?.bankProvider).toBe(BankProvider.BNB);
    expect(result?.amount).toBe(85.0);
    expect(result?.currency).toBe(Currency.BOB);
    expect(result?.merchantName).toContain('CAFE TYPICA');
  });

  it('should correctly parse Banco Union notification', () => {
    const rawSms = 'B.Union: Compra de Bs. 200.00 en FARMACORP CALA CALA';
    const result = BoliviaSmsParser.parse(rawSms);

    expect(result).toBeDefined();
    expect(result?.bankProvider).toBe(BankProvider.BANCO_UNION);
    expect(result?.amount).toBe(200.0);
    expect(result?.currency).toBe(Currency.BOB);
    expect(result?.merchantName).toContain('FARMACORP');
  });

  it('should correctly parse QR Simple payment', () => {
    const rawSms = 'Pago QR Simple realizado con exito por Bs 65.50 a Pollos Kingdom.';
    const result = BoliviaSmsParser.parse(rawSms);

    expect(result).toBeDefined();
    expect(result?.amount).toBe(65.5);
    expect(result?.currency).toBe(Currency.BOB);
    expect(result?.merchantName).toContain('Pollos Kingdom');
  });
});
