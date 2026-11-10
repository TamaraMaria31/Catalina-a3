-- Rode este arquivo inteiro no SQL Editor do Supabase (SQL Editor > New query > Run).
-- Pode rodar de novo sem erro: os comandos são idempotentes.

-- =========================================================
-- 1) Lista de Casamento
-- =========================================================
create table if not exists wedding_list_items (
  id uuid primary key default gen_random_uuid(),
  couple_slug text not null,
  name text not null,
  price numeric not null default 0,
  emoji text,
  created_at timestamp with time zone default now()
);

alter table wedding_list_items enable row level security;

drop policy if exists "Acesso público de leitura e escrita (projeto acadêmico, sem auth)" on wedding_list_items;
create policy "Acesso público de leitura e escrita (projeto acadêmico, sem auth)"
on wedding_list_items
for all
using (true)
with check (true);

-- =========================================================
-- 2) Cadastro e login: perfil de cada usuário
--    (a senha e o e-mail ficam em auth.users, gerenciados pelo Supabase Auth)
-- =========================================================
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  wedding_date date,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

drop policy if exists "Usuário lê o próprio perfil" on profiles;
create policy "Usuário lê o próprio perfil"
on profiles for select
using (auth.uid() = id);

drop policy if exists "Usuário atualiza o próprio perfil" on profiles;
create policy "Usuário atualiza o próprio perfil"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Usuário cria o próprio perfil" on profiles;
create policy "Usuário cria o próprio perfil"
on profiles for insert
with check (auth.uid() = id);

-- Cria o perfil automaticamente quando alguém se cadastra,
-- usando o nome enviado no cadastro (raw_user_meta_data).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================================================
-- 3) Favoritos (um coração por usuário e produto)
-- =========================================================
create table if not exists favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id integer not null,
  created_at timestamp with time zone default now(),
  primary key (user_id, product_id)
);

alter table favorites enable row level security;

drop policy if exists "Usuário gerencia os próprios favoritos" on favorites;
create policy "Usuário gerencia os próprios favoritos"
on favorites
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
