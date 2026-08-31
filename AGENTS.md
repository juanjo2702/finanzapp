# 🤖 AGENTS.md - Context & AI Assistant Instructions for Finanzapp

This repository is **Finanzapp**, an enterprise multi-platform personal finance suite built with a Turborepo monorepo, NestJS, Next.js 15, React Native (Expo), Prisma ORM, and PostgreSQL.

When acting as an AI assistant (Antigravity, Cursor, GitHub Copilot, Claude Code, ChatGPT) in this codebase, you MUST strictly follow these rules and architectural principles.

---

## 🗺️ 1. Codebase Architecture & Structure

```
finanzapp/
├── apps/
│   ├── api/             # NestJS 10 + Prisma ORM + PostgreSQL + Redis
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/          # JWT, Bcrypt, CurrentUser decorator
│   │   │   │   ├── accounts/      # Multi-currency accounts (BOB, USD, USDT)
│   │   │   │   ├── transactions/  # ACID Balance locks ($transaction)
│   │   │   │   ├── banking/       # Bolivia SMS/Push regex + Open Banking adapters
│   │   │   │   ├── ai-categorizer/# Local & global merchant taxonomy
│   │   │   │   ├── analytics/     # 50/30/20, Runway, Net worth, Sankey
│   │   │   │   ├── budgets/       # Budget limits and alerts
│   │   │   │   └── users/         # Profile and preferences
│   │   │   └── prisma/            # Schema and seed script
│   ├── web/             # Next.js 15 App Router + Tailwind CSS + Lucide Icons
│   │   ├── src/
│   │   │   ├── app/               # App Router pages and layout
│   │   │   ├── components/        # ThemeToggle, PaydayCycle, FixedExpenses, Debts, Couples, Savings
│   │   │   └── lib/               # Mock data, formatters, and API client
│   └── mobile/          # React Native + Expo Router SDK 52
│       ├── app/                   # Expo Router tabs
│       └── services/              # Android notification bridge
├── packages/
│   ├── shared-types/    # Domain types, Zod DTOs, Enums (Currency, CategoryClassification, Recurring)
│   └── tsconfig/        # Base TypeScript configs
├── docs/                # ARCHITECTURE.md, BANKING_INTEGRATIONS.md, API_REFERENCE.md, CODING_STANDARDS.md
├── docker-compose.yml   # PostgreSQL 16 & Redis 7
└── turbo.json           # Turborepo task pipeline
```

---

## 🔑 2. Critical Domain & Business Rules

1. **Shared Types First**: Never declare duplicate types in `apps/api`, `apps/web` or `apps/mobile`. Put shared models, enums, or Zod schemas in `packages/shared-types` and run `npm run build --workspace=@finanzapp/shared-types`.
2. **ACID Financial Transactions**: Always wrap balance updates and transaction creations in `prisma.$transaction`. Financial balances must NEVER be calculated in loose, unsynchronized queries.
3. **Bolivian Banking Specifics**:
   - Supported local banks: BCP, BNB, Banco Unión, Banco BISA, Banco Mercantil Santa Cruz, and QR Simple.
   - Parsers live in `apps/api/src/modules/banking/parsers/bolivia-sms-parser.ts`.
   - Multi-currency support: `BOB` (Bolivianos), `USD` (Dólares), `EUR` (Euros), `USDT` (Cripto).
4. **Theme Support**:
   - The app supports both Dark and Light modes. Dark mode is default.
   - Always ensure high contrast (`dark:` vs light Tailwind classes).
5. **Payday Budget Cycle**:
   - Budgets are calculated based on the user's custom payday date (e.g. 25th of month), not strictly 1st to 30th.

---

## 🛠️ 3. Standard Developer Commands

```bash
# Start Docker services (PostgreSQL & Redis)
npm run docker:up

# Push Prisma DB schema & seed demo data
npm run db:migrate
npm run db:seed

# Start all development servers
npm run dev

# Run unit tests
npm run test

# Typecheck the entire monorepo
npx tsc --noEmit
```

---

## 📜 4. Clean Code & Output Guidelines for AI

- **No Any**: Avoid `any` at all costs. Use strict TypeScript interfaces.
- **Preserve Documentation**: Always include TSDoc comments for public methods and do not strip existing code comments.
- **Verification**: Run `tsc --noEmit` or tests to verify your changes before declaring completion.
