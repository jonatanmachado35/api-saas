# CI/CD com Render

Este projeto está configurado para deployment automático no Render usando Infrastructure as Code.

## 🚀 Setup Inicial

### 1. Conectar Repositório ao Render

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **"New +"** → **"Blueprint"**
3. Conecte seu repositório GitHub
4. Selecione este repositório
5. O Render irá detectar automaticamente o `render.yaml`

### 2. Configurar Variáveis de Ambiente

No Render Dashboard, configure as seguintes variáveis (marcadas com `sync: false`):

#### **Banco de Dados** (PostgreSQL)
```bash
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
DIRECT_URL=postgresql://user:password@host:5432/database?schema=public
```

#### **OAuth - Google**
```bash
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GOOGLE_CALLBACK_URL=https://sua-api.onrender.com/auth/google/callback
```

#### **OAuth - GitHub**
```bash
GITHUB_CLIENT_ID=seu-github-client-id
GITHUB_CLIENT_SECRET=seu-github-client-secret
GITHUB_CALLBACK_URL=https://sua-api.onrender.com/auth/github/callback
```

#### **Cloudinary** (Upload de Imagens)
```bash
CLOUDINARY_CLOUD_NAME=seu-cloudinary-cloud-name
CLOUDINARY_API_KEY=seu-cloudinary-api-key
CLOUDINARY_API_SECRET=seu-cloudinary-api-secret
```

#### **AbacatePay** (Pagamentos)
```bash
ABACATEPAY_API_KEY=sk-p5dY6E8s2aewrwaMGRs57dAnxrBZk
ABACATEPAY_BASE_URL=https://api.abacatepay.com/v1
```

#### **CORS**
```bash
CORS_ORIGIN=https://seu-frontend.vercel.app,http://localhost:3001
```

> **Nota:** `JWT_SECRET` é gerado automaticamente pelo Render (`generateValue: true`)

### 3. Deploy Automático

O Render está configurado com **`autoDeploy: true`**, então:

✅ **Cada push na branch `main`** → Deploy automático
✅ **Pull Request merged** → Deploy automático
✅ **Manual deploy** → Botão "Manual Deploy" no dashboard

## 🔧 Configuração Atual

### Service Configuration

```yaml
- type: web
  name: agentchat-api
  env: docker
  plan: free
  region: oregon
  branch: main
  autoDeploy: true
```

### Database Configuration

```yaml
- type: database
  name: agentchat-db
  databaseName: agentchat
  plan: free
  region: oregon
```

## 📦 Processo de Build

1. **Render detecta push na branch `main`**
2. **Build da imagem Docker:**
   - Instala dependências (`npm ci`)
   - Gera Prisma Client (`npx prisma generate`)
   - Compila TypeScript (`npm run build`)
3. **Executa migrations:** `npx prisma migrate deploy`
4. **Executa seed (opcional):** `npx prisma db seed`
5. **Inicia aplicação:** `npm run start:prod`

## 🔍 Health Check

- **Endpoint:** `/`
- **Timeout:** 30s
- **Interval:** 60s

## 🌐 URLs

Após deploy, sua API estará disponível em:
```
https://agentchat-api.onrender.com
```

### Endpoints Principais:
- `GET /` - Health check
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `GET /products` - Listar produtos
- `POST /payments/credits/checkout` - Comprar créditos
- `POST /webhooks/abacatepay` - Webhook AbacatePay

## 🔄 Pipeline CI/CD

```mermaid
graph LR
    A[Push to main] --> B[Render detecta mudança]
    B --> C[Build Docker Image]
    C --> D[Run Migrations]
    D --> E[Health Check]
    E --> F{Passou?}
    F -->|Sim| G[Deploy Concluído]
    F -->|Não| H[Rollback]
```

## 📊 Monitoramento

### Logs
```bash
# Acessar logs em tempo real no Render Dashboard
# Ou via CLI:
render logs -s agentchat-api --tail
```

### Métricas
- CPU Usage
- Memory Usage
- Request Rate
- Response Time

## 🚨 Troubleshooting

### Build Falhou
1. Verifique os logs no Render Dashboard
2. Confirme que todas as env vars estão configuradas
3. Teste build local: `npm run build`

### Migration Falhou
1. Conecte ao banco: `npx prisma studio`
2. Verifique status: `npx prisma migrate status`
3. Force migration: `npx prisma migrate deploy`

### Health Check Falhou
1. Verifique se app está rodando: `GET /`
2. Confirme PORT=3000
3. Verifique logs de startup

## 🔐 Webhook do AbacatePay

Configure no painel AbacatePay:
```
URL: https://agentchat-api.onrender.com/webhooks/abacatepay
Eventos: billing.paid, billing.disputed
```

## 📝 Comandos Úteis

```bash
# Deploy manual via Render CLI
render deploy -s agentchat-api

# Ver logs
render logs -s agentchat-api --tail

# Listar services
render services list

# SSH no container
render shell agentchat-api
```

## 🎯 Próximos Passos

1. ✅ Conectar repositório ao Render
2. ✅ Configurar variáveis de ambiente
3. ✅ Fazer primeiro deploy
4. ⬜ Configurar domínio customizado
5. ⬜ Configurar notificações de deploy (Slack/Discord)
6. ⬜ Upgrade para plano pago (se necessário)

## 📚 Documentação

- [Render Docs](https://render.com/docs)
- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)
- [Render CLI](https://render.com/docs/cli)
