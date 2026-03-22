-- Neon Postgres schema (user scoping is in application code via Clerk userId)

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
