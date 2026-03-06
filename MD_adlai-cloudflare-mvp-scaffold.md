# Adlai — Cloudflare-Only MVP Scaffold Brief

## Objective
Build **Adlai** as a TypeScript-first, Cloudflare-native web application on **capidemo.com** using:

- **Cloudflare Workers** for the app/API runtime
- **D1** for relational data
- **R2** for files and document assets
- **KV** for read-heavy/cache/session-ish ephemeral data
- **Durable Objects** for stateful workflows and order tracking coordination
- **Workers AI** for the shopping assistant and admin copilot
- **Wrangler** for local development and deployment
- **GitHub** for source control
- **Windsurf** as the primary AI coding environment

This document tells an AI coding agent how to scaffold the application from scratch in a way that is fast to ship as an MVP and will not block future growth.

---

## Product Scope

### Customer-facing
- Landing page
- Offers / product selection
- SKUs: **1kg, 3kg, 9kg, 27kg**
- AI shopping assistant / chatbot
- Customer account creation
- Personal details capture
- Address capture and validation using **Google Maps Address Validation API**
- Simulated checkout/payment
- Order status / tracking page

### Admin dashboard
- Admin login
- Order management and fulfillment
- Inventory management
- Accounting page for payment tracking
- Customer database
- AI assistant for orders, accounting, and inventory

### MCP servers
- **Admin MCP**
  - Inventory updates
  - Accounting updates
  - Customer updates
- **Gmail MCP**
  - Draft / send customer emails
  - Send order and tracking details

---

## Architecture Decision

## Use a monorepo with 3 Cloudflare deployables
Create a single GitHub repository with three deployable Workers projects:

1. **apps/web**
   - Public website + admin SPA + API routes
   - Static assets served by Workers Assets
   - Main D1 / KV / R2 / AI bindings
   - Durable Objects for order state and chat session coordination

2. **apps/mcp-admin**
   - Remote MCP server exposing tools for inventory, accounting, and customer updates
   - Talks to the same D1 database through bindings or a service boundary

3. **apps/mcp-gmail**
   - Remote MCP server for Gmail drafting/sending
   - External Google OAuth and Gmail API integration
   - Keep isolated because it introduces non-Cloudflare auth complexity

This separation keeps the MVP simple while leaving room for future service bindings, independent deployments, and stricter auth boundaries.

---

## Technology Recommendations

## Frontend
Use:
- **React**
- **Vite**
- **TypeScript**
- **React Router**
- **TanStack Query**
- **Tailwind CSS**
- **shadcn/ui style component setup** (implemented locally, not a hosted dependency)
- **lucide-react** for icons

Rationale:
- Fast MVP velocity
- Works well with Cloudflare Workers + Vite
- Easy future move into SSR or more advanced routing if needed

## Backend API
Use:
- **Hono** for API routing inside Workers
- **Zod** for request/response validation
- **Drizzle ORM** + **drizzle-kit** for schema + migrations against D1
- **jose** for signed session/JWT handling

Rationale:
- Hono is lightweight and Cloudflare-friendly
- Drizzle keeps schema explicit and migration-friendly
- Zod prevents API drift and bad AI-generated code

## State / Data Layer Mapping
Use each Cloudflare store for the right job:

### D1
Use for:
- users
- addresses
- products / SKUs
- inventory ledger
- orders
- order items
- payment records
- chatbot conversation metadata
- accounting entries
- admin audit logs

### R2
Use for:
- invoice PDFs
- packing slips
- export files
- uploaded proofs / attachments
- future media assets not suited for Git

### KV
Use for:
- short-lived checkout/cart snapshots
- session adjunct data
- cached catalog payloads
- feature flags
- rate-limiting counters
- AI prompt/cache fragments

### Durable Objects
Use for:
- single-order coordination and fulfillment state transitions
- websocket/chat session coordination if real-time chat is enabled
- idempotent tracking updates
- preventing concurrent inventory write conflicts during fulfillment

### Workers AI
Use for:
- customer shopping assistant
- admin copilot for order/accounting/inventory Q&A
- summarization of customer/order history
- drafting email content before passing to Gmail MCP

---

## Recommended Dependencies

## Root / workspace tools
Install at repo root:

### dependencies
- react
- react-dom
- react-router-dom
- @tanstack/react-query
- hono
- zod
- drizzle-orm
- jose
- nanoid
- date-fns
- clsx
- tailwind-merge
- class-variance-authority
- lucide-react

### devDependencies
- typescript
- vite
- @cloudflare/vite-plugin
- wrangler
- drizzle-kit
- tailwindcss
- @tailwindcss/vite
- vitest
- @cloudflare/vitest-pool-workers
- eslint
- @typescript-eslint/parser
- @typescript-eslint/eslint-plugin
- prettier
- prettier-plugin-tailwindcss

