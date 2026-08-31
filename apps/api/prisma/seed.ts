import {
  PrismaClient,
  CategoryClassification,
  AccountType,
  Currency,
  TransactionType,
  TransactionSource,
  BudgetPeriod,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  // NEEDS (50%)
  { name: 'Supermercado & Víveres', icon: 'shopping-cart', color: '#16a34a', classification: CategoryClassification.NEEDS },
  { name: 'Alquiler & Vivienda', icon: 'home', color: '#2563eb', classification: CategoryClassification.NEEDS },
  { name: 'Servicios (Luz, Agua, Gas, Internet)', icon: 'zap', color: '#eab308', classification: CategoryClassification.NEEDS },
  { name: 'Transporte & Combustible', icon: 'car', color: '#f97316', classification: CategoryClassification.NEEDS },
  { name: 'Salud & Medicamentos', icon: 'heart-pulse', color: '#ef4444', classification: CategoryClassification.NEEDS },
  { name: 'Educación & Cursos', icon: 'book-open', color: '#8b5cf6', classification: CategoryClassification.NEEDS },

  // WANTS (30%)
  { name: 'Restaurantes & Cafés', icon: 'utensils', color: '#ec4899', classification: CategoryClassification.WANTS },
  { name: 'Entretenimiento & Salidas', icon: 'ticket', color: '#a855f7', classification: CategoryClassification.WANTS },
  { name: 'Suscripciones Digitales', icon: 'tv', color: '#06b6d4', classification: CategoryClassification.WANTS },
  { name: 'Ropa & Compras Personales', icon: 'shirt', color: '#3b82f6', classification: CategoryClassification.WANTS },
  { name: 'Viajes & Vacaciones', icon: 'plane', color: '#14b8a6', classification: CategoryClassification.WANTS },

  // SAVINGS & DEBT (20%)
  { name: 'Fondo de Emergencia', icon: 'shield-check', color: '#10b981', classification: CategoryClassification.SAVINGS_DEBT },
  { name: 'Inversiones & DPF', icon: 'trending-up', color: '#059669', classification: CategoryClassification.SAVINGS_DEBT },
  { name: 'Pago Tarjetas de Crédito', icon: 'credit-card', color: '#dc2626', classification: CategoryClassification.SAVINGS_DEBT },
  { name: 'Pago de Préstamos / Deudas', icon: 'landmark', color: '#7c3aed', classification: CategoryClassification.SAVINGS_DEBT },
];

async function main() {
  console.log('Seeding initial default categories...');

  for (const cat of DEFAULT_CATEGORIES) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, isSystem: true },
    });
    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          classification: cat.classification,
          isSystem: true,
        },
      });
    }
  }

  console.log('Checking demo user...');
  const demoEmail = 'demo@finanzapp.bo';
  let demoUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!demoUser) {
    const passwordHash = await bcrypt.hash('Finanzapp2026!', 10);
    demoUser = await prisma.user.create({
      data: {
        email: demoEmail,
        fullName: 'Juan José Rodríguez',
        passwordHash,
        baseCurrency: Currency.BOB,
      },
    });

    console.log('Created demo user:', demoUser.email);

    // Create demo accounts
    const bnbAccount = await prisma.account.create({
      data: {
        userId: demoUser.id,
        name: 'Caja de Ahorros BNB',
        type: AccountType.SAVINGS,
        currency: Currency.BOB,
        balance: 5400.0,
        initialBalance: 5400.0,
        institutionName: 'Banco Nacional de Bolivia',
        accountNumberMask: '****8912',
        color: '#059669',
      },
    });

    const bcpAccount = await prisma.account.create({
      data: {
        userId: demoUser.id,
        name: 'BCP Sueldo & QR',
        type: AccountType.CHECKING,
        currency: Currency.BOB,
        balance: 7850.5,
        initialBalance: 7850.5,
        institutionName: 'Banco de Crédito BCP',
        accountNumberMask: '****4431',
        color: '#2563eb',
      },
    });

    const cashWallet = await prisma.account.create({
      data: {
        userId: demoUser.id,
        name: 'Efectivo en Billetera',
        type: AccountType.CASH,
        currency: Currency.BOB,
        balance: 420.0,
        initialBalance: 420.0,
        color: '#ca8a04',
      },
    });

    const usdSavings = await prisma.account.create({
      data: {
        userId: demoUser.id,
        name: 'Ahorro Dólares Físico/Banco',
        type: AccountType.SAVINGS,
        currency: Currency.USD,
        balance: 1500.0,
        initialBalance: 1500.0,
        color: '#0d9488',
      },
    });

    // Fetch categories to link
    const supermarketCat = await prisma.category.findFirst({ where: { name: { contains: 'Supermercado' } } });
    const restaurantCat = await prisma.category.findFirst({ where: { name: { contains: 'Restaurantes' } } });
    const transportCat = await prisma.category.findFirst({ where: { name: { contains: 'Transporte' } } });
    const subscriptionCat = await prisma.category.findFirst({ where: { name: { contains: 'Suscripciones' } } });

    // Create sample transactions
    await prisma.transaction.createMany({
      data: [
        {
          userId: demoUser.id,
          accountId: bcpAccount.id,
          categoryId: supermarketCat?.id,
          amount: 245.5,
          currency: Currency.BOB,
          baseAmount: 245.5,
          exchangeRate: 1.0,
          type: TransactionType.EXPENSE,
          merchantName: 'Hipermaxi El Prado',
          notes: 'Compras semanales de víveres',
          source: TransactionSource.SMS_PARSER,
          transactionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        },
        {
          userId: demoUser.id,
          accountId: bcpAccount.id,
          categoryId: restaurantCat?.id,
          amount: 110.0,
          currency: Currency.BOB,
          baseAmount: 110.0,
          exchangeRate: 1.0,
          type: TransactionType.EXPENSE,
          merchantName: 'Café Typica Cochabamba',
          notes: 'Café de especialidad y almuerzo',
          source: TransactionSource.PUSH_NOTIFICATION,
          transactionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        },
        {
          userId: demoUser.id,
          accountId: bcpAccount.id,
          amount: 9500.0,
          currency: Currency.BOB,
          baseAmount: 9500.0,
          exchangeRate: 1.0,
          type: TransactionType.INCOME,
          merchantName: 'Nómina Empresa Tech SRL',
          notes: 'Sueldo mensual',
          source: TransactionSource.BANK_SYNC,
          transactionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        },
        {
          userId: demoUser.id,
          accountId: bnbAccount.id,
          categoryId: subscriptionCat?.id,
          amount: 69.9,
          currency: Currency.BOB,
          baseAmount: 69.9,
          exchangeRate: 1.0,
          type: TransactionType.EXPENSE,
          merchantName: 'Netflix Premium',
          notes: 'Suscripción mensual',
          source: TransactionSource.MANUAL,
          isRecurring: true,
          transactionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        },
      ],
    });

    // Create a demo budget
    if (supermarketCat) {
      await prisma.budget.create({
        data: {
          userId: demoUser.id,
          categoryId: supermarketCat.id,
          limitAmount: 1500.0,
          period: BudgetPeriod.MONTHLY,
          startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      });
    }

    console.log('Sample data seeded successfully.');
  }

  console.log('Seed process completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
