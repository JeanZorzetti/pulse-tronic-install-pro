# 👨‍💼 Pulse Tronic - Painel Administrativo

Painel administrativo moderno para gerenciamento de orçamentos, contatos, agendamentos e conteúdo do site.

## 🚀 Stack Tecnológica

- **React 18** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rápido
- **React Router** - Roteamento
- **TanStack Query** - Data fetching e cache
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **Sonner** - Toast notifications
- **Recharts** - Gráficos e dashboards
- **date-fns** - Manipulação de datas
- **Zod** - Validação de schemas

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🏗️ Estrutura do Projeto

```
admin/
├── src/
│   ├── components/      # Componentes React
│   │   ├── ui/         # Componentes shadcn/ui
│   │   └── layout/     # Layouts (Header, Sidebar, etc)
│   ├── pages/          # Páginas/rotas
│   ├── services/       # Serviços de API
│   ├── contexts/       # React Contexts
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Configurações (axios, etc)
│   ├── types/          # TypeScript types
│   └── assets/         # Imagens, fontes, etc
├── public/             # Arquivos estáticos
└── index.html          # HTML entry point
```

## 🔐 Autenticação

O painel utiliza JWT (JSON Web Tokens) para autenticação:

- **Access Token**: Token de curta duração para autenticar requisições
- **Refresh Token**: Token de longa duração para renovar o access token
- Armazenamento em localStorage
- Refresh automático quando access token expira
- Redirect para login em caso de falha

## 📡 Integração com Backend

A comunicação com o backend é feita via Axios com interceptors:

- Adiciona automaticamente o token de auth nas requisições
- Trata refresh de tokens expirados
- Trata erros globalmente

**Base URL**: Configurada via `VITE_API_URL` no `.env`

## 🎨 Componentes UI

Utilizamos shadcn/ui para componentes consistentes e acessíveis:

```bash
# Adicionar componentes shadcn/ui conforme necessário
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
# etc...
```

## 🚧 Status do Desenvolvimento

### ✅ Implementado (Fase 3.1 - Setup)

- Estrutura do projeto
- Configuração Vite + React + TypeScript
- Configuração Tailwind CSS
- Sistema de autenticação (Login/Logout)
- Proteção de rotas
- Interceptors Axios (auth + refresh)
- Página de login responsiva
- Dashboard placeholder

### 🔄 Em Desenvolvimento

- Dashboard com métricas reais
- Gerenciamento de orçamentos
- Gerenciamento de contatos
- Sistema de notificações UI
- CMS (Serviços, FAQs, Depoimentos)

### ⏳ Planejado

- Calendário de agendamentos
- Gráficos e analytics
- Upload de imagens
- Sistema de permissões por role
- Configurações da empresa
- Dark mode toggle

## 🔑 Credenciais de Teste

```
Email: admin@pulsetronic.com.br
Senha: Admin@123
```

(Definidas no seed do backend)

## 🌐 Endpoints da API

```
# Auth
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh

# Quotes (Admin)
GET    /api/admin/quotes
GET    /api/admin/quotes/:id
PUT    /api/admin/quotes/:id
DELETE /api/admin/quotes/:id

# Contacts (Admin)
GET    /api/admin/contacts
GET    /api/admin/contacts/:id
PUT    /api/admin/contacts/:id
DELETE /api/admin/contacts/:id

# Notifications (Admin)
GET    /api/admin/notifications
GET    /api/admin/notifications/unread-count
PATCH  /api/admin/notifications/:id/read
PATCH  /api/admin/notifications/mark-all-read
DELETE /api/admin/notifications/:id
```

## 📱 Responsividade

O painel é totalmente responsivo e funciona em:

- Desktop (1920px+)
- Laptop (1280px - 1919px)
- Tablet (768px - 1279px)
- Mobile (< 768px)

## 🎯 Próximos Passos

1. Implementar dashboard com dados reais
2. Criar tabelas de orçamentos e contatos
3. Implementar sistema de notificações UI
4. Adicionar gráficos (Recharts)
5. Criar CMS para gerenciar conteúdo
6. Implementar calendário de agendamentos

## 📄 Licença

Propriedade de Pulse Tronic Install Pro - Todos os direitos reservados
