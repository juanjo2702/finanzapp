import { Currency } from './enums';

export enum RecurringExpenseType {
  INVESTMENT_DCA = 'INVESTMENT_DCA', // Aporte mensual a DPF, SAFI, Acciones, Cripto DCA
  HOUSING = 'HOUSING', // Alquiler, Hipoteca, Expensas
  FIXED_UTILITY = 'FIXED_UTILITY', // Internet, Luz, Agua, Gas
  SUBSCRIPTION = 'SUBSCRIPTION', // Netflix, Spotify, ChatGPT, Gym
  LOAN_INSTALLMENT = 'LOAN_INSTALLMENT', // Cuota bancaria, Préstamo auto
}

export interface RecurringExpenseItem {
  id: string;
  name: string;
  categoryName: string;
  type: RecurringExpenseType;
  amount: number;
  currency: Currency;
  billingFrequency: 'MONTHLY' | 'YEARLY' | 'WEEKLY';
  dueDayOfMonth: number;
  autoDeduct: boolean;
  linkedAccountId?: string;
  color: string;
  icon: string;
  isActive: boolean;
}

export enum DebtType {
  I_OWE = 'I_OWE', // Cuentas por pagar (Deudas que tengo con personas/bancos)
  THEY_OWE_ME = 'THEY_OWE_ME', // Cuentas por cobrar (Dinero que presté a terceros)
}

export interface DebtLoanItem {
  id: string;
  title: string;
  counterpartName: string;
  type: DebtType;
  totalAmount: number;
  paidAmount: number;
  currency: Currency;
  dueDate?: string;
  notes?: string;
  isSettled: boolean;
  createdAt: string;
}

export interface CouplesExpenseItem {
  id: string;
  title: string;
  totalAmount: number;
  currency: Currency;
  category: string;
  paidBy: 'USER' | 'PARTNER';
  userShareRatio: number;
  partnerShareRatio: number;
  date: string;
  isSettled: boolean;
}

export interface SavingsGoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: Currency;
  deadlineDate?: string;
  color: string;
  icon: string;
  monthlyRequiredContribution: number;
}

export interface UserFinancialCycleConfig {
  paydayOfMonth: number;
  cycleStartDate: number;
  salaryAmount: number;
  currency: Currency;
  enableCouplesMode: boolean;
  partnerName?: string;
  partnerEmail?: string;
}
