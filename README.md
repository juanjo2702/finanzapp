# 💎 Finanzapp Enterprise &mdash; Modern Personal Finance Platform

> Plataforma integral y multiplataforma de finanzas personales, gestión patrimonial y presupuesto inteligente, diseñada con arquitectura **Clean Architecture**, **Domain-Driven Design** y soporte nativo para **bancos de Bolivia (BOB / QR Simple)** y monedas internacionales (**USD, EUR, USDT**).

[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-ef4444.svg)](https://turbo.build/repo)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2010-ea2845.svg)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-000000.svg)](https://nextjs.org)
[![Expo](https://img.shields.io/badge/Mobile-React%20Native%20Expo-000020.svg)](https://expo.dev)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%206-2d3748.svg)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-336791.svg)](https://www.postgresql.org)

---

## 📚 Documentación y Estándares del Proyecto

Para que cualquier desarrollador o asistente de Inteligencia Artificial (Cursor, Copilot, Antigravity, Claude Code) comprenda el 100% del sistema:

| Documento | Descripción |
| :--- | :--- |
| 🏛️ **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** | Arquitectura limpia, capas de dominio, seguridad y operaciones ACID. |
| 📐 **[CODING_STANDARDS.md](docs/CODING_STANDARDS.md)** | Reglas de Clean Code, convenciones de nombres, TSDoc obligatorio y Git. |
| 🤖 **[AGENTS.md](AGENTS.md)** | Instrucciones y contexto para agentes y asistentes de IA. |
| 💳 **[BANKING_INTEGRATIONS.md](docs/BANKING_INTEGRATIONS.md)** | Expresiones regulares de bancos bolivianos y adaptadores Open Banking. |
| 📡 **[API_REFERENCE.md](docs/API_REFERENCE.md)** | Contratos REST, DTOs y documentación Swagger OpenAPI. |

---

## 🌟 Funcionalidades Principales

* 📊 **Panel Financiero & Flujo de Caja:** Balance patrimonial consolidado, regla **50/30/20** (Necesidades, Deseos, Ahorro/Deuda) y gráfico interactivo mensual.
* 🌓 **Modo Oscuro & Claro:** Interfaz de alta gama con paleta obsidian *Fintech Pro* y tema claro con contraste WCAG AA.
* 📅 **Ciclo Mensual por Fecha de Sueldo (*Payday Cycle*):** Permite configurar el día exacto de pago (ej. día 25) y calcula el límite diario seguro (*Safe-to-Spend*).
* 🔁 **Gastos Fijos & Inversiones Recurrentes:** Control de Vivienda, Servicios Básicos, Suscripciones Digitales y **Aportes periódicos a DPF, SAFI y Cripto DCA**.
* ⚖️ **Deudas & Préstamos (Debo vs Me Deben):** Cuentas por cobrar a terceros vs deudas por pagar con amortizaciones parciales y seguimiento de liquidación.
* 👥 **Modo Parejas & Hogar Compartido:** Gastos divididos (50/50, 60/40, 70/30), cálculo automático de *"quién debe a quién"* y saldado en 1-click.
* 🎯 **Metas de Ahorro & Fondo de Emergencia:** Objetivos financieros con cálculo automático de ahorro mensual necesario para cumplir el plazo.
* 📱 **Detección Automática de Bancos (Bolivia):** Motor de regex e IA para **BCP, BNB, Banco Unión, Banco BISA, BMSC y QR Simple**.

---

## 🚀 Inicio Rápido en Local

### 1. Clonar e Instalar Dependencias
```bash
git clone https://github.com/juanjo2702/finanzapp.git
cd finanzapp
npm install
```

### 2. Levantar Base de Datos (Docker)
```bash
# Inicia PostgreSQL 16 y Redis 7
npm run docker:up
```

### 3. Sincronizar Base de Datos y Sembrar Datos Demo
```bash
# Aplica el esquema de Prisma y carga categorías 50/30/20 y usuario demo
npm run db:migrate
npm run db:seed
```

### 4. Iniciar Servidores de Desarrollo
```bash
npm run dev
```

* **Dashboard Web:** [http://localhost:3000](http://localhost:3000)
* **Documentación Interactiva Swagger:** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
* **Usuario Demo:** `demo@finanzapp.bo` / `Finanzapp2026!`

---

## 🏗️ Estructura del Monorepo

```
finanzapp/
├── apps/
│   ├── api/             # NestJS 10 REST API + Prisma ORM
│   ├── web/             # Next.js 15 App Router + Tailwind CSS
│   └── mobile/          # React Native + Expo Router SDK 52
├── packages/
│   ├── shared-types/    # Modelos de dominio, Zod DTOs y Enums compartidos
│   └── tsconfig/        # Configuraciones base de TypeScript
├── docs/                # Documentación de arquitectura, banca y estándares
└── docker-compose.yml   # Servicios de base de datos y caché
```

---

## 🔒 Seguridad Fintech

1. **Contraseñas:** Hashing con `bcrypt` (10 salt rounds).
2. **Autenticación:** JWT con Access Tokens de corta duración y Refresh Tokens.
3. **Consistencia Financiera:** Todas las operaciones de saldo se ejecutan en transacciones atómicas con aislamiento de lectura (`prisma.$transaction`).
4. **Validación:** DTOs fuertemente tipados validados con `class-validator` y `Zod`.
