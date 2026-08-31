# 💎 Finanzapp - Plataforma Integral de Finanzas Personales

**Finanzapp** es una plataforma moderna, escalable y profesional de gestión de finanzas personales (**PFM**), diseñada para operar tanto en la **Web** como en **Dispositivos Móviles (Android / iOS)** con sincronización inteligente de movimientos bancarios, presupuestos 50/30/20, soporte multidivisa y analítica financiera predictiva.

---

## 🏗️ Arquitectura del Monorepo

El proyecto está orquestado con **Turborepo** y **npm workspaces**:

```
finanzapp/
├── apps/
│   ├── api/                  # Backend REST API en NestJS + Prisma + PostgreSQL + Redis
│   ├── web/                  # Dashboard Web en Next.js 15 (App Router, Tailwind CSS, Lucide)
│   └── mobile/               # App Móvil en React Native + Expo SDK 52 (Expo Router)
├── packages/
│   ├── shared-types/         # DTOs, Enums, Zod Schemas y modelos compartidos
│   └── tsconfig/             # Configuraciones base de TypeScript
├── docs/                     # Documentación técnica y guías de arquitectura
│   ├── ARCHITECTURE.md       # Clean Architecture, Hexagonal, Seguridad Fintech
│   ├── BANKING_INTEGRATIONS.md # Parseo SMS/Push Bolivia y Open Banking internacional
│   └── API_REFERENCE.md      # Endpoints REST y contratos de datos
├── docker-compose.yml        # PostgreSQL 16 y Redis 7
├── turbo.json                # Pipeline de ejecución paralela y caché
└── package.json              # Workspaces de npm
```

---

## 🚀 Puesta en Marcha Rápida (Getting Started)

### 1. Requisitos Previos
* **Node.js**: v20+ o v24+
* **Docker Desktop**: Para levantar PostgreSQL y Redis

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Iniciar Servicios de Base de Datos (PostgreSQL & Redis)
```bash
docker compose up -d
```

### 4. Generar Cliente Prisma y Migraciones
```bash
npm run prisma:generate --workspace=@finanzapp/api
npm run prisma:migrate --workspace=@finanzapp/api
npm run prisma:seed --workspace=@finanzapp/api
```

> **Nota:** El comando `seed` crea automáticamente las categorías base de la regla **50/30/20** y el usuario demo:
> - **Email:** `demo@finanzapp.bo`
> - **Password:** `Finanzapp2026!`

### 5. Ejecutar la Plataforma en Desarrollo

Puedes ejecutar todos los proyectos en paralelo:
```bash
npm run dev
```

O levantar cada aplicación por separado:
* **Backend API (NestJS):**
  ```bash
  npm run dev:api
  ```
  * Swagger Docs disponible en: `http://localhost:4000/api/docs`
  * API Base: `http://localhost:4000/api`

* **Frontend Web (Next.js 15):**
  ```bash
  npm run dev:web
  ```
  * Panel Web interactivo: `http://localhost:3000`

* **App Móvil (Expo / React Native):**
  ```bash
  npm run dev:mobile
  ```
  * Abre la app en emulador Android/iOS o escanea el QR con **Expo Go**.

---

## ✨ Funcionalidades Principales

1. **Gestión Multidivisa y Bimonetarismo:**  
   Soporte nativo para transacciones y cuentas en **Bolivianos (BOB)**, **Dólares (USD)** y **Cripto/USDT** con tipo de cambio histórico.
2. **Regla de Presupuesto 50 / 30 / 20:**  
   Categorización automática entre **Necesidades (50%)**, **Deseos y Ocio (30%)** y **Ahorro / Deuda (20%)** con indicadores visuales de salud financiera.
3. **Autonomía y Flujo de Caja (*Runway*):**  
   Cálculo predictivo de días de solvencia sin nuevos ingresos basado en la tasa de gasto diario real.
4. **Motor Inteligente de Detección Bancaria (Bolivia & Global):**  
   Módulo de extracción con IA y expresiones regulares para capturar automáticamente transacciones desde SMS/Push de **BCP, BNB, Banco Unión, Bisa, Mercantil Santa Cruz y pagos QR Simple**.
5. **Seguridad Grado Fintech:**  
   Contraseñas hasheadas con **Bcrypt**, autenticación **JWT** con rotación, integridad transaccional **ACID**, y soporte para biometría en el móvil.

---

## 📚 Documentación Adicional

* [Arquitectura de Software y Seguridad](file:///C:/Users/juanj/.gemini/antigravity/scratch/finanzapp/docs/ARCHITECTURE.md)
* [Integración Bancaria (Bolivia vs. Internacional)](file:///C:/Users/juanj/.gemini/antigravity/scratch/finanzapp/docs/BANKING_INTEGRATIONS.md)
* [Referencia de API REST y Swagger](file:///C:/Users/juanj/.gemini/antigravity/scratch/finanzapp/docs/API_REFERENCE.md)
