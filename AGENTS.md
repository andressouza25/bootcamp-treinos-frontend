# AGENTS.md

## Objetivo

Este repositório contém o frontend do projeto FIT.AI, construído com Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, BetterAuth e Orval.

Toda alteração neste projeto deve priorizar:
- código limpo, legível e de fácil manutenção
- baixo acoplamento e alta coesão
- reutilização de componentes e funções
- consistência visual e arquitetural
- aderência às regras definidas neste arquivo

---

## Stack e ferramentas oficiais

- Next.js 15 com App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- BetterAuth
- Orval
- TanStack Query
- dayjs
- pnpm

---

## Regras gerais

- **SEMPRE** escreva código em TypeScript.
- **SEMPRE** escreva código limpo, conciso e fácil de manter.
- **SEMPRE** siga princípios de SOLID e Clean Code.
- **SEMPRE** use nomes de variáveis e funções descritivos.
- **SEMPRE** prefira composição em vez de duplicação.
- **SEMPRE** aplique DRY.
- **NUNCA** escreva comentários no código.
- **NUNCA** rode `pnpm run dev` ou `pnpm dev` para validar alterações.
- **SEMPRE** use `dayjs` para manipulação e formatação de datas.
- **NUNCA** use formatação manual com `Date` nativo quando `dayjs` resolver o caso.
- **SEMPRE** use `pnpm` como gerenciador de pacotes.
- **SEMPRE** mantenha o código consistente com a arquitetura existente do projeto.
- **SEMPRE** corrija a causa do problema, e não apenas o sintoma visual ou temporário.

---

## Convenções de nomes

- **SEMPRE** use `kebab-case` para nomes de arquivos e pastas.
- **SEMPRE** use nomes descritivos para componentes, hooks, funções, tipos e variáveis.
- **SEMPRE** use nomes booleanos claros, como:
  - `isLoading`
  - `isPending`
  - `hasError`
  - `isAuthenticated`
  - `shouldRedirect`

---

## Estrutura do projeto

### Estrutura principal esperada

- `app/` para páginas, layouts e lógica de App Router
- `app/_lib/` para bibliotecas internas do app
- `app/_lib/api/fetch-generated/` para funções geradas pelo Orval voltadas ao server-side
- `app/_lib/api/rc-generated/` para hooks gerados pelo Orval voltados ao client-side
- `components/` para componentes reutilizáveis
- `components/ui/` para componentes do shadcn/ui
- `lib/` para utilitários compartilhados
- `public/` para assets estáticos
- `types/` para tipos compartilhados, se necessário

### Regras de organização

- **SEMPRE** mantenha componentes reutilizáveis fora de `app/`, quando fizer sentido.
- **SEMPRE** coloque utilitários puros em `lib/` ou `app/_lib/`, conforme o contexto.
- **SEMPRE** mantenha páginas enxutas.
- **SEMPRE** extraia trechos reutilizáveis de UI para componentes próprios.
- **SEMPRE** extraia lógica reutilizável para hooks ou helpers.
- **NUNCA** coloque mais de um componente no mesmo arquivo.
- **SEMPRE** prefira separar:
  - apresentação
  - regras de negócio
  - validação
  - acesso a dados

---

## Path alias

- **SEMPRE** use o alias `@/*` para imports internos.
- Exemplos válidos:
  - `@/components/ui/button`
  - `@/app/_lib/auth-client`
  - `@/lib/utils`

- **EVITE** imports relativos muito longos como `../../../`.

---

## Next.js e App Router

- **SEMPRE** siga o padrão do App Router.
- **EVITE** transformar páginas inteiras em Client Components.
- **SEMPRE** use Server Components por padrão.
- **SÓ** use `"use client"` quando realmente houver necessidade de:
  - estado local interativo
  - efeitos do React
  - hooks client-side
  - manipulação direta de eventos no navegador

- **SEMPRE** mantenha a lógica server-side no server sempre que possível.
- **SEMPRE** prefira carregar dados no servidor quando a página puder ser renderizada dessa forma.
- **SEMPRE** mantenha Client Components pequenos e focados em interatividade.

---

## Componentes

