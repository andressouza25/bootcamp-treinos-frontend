# FIT.AI Frontend

Frontend da plataforma FIT.AI, desenvolvido com Next.js e React para entregar a experiencia do aluno dentro do produto: autenticacao, onboarding conversacional, visualizacao de treino do dia, planos de treino, estatisticas e perfil.

## Visao geral

Esta aplicacao consome a API do ecossistema FIT.AI e organiza a experiencia principal do usuario em uma interface mobile-first. O projeto utiliza App Router, componentes reutilizaveis, assets locais em `public/` e integracao com Better Auth para login com Google.

## Principais funcionalidades

- login com Google via Better Auth
- redirecionamento de sessao entre paginas publicas e protegidas
- onboarding guiado por chat
- geracao e salvamento de plano de treino a partir da conversa
- home com consistencia semanal e treino de hoje
- visualizacao de plano de treino e detalhes por dia
- pagina de estatisticas com heatmap, streak e resumo de desempenho
- pagina de perfil com dados do usuario e logout
- proxy interno para rotas de IA e autenticacao

## Stack principal

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Better Auth
- AI SDK
- Zod
- React Hook Form
- Orval
- dayjs
- pnpm

## Estrutura do projeto

```text
app/                              rotas, layouts e logica do App Router
app/_lib/                         helpers, auth, fetch customizado e regras de pagina
app/_lib/api/fetch-generated/     client gerado pelo Orval para chamadas server-side
app/api/                          route handlers internos
app/ai/                           proxy para a rota de IA da API
components/                       componentes reutilizaveis da aplicacao
components/ui/                    base de componentes do shadcn/ui
lib/                              utilitarios compartilhados
public/                           imagens e assets estaticos locais
```

## Rotas principais

- `/auth`: autenticacao do usuario
- `/`: home com resumo da semana e treino do dia
- `/onboarding`: fluxo inicial em chat
- `/workout-plans/[id]`: detalhes do plano de treino ativo
- `/workout-plans/[id]/days/[daysId]`: detalhes de um dia especifico de treino
- `/stats`: historico e metricas de desempenho
- `/profile`: resumo do usuario e logout

## Variaveis de ambiente

Crie um arquivo `.env` com base no `.env.example`.

Variaveis utilizadas no projeto:

- `NEXT_PUBLIC_API_URL`: URL base da API FIT.AI
- `NEXT_PUBLIC_BASE_URL`: URL base do frontend para callbacks e autenticacao

Exemplo:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Como rodar localmente

1. Instale as dependencias:

```bash
pnpm install
```

2. Configure o arquivo `.env`.

3. Inicie a aplicacao em desenvolvimento:

```bash
pnpm dev
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Integracao com a API

- o frontend espera uma API compativel com a documentacao OpenAPI exposta em `/swagger.json`
- o arquivo `orval.config.ts` gera funcoes de acesso em `app/_lib/api/fetch-generated/`
- a comunicacao server-side utiliza um `customFetch` que encaminha os cookies da sessao
- as rotas `app/api/auth/[...all]/route.ts` e `app/ai/route.ts` funcionam como proxy interno para autenticacao e IA

## Fluxo de autenticacao

- usuarios nao autenticados sao redirecionados para `/auth`
- usuarios autenticados que acessam `/auth` sao redirecionados para `/`
- a sessao e lida no servidor para proteger paginas e manter o fluxo consistente

## Assets e interface

- todas as imagens utilizadas pela interface ficam versionadas em `public/`
- a aplicacao segue um layout mobile-first com largura maxima proxima a 390px nas telas principais
- a base visual reutiliza componentes do `shadcn/ui` adaptados ao design do produto

## Qualidade e manutencao

- codigo tipado com TypeScript
- foco em App Router e Server Components por padrao
- organizacao por responsabilidade entre pagina, componente, regra de negocio e acesso a dados
- reutilizacao de componentes e helpers para manter consistencia visual e arquitetural
