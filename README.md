# Adlai — capidemo.com

Cloudflare-native e-commerce MVP for selling products in 1kg, 3kg, 9kg, and 27kg SKUs.

## Architecture

- **apps/web** — Public website + admin SPA + API (Cloudflare Workers + Vite + React + Hono)
- **apps/mcp-admin** — Remote MCP server for inventory, accounting, and customer tools
- **apps/mcp-gmail** — Remote MCP server for Gmail drafting/sending
- **packages/shared** — Shared types, Zod schemas, constants, and utilities

## Tech Stack

- TypeScript, React, Vite, Tailwind CSS, shadcn/ui components, Lucide icons
- Hono (API), Drizzle ORM (D1), jose (JWT/sessions), Zod (validation)
- Cloudflare Workers, D1, R2, KV, Durable Objects, Workers AI

## Getting Started

```bash
pnpm install
cd apps/web
cp .dev.vars.example .dev.vars   # fill in secrets
npx wrangler d1 migrations apply DB --local
pnpm run seed
pnpm run dev
```

## Scripts

```bash
pnpm run typecheck   # typecheck all packages
pnpm run lint        # lint all packages
pnpm run format      # format all files
pnpm run test        # run all tests
```
