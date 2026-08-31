import { z } from 'zod';
import {
  AccountType,
  BudgetPeriod,
  CategoryClassification,
  Currency,
  TransactionSource,
  TransactionType,
} from './enums';

// Auth DTOs
export const RegisterDtoSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  fullName: z.string().min(2, 'Nombre completo requerido'),
  baseCurrency: z.nativeEnum(Currency).default(Currency.BOB),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export const LoginDtoSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

// Account DTOs
export const CreateAccountDtoSchema = z.object({
  name: z.string().min(1, 'El nombre de la cuenta es requerido'),
  type: z.nativeEnum(AccountType),
  currency: z.nativeEnum(Currency).default(Currency.BOB),
  initialBalance: z.number().default(0),
  color: z.string().optional(),
  icon: z.string().optional(),
  institutionName: z.string().optional(),
  accountNumberMask: z.string().optional(),
});

export type CreateAccountDto = z.infer<typeof CreateAccountDtoSchema>;

export const UpdateAccountDtoSchema = CreateAccountDtoSchema.partial();
export type UpdateAccountDto = z.infer<typeof UpdateAccountDtoSchema>;

// Category DTOs
export const CreateCategoryDtoSchema = z.object({
  name: z.string().min(1, 'El nombre de la categoría es requerido'),
  icon: z.string().default('tag'),
  color: z.string().default('#3b82f6'),
  classification: z.nativeEnum(CategoryClassification),
  parentId: z.string().uuid().optional(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategoryDtoSchema>;

// Transaction DTOs
export const CreateTransactionDtoSchema = z.object({
  accountId: z.string().uuid('ID de cuenta inválido'),
  categoryId: z.string().uuid().optional().nullable(),
  destinationAccountId: z.string().uuid().optional().nullable(),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  currency: z.nativeEnum(Currency).default(Currency.BOB),
  exchangeRate: z.number().positive().default(1.0),
  type: z.nativeEnum(TransactionType),
  merchantName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  transactionDate: z.string().or(z.date()).transform((val) => new Date(val)),
  source: z.nativeEnum(TransactionSource).default(TransactionSource.MANUAL),
  isRecurring: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  rawPayload: z.string().optional().nullable(),
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionDtoSchema>;

export const TransactionFilterDtoSchema = z.object({
  accountId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type TransactionFilterDto = z.infer<typeof TransactionFilterDtoSchema>;

// Budget DTOs
export const CreateBudgetDtoSchema = z.object({
  categoryId: z.string().uuid('ID de categoría requerido'),
  limitAmount: z.number().positive('El límite debe ser mayor a 0'),
  period: z.nativeEnum(BudgetPeriod).default(BudgetPeriod.MONTHLY),
  startDate: z.string().or(z.date()).transform((val) => new Date(val)),
  endDate: z.string().or(z.date()).optional().nullable().transform((val) => (val ? new Date(val) : null)),
});

export type CreateBudgetDto = z.infer<typeof CreateBudgetDtoSchema>;

// Bank Notification / SMS Parse DTO
export const ParseSmsDtoSchema = z.object({
  rawMessage: z.string().min(5, 'El texto del mensaje o notificación es muy corto'),
  accountIdHint: z.string().uuid().optional(),
});

export type ParseSmsDto = z.infer<typeof ParseSmsDtoSchema>;
