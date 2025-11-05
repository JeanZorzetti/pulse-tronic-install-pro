# 🚀 Deploy no Easypanel - Pulse Tronic Backend

## 📋 Informações do PostgreSQL

**Database já configurada:**
```
User: pulse
Password: PAzo18**
Database Name: pulse
Internal Host: dados_pulse
Internal Port: 5432
Internal Connection URL: postgres://pulse:PAzo18**@dados_pulse:5432/pulse?sslmode=disable
External Host: 31.97.23.166
External Port: 5434
```

---

## 🔧 Configuração do Backend no Easypanel

### 1. Criar novo App/Service

1. Acesse seu projeto `pulse` no Easypanel
2. Clique em **"+ Service"**
3. Escolha **"App"**
4. Selecione **"From GitHub"**

### 2. Configurar Repositório

```
Repository: https://github.com/JeanZorzetti/pulse-tronic-install-pro
Branch: main
```

### 3. Configurar Build

**Build Method:** Dockerfile

**Dockerfile Path:** `./Dockerfile`

**Build Context:** `/` (raiz do repositório)

**Port:** `3000`

---

## 🔐 Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente no Easypanel:

```env
# Server
NODE_ENV=production
PORT=3000
API_URL=https://api.pulsetronic.com.br

# Database (usar Internal Connection URL do PostgreSQL)
DATABASE_URL=postgresql://pulse:PAzo18**@dados_pulse:5432/pulse?sslmode=disable

# Redis (opcional - adicionar depois)
# REDIS_URL=redis://redis:6379

# JWT Authentication
JWT_SECRET=pulse-tronic-super-secret-jwt-key-2025-production-change-this
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=pulse-tronic-refresh-secret-key-2025-production-change-this
JWT_REFRESH_EXPIRES_IN=30d

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contato@pulsetronic.com.br
SMTP_PASS=sua-senha-app-gmail
SMTP_FROM=Pulse Tronic <contato@pulsetronic.com.br>

# Admin Email
ADMIN_EMAIL=admin@pulsetronic.com.br

# WhatsApp (opcional - configurar depois)
# TWILIO_ACCOUNT_SID=your-twilio-account-sid
# TWILIO_AUTH_TOKEN=your-twilio-auth-token
# TWILIO_WHATSAPP_NUMBER=+14155238886
# ADMIN_WHATSAPP=+5511999999999

# Google Maps (opcional - configurar depois)
# GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Frontend URLs (ajustar com seus domínios)
FRONTEND_URL=https://pulsetronic.com.br
ADMIN_URL=https://admin.pulsetronic.com.br

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=10

# Sentry (opcional - configurar depois)
# SENTRY_DSN=your-sentry-dsn
```

---

## 📝 Configuração Passo a Passo

### Passo 1: Criar o App Backend

1. No Easypanel, vá para seu projeto `pulse`
2. Clique em **"+ Service"**
3. Selecione **"App"**
4. Nome do serviço: `backend` ou `api`

### Passo 2: Conectar GitHub

1. Autorize o Easypanel a acessar seu GitHub
2. Selecione o repositório: `JeanZorzetti/pulse-tronic-install-pro`
3. Branch: `main`

### Passo 3: Configurar Build

```yaml
Build Method: Dockerfile
Dockerfile: ./Dockerfile
Build Context: /
Port: 3000
```

### Passo 4: Adicionar Variáveis de Ambiente

Copie e cole as variáveis acima na seção "Environment Variables"

**IMPORTANTE:** Ajuste os seguintes valores:

1. **SMTP_PASS:** Senha de app do Gmail (não use sua senha normal)
   - Vá em: https://myaccount.google.com/apppasswords
   - Crie uma senha de app para "Mail"

2. **JWT_SECRET e JWT_REFRESH_SECRET:**
   - Use valores únicos e seguros
   - Gere com: `openssl rand -base64 64`

3. **FRONTEND_URL e ADMIN_URL:**
   - Ajuste com seus domínios reais
   - Ou use temporariamente: `http://localhost:8080`

### Passo 5: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (~2-3 minutos)

---

## 🗄️ Executar Migrations do Prisma

Após o primeiro deploy bem-sucedido, você precisa executar as migrations:

### Opção 1: Via Easypanel Shell

1. No Easypanel, vá até o serviço `backend`
2. Clique em **"Shell"** ou **"Terminal"**
3. Execute:

```bash
# Gerar Prisma Client (se necessário)
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# Popular banco com dados iniciais
npx prisma db seed
```