- **SEMPRE** reutilize componentes antes de criar novos.
- **SEMPRE** use componentes do `shadcn/ui` o máximo possível.
- **SEMPRE** verifique primeiro se já existe um componente equivalente no `shadcn/ui`.
- **SEMPRE** use `Button` de `@/components/ui/button` para botões.
- **NUNCA** use `<button>` nativo diretamente quando um botão da interface do sistema for suficiente.
- **SEMPRE** use `@/components/ui/form.tsx` para formulários.
- **SEMPRE** crie componentes pequenos, coesos e reutilizáveis.
- **NUNCA** crie componentes gigantes com múltiplas responsabilidades.
- **SEMPRE** separe componentes visuais de componentes que concentram lógica complexa, quando necessário.

### Regra obrigatória por arquivo

- Um arquivo = um componente principal.
- NUNCA mais de um componente por arquivo.

---

## Formulários

- **SEMPRE** use React Hook Form para formulários.
- **SEMPRE** use Zod para validação.
- **SEMPRE** conecte Zod ao React Hook Form com `zodResolver`.
- **SEMPRE** use os componentes do `shadcn/ui` para formulários.
- **SEMPRE** exiba mensagens de erro de validação.
- **SEMPRE** defina schemas de validação de forma explícita.
- **SEMPRE** use tipos inferidos a partir do schema quando fizer sentido.
- **NUNCA** implemente formulários grandes sem schema.
- **NUNCA** valide manualmente campos que podem ser cobertos por Zod.

---

## Estilização

- **SEMPRE** use Tailwind CSS conforme o padrão já adotado no projeto.
- **SEMPRE** use as variáveis de tema definidas no projeto.
- **NUNCA** use cores hard-coded do Tailwind como:
  - `text-white`
  - `bg-black`
  - `bg-white`
  - `text-black`
  - hex solto
  - `oklch(...)` inline
  - qualquer valor arbitrário de cor embutido na classe

- **SEMPRE** use classes de tema como:
  - `bg-primary`
  - `text-primary-foreground`
  - `bg-background`
  - `text-foreground`
  - `text-muted-foreground`
  - `border-border`

- Caso uma cor necessária não exista:
  - **SEMPRE** crie a variável no tema global do projeto
  - **NUNCA** adicione uma cor arbitrária diretamente no componente sem necessidade

- **SEMPRE** reutilize padrões visuais já existentes.
- **SEMPRE** mantenha consistência de spacing, radius, border e typography.
- **SEMPRE** use `cn()` quando precisar compor classes de forma condicional.

---

## Tipografia e fontes

- O projeto utiliza fontes configuradas globalmente.
- **SEMPRE** respeite as fontes e variáveis já definidas no layout/global CSS.
- **NUNCA** introduza novas fontes sem necessidade real e sem padronização.

---

## Imagens

- **SEMPRE** use `Image` de `next/image`.
- **NUNCA** use `<img>` diretamente.
- **SEMPRE** forneça `alt` descritivo.
- **SEMPRE** respeite boas práticas de performance com imagens.
- **SEMPRE** baixe para a pasta local do projeto toda imagem externa que for utilizada na interface.
- **SEMPRE** prefira servir imagens a partir de `public/` em vez de depender de URLs remotas no código.

---

## Autenticação

- O projeto usa BetterAuth.
- **NUNCA** use middleware para autenticação.
- **SEMPRE** faça a verificação de sessão diretamente na página ou no fluxo adequado.
- Em Client Components, use `authClient.useSession()` quando apropriado.
- Em Server Components, siga o padrão do projeto para recuperar a sessão no servidor.
- Páginas protegidas:
  - **SEMPRE** redirecionar para `/auth` se o usuário não estiver autenticado
- Página `/auth`:
  - **SEMPRE** redirecionar para `/` se o usuário já estiver autenticado

### Regra importante do authClient

- Ao chamar `authClient`, **NUNCA** o envolva em `try/catch`.
- **SEMPRE** destruture e trate o `error` retornado pela própria chamada.

Exemplo de padrão esperado:

```ts
const { error } = await authClient.changePassword(payload)

if (error) {
  // tratar erro
}
```
