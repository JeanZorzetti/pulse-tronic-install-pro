# 🚀 Pulse Tronic Backend API

Backend API REST para o sistema Pulse Tronic - Instalação Profissional Automotiva BYOD.

## 📋 Tecnologias

- **Node.js** 20 LTS
- **Express.js** 4.x - Framework web
- **TypeScript** 5.x - Type safety
- **Prisma ORM** - Database ORM
- **PostgreSQL** 16 - Database
- **Redis** 7 - Cache (opcional)
- **JWT** - Autenticação
- **Nodemailer** - Envio de emails
- **Zod** - Validação de dados
- **Docker** - Containerização

---

## 🏗️ Estrutura do Projeto

```
Backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed
├── src/
│   ├── config/            # Configurações
│   │   └── env.ts         # Environment variables
│   ├── controllers/       # Controllers
│   │   ├── quote.controller.ts
│   │   ├── contact.controller.ts
│   │   ├── service.controller.ts
│   │   ├── faq.controller.ts
│   │   └── testimonial.controller.ts
│   ├── middlewares/       # Middlewares
│   │   └── validate.ts
│   ├── routes/            # Routes
│   │   ├── index.ts
│   │   └── public.routes.ts
│   ├── services/          # Services
│   │   └── email.service.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── utils/             # Utilities
│   │   └── response.ts
│   ├── validators/        # Zod validators
│   │   ├── quote.validator.ts
│   │   └── contact.validator.ts
│   └── server.ts          # Main server file
├── .env.example           # Example environment variables
├── .gitignore
├── Dockerfile             # Production Dockerfile
├── docker-compose.yml     # Development setup
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL 16 (ou Docker)
- Redis 7 (opcional, ou Docker)

### 1. Instalação

```bash
# Clone o repositório
git clone https://github.com/JeanZorzetti/pulse-tronic-install-pro.git
cd pulse-tronic-install-pro/Backend

# Instale as dependências
npm install
```

### 2. Configuração

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

**Variáveis Essenciais:**

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/pulsetronic
JWT_SECRET=your-super-secret-jwt-key-change-this
SMTP_HOST=smtp.gmail.com
SMTP_USER=contato@pulsetronic.com.br
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@pulsetronic.com.br
FRONTEND_URL=http://localhost:8080
```

### 3. Database Setup

```bash
# Gere o Prisma Client
npm run prisma:generate

# Execute as migrations
npm run prisma:migrate

# Popule o banco com dados iniciais
npm run prisma:seed
```

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

---

## 🐳 Docker

### Desenvolvimento com Docker Compose

```bash
# Inicie todos os serviços (backend + postgres + redis)
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (apaga dados)
docker-compose down -v
```

### Build para Produção

```bash
# Build da imagem
docker build -t pulsetronic-backend .

# Run container
docker run -p 3000:3000 --env-file .env pulsetronic-backend
```

---

## 📡 API Endpoints

### Public Endpoints (Não requerem autenticação)

#### Health Check
```http
GET /health
```

#### Quotes (Orçamentos)
```http
POST /api/quotes
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "11999999999",
  "vehicle": "Honda Civic 2020",
  "equipment": "Central multimídia Pioneer",
  "serviceId": "uuid-optional",
  "message": "Mensagem opcional"
}
```

#### Contact (Contato)
```http
POST /api/contacts
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "phone": "11999999999",
  "subject": "Dúvida sobre instalação",
  "message": "Gostaria de saber mais sobre..."
}
```

#### Services (Serviços)
```http
GET /api/services
GET /api/services/:slug
```

#### FAQs
```http
GET /api/faqs
```

#### Testimonials (Depoimentos)
```http
GET /api/testimonials
GET /api/testimonials?featured=true
```

---

## 🗄️ Database Schema

### Principais Modelos

**User** - Usuários administrativos
- id, email, password, name, role, isActive

**Customer** - Clientes
- id, name, email, phone, vehicle

**Quote** - Orçamentos
- id, customerId, serviceId, equipment, vehicle, message, status

**Appointment** - Agendamentos
- id, customerId, quoteId, scheduledDate, status

**Service** - Serviços oferecidos
- id, title, description, category, slug

**Contact** - Mensagens de contato
- id, name, email, phone, subject, message, status

