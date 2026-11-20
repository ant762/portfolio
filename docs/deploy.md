# Deploy (Cloudflare Pages, grátis)

1. `npm run build:static` → gera `out/` (inclui `_headers` com CSP/HSTS).
2. Cloudflare → Workers & Pages → Create → Pages → conectar o repo `ant762/portfolio`.
3. Build command: `npm run build:static` · Output directory: `out` · Variável: `STATIC_EXPORT=1`, `NEXT_PUBLIC_SITE_URL=https://<seu-dominio>`.
4. Custom domains → adicionar o domínio. Cabeçalhos de segurança vêm de `public/_headers` (mantenha em sincronia com `next.config.ts`).

Em `next start`/Vercel, os cabeçalhos vêm de `next.config.ts`.