## Optional but recommended later
- @tanstack/react-table for richer admin tables
- xstate if order workflows become highly complex
- react-hook-form for bigger forms
- @hookform/resolvers if using react-hook-form + zod

## Intentionally avoid at MVP
- Prisma
- Next.js
- heavy Node-only SDKs for core runtime paths
- password-hash stacks that complicate Workers deployment

For MVP auth, prefer **email one-time code / magic link style login** instead of password auth.

---

## Authentication Strategy

## Customer auth
Implement custom auth in the main web Worker:
- email-based sign up / login
- one-time verification code or magic link
- signed session cookie with **jose**
- session record in D1 or KV-backed short session metadata

## Admin auth
Do **not** build a separate password system first.
Use **Cloudflare Access** in front of `/admin` and `/mcp/*` routes if available.
If app-level admin roles are still needed, also store admin user records in D1.

This keeps public customer auth separate from internal staff access.

---

## Suggested Repository Layout

```txt
adlai/
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  .gitignore
  README.md

  apps/
    web/
      package.json
      wrangler.jsonc
      vite.config.ts
      tsconfig.json
      drizzle.config.ts
      public/
      migrations/
      src/
        client/
          main.tsx
          app.tsx
          routes/
            landing.tsx
            offers.tsx
            checkout.tsx
            account.tsx
            order-tracking.tsx
            admin/
              dashboard.tsx
              orders.tsx
              inventory.tsx
              accounting.tsx
              customers.tsx
        server/
          index.ts
          app.ts
          env.ts
          middleware/
          lib/
          auth/
          services/
            catalog/
            orders/
            inventory/
            accounting/
            address-validation/
            ai/
          routes/
            public.ts
            auth.ts
            products.ts
            checkout.ts
            orders.ts
            tracking.ts
            admin.orders.ts
            admin.inventory.ts
            admin.accounting.ts
            admin.customers.ts
            ai.chat.ts
          db/
            schema.ts
            client.ts
            seed.ts
          durable-objects/
            OrderCoordinator.ts
            ChatSession.ts
          prompts/
            customer-assistant.md
            admin-copilot.md

    mcp-admin/
      package.json
      wrangler.jsonc
      tsconfig.json
      src/
        index.ts
        tools/
          inventory-update.ts
          accounting-update.ts
          customer-update.ts

    mcp-gmail/
      package.json
      wrangler.jsonc
      tsconfig.json
      src/
        index.ts
        gmail/
          oauth.ts
          send-mail.ts
          draft-order-email.ts
          draft-tracking-email.ts

  packages/
    ui/
    config/
    shared/
      src/
        types/
        schemas/
        constants/
        utils/
```

---

## Data Model (MVP)

Create these core tables in D1:

### users
- id
- email
- first_name
- last_name
- phone
- role (`customer` | `admin`)
- created_at
- updated_at

### addresses
- id
- user_id
- line1
- line2
- city
- state_province
- postal_code
- country_code
- formatted_address
- google_place_id_or_validation_id
- latitude
- longitude
- is_validated
- created_at

### products
- id
- slug
- name
- description
- active

### skus
- id
- product_id
- code
- label
- weight_kg
- price_minor
- currency
- active

Seed with:
- 1kg
- 3kg
- 9kg
- 27kg

### inventory_lots
- id
- sku_id
- quantity_on_hand
- quantity_reserved
- reorder_threshold
- updated_at

### inventory_ledger
- id
- sku_id
- order_id nullable
- event_type
- delta
- note
- actor_user_id nullable
- created_at

### orders
- id
- user_id
- address_id
- order_number
- status
- subtotal_minor
- shipping_minor
- total_minor
- currency
- payment_status
- payment_provider (`simulation`)
- tracking_code
- tracking_status
- created_at
- updated_at

### order_items
- id
- order_id
- sku_id
- quantity
- unit_price_minor
- line_total_minor

### payments
- id
- order_id
- provider (`simulation`)
- provider_ref
- status
- amount_minor
- paid_at nullable
- created_at

### accounting_entries
- id
- order_id nullable
- payment_id nullable
- entry_type
- amount_minor
- currency
- notes
- created_at

### chat_threads
- id
- user_id nullable
- channel (`customer` | `admin`)
- created_at
- updated_at

### chat_messages
- id
- thread_id
- role (`system` | `user` | `assistant` | `tool`)
- content
- metadata_json
- created_at

### audit_logs
- id
- actor_user_id nullable
- area
- action
- entity_type
- entity_id
- payload_json
- created_at

---

## Route Plan

## Public pages
- `/`
- `/offers`
- `/product/:slug`
- `/checkout`
- `/account`
- `/orders/:orderNumber`
- `/track/:trackingCode`

