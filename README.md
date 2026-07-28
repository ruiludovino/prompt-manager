# PromptVault

A shared prompt library for your team — organize, tag, and reuse AI prompts, with GitHub login and team sharing.

**Stack:** Next.js (App Router) · Auth.js (GitHub OAuth) · Prisma + Postgres · Resend

## Deploying

See [SETUP.md](./SETUP.md) for the full walkthrough (GitHub OAuth App, Postgres, Resend, Vercel).

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values, see SETUP.md
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/app/(auth)/signin` — sign-in page
- `src/app/(app)/*` — the app itself (dashboard, library, categories, favorites, tips, prompt detail/editor), behind auth
- `src/lib/actions.ts` — server actions (create/update/delete prompts & categories, favorites, usage tracking)
- `src/lib/data.ts` — read queries (prompts/categories scoped to the current user + team-shared)
- `src/lib/resend.ts` — team-share email notifications
- `prisma/schema.prisma` — data model