**Testimonial** - Depoimentos
- id, customerId, name, rating, comment, isApproved

**FAQ** - Perguntas Frequentes
- id, question, answer, displayOrder

---

## 🔐 Autenticação (Em desenvolvimento)

```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/logout
```

---

## 📧 Email Templates

O sistema envia emails automaticamente para:

1. **Confirmação de Orçamento** (Cliente)
2. **Notificação de Novo Orçamento** (Admin)
3. **Confirmação de Contato** (Cliente)
4. **Notificação de Nova Mensagem** (Admin)

Configuração SMTP necessária no `.env`

---

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor com hot-reload

# Build
npm run build            # Compila TypeScript para JavaScript
npm start                # Inicia servidor de produção

# Prisma
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Executa migrations
npm run prisma:seed      # Popula banco com dados iniciais
npm run prisma:studio    # Abre Prisma Studio (GUI do banco)
npm run prisma:reset     # Reset completo do banco

# Lint
npm run lint             # Executa ESLint

# Test
npm test                 # Executa testes (em desenvolvimento)
```

---

## 🔧 Prisma Studio

Interface visual para o banco de dados:

```bash
npm run prisma:studio
```

Acesse: `http://localhost:5555`

---

## 📦 Deploy para Easypanel (VPS)

### 1. Prepare seu VPS com Easypanel instalado

### 2. No Easypanel:

1. Crie um novo projeto
2. Conecte ao repositório GitHub
3. Configure build via Dockerfile
4. Adicione variáveis de ambiente (`.env`)
5. Configure PostgreSQL como serviço adicional
6. Configure Redis (opcional)
7. Deploy!

### 3. Variáveis de Ambiente no Easypanel

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@postgres:5432/pulsetronic
JWT_SECRET=production-secret-key-very-long-and-secure
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@pulsetronic.com.br
SMTP_PASS=your-production-password
ADMIN_EMAIL=admin@pulsetronic.com.br
FRONTEND_URL=https://pulsetronic.com.br
ADMIN_URL=https://admin.pulsetronic.com.br
```

---

## 🔒 Segurança

✅ Helmet.js - Headers de segurança
✅ CORS configurado
✅ Rate limiting
✅ Validação de inputs (Zod)
✅ JWT authentication
✅ Bcrypt para senhas
✅ Container não-root (Docker)

---

## 📈 Monitoramento

### Health Check

```http
GET /health
```

Resposta:
```json
{
  "status": "ok",
  "timestamp": "2025-11-05T18:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

---

## 🐛 Debug

### Logs

```bash
# Docker
docker-compose logs -f backend

# PM2 (produção)
pm2 logs pulse-tronic-backend
```

### Erros Comuns

**Erro de conexão com banco:**
```
Verifique DATABASE_URL no .env
Certifique-se que PostgreSQL está rodando
```

**Erro de SMTP:**
```
Verifique credenciais SMTP
Para Gmail, use App Password
```

---

## 📚 Dados Iniciais (Seed)

Após executar `npm run prisma:seed`:

### Admin Padrão
```
Email: admin@pulsetronic.com.br
Senha: admin123
⚠️ MUDE EM PRODUÇÃO!
```

### Serviços Criados
- Instalação de Central Multimídia
- Sistema de Som (Hi-Fi / SQ)
- Câmeras e Dash Cams
- Alarmes e Sistemas de Segurança

### FAQs Criados
- 5 perguntas frequentes pré-cadastradas

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 TODO

- [ ] Implementar autenticação JWT completa
- [ ] Implementar rotas de admin protegidas
- [ ] Sistema de agendamentos
- [ ] Upload de imagens (S3)
- [ ] Integração WhatsApp API
- [ ] Testes unitários e integração
- [ ] CI/CD com GitHub Actions
- [ ] Documentação OpenAPI/Swagger

---

## 📄 Licença

ISC

---

## 👨‍💻 Autor

**Jean Zorzetti**

- GitHub: [@JeanZorzetti](https://github.com/JeanZorzetti)
- Repository: [pulse-tronic-install-pro](https://github.com/JeanZorzetti/pulse-tronic-install-pro)

---

## 🆘 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato.

---

**Desenvolvido com ❤️ para Pulse Tronic**