## Public API
- `POST /api/auth/request-code`
- `POST /api/auth/verify-code`
- `GET /api/products`
- `POST /api/address/validate`
- `POST /api/checkout/simulate-payment`
- `POST /api/orders`
- `GET /api/orders/:orderNumber`
- `POST /api/ai/customer-chat`

## Admin pages
- `/admin`
- `/admin/orders`
- `/admin/inventory`
- `/admin/accounting`
- `/admin/customers`

## Admin API
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id`
- `GET /api/admin/inventory`
- `POST /api/admin/inventory/adjust`
- `GET /api/admin/accounting`
- `GET /api/admin/customers`
- `POST /api/ai/admin-chat`

## MCP endpoints
- `/mcp/admin`
- `/mcp/gmail`

---

## Durable Object Design

## OrderCoordinator Durable Object
One Durable Object instance per order id.
Responsibilities:
- serialize order state transitions
- enforce legal transitions (`pending -> paid -> fulfilled -> shipped -> delivered`)
- avoid double fulfillment
- update tracking state safely
- write inventory and audit side effects in one controlled path

## ChatSession Durable Object
One instance per chat thread or signed-in user session.
Responsibilities:
- websocket coordination if real-time chat is enabled later
- short-lived chat context buffering
- throttling and message sequencing

If time is tight, fully implement `OrderCoordinator` first and keep `ChatSession` minimal.

---

## AI Design

## Customer assistant
Goal:
- help users pick among 1kg / 3kg / 9kg / 27kg
- answer shipping/order questions
- guide users through checkout
- never mutate inventory or payments directly

Allowed tools:
- catalog lookup
- order status lookup for authenticated user
- shipping/tracking lookup
- address validation helper trigger

## Admin copilot
Goal:
- summarize orders
- explain inventory state
- explain accounting records
- draft operational responses

Allowed tools:
- order search
- customer lookup
- inventory lookup
- accounting lookup
- optional mutation tools only for admins and only after explicit confirmation

## Important guardrail
All AI tool calls must pass through typed service functions validated with Zod.
Do not let model output write directly to D1.

---

## Google Address Validation Integration

Implement address validation as a server-side call from the Worker using `fetch()`.
Do not call Google directly from the browser with unrestricted credentials.

Flow:
1. Customer submits address form.
2. Worker calls Google Address Validation API.
3. Worker returns normalized address + confidence / suggested corrections.
4. Customer confirms corrected address.
5. Final selected address is stored in D1 with validation metadata.

Store Google API credentials as Wrangler secrets.

---

## Payment Simulation Design

For MVP, do not integrate a live PSP yet.
Create a simulation flow:
- create order in `pending_payment`
- simulate payment authorization/capture
- write `payments` row with provider `simulation`
- move order to `paid`
- create accounting entry
- reserve/decrement inventory appropriately

Design the payment service behind an interface:

```ts
interface PaymentProvider {
  createPaymentIntent(input: CreatePaymentIntentInput): Promise<CreatePaymentIntentResult>;
  confirmPayment(input: ConfirmPaymentInput): Promise<ConfirmPaymentResult>;
  refundPayment?(input: RefundPaymentInput): Promise<RefundPaymentResult>;
}
```

Implement `SimulationPaymentProvider` now so Stripe/Xendit/PayMongo can be added later without rewriting order logic.

---

## Inventory Strategy

Use both current-state and ledger tables:
- `inventory_lots` stores current usable counts
- `inventory_ledger` stores immutable history

Rules:
- checkout reserves stock
- payment success confirms reservation
- canceled/expired orders release stock
- fulfillment deducts final stock movement if using reserve model
- every adjustment writes an audit log

All stock-changing operations should go through a single service layer and, when order-related, through the `OrderCoordinator` Durable Object.

---

## Accounting Strategy

For MVP, keep accounting simple and explicit.

Track:
- simulated payments received
- refunds later if needed
- revenue-related entries per order
- manual adjustment notes from admins

Do not build full double-entry accounting in v1 unless required.
Instead create a clean `accounting_entries` table and a reporting-friendly service layer.

---

## MCP Design

## mcp-admin
Expose these tools:
- `inventory.adjust`
- `inventory.get`
- `order.get`
- `order.updateStatus`
- `accounting.recordNote`
- `customer.get`
- `customer.update`

Rules:
- read tools are safe by default
- write tools require admin auth
- every mutation writes to `audit_logs`
- return structured JSON only

## mcp-gmail
Expose these tools:
- `gmail.draftOrderConfirmation`
- `gmail.sendOrderConfirmation`
- `gmail.draftTrackingUpdate`
- `gmail.sendTrackingUpdate`

Rules:
- keep Gmail OAuth tokens isolated to this app
- only send after explicit admin action or approved workflow
- log outbound email metadata to D1

---

## Environment and Bindings

Each Worker should use `wrangler.jsonc`.

## web bindings
- D1 database binding: `DB`
- R2 bucket binding: `FILES`
- KV namespace binding: `CACHE`
- AI binding: `AI`
- Durable Objects:
  - `ORDER_COORDINATOR`
  - `CHAT_SESSION`
- optional assets binding: `ASSETS`

## secrets
- `GOOGLE_MAPS_API_KEY`
- `SESSION_SECRET`
- `ADMIN_BOOTSTRAP_EMAILS`
- any Gmail OAuth secrets for the Gmail MCP app only

Use separate Cloudflare environments for:
- `dev`
- `staging`
- `production`

---

## Scaffolding Sequence for the AI Agent

Perform the work in this order.

### Step 1 — initialize repo
- create monorepo workspace
- use pnpm workspaces
- add root lint/format/typecheck/test scripts
- add shared tsconfig base

### Step 2 — scaffold `apps/web`
- create Cloudflare React + Vite app
- wire Worker entry and static asset serving
- add Hono API inside the Worker
- confirm local dev works with Wrangler/Vite

### Step 3 — add shared packages
- create `packages/shared` for shared schemas, types, constants
- put Zod DTOs here first

### Step 4 — add D1 with Drizzle
- create Drizzle config
- define schema
- create initial migration
- seed products and SKUs

### Step 5 — implement auth
- customer magic-code login flow
- signed cookie session helpers
- admin middleware with role checks
- leave Cloudflare Access enforcement as infra step outside app code

### Step 6 — implement catalog and checkout
- offers page
- cart state
- address form
- address validation endpoint
- simulated payment provider
- order creation flow

### Step 7 — implement order tracking
- tracking code generation
- order status page
- basic timeline UI
- Durable Object backed status transition service

### Step 8 — implement admin dashboard
- orders grid
- inventory grid and adjust modal
- accounting view
- customer view

### Step 9 — implement AI features
- customer assistant endpoint and widget
- admin copilot endpoint and widget
- server-side tool router
- prompt templates stored in source control

### Step 10 — scaffold MCP apps
- create `apps/mcp-admin`
- create `apps/mcp-gmail`
- expose placeholder tools with typed contracts
- connect admin MCP to D1-backed services
- keep Gmail send capability behind mocked adapter first if credentials are not ready

### Step 11 — tests
- add Worker runtime tests with Vitest
- test auth, orders, inventory adjustments, and address validation adapter

### Step 12 — deploy
- configure Cloudflare environments
- bind domain/subpaths
- deploy staging first
- then production on `capidemo.com`

---

## Non-Negotiable Build Rules for the AI Agent

- Use **TypeScript everywhere**.
- Do not introduce Node-only server frameworks.
- Keep all external integrations behind adapters.
- Validate every inbound API payload with Zod.
- Never write raw SQL outside the data access layer except migrations.
- Use Drizzle for normal query code.
- Keep shared types in `packages/shared`.
- Keep AI prompts versioned in files.
- Every admin mutation must create an audit log.
- Every inventory mutation must create a ledger record.
- All order status changes must go through a dedicated service, preferably the Durable Object.
- Build for clean separation between public customer actions and internal admin actions.
- Do not over-engineer microservices yet; keep one main app Worker and two isolated MCP Workers.

---

## Suggested Initial Backlog

### P0
- landing page
- offers page
- SKU selection
- account creation/login
- address validation
- simulated checkout
- order creation
- order tracking
- admin order management
- admin inventory management
- basic accounting view
- customer AI assistant

### P1
- admin AI copilot
- Gmail MCP integration
- admin/customer audit UI
- richer search/filtering
- export reports to CSV

### P2
- live payment gateway
- live shipping provider integration
- R2 documents generation
- websocket real-time order updates
- multi-product catalog
- promotional engine / discount codes

---

## Acceptance Criteria for MVP

The scaffold is acceptable when:
- local dev runs with Wrangler/Vite
- D1 migrations and seed scripts run cleanly
- customer can sign in, validate address, place simulated order, and view tracking
- admin can view/update orders and inventory
- AI customer assistant can answer catalog/order questions using approved tools
- admin AI assistant can summarize operational data safely
- MCP admin server exposes working inventory/accounting/customer tools
- Gmail MCP worker is scaffolded with a clear adapter boundary, even if email sending is initially mocked

---

## Final Implementation Notes

- Prefer one deployable public hostname for the main app, such as `capidemo.com`.
- Consider separate internal hostnames or path-protected routes for admin and MCP endpoints.
- Use Cloudflare Access in front of admin and MCP surfaces where possible.
- Keep payment, Gmail, and Google Maps integrations isolated behind adapters so they can be swapped without touching core business logic.
- Optimize for clear domain services, typed contracts, and migration safety over short-term code generation convenience.

