# Render CI/CD - Quick Start

## 🚀 Deploy em 5 Minutos

### 1. Conectar ao Render

```bash
# 1. Acesse: https://dashboard.render.com
# 2. Clique em "New +" → "Blueprint"
# 3. Conecte seu GitHub e selecione este repo
# 4. Render detecta o render.yaml automaticamente
```

### 2. Configurar Variáveis de Ambiente

**Obrigatórias:**
```bash
DATABASE_URL=postgresql://...  # Gerado automaticamente pelo Render DB
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://sua-api.onrender.com/auth/google/callback
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_CALLBACK_URL=https://sua-api.onrender.com/auth/github/callback
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ABACATEPAY_API_KEY=sk-p5dY6E8s2aewrwaMGRs57dAnxrBZk
CORS_ORIGIN=https://seu-frontend.com
```

**Auto-geradas pelo Render:**
- `JWT_SECRET` ✅
- `PORT` ✅

### 3. Primeiro Deploy

Clique em **"Apply"** e aguarde ~5 minutos.

## 🔄 CI/CD Automático

**✅ Configurado:**
- Auto-deploy na branch `main`
- Health checks automáticos
- Rollback automático se falhar
- Logs em tempo real

**📋 Pipeline:**
```
Push → Build Docker → Migrations → Health Check → Deploy ✅
```

## 📝 Checklist Pós-Deploy

- [ ] API respondendo: `GET https://sua-api.onrender.com/`
- [ ] Swagger: `GET https://sua-api.onrender.com/api`
- [ ] Webhook AbacatePay configurado
- [ ] CORS configurado com frontend
- [ ] Logs sem erros

## 🔗 Links Úteis

- **Dashboard:** https://dashboard.render.com
- **Docs:** https://render.com/docs
- **Support:** https://render.com/docs/support

Pronto! 🎉