### Opção 2: Via Connection String Externa

Se preferir executar localmente antes:

```bash
# Clone o repositório
git clone https://github.com/JeanZorzetti/pulse-tronic-install-pro.git
cd pulse-tronic-install-pro/Backend

# Configure .env com a connection string EXTERNA
echo "DATABASE_URL=postgresql://pulse:PAzo18**@31.97.23.166:5434/pulse?sslmode=disable" > .env

# Instale dependências
npm install

# Execute migrations
npm run prisma:migrate

# Execute seed
npm run prisma:seed
```

---

## ✅ Verificar Deploy

### 1. Health Check

Acesse: `https://seu-dominio/health`

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-11-05T18:00:00.000Z",
  "uptime": 120,
  "environment": "production"
}
```

### 2. Testar Endpoint de Serviços

Acesse: `https://seu-dominio/api/services`

Deve retornar lista de serviços cadastrados no seed.

### 3. Testar Endpoint de FAQ

Acesse: `https://seu-dominio/api/faqs`

Deve retornar lista de FAQs cadastradas no seed.

---

## 🔗 Configurar Domínio

### No Easypanel:

1. Vá até o serviço `backend`
2. Clique em **"Domains"**
3. Adicione seu domínio: `api.pulsetronic.com.br`
4. Easypanel gerará SSL automaticamente (Let's Encrypt)

### No DNS (Cloudflare, etc):

Adicione um registro A ou CNAME:
```
Type: A
Name: api
Value: 31.97.23.166 (IP do seu servidor)
```

---

## 📊 Monitoramento

### Logs

No Easypanel:
1. Vá até o serviço `backend`
2. Clique em **"Logs"**
3. Verifique os logs de inicialização

Deve aparecer:
```
🚀 Pulse Tronic Backend API
📡 Server running on port 3000
🌍 Environment: production
🔗 API URL: https://api.pulsetronic.com.br
✅ Health check: https://api.pulsetronic.com.br/health
```

### Métricas

No dashboard do Easypanel você verá:
- CPU Usage
- Memory Usage
- Network I/O

---

## 🐛 Troubleshooting

### Erro: "unable to prepare context"
✅ **RESOLVIDO** - Dockerfile agora está na raiz do projeto

### Erro: "DATABASE_URL is not set"
Verifique se a variável `DATABASE_URL` está configurada corretamente nas variáveis de ambiente

### Erro: "Failed to connect to database"
Verifique:
1. PostgreSQL está rodando
2. Credenciais estão corretas
3. Use o **Internal Connection URL** (não o external)

### Erro: "Port 3000 is not accessible"
Verifique se a porta 3000 está configurada corretamente nas configurações do app

### Migrations não foram executadas
Execute manualmente via shell:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 🔄 Atualizações Futuras

Para fazer deploy de novas versões:

1. Faça commit e push no GitHub:
   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin main
   ```

2. No Easypanel:
   - Vá até o serviço
   - Clique em **"Redeploy"**
   - Ou configure **Auto Deploy** para deploy automático a cada push

---

## 📋 Checklist de Deploy

- [ ] PostgreSQL configurado e rodando
- [ ] Variáveis de ambiente configuradas
- [ ] Build do Docker concluído com sucesso
- [ ] Migrations executadas (`prisma migrate deploy`)
- [ ] Seed executado (`prisma db seed`)
- [ ] Health check retorna 200 OK
- [ ] Endpoints da API funcionando
- [ ] Domínio configurado
- [ ] SSL ativo (HTTPS)
- [ ] Logs sem erros críticos
- [ ] Email SMTP configurado
- [ ] JWT secrets configurados

---

## 🎯 Próximos Passos Após Deploy

1. **Configurar Redis** (para cache e filas)
   - Adicionar serviço Redis no Easypanel
   - Atualizar `REDIS_URL` nas variáveis

2. **Configurar Email Production**
   - Verificar SMTP funcionando
   - Testar envio de emails

3. **Implementar Autenticação JWT**
   - Criar rotas de login/logout
   - Proteger rotas admin

4. **Configurar Backups**
   - Backup automático do PostgreSQL
   - Política de retenção

5. **Monitoramento**
   - Configurar Sentry para error tracking
   - Configurar alertas de downtime

---

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs no Easypanel
2. Verifique variáveis de ambiente
3. Teste conexão com PostgreSQL
4. Abra uma issue no GitHub

---

**Desenvolvido com ❤️ para Pulse Tronic**

**Deploy configurado por:** Claude Code
**Data:** 05/11/2025
