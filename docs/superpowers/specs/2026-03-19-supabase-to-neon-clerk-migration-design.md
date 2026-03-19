# Migration: Supabase → Neon + Clerk

## Overview

Fully remove the Supabase dependency (both DB and Auth) from the Bookshelf app so it no longer counts as an active Supabase project. Replace with:

- **Neon** — Postgres database via `@neondatabase/serverless` HTTP driver (runs in the browser, no backend needed)
- **Clerk** — Authentication via `@clerk/clerk-react` with prebuilt `<SignIn />` / `<SignUp />` components

The app stays a pure React SPA — no server-side code.

## Architecture

### Database access pattern

```
Browser → Neon HTTP driver (tagged-template SQL) → Neon Postgres
```

- Connection string stored in `VITE_NEON_DATABASE_URL` env var
- All queries use parameterized SQL via `neon()` tagged template — safe against injection
- User scoping: every query includes `WHERE user_id = $userId` (replaces Supabase RLS)
- The `userId` comes from Clerk's `useUser()` hook

### Auth flow

```
Browser → Clerk React SDK → Clerk hosted auth
```

- `<ClerkProvider>` wraps the app in `main.tsx`
- `AuthPage` renders Clerk's `<SignIn />` and `<SignUp />` prebuilt components
- Protected routes use Clerk's `<SignedIn>` / `<SignedOut>` / `<RedirectToSignIn />`
- No custom auth forms — Clerk handles email/password + Google OAuth via its dashboard config

### User ID mapping

Supabase uses its own `auth.users` UUID. Clerk uses a string ID like `user_2x...`. The migration changes:

- `user_id` column type from `uuid` to `text` in the `books` table
- The foreign key to `auth.users` is dropped (Clerk manages users externally)
- Existing data needs a one-time manual migration to map old Supabase user IDs to Clerk user IDs (or start fresh if acceptable)

## Schema

```sql
-- No RLS, no auth.users reference
-- user_id is text to store Clerk user IDs

create table books (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books on delete cascade not null,
  title text not null,
  position integer not null default 0,
  created_at timestamptz default now()
);

create table book_content (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books on delete cascade unique not null,
  content jsonb,
  updated_at timestamptz default now()
);

create index idx_books_user_id on books(user_id);
```

## Environment variables

```
# Remove these:
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

# Add these:
VITE_NEON_DATABASE_URL=postgres://...@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## File changes

### Delete
- `src/lib/supabase.ts`

### New files
- `src/lib/db.ts` — Neon client initialization

### Rewrite
| File | What changes |
|------|-------------|
| `src/lib/db.ts` (new) | Exports `sql` tagged-template function from `@neondatabase/serverless` |
| `src/hooks/useAuth.ts` | Thin wrapper around Clerk's `useUser()` and `useClerk()`. Exports same shape: `{ user, loading, signOut }` |
| `src/hooks/useBooks.ts` | All Supabase calls → raw SQL via `sql`. Gets `userId` from Clerk. Same public API |
| `src/hooks/useChapters.ts` | Same — Supabase calls → raw SQL |
| `src/hooks/useEditor.ts` | Same — Supabase calls → raw SQL |
| `src/pages/AuthPage.tsx` | Replace entire custom form with Clerk `<SignIn />` / `<SignUp />` components |
| `src/pages/DashboardPage.tsx` | Update `useAuth()` usage: `user.email` → Clerk user shape, sign-out via Clerk |
| `src/pages/BookPage.tsx` | Remove direct `supabase.from("books")` call, use hook instead |
| `src/App.tsx` | Replace `ProtectedRoute` with Clerk's `<SignedIn>` / `<RedirectToSignIn />` |
| `src/main.tsx` | Add `<ClerkProvider>` wrapper |
| `src/vite-env.d.ts` | Update env var types |

### Package changes
```
Remove: @supabase/supabase-js
Add:    @neondatabase/serverless @clerk/clerk-react
```

## Hook API preservation

The hooks keep the same public API so components don't need changes beyond auth:

```typescript
// useBooks — same return shape
{ books, loading, createBook, updateBook, deleteBook, refetch }

// useChapters — same return shape
{ chapters, loading, addChapter, renameChapter, deleteChapter, reorderChapters, refetch }

// useEditor — same return shape
{ content, loading, saveStatus, debouncedSave }

// useAuth — simplified
{ user, loading, signOut }
// user shape changes: user.id (Clerk string), user.emailAddresses[0].emailAddress
```

## What stays the same

- All UI components (`BookCard`, `BookGrid`, `BookForm`, `DeleteConfirmModal`, `ChapterSidebar`, `BookEditor`, `EditorToolbar`, all `ui/` primitives)
- TipTap editor setup and behavior
- Auto-save with debounce
- Chapter auto-sync from H1 headings
- React Router route structure (`/`, `/auth`, `/book/:id`)
- Tailwind styling

## Data migration

This is a personal app. Two options:

1. **Start fresh** — create empty tables in Neon, re-create books manually
2. **Export/import** — dump Supabase tables, update `user_id` values to Clerk IDs, import into Neon

Recommend option 1 unless there's significant data to preserve.

## Security considerations

- Neon connection string is exposed in the browser bundle (same trust model as Supabase anon key)
- No RLS — all user scoping is enforced in application code via Clerk `userId` in every query
- Parameterized queries prevent SQL injection
- For production SaaS with multiple users, a server-side API layer would be the next step
