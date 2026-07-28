# Deploying PromptVault

This app needs four things set up on your own accounts before it works: a GitHub OAuth App (login), a Postgres database, a Resend API key (team-share emails), and a Vercel project. None of these can be created on your behalf — here's exactly what to do.

## 1. Push this repo to GitHub

Vercel deploys from a Git repository.

```
git init
git add .
git commit -m "Initial commit"
```

Create a new repo on GitHub and push to it (`gh repo create` or via github.com), then `git push -u origin main`.

## 2. Create a Vercel project

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo you just created.
2. Vercel auto-detects Next.js — don't deploy yet, we need env vars first (steps below). You can click Deploy and it'll fail on the first try without a database; that's fine, you'll redeploy after adding env vars.

## 3. Add a Postgres database

1. In your Vercel project dashboard → **Storage** tab → **Create Database** → choose **Postgres** (this provisions a Neon database).
2. Connect it to this project. Vercel will automatically add `DATABASE_URL` and a few other Postgres env vars to your project.
3. In your project's **Settings → Environment Variables**, make sure there's a `DATABASE_URL_UNPOOLED` variable too — Neon/Vercel Postgres usually adds one named `POSTGRES_URL_NON_POOLING`. If so, add a new env var named `DATABASE_URL_UNPOOLED` with that same value (Prisma needs this exact name for migrations).

## 4. Create a GitHub OAuth App (login)

1. Go to [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**.
2. **Homepage URL**: your Vercel deployment URL (e.g. `https://promptvault.vercel.app`).
3. **Authorization callback URL**: same URL + `/api/auth/callback/github` (e.g. `https://promptvault.vercel.app/api/auth/callback/github`).
4. Create it, then generate a **Client Secret**.
5. In Vercel → Settings → Environment Variables, add:
   - `AUTH_GITHUB_ID` = the Client ID
   - `AUTH_GITHUB_SECRET` = the Client Secret
   - `AUTH_SECRET` = run `npx auth secret` locally and paste the value it generates
   - `NEXT_PUBLIC_APP_URL` = your Vercel deployment URL

## 5. Set up Resend (team-share emails)

1. Sign up at [resend.com](https://resend.com), go to **API Keys**, create one.
2. In Vercel, add `RESEND_API_KEY` with that value.
3. By default the app sends from `PromptVault <onboarding@resend.dev>` — Resend's sandbox address, which only delivers to **your own** Resend account email until you verify a domain. To send to real teammates, verify a domain you own under Resend → **Domains**, then set `RESEND_FROM_EMAIL` in Vercel to an address on that domain, e.g. `PromptVault <notifications@yourdomain.com>`.

## 6. Run the first migration

Once `DATABASE_URL` exists (step 3), run this **locally** to create the database tables:

```
vercel env pull .env.local     # pulls the real DATABASE_URL etc. from Vercel
npx prisma migrate dev --name init
npx prisma db seed             # seeds the 8 default categories
```

This creates a `prisma/migrations/` folder — commit and push it. From then on, every Vercel deploy runs `prisma migrate deploy` automatically (already wired into the build script) to apply any new migrations.

## 7. Redeploy

Push to `main` (or click **Redeploy** in Vercel). The app should now be live — sign in with GitHub, and you're in.

---

### How sharing works

- Every prompt is **Private** by default (only you see it).
- Setting a prompt to **Team Shared** makes it visible to every signed-in user, and emails everyone else via Resend.
- Categories are shared across the whole team (not per-user).
- Favorites are per-user, so favoriting a shared prompt doesn't affect what your teammates see.

### Local development

```
npm install
cp .env.example .env.local     # fill in the values from steps above
npm run dev
```
