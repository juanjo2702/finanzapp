# 📡 Referencia de API REST (Endpoints & Payloads)

La API cuenta con documentación interactiva con **Swagger / OpenAPI** en:
> `http://localhost:4000/api/docs`

---

## 1. Autenticación (`/api/auth`)

### `POST /api/auth/register`
Registra un nuevo usuario y crea automáticamente sus cuentas base (Efectivo y Cuenta Principal).
```json
{
  "email": "juanjose@ejemplo.com",
  "password": "PasswordSegura123!",
  "fullName": "Juan José Rodríguez",
  "baseCurrency": "BOB"
}
```

### `POST /api/auth/login`
Autentica y devuelve el `accessToken` y `refreshToken`.
```json
{
  "email": "juanjose@ejemplo.com",
  "password": "PasswordSegura123!"
}
```

---

## 2. Cuentas (`/api/accounts`) - *Requiere Bearer Token*

* `GET /api/accounts`: Listado de cuentas activas.
* `POST /api/accounts`: Crear nueva cuenta bancaria, efectivo o cripto.
```json
{
  "name": "Caja de Ahorro BNB",
  "type": "SAVINGS",
  "currency": "BOB",
  "initialBalance": 4500.0,
  "institutionName": "Banco Nacional de Bolivia",
  "accountNumberMask": "****8912",
  "color": "#059669"
}
```

---

## 3. Transacciones (`/api/transactions`) - *Requiere Bearer Token*

* `GET /api/transactions?page=1&limit=20&type=EXPENSE&search=Hipermaxi`: Filtrado de transacciones.
* `POST /api/transactions`: Registrar gasto o ingreso.
```json
{
  "accountId": "uuid-cuenta",
  "categoryId": "uuid-categoria",
  "amount": 245.50,
  "currency": "BOB",
  "exchangeRate": 1.0,
  "type": "EXPENSE",
  "merchantName": "Hipermaxi El Prado",
  "notes": "Compras de la semana",
  "transactionDate": "2026-08-28T14:30:00Z",
  "source": "SMS_PARSER"
}
```

---

## 4. Analítica & Métricas (`/api/analytics`)

* `GET /api/analytics/summary`: Retorna el patrimonio neto, ahorro neto, desglose **50/30/20** y días de autonomía (*runway*).
* `GET /api/analytics/cashflow`: Retorna el historial mensual de ingresos vs gastos.
* `GET /api/analytics/categories`: Retorna la distribución de gastos por categoría.
* `GET /api/analytics/sankey`: Retorna nodos y enlaces para el diagrama de flujo Sankey.

---

## 5. Automatización Bancaria (`/api/banking`)

### `POST /api/banking/parse-notification`
Analiza texto plano de SMS o notificaciones push y devuelve los datos extraídos con la categoría sugerida por IA.
```json
{
  "rawMessage": "BCP: Compra con tarjeta ****4431 por Bs. 245.50 en Hipermaxi el 28/08/2026."
}
```
**Respuesta:**
```json
{
  "parsedTransaction": {
    "bankProvider": "BCP_BOLIVIA",
    "amount": 245.5,
    "currency": "BOB",
    "type": "EXPENSE",
    "merchantName": "Hipermaxi",
    "accountIdentifier": "****4431",
    "confidenceScore": 0.95
  },
  "aiCategorization": {
    "suggestedCategory": "Supermercado & Víveres",
    "classification": "NEEDS",
    "confidence": 0.92
  }
}
```
