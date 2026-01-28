# Módulo de Pagamentos - AbacatePay

Integração completa com gateway de pagamento AbacatePay seguindo Clean Architecture.

## 📦 Estrutura

```
payment/
├── domain/
│   ├── entities/
│   │   └── payment.entity.ts         # Entidade Payment
│   └── repositories/
│       └── payment.repository.interface.ts
├── application/
│   └── use-cases/
│       ├── payment.use-cases.ts      # CreateSubscriptionPayment, CreateCreditsPayment
│       └── webhook.use-case.ts       # ProcessPaymentWebhook
├── infra/
│   ├── repositories/
│   │   └── prisma-payment.repository.ts
│   ├── services/
│   │   └── abacatepay.service.ts     # Cliente HTTP AbacatePay
│   └── http/
│       ├── controllers/
│       │   └── payment.controller.ts  # PaymentController + WebhookController
│       └── dtos/
│           └── payment.dto.ts
└── payment.module.ts
```

## 🔧 Funcionalidades

### 1. Pagamento de Assinaturas (Mensalidade)

**Endpoint:** `POST /payments/subscription/checkout`

**Request:**
```json
{
  "plan": "pro",
  "returnUrl": "https://app.agentchat.com/dashboard"
}
```

**Response:**
```json
{
  "paymentId": "uuid",
  "externalId": "bill_12345667",
  "paymentUrl": "https://abacatepay.com/pay/bill_12345667",
  "amount": 4990,
  "status": "pending"
}
```

**Preços:**
- PRO: R$ 49,90/mês (recorrente)

### 2. Compra de Créditos (Pagamento Único)

**Endpoint:** `POST /payments/credits/checkout`

**Request:**
```json
{
  "packageId": "popular",
  "returnUrl": "https://app.agentchat.com/dashboard"
}
```

**Response:**
```json
{
  "paymentId": "uuid",
  "externalId": "bill_12345668",
  "paymentUrl": "https://abacatepay.com/pay/bill_12345668",
  "amount": 3990,
  "credits": 550,
  "status": "pending"
}
```

**Pacotes Disponíveis:**

| Package ID | Créditos Base | Bônus | Total | Preço |
|-----------|---------------|-------|-------|-------|
| starter | 100 | 0 | 100 | R$ 9,90 |
| popular | 500 | 50 | 550 | R$ 39,90 |
| pro | 1000 | 150 | 1150 | R$ 69,90 |
| enterprise | 5000 | 1000 | 6000 | R$ 299,90 |

### 3. Listar Pagamentos

**Endpoint:** `GET /payments`

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "credits",
    "amount": 3990,
    "description": "Compra de 550 créditos (pacote popular)",
    "status": "paid",
    "frequency": "one_time",
    "paymentUrl": "https://...",
    "createdAt": "2026-01-27T..."
  }
]
```

### 4. Webhook (AbacatePay → Backend)

**Endpoint:** `POST /webhooks/abacatepay`

**Body (enviado pelo AbacatePay):**
```json
{
  "id": "bill_12345667",
  "status": "PAID",
  "amount": 4990,
  "frequency": "MONTHLY",
  "metadata": {
    "paymentId": "uuid",
    "userId": "uuid",
    "type": "subscription",
    "plan": "pro"
  }
}
```

**Processamento automático:**
- ✅ Marca payment como PAID
- ✅ Ativa/atualiza subscription do usuário (se tipo = subscription)
- ✅ Adiciona créditos à subscription (se tipo = credits)

## 🔐 Variáveis de Ambiente

```env
# AbacatePay
ABACATEPAY_API_KEY=sk-p5dY6E8s2aewrwaMGRs57dAnxrBZk
ABACATEPAY_BASE_URL=https://api.abacatepay.com/v1
```

## 🗄️ Banco de Dados

**Tabela:** `payments`

```sql
CREATE TABLE "payments" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "type" PaymentType NOT NULL,           -- SUBSCRIPTION | CREDITS
  "amount" INTEGER NOT NULL,              -- Valor em centavos
  "description" TEXT NOT NULL,
  "status" PaymentStatus DEFAULT 'PENDING', -- PENDING | PAID | FAILED | CANCELED
  "frequency" PaymentFrequency DEFAULT 'ONE_TIME', -- ONE_TIME | MONTHLY
  "external_id" TEXT UNIQUE,              -- billing ID do AbacatePay
  "payment_url" TEXT,                     -- URL de checkout
  "metadata" JSONB,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Fluxo Completo

### Assinatura PRO:

1. **Frontend** chama `POST /payments/subscription/checkout { plan: "pro" }`
2. **Backend** cria Payment (PENDING) no banco
3. **Backend** chama AbacatePay API `/billing/create` (MONTHLY)
4. **AbacatePay** retorna URL de pagamento
5. **Backend** retorna `paymentUrl` para o frontend
6. **Usuário** acessa URL e paga (PIX ou Cartão)
7. **AbacatePay** envia webhook `POST /webhooks/abacatepay { status: PAID }`
8. **Backend** processa webhook:
   - Marca payment como PAID
   - Ativa subscription do usuário (plan = PRO, status = ACTIVE)
9. **Usuário** tem acesso ao plano PRO

### Compra de Créditos:

1. **Frontend** chama `POST /payments/credits/checkout { packageId: "popular" }`
2. **Backend** cria Payment (PENDING, metadata com créditos)
3. **AbacatePay** retorna URL de pagamento (ONE_TIME)
4. **Usuário** paga
5. **Webhook** confirma pagamento
6. **Backend** adiciona 550 créditos (500 + 50 bônus) à subscription

## 🔄 Estados do Payment

- **PENDING**: Aguardando pagamento
- **PAID**: Pagamento confirmado (créditos/assinatura já creditados)
- **FAILED**: Pagamento falhou
- **CANCELED**: Cancelado
- **REFUNDED**: Reembolsado

## 📝 Notas Importantes

1. **Modo DEV**: API key atual é de homologação (`sk-p5dY6E8s2ae...`)
2. **Idempotência**: AbacatePay é idempotente, pode reenviar requisições
3. **Webhook**: Configure a URL no painel AbacatePay: `https://sua-api.com/webhooks/abacatepay`
4. **Segurança**: Webhook é público (sem auth) — validar assinatura em produção
5. **Metadata**: Sempre inclua `paymentId` para rastreamento

## 🧪 Testando

```bash
# Criar checkout de assinatura
curl -X POST http://localhost:3000/payments/subscription/checkout \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"plan":"pro","returnUrl":"https://app.com"}'

# Criar checkout de créditos
curl -X POST http://localhost:3000/payments/credits/checkout \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"packageId":"popular","returnUrl":"https://app.com"}'

# Simular webhook (DEV)
curl -X POST http://localhost:3000/webhooks/abacatepay \
  -H "Content-Type: application/json" \
  -d '{
    "id":"bill_123",
    "status":"PAID",
    "amount":3990,
    "frequency":"ONE_TIME",
    "metadata":{"paymentId":"uuid","type":"credits","credits":500,"bonus":50}
  }'
```

## 📚 Princípios Aplicados

✅ **Clean Architecture**: Domain → Application → Infrastructure
✅ **SOLID**: Single Responsibility, Dependency Inversion
✅ **DDD**: Payment como entidade rica, repositório como port
✅ **Framework Agnostic**: Lógica de negócio independente do NestJS
✅ **Testabilidade**: Use cases facilmente mockáveis
