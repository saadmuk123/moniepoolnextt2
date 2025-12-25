# GitHub Copilot / AI Agent Instructions

This repo is a Next.js (App Router) dashboard starter with server actions and Postgres-backed examples. Keep guidance short and actionable for code-editing agents.

- Project type: Next.js App Router (app/ directory). See [app/layout.tsx](app/layout.tsx) and [app/dashboard/layout.tsx](app/dashboard/layout.tsx).
- Package manager: pnpm is present (see `pnpm-lock.yaml`), but `npm` scripts are defined in [package.json](package.json). Preferred local commands:

```bash
pnpm dev   # runs Next.js dev (uses turbopack via `next dev --turbopack`)
pnpm build
pnpm start
pnpm lint
```

- DB and auth: Uses `postgres` and `next-auth` (credentials provider + `bcrypt`). The database URL is provided via `POSTGRES_URL` env var. See:
  - auth setup: [auth.ts](auth.ts) and [auth.config.ts](auth.config.ts)
  - server actions using Postgres: [app/lib/actions.ts](app/lib/actions.ts)

- Conventions and important patterns (use these exact patterns when editing):
  - Server actions: `"use server"` functions in `app/lib/actions.ts` are invoked directly from forms via `action={createInvoice}` or `action={signup}`. Follow the Zod-based validation pattern already present.
  - DB access: queries use the `postgres` lib with tagged template SQL (e.g., `await sql`SELECT ...``). Keep queries parameterized in that style.
  - Revalidation & navigation: After successful server actions, code calls `revalidatePath('/dashboard/invoices')` then `redirect('/dashboard/invoices')` — preserve this flow for cache + navigation.
  - Authentication: `NextAuth` is configured and exported from `auth.ts` (the app imports `signIn`/`auth`). The `authConfig` contains a page redirect rule for `/dashboard` access. Modify carefully.

- File layout notes:
  - UI components used by routes live under `app/ui/` (e.g., `app/ui/login-form.tsx`, `app/ui/signup-form.tsx`). The repo also contains `ui/` and `components/` folders; prefer `app/ui` for route-scoped components and `ui/` for generic small primitives.
  - There are two `lib` locations: root `lib/` (helpers like `lib/utils.ts`) and `app/lib/` (server actions). Keep server-only code in `app/lib`.

- Tests & linting: No tests included. Use `pnpm lint` to run ESLint. When adding new TypeScript code, keep types strict and reuse `zod` schemas where present.

- Environment & debugging:
  - Required env: `POSTGRES_URL` (Postgres conn string). NextAuth may need `NEXTAUTH_URL` and a secret when running production.
  - To reproduce server-action flow locally: run `pnpm dev`, open the relevant route (e.g., `/dashboard/invoices`), submit forms that call `action` functions and watch `revalidatePath`/`redirect` behavior.

- Quick examples to follow when implementing a new action or form:
  - Server action signature (copy pattern from `app/lib/actions.ts`):

```ts
// in app/lib/actions.ts
export async function myAction(prevState: any, formData: FormData) {
  // validate with Zod, write via `sql` and call revalidatePath/redirect
}
```

  - Form usage (copy pattern from `app/ui/signup-form.tsx`): `<form action={signup}>` where `signup` is the exported server action.

- When editing, prioritize minimal, focused changes. Preserve existing Zod validation, SQL templates, and NextAuth callbacks unless explicitly refactoring.

If anything here is unclear or you want more examples (e.g., common SQL patterns, Zod schemas, or how to wire new NextAuth providers), tell me which area to expand and I will update this file.
