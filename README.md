# FIT.AI Frontend

Frontend da plataforma FIT.AI, responsável pela interface de autenticação, onboarding, home, planos de treino, detalhes dos dias de treino, estatísticas e experiência de chat com IA.

## Link externo

- Produção: https://fitai.andressouza25.com.br

## Tecnologias e ferramentas

### Frameworks e runtime

- Next.js 16
- React 19
- TypeScript 5
- Node.js

### Estilização e UI

- Tailwind CSS 4
- shadcn/ui
- Radix UI
- class-variance-authority
- clsx
- tailwind-merge
- tw-animate-css
- Lucide React

### Formulários e validação

- React Hook Form
- Zod
- @hookform/resolvers

### Autenticação

- Better Auth

### Consumo de API e geração de client

- Fetch API
- Orval

### IA e experiência conversacional

- AI SDK
- @ai-sdk/react
- streamdown

### Utilitários

- dayjs
- nuqs
- dotenv

### Qualidade e desenvolvimento

- ESLint 9
- Prettier 3
- pnpm

## Funcionalidades principais

- Autenticação social com Google
- Onboarding inicial do usuário
- Listagem de planos de treino
- Visualização de dias e exercícios do treino
- Página inicial com resumo do treino atual
- Página de estatísticas
- Chat com IA integrado ao fluxo da aplicação
- Integração com backend via rotas e tipos gerados

## Estrutura do projeto

```text
app/                         rotas, páginas e lógica do App Router
app/_lib/                    helpers, auth, fetch e integrações internas
app/_lib/api/fetch-generated cliente gerado pelo Orval para server-side
components/                  componentes reutilizáveis da aplicação
components/ui/               componentes base do shadcn/ui
lib/                         utilitários compartilhados
public/                      assets estáticos
```

## Variáveis de ambiente

Crie um arquivo `.env` com base no `.env.example`.

Variáveis utilizadas:

- `NEXT_PUBLIC_API_URL`: URL da API utilizada pelo frontend
- `NEXT_PUBLIC_BASE_URL`: URL base pública da aplicação para fluxos de autenticação

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Integração com o backend

O frontend consome a documentação OpenAPI exposta pelo backend em `/swagger.json` para gerar funções de acesso à API com Orval.

Backend público:

- https://fit-api.anderssouza25.com.br
