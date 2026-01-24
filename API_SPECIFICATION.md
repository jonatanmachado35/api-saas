# AgentChat - API Specification

Este documento especifica todos os endpoints necessários para o backend consumido pelo frontend AgentChat.

## Base URL

```
VITE_PUBLIC_API_URL=https://sua-api.com/api
```

## Autenticação

Todos os endpoints autenticados requerem o header:
```
Authorization: Bearer {token}
```

---

## 1. Autenticação

### 1.1 Registrar Usuário

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "full_name": "Nome Completo"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "user_metadata": {
      "full_name": "Nome Completo"
    }
  },
  "token": "jwt_token"
}
```

**Erros:**
- `400` - Email já cadastrado
- `400` - Senha deve ter no mínimo 6 caracteres

---

### 1.2 Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "user_metadata": {
      "full_name": "Nome Completo",
      "avatar_url": "https://..."
    }
  },
  "token": "jwt_token"
}
```

**Erros:**
- `401` - Email ou senha incorretos

---

### 1.3 Login com Google

```http
POST /auth/google
```

**Request Body:**
```json
{
  "google_token": "token_do_google"
}
```

**Response (200):**
```json
{
  "user": { ... },
  "token": "jwt_token"
}
```

---

### 1.4 Validar Sessão

```http
GET /auth/me
```

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "user_metadata": { ... }
  }
}
```

**Erros:**
- `401` - Token inválido ou expirado

---

### 1.5 Logout

```http
POST /auth/logout
```

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true
}
```

---

## 2. Perfil do Usuário

### 2.1 Obter Perfil

```http
GET /profiles/:user_id
```

**Response (200):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "full_name": "Nome Completo",
  "avatar_url": "https://...",
  "email": "usuario@email.com",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### 2.2 Atualizar Perfil

```http
PUT /profiles/:user_id
```

**Request Body:**
```json
{
  "full_name": "Novo Nome",
  "avatar_url": "https://..."
}
```

**Response (200):**
```json
{
  "success": true,
  "profile": { ... }
}
```

---

### 2.3 Upload de Avatar

```http
POST /profiles/:user_id/avatar
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `avatar`: File (imagem)

**Response (200):**
```json
{
  "url": "https://storage.../avatar.jpg"
}
```

---

## 3. Roles de Usuário

### 3.1 Obter Role do Usuário

```http
GET /users/:user_id/role
```

**Response (200):**
```json
{
  "role": "user" | "moderator" | "admin" | null
}
```

---

## 4. Assinaturas

### 4.1 Obter Assinatura do Usuário

```http
GET /subscriptions/:user_id
```

**Response (200):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "plan": "free" | "pro" | "custom",
  "status": "active" | "canceled" | "pending",
  "credits": 100,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### 4.2 Upgrade de Plano

```http
POST /subscriptions/upgrade
```

**Request Body:**
```json
{
  "plan": "pro"
}
```

**Response (200):**
```json
{
  "subscription": { ... },
  "success": true
}
```

---

### 4.3 Downgrade de Plano

```http
POST /subscriptions/downgrade
```

**Response (200):**
```json
{
  "subscription": { ... },
  "success": true
}
```

---

### 4.4 Comprar Créditos

```http
POST /credits/purchase
```

**Request Body:**
```json
{
  "package_id": "popular",
  "credits": 500
}
```

**Response (200):**
```json
{
  "success": true,
  "total_credits": 600
}
```

---

## 5. Agentes

### 5.1 Listar Agentes do Usuário

```http
GET /agents?user_id=:user_id
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Assistente de Vendas",
    "avatar": "🤖",
    "description": "Ajuda com vendas",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### 5.2 Criar Agente

```http
POST /agents
```

**Request Body:**
```json
{
  "user_id": "uuid",
  "name": "Meu Agente",
  "avatar": "🤖",
  "description": "Descrição opcional"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Meu Agente",
  "avatar": "🤖",
  "description": "Descrição opcional",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 5.3 Atualizar Agente

```http
PUT /agents/:agent_id
```

**Request Body:**
```json
{
  "name": "Novo Nome",
  "avatar": "🧠",
  "description": "Nova descrição"
}
```

**Response (200):**
```json
{
  "agent": { ... },
  "success": true
}
```

---

### 5.4 Deletar Agente

```http
DELETE /agents/:agent_id
```

**Response (200):**
```json
{
  "success": true
}
```

---

## 6. Chat e Mensagens

### 6.1 Listar Chats

```http
GET /chats?user_id=:user_id
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "agent_id": "uuid",
    "title": "Conversa 1",
    "last_message": "Última mensagem...",
    "unread": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### 6.2 Enviar Mensagem

```http
POST /chats/:chat_id/messages
```

**Request Body:**
```json
{
  "content": "Olá, como posso ajudar?"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "chat_id": "uuid",
  "content": "Olá, como posso ajudar?",
  "sender": "user",
  "timestamp": "2024-01-01T00:00:00Z",
  "agent_response": {
    "id": "uuid",
    "content": "Resposta do agente...",
    "sender": "agent",
    "timestamp": "2024-01-01T00:00:01Z"
  }
}
```

---

## 7. Contato

### 7.1 Enviar Formulário de Contato

```http
POST /contact
```

**Request Body:**
```json
{
  "name": "Nome",
  "email": "email@exemplo.com",
  "company": "Empresa (opcional)",
  "subject": "Assunto da mensagem",
  "message": "Conteúdo da mensagem..."
}
```

**Validações:**
- `name`: 2-100 caracteres
- `email`: email válido
- `subject`: 5-200 caracteres
- `message`: 10-2000 caracteres

