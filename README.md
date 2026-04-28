# StudyCycle

Plataforma web para planejamento de ciclos de estudo com distribuição inteligente de horas por matéria, acompanhamento de progresso por hora e autenticação com credenciais e Google.

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Requisitos](#requisitos)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Como Executar](#como-executar)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Banco de Dados](#banco-de-dados)
- [Autenticação](#autenticação)
- [Fluxo de Ciclos](#fluxo-de-ciclos)
- [API e Swagger](#api-e-swagger)
- [Páginas da Aplicação](#páginas-da-aplicação)
- [Tratamento de Erros](#tratamento-de-erros)
- [Próximos Passos](#próximos-passos)

## Visão Geral

O StudyCycle resolve dois problemas comuns de rotina de estudos:

1. Dificuldade de distribuir tempo entre matérias de forma estratégica.
2. Falta de continuidade no progresso quando o aluno pausa o plano.

Com base em afinidade e peso extra por matéria, o sistema calcula as horas recomendadas de cada disciplina e permite marcar progresso por blocos de 1h.

## Tecnologias

- Next.js 16 (App Router)
- React 19
- Material UI
- NextAuth.js
- PostgreSQL (`pg`)
- Zod (validação)
- Resend (envio de e-mails de reset de senha)

## Arquitetura do Projeto

Estrutura em camadas:

- `src/app`: páginas e rotas da API (App Router)
- `src/lib/modules`: regras de negócio (services + schemas)
- `src/database/repositories`: acesso a dados
- `src/utils`: helpers e padronização de erros

Fluxo típico:

1. Rota API recebe request.
2. Schema Zod valida payload.
3. Service aplica regra de negócio.
4. Repository executa SQL.
5. Erros passam por `HandleError`.

## Requisitos

- Node.js 20+
- PostgreSQL 14+
- npm 10+

## Configuração de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Variáveis esperadas:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM` (opcional)

## Como Executar

1. Instale dependências:

```bash
npm install
```

2. Inicialize o banco:

```bash
npm run db:init
```

3. (Opcional) Popule com dados de seed:

```bash
npm run db:seed
```

4. Rode em desenvolvimento:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Scripts Disponíveis

- `npm run dev`: inicia em modo desenvolvimento
- `npm run build`: gera build de produção
- `npm run start`: sobe servidor de produção
- `npm run db:init`: cria estrutura do banco (`schema.sql`)
- `npm run db:seed`: executa dados de seed (`seed.sql`)
- `npm run db:reset`: recria schema e executa init + seed

## Banco de Dados

Principais entidades:

- `users`: dados do usuário e agregados (`total_hours_done`, `total_cycles_done`)
- `accounts`: contas de autenticação (`credentials` e `google`)
- `cycles`: metadados do ciclo e estado de progresso
- `cycle_subjects`: matérias do ciclo e horas concluídas

Arquivo de referência: `src/database/schema.sql`.

## Autenticação

- Login por credenciais (email/senha)
- Login social com Google
- Recuperação de senha por e-mail via Resend

Documentação detalhada:

- `docs/AUTENTICACAO.md`

## Fluxo de Ciclos

### Cálculo de horas

1. Afinidade de `1..5` gera peso inverso.
2. Peso extra é somado ao peso base.
3. Fórmula de distribuição proporcional define horas por matéria.
4. Aplicação garante mínimo de 2h por matéria conforme regra de negócio atual.

### Progresso

- Marcação por checkbox salva imediatamente via `PATCH`.
- Conclusão do ciclo pode atualizar totais globais de usuário/ciclo.
- Edição do ciclo reinicia o progresso atual do ciclo (horas atuais zeradas e `cycle_done=false`).

## API e Swagger

Especificação OpenAPI (Swagger):

- `docs/swagger.yaml`

Guia para abrir documentação interativa:

- `docs/SWAGGER.md`

Resumo de contratos e exemplos:

- `docs/API.md`

## Páginas da Aplicação

- `/`: landing page
- `/login`: autenticação
- `/signup`: cadastro
- `/forgot-password`: solicitação de reset
- `/reset-password`: redefinição de senha
- `/dashboard`: visão geral
- `/ciclo/criar`: criação de ciclo
- `/ciclo/[id]`: acompanhamento do ciclo
- `/ciclo/[id]/edit`: edição e exclusão do ciclo
- `/ajuda`: central de ajuda
- `/privacidade`: política de privacidade

## Tratamento de Erros

A API padroniza erros com `HandleError`:

- Erro de validação Zod: `400` com `{ type: "validation", errors: { ... } }`
- Erros de domínio/autorização mapeados: `401`, `403`, `404`, `409`
- Fallback: `500`

## Próximos Passos

- Rate limiting para endpoints de autenticação
- Observabilidade (logs estruturados e tracing)
- Testes automatizados (unitários e integração)
- Versionamento explícito da API (`/api/v1`)
