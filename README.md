# Catalina Marriage

E-commerce completo para produtos e serviços de casamento — vestidos, trajes, acessórios, decoração, flores e lembrancinhas — com lista de casamento compartilhável, planejador de orçamento e painel administrativo.

## Rodando o projeto

```bash
npm install
npm run dev
```

Acesse http://localhost:5173

## Stack

- React + Vite
- React Router v6
- Tailwind CSS
- lucide-react (ícones)

## Estado atual (dados mockados)

Este projeto está com **dados de exemplo em memória** (`src/data/mockProducts.js`) e autenticação/carrinho simulados via `localStorage` (`src/context/`). Ainda não há backend real conectado.

## Páginas incluídas

- `/` — Home
- `/produtos/:category` — Listagem com filtros (vestidos, trajes, acessorios, decoracao, flores, lembrancinhas)
- `/produto/:id` — Página de produto
- `/carrinho` — Carrinho (com cupom: `CATALINA10` ou `NOIVA15`)
- `/checkout` — Checkout (formulário + confirmação de pedido)
- `/login`, `/cadastro` — Autenticação (mock)
- `/minha-conta` — Contagem regressiva, checklist, histórico de pedidos
- `/lista-de-casamento` — Lista de casamento compartilhável
- `/planejador` — Planejador de orçamento por estilo/convidados
- `/admin`, `/admin/produtos`, `/admin/pedidos` — Painel administrativo

## Próximos passos sugeridos

1. Conectar um backend real (Supabase é uma boa opção: Postgres + Auth + Storage em um só lugar).
2. Trocar `mockProducts.js` por chamadas a uma API/banco de dados.
3. Trocar o login mock em `AuthContext.jsx` por autenticação real.
4. Integrar um gateway de pagamento (ex: Mercado Pago) na página de Checkout.
5. Adicionar imagens reais dos produtos no lugar dos emojis/placeholders.

## Imagens dos produtos (API gratuita)

O site usa a **API do Pexels** para buscar fotos reais dos produtos automaticamente, com base no campo `imageQuery` de cada item em `src/data/mockProducts.js`.

1. Crie uma chave grátis em https://www.pexels.com/api/ (sem cartão de crédito, aprovação instantânea).
2. Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
3. Cole sua chave em `.env`:
   ```
   VITE_PEXELS_API_KEY=sua_chave_aqui
   ```
4. Reinicie `npm run dev`.

**Sem a chave configurada, o site continua funcionando normalmente** — cada produto mostra o emoji sobre um fundo em degradê no lugar da foto (é o fallback em `src/components/product/ProductImage.jsx`).

Limite do plano gratuito do Pexels: 200 requisições/hora e 20.000/mês — suficiente para desenvolvimento. Se quiser trocar por outra API (Unsplash, Pixabay), a única mudança necessária é em `src/services/imageService.js`.

## Banco de dados real (Supabase) — Lista de Casamento

A página **Lista de Casamento** (`/lista-de-casamento`) já está conectada a um banco de dados Postgres real via Supabase — adicionar/remover item faz `insert`/`delete` de verdade e persiste entre recarregamentos de página.

### Como ativar (leva ~3 minutos)

1. Crie uma conta grátis em https://supabase.com e clique em **"New project"**.
2. Escolha um nome e uma senha para o banco (guarde a senha, mas ela não é usada no código).
3. Espere o projeto ser provisionado (~1-2 min).
4. Vá em **SQL Editor → New query**, cole o conteúdo do arquivo `supabase/schema.sql` deste projeto, e clique em **Run**. Isso cria a tabela `wedding_list_items`.
5. Vá em **Project Settings → API**. Copie:
   - **Project URL** → cole em `VITE_SUPABASE_URL` no seu `.env`
   - **anon public key** → cole em `VITE_SUPABASE_ANON_KEY` no seu `.env`
6. Reinicie `npm run dev`.

Teste: acesse `/lista-de-casamento`, adicione um item, dê F5 na página — o item continua lá porque veio do banco, não da memória do navegador. No painel do Supabase, em **Table Editor → wedding_list_items**, você vê a linha gravada em tempo real — ótimo para mostrar no vídeo de demonstração da AC1.

**Nota de segurança:** a policy do banco libera leitura/escrita pública, porque o projeto não exige login (conforme as regras da atividade). Isso é aceitável para um projeto acadêmico, mas não deveria ir para produção real assim.

## Cadastro e login (Supabase Auth)

`/cadastro` e `/login` usam o Supabase Auth de verdade: o usuário e a senha (criptografada) ficam em **Authentication → Users**, e o nome e a data do casamento ficam na tabela `profiles` (criada pelo `supabase/schema.sql`, com um gatilho que cria o perfil no cadastro).

Passos extras, além dos da Lista de Casamento:

1. Rode de novo o `supabase/schema.sql` inteiro (ele agora também cria `profiles`; pode rodar quantas vezes quiser).
2. Em **Authentication → Providers → Email**, desligue **Confirm email**. Com a confirmação ligada, o login só funciona depois de clicar num link enviado por e-mail, o que atrapalha a demonstração.
3. No Netlify ou no Vercel, cadastre as variáveis `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e `VITE_PEXELS_API_KEY` e faça um novo deploy (variáveis `VITE_` são lidas na hora do build).

Teste: cadastre-se, veja o usuário em **Authentication → Users** e a linha em **Table Editor → profiles**, clique em Sair, entre de novo e salve a data do casamento em Minha conta (a coluna `wedding_date` muda no banco).

## Imagens

Fotos próprias ficam em `public/images/products/` e são ligadas ao produto pelo campo `localImage` em `src/data/mockProducts.js`. Produtos sem `localImage` usam o Pexels; sem chave, aparece um ícone de flor.

## Estrutura do código

```
src/
  components/  ui/ (Button, ArchImage) · home/ · product/ · layout/ · ErrorBoundary, PageLoader, ScrollToTop
  context/     Auth, Cart, Favorites
  data/        mockProducts.js
  hooks/       usePageTitle
  lib/         supabaseClient
  pages/       uma página por rota (carregadas sob demanda) · admin/
  routes/      AppRoutes.jsx
  utils/       format, pricing (frete/cupom), validators + testes (npm test)
```
Identidade visual: arcos nas fotos, verde-floresta, serifa Cormorant Garamond + DM Sans (inspiração: Wedora; layout e textos originais).