**Response (200):**
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso"
}
```

---

## 8. Admin - Dashboard

### 8.1 Estatísticas

```http
GET /admin/stats
```

**Requer:** Role `admin`

**Response (200):**
```json
{
  "total_users": 150,
  "total_agents": 320,
  "total_subscriptions": 145,
  "pro_subscriptions": 45
}
```

---

## 9. Admin - Usuários

### 9.1 Listar Usuários

```http
GET /admin/users
```

**Requer:** Role `admin`

**Response (200):**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "full_name": "Nome",
    "avatar_url": "https://...",
    "created_at": "2024-01-01T00:00:00Z",
    "role": "user" | "moderator" | "admin" | null,
    "plan": "free" | "pro" | "custom" | null,
    "status": "active" | "inactive" | "pending" | null,
    "credits": 100
  }
]
```

---

### 9.2 Alterar Role de Usuário

```http
PUT /admin/users/:user_id/role
```

**Requer:** Role `admin`

**Request Body:**
```json
{
  "role": "admin" | "moderator" | "user" | "none"
}
```

**Response (200):**
```json
{
  "success": true
}
```

---

## 10. Admin - Assinaturas

### 10.1 Listar Assinaturas

```http
GET /admin/subscriptions
```

**Requer:** Role `admin`

**Response (200):**
```json
{
  "subscriptions": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "plan": "pro",
      "status": "active",
      "credits": 500,
      "owner_name": "Nome do Usuário",
      "owner_email": "email@exemplo.com",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "users_without_subscription": [
    {
      "user_id": "uuid",
      "full_name": "Nome"
    }
  ]
}
```

---

### 10.2 Criar Assinatura

```http
POST /admin/subscriptions
```

**Requer:** Role `admin`

**Request Body:**
```json
{
  "user_id": "uuid",
  "plan": "free" | "pro" | "custom",
  "status": "active",
  "credits": 100
}
```

**Response (201):**
```json
{
  "subscription": { ... },
  "success": true
}
```

---

### 10.3 Atualizar Assinatura

```http
PUT /admin/subscriptions/:subscription_id
```

**Requer:** Role `admin`

**Request Body:**
```json
{
  "plan": "pro",
  "status": "active",
  "credits": 500
}
```

**Response (200):**
```json
{
  "subscription": { ... },
  "success": true
}
```

---

## 11. Admin - Agentes

### 11.1 Listar Todos os Agentes

```http
GET /admin/agents
```

**Requer:** Role `admin`

**Response (200):**
```json
{
  "agents": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Agente 1",
      "avatar": "🤖",
      "description": "...",
      "owner_name": "Nome do Dono",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "users": [
    {
      "user_id": "uuid",
      "full_name": "Nome"
    }
  ]
}
```

---

### 11.2 Criar Agente (Admin)

```http
POST /admin/agents
```

**Requer:** Role `admin`

**Request Body:**
```json
{
  "user_id": "uuid",
  "name": "Agente",
  "avatar": "🤖",
  "description": "Descrição"
}
```

**Response (201):**
```json
{
  "agent": { ... },
  "success": true
}
```

---

### 11.3 Deletar Agente (Admin)

```http
DELETE /admin/agents/:agent_id
```

**Requer:** Role `admin`

**Response (200):**
```json
{
  "success": true
}
```

---

## Modelos de Dados

### User
```typescript
interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}
```

### Profile
```typescript
interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}
```

### Subscription
```typescript
interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'pro' | 'custom';
  status: 'active' | 'canceled' | 'pending';
  credits: number;
  created_at: string;
  updated_at: string;
}
```

### Agent
```typescript
interface Agent {
  id: string;
  user_id: string;
  name: string;
  avatar: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}
```

### UserRole
```typescript
type AppRole = 'admin' | 'moderator' | 'user';
```

---

## Planos e Limites

### Plano Free (R$ 0/mês)
- 3 agentes ativos
- 100 mensagens/mês
- Histórico de 7 dias
- 50 créditos iniciais

### Plano Pro (R$ 49/mês)
- Agentes ilimitados
- Mensagens ilimitadas
- Histórico completo
- 500 créditos/mês
- Suporte prioritário

### Plano Enterprise (Sob consulta)
- Tudo do Pro
- SSO e segurança avançada
- SLA 99.9%
- Gerente dedicado
- 1000 créditos/mês

### Pacotes de Créditos
| Pacote | Créditos | Bônus | Preço |
|--------|----------|-------|-------|
| Starter | 100 | - | R$ 9,90 |
| Popular | 500 | +50 | R$ 39,90 |
| Pro | 1000 | +150 | R$ 69,90 |
| Enterprise | 5000 | +1000 | R$ 299,90 |

---

## Respostas de Erro

Todas as respostas de erro seguem o formato:

```json
{
  "error": true,
  "code": "ERROR_CODE",
  "message": "Descrição do erro"
}
```

### Códigos de Erro Comuns
| Código | HTTP | Descrição |
|--------|------|-----------|
| INVALID_CREDENTIALS | 401 | Email ou senha incorretos |
| EMAIL_ALREADY_EXISTS | 400 | Email já cadastrado |
| UNAUTHORIZED | 401 | Token inválido ou ausente |
| FORBIDDEN | 403 | Sem permissão para o recurso |
| NOT_FOUND | 404 | Recurso não encontrado |
| VALIDATION_ERROR | 400 | Dados inválidos |
| INSUFFICIENT_CREDITS | 402 | Créditos insuficientes |
| PLAN_LIMIT_EXCEEDED | 403 | Limite do plano excedido |

---

## Configuração do Axios

O frontend usa a seguinte configuração:

```typescript
// src/service/api.ts
import Axios from "axios"

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para adicionar token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Variáveis de Ambiente

```env
VITE_PUBLIC_API_URL=https://api.seudominio.com
VITE_PUBLIC_WEBHOOK_URL=https://webhook.seudominio.com
```
