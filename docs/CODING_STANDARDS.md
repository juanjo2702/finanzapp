# 📐 Guía de Convenciones y Estándares de Código (Clean Code) - Finanzapp

Este documento establece las directrices de calidad, arquitectura y documentación obligatorias para cualquier desarrollador o agente de Inteligencia Artificial que colabore en el proyecto **Finanzapp**.

---

## 🏛️ 1. Principios de Arquitectura y Diseño

1. **Clean Architecture & Domain-Driven Design (DDD):**
   * El código debe estructurarse en capas: **Entidades de Dominio $\rightarrow$ Casos de Uso / Servicios $\rightarrow$ Controladores / Adaptadores $\rightarrow$ Infraestructura**.
   * La lógica de negocio no debe depender directamente de detalles de base de datos o frameworks web.

2. **Single Source of Truth para Contratos de Datos:**
   * **Todo tipo, interfaz, enum o DTO compartido** DEBE definirse en el paquete [`packages/shared-types`](file:///packages/shared-types).
   * No dupliques interfaces entre frontend y backend. Importa siempre desde `@finanzapp/shared-types`.

3. **Operaciones Financieras Transaccionales (ACID):**
   * **REGLA DE ORO:** Nunca actualices el saldo de una cuenta (`Account.balance`) en una consulta separada sin usar una transacción atómica (`prisma.$transaction`).
   * Cualquier creación, edición o eliminación de transacción financiera debe ejecutar el bloqueo y recálculo de balances de forma atómica.

4. **Tratamiento Multi-Moneda (BOB / USD / EUR / USDT):**
   * Todas las operaciones deben conservar la moneda original de la cuenta (`currency`).
   * Para consolidaciones patrimoniales (Net Worth), se debe utilizar la tasa de cambio parametrizable (Tipo de cambio oficial y paralelo boliviano).

---

## 💻 2. Estándares de TypeScript y JavaScript

1. **Tipado Estricto (Strict Mode):**
   * Prohibido el uso de `any`. Si el tipo es dinámico o desconocido, usa `unknown` junto con validación mediante **Zod** o type guards.
   * Define siempre los tipos de retorno en funciones y métodos públicos:
     ```typescript
     // ❌ INCORRECTO
     async function getAccount(id) { ... }

     // ✅ CORRECTO
     async function getAccount(id: string): Promise<AccountResponseDto> { ... }
     ```

2. **Validación de Entradas (Zod & Class-Validator):**
   * Todo endpoint REST debe validar sus payloads de entrada (`CreateTransactionDto`, `CreateAccountDto`, etc.) con DTOs fuertemente tipados.

3. **Inmutabilidad y Funciones Puras:**
   * Prefiere métodos inmutables (`map`, `filter`, `reduce`) sobre mutaciones directas de arrays u objetos.

---

## 📝 3. Reglas de Documentación de Código

1. **Comentarios TSDoc / JSDoc Obligatorios:**
   * Toda función, clase, método de servicio o interfaz exportada debe incluir un bloque de documentación TSDoc explicando su propósito, parámetros y valores de retorno:
     ```typescript
     /**
      * Procesa y parsea el texto en crudo de una notificación bancaria (SMS / Push).
      *
      * @param rawMessage - Texto completo recibido del banco boliviano o pasarela
      * @returns Objeto con monto, comercio, cuenta inferida y nivel de confianza
      * @throws BadRequestException si el formato no coincide con ningún patrón conocido
      */
     parseRawNotification(rawMessage: string): ParsedBankTransaction;
     ```

2. **Código Auto-Explicativo (Clean Naming):**
     * Nombres de variables y funciones en inglés técnico, descriptivos y sin abreviaturas confusas:
       * `calculateDailySafeSpendBudget()` en lugar de `calcSafe()`
       * `isSubscriptionPaidThisMonth` en lugar de `isPaid`

---

## 👥 4. Flujo de Trabajo en Git y Commits Convencionales

Todos los commits deben seguir la convención **Conventional Commits**:

| Prefijo | Propósito | Ejemplo |
| :--- | :--- | :--- |
| `feat:` | Nueva funcionalidad o módulo | `feat: add recurring investment tracking to fixed expenses` |
| `fix:` | Corrección de un bug | `fix: resolve light mode contrast in summary card` |
| `refactor:` | Mejora de código sin cambiar funcionalidad | `refactor: optimize transaction balance updates with batching` |
| `docs:` | Cambios en documentación | `docs: add coding standards and onboarding guide` |
| `test:` | Añadir o modificar pruebas | `test: add unit tests for BNB bank SMS parser` |
| `chore:` | Tareas de mantenimiento o dependencias | `chore: update turbo dependencies` |

---

## 🤖 5. Instrucciones para Asistentes de Inteligencia Artificial (AI Context)

Si estás utilizando un agente de IA (Cursor, Copilot, Antigravity, Claude Code):
1. **Lee primero este archivo y [`ARCHITECTURE.md`](file:///docs/ARCHITECTURE.md)** antes de realizar modificaciones estructurales.
2. **Ejecuta siempre el linter y typecheck** (`npx tsc --noEmit`) antes de dar por terminada una tarea.
3. **No elimines comentarios existentes** ni desestabilices la compatibilidad entre `apps/api`, `apps/web` y `apps/mobile`.
4. **Respeta la estructura monorepo:** Los tipos compartidos van en `packages/shared-types`.
