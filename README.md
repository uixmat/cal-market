# Discover — Cal.com Marketplace

Discover is a side project for [Cal.com](https://cal.com): a **no-commission, Craigslist-style marketplace** for bookable local services — dentists, vets, instructors, clubs, sports, and more. Listings link out to Cal.com scheduling pages; there are no user accounts, payments, or commissions in v1.

## Architecture

Discover is a **pnpm + Turborepo monorepo**. Business logic lives in one place and is consumed by three surfaces:

```text
                    ┌─────────────────┐
                    │  packages/db    │  Postgres + Drizzle schema
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ packages/       │  searchListings, bookListing,
                    │  agent-core     │  Zod schemas, system prompt
                    └────────┬────────┘
           ┌─────────────────┼─────────────────┐
           │                 │                 │
    ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
    │  apps/web   │   │  /api/mcp   │   │ apps/agent  │
    │  Next.js    │   │ mcp-handler │   │ Vercel Eve  │
    │  + /search  │   │             │   │             │
    └─────────────┘   └─────────────┘   └─────────────┘
```

### Architectural decisions

| Decision         | Choice                                                             | Rationale                                                     |
| ---------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| Monorepo tooling | pnpm workspaces + Turborepo                                        | Shared packages, parallel dev/build, Vercel-friendly          |
| UI               | [COSS UI](https://coss.com/ui) (Base UI)                           | shadcn-like DX, already installed in `apps/web`               |
| Database         | Postgres + Drizzle ORM                                             | Portable to Supabase later; no ORM lock-in                    |
| API layer        | Server Actions + Route Handlers                                    | No tRPC — scope is small; direct Drizzle queries              |
| Auth             | None (v1)                                                          | Craigslist-style discovery; booking = Cal.com deep link       |
| AI (web)         | Vercel AI SDK + OpenAI                                             | Streaming chat with tool calling on `/api/chat`               |
| MCP              | [mcp-handler](https://github.com/vercel/mcp-handler) in `apps/web` | Same tools as web chat; MCP-compatible for Cursor etc.        |
| Durable agent    | [Vercel Eve](https://vercel.com/eve) in `apps/agent`               | Filesystem-first agent; tools delegate to `agent-core`        |
| Shared logic     | `packages/agent-core`                                              | Single source of truth — never duplicate search/book in apps  |
| Local DB         | Docker Compose (Postgres 16)                                       | Matches production Postgres; swap `DATABASE_URL` for Supabase |
| Deploy           | Two Vercel projects                                                | `apps/web` (Next.js) + `apps/agent` (Eve), same repo          |

### Monorepo map

| Path                                         | Responsibility                                                   |
| -------------------------------------------- | ---------------------------------------------------------------- |
| [`apps/web`](apps/web)                       | Next.js app — browse UI, AI search, MCP endpoint                 |
| [`apps/agent`](apps/agent)                   | Eve durable agent — HTTP channel, optional MCP connection to web |
| [`packages/db`](packages/db)                 | Drizzle schema, `db:push`, `db:seed`, `db:studio`                |
| [`packages/agent-core`](packages/agent-core) | `searchListings`, `bookListing`, tool schemas, system prompt     |

Agent skills (COSS, motion, etc.) live at repo root in [`.agents/`](.agents/) and [`.claude/`](.claude/). Product context for AI agents is in [AGENTS.md](AGENTS.md).

## Getting started

### Prerequisites

- **Node.js 20+** — web app (`apps/web`)
- **Node.js 24+** — Eve agent only (`apps/agent`)
- **[pnpm](https://pnpm.io/) 9+** — `corepack enable && corepack prepare pnpm@9.15.4 --activate`
- **Docker** — local Postgres via Compose
- **OpenAI API key** — for `/search` AI chat (optional for browse-only)

### 1. Clone and install

```bash
git clone <repo-url> cal-market
cd cal-market
pnpm install
```

### 2. Start Postgres

```bash
docker compose up -d
```

Postgres listens on `localhost:5432` with user/database `discover` / password `discover`.

### 3. Environment variables

```bash
# Root — used by Drizzle CLI and seed
cp .env.example .env

# Web app — needs DATABASE_URL + OPENAI_API_KEY for AI search
cp apps/web/.env.example apps/web/.env
```

Edit `apps/web/.env`:

```env
DATABASE_URL=postgres://discover:discover@localhost:5432/discover
OPENAI_API_KEY=sk-...
```

For the Eve agent (Node 24+):

```bash
cp apps/agent/.env.example apps/agent/.env
# Set DATABASE_URL, OPENAI_API_KEY, DISCOVER_WEB_URL=http://localhost:3000
```

### 4. Database setup

```bash
pnpm db:push    # apply Drizzle schema
pnpm db:seed    # insert 20 sample listings (Unsplash images)
pnpm db:studio  # optional — Drizzle Studio UI
```

### 5. Run locally

```bash
# Web app → http://localhost:3000
pnpm dev

# Eve agent (separate terminal, Node 24+)
pnpm dev:agent
```

### 6. Try it

| What            | Where                                                           |
| --------------- | --------------------------------------------------------------- |
| Browse listings | http://localhost:3000                                           |
| AI search       | http://localhost:3000/search — e.g. _"Show me dentists nearby"_ |
| Listing detail  | http://localhost:3000/listings/bright-smile-dental              |
| Chat API        | `POST /api/chat`                                                |
| MCP server      | http://localhost:3000/api/mcp                                   |

### Common scripts

```bash
pnpm dev              # web dev server
pnpm dev:agent        # Eve agent dev (Node 24+)
pnpm build            # production build (web)
pnpm build:agent      # Eve build (Node 24+)
pnpm check            # Ultracite lint + format check (CI)
pnpm fix              # Ultracite auto-fix
pnpm db:push          # push schema changes
pnpm db:seed          # re-seed listings
```

CI runs on every pull request via [`.github/workflows/ci.yml`](.github/workflows/ci.yml): `pnpm check` and `pnpm build`. Before opening a PR, follow [`.agents/skills/pr-open/SKILL.md`](.agents/skills/pr-open/SKILL.md).

## Features (v1)

- **Browse** — Featured listing grid with Ken Burns hover on images (Motion)
- **AI search** — Natural language find + book via shared agent tools
- **MCP** — Streamable HTTP at `/api/mcp` (`search_listings`, `book_listing`)
- **Eve agent** — Same tools via `@cal-market/agent-core`; optional `discover_mcp` connection proxies web MCP

## Out of scope (v1)

- User accounts / authentication
- Cal.com API integration (booking = `calLink` only)
- Payments or commissions
- Geo-IP for "nearby" (defaults to San Francisco seed data)

## Deploy (Vercel)

Link **two** Vercel projects from this monorepo:

1. **Web** — Root Directory: `apps/web`
2. **Agent** — Root Directory: `apps/agent`

Set `DATABASE_URL` and `OPENAI_API_KEY` in each project. Point production Postgres at Supabase when ready — Drizzle schema is unchanged.

## Links

- [Cal.com](https://cal.com)
- [COSS UI](https://coss.com/ui)
- [Vercel Eve](https://vercel.com/eve)
- [mcp-handler](https://github.com/vercel/mcp-handler)
- [AGENTS.md](AGENTS.md) — project context and coding standards
