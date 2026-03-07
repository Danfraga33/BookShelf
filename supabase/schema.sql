-- Books table
create table books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Chapters table
create table chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books on delete cascade not null,
  title text not null,
  position integer not null default 0,
  created_at timestamptz default now()
);

-- Book content (one document per book)
create table book_content (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books on delete cascade unique not null,
  content jsonb,
  updated_at timestamptz default now()
);

-- RLS
alter table books enable row level security;
alter table chapters enable row level security;
alter table book_content enable row level security;

create policy "Users see own books" on books for all using (auth.uid() = user_id);
create policy "Users see own chapters" on chapters for all using (
  book_id in (select id from books where user_id = auth.uid())
);
create policy "Users see own content" on book_content for all using (
  book_id in (select id from books where user_id = auth.uid())
);
