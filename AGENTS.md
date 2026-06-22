# Discover — Project Overview

Discover (also called **Cal Discover**) is a side project for [Cal.com](https://cal.com): a **no-commission, no-risk, Craigslist-style marketplace** for bookable local services. Cal.com's core product sends calendar invites so people can pick a time slot; Discover helps people **find** providers — dentists, doctors, veterinarians, dance studios, sports clubs, ski & snowboard instructors, social clubs, and more — and **book** them via Cal.com scheduling links.

Keep all work focused on Discover. Do not drift into unrelated features.

## Monorepo map

| Path                                         | Responsibility                                                                                     |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [`apps/web`](apps/web)                       | Next.js marketplace UI, AI chat search, MCP server (`/api/mcp`)                                    |
| [`apps/agent`](apps/agent)                   | [Vercel Eve](https://vercel.com/eve) durable agent — HTTP channel + optional MCP connection to web |
| [`packages/db`](packages/db)                 | Drizzle ORM schema, migrations, seed data (Postgres)                                               |
| [`packages/agent-core`](packages/agent-core) | Shared search/book business logic consumed by web, MCP, and Eve                                    |

Agent skills (COSS UI, motion, etc.) live at repo root in [`.agents/`](.agents/) and [`.claude/`](.claude/).

## Tech stack

- **UI:** [COSS UI](https://coss.com/ui) (Base UI, shadcn-like). Read [`.agents/skills/coss/SKILL.md`](.agents/skills/coss/SKILL.md) before building UI. Keep design **minimal** — polish comes later.
- **Animation:** [Motion](https://motion.dev/) (`motion/react`). Use a Ken Burns zoom on hover for image lists, carousels, and cards.
- **Database:** Postgres + [Drizzle ORM](packages/db). Local dev uses Docker Compose; production will use Supabase (swap `DATABASE_URL`).
- **AI:** OpenAI via Vercel AI SDK. Agentic search: _"Show me dentists nearby"_ and _"Book me a dentist nearby"_.
- **MCP:** [mcp-handler](https://github.com/vercel/mcp-handler) in `apps/web` at `/api/mcp`. Pin `@modelcontextprotocol/sdk@1.26.0+` for security fixes.
- **Eve agent:** Separate deployable in `apps/agent`. Requires **Node 24+**. Tools delegate to `@cal-market/agent-core`; optional `discover_mcp` connection proxies the web MCP endpoint.
- **Deploy:** Two Vercel projects from one repo (`apps/web`, `apps/agent`). Turborepo for builds.

## Architecture principle

Business logic lives **once** in `packages/agent-core`. Three surfaces consume it:

1. **Web** — `/api/chat` (AI SDK) + browse pages
2. **MCP** — `mcp-handler` tools in `apps/web/app/api/[transport]/route.ts`
3. **Eve** — `agent/tools/*.ts` in `apps/agent`

Do not duplicate search/book logic in app code.

## Out of scope (v1)

- **No authentication** — no user accounts, sessions, or Better Auth
- No commissions or payments
- No Cal.com API integration — booking = `calLink` deep link only
- No geo-IP for "nearby" — parse city from query or default to San Francisco seed data

## Environment variables

| Variable           | Used by        | Purpose                                                       |
| ------------------ | -------------- | ------------------------------------------------------------- |
| `DATABASE_URL`     | db, web, agent | Postgres connection string                                    |
| `OPENAI_API_KEY`   | web, agent     | OpenAI API key for chat/agent                                 |
| `DISCOVER_WEB_URL` | agent          | Base URL for MCP connection (default `http://localhost:3000`) |

See [`.env.example`](.env.example) and per-app `.env.example` files. Never commit secrets.

## Photography

Seed data uses [Unsplash](https://unsplash.com) stock image URLs. A custom Unsplash search skill is optional future work.

## Agent behavior rules

1. Stay on Discover domain and marketplace features
2. Use COSS UI components from `apps/web/components/ui`
3. Prefer shared `agent-core` tools over reimplementing logic
4. Read Next.js 16 docs in `node_modules/next/dist/docs/` before writing Next.js code (APIs differ from older versions)
5. Run `pnpm exec ultracite fix` before committing
6. Before opening or updating a PR, follow [`.agents/skills/pr-open/SKILL.md`](.agents/skills/pr-open/SKILL.md)

## Local development

```bash
docker compose up -d
pnpm install
pnpm db:push && pnpm db:seed
pnpm dev          # web app on :3000
pnpm dev:agent    # Eve agent (Node 24+)
```

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `pnpm exec ultracite fix`
- **Check for issues**: `pnpm exec ultracite check`
- **Diagnose setup**: `pnpm exec ultracite doctor`

Oxlint + Oxfmt (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**

- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**

- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**

- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Oxlint + Oxfmt Can't Help

Oxlint + Oxfmt's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Oxlint + Oxfmt can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Oxlint + Oxfmt. Run `pnpm exec ultracite fix` before committing to ensure compliance.
