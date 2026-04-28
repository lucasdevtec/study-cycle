# Configuração de Autenticação com NextAuth

## Visão Geral

O projeto está configurado com **NextAuth** para autenticação via:

- **Email e Senha** (Credentials Provider)
- **Google OAuth** (Google Provider)

## Configuração Necessária

### 1. Variáveis de Ambiente (.env.local)

Copie o arquivo `.env.local.example` para `.env.local` e configure:

```bash
cp .env.example .env
```

```env
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/study_cycle_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-uma-chave-secreta-segura"

# Google OAuth
GOOGLE_CLIENT_ID="seu-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="sua-google-client-secret"
```

### 2. Gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### 3. Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Em "Credenciais", crie uma "Chave de ID do cliente (Web)"
4. Adicione as URIs autorizadas:
   - URIs JavaScript autorizadas: `http://localhost:3000`
   - URIs de redirecionamento autorizadas: `http://localhost:3000/api/auth/callback/google`
5. Copie o Client ID e Client Secret

## Execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Executar migrações

```bash
npm run db:migrate
npm run db:seed
```

Este comando irá:

- Executar todas as migrações
- Executar seeders

### 3. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`

## Fluxos de Autenticação

### Registro (Email/Senha)

1. Acesse `/signup`
2. Preencha nome, email e senha (mínimo 8 caracteres)
3. Confirme a senha
4. Clique em "Criar Conta"
5. Será redirecionado automaticamente ao dashboard

### Login (Email/Senha)

1. Acesse `/login`
2. Preencha email e senha
3. Clique em "Entrar"

### Login com Google

1. Acesse `/login`
2. Clique em "Entrar com Google"
3. Autorize o acesso
4. Se for a primeira vez, será criada uma conta automaticamente

### Recuperação de Senha

1. Acesse `/forgot-password`
2. Informe seu email
3. Você receberá um link por email (Resend)
4. Acesse o link (`/reset-password?token=...`) e defina a nova senha

Variáveis necessárias para email:

- `RESEND_API_KEY`
- `RESEND_FROM` (opcional)

## Proteção de Rotas

As seguintes rotas requerem autenticação:

- `/dashboard`
- `/ciclo/*`

O middleware em `src/middleware.js` redireciona automaticamente usuários não autenticados para `/login`.

## Estrutura de Autenticação

### Arquivos principais

- `src/app/api/auth/[...nextauth]/route.js` - Configuração do NextAuth
- `src/app/api/auth/register/route.js` - Endpoint de registro
- `src/app/login/page.js` - Página de login
- `src/app/signup/page.js` - Página de registro
- `src/middleware.js` - Proteção de rotas
- `src/components/layout/AppHeader.js` - Header com info de usuário

### Model User

Campos adicionados:

- `password` - Hash da senha (bcrypt)
- `provider` - Provedor de autenticação (credentials, google)
- `provider_id` - ID do provedor (para OAuth)

## Troubleshooting

### Erro "Email já cadastrado"

O email já existe no banco. Use um email diferente ou delete o usuário do banco.

### Erro de conexão com Google

Verifique:

1. Se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos
2. Se a URI de redirecionamento está configurada no Google Cloud Console
3. Se `NEXTAUTH_URL` aponta para `http://localhost:3000` em desenvolvimento

### Middleware não funciona

Certifique-se que está usando Next.js App Router e que o arquivo `middleware.js` está em `src/`.

## Próximas Melhorias

- [ ] Verificação de email (confirmação de conta)
- [ ] Recuperação de senha
- [ ] Autenticação com outros provedores (GitHub, Discord)
- [ ] Rate limiting no login
- [ ] Dois fatores de autenticação
