create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.has_area_access(_area text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_profiles up
    where up.id = (select auth.uid())
      and up.activo = true
      and (
        up.perfil = 'admin'
        or up.areas @> array['todos']::text[]
        or up.areas @> array[_area]::text[]
      )
  );
$$;
revoke all on function private.has_area_access(text) from public, anon;
grant execute on function private.has_area_access(text) to authenticated;

drop policy if exists "read own profile" on public.user_profiles;
create policy "read own profile or admin"
on public.user_profiles
for select
to authenticated
using (id = (select auth.uid()) or private.has_area_access('gestao-utilizadores'));

create policy "admin update user profiles"
on public.user_profiles
for update
to authenticated
using (private.has_area_access('gestao-utilizadores'))
with check (private.has_area_access('gestao-utilizadores'));

create table if not exists public.processos (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique,
  dominio text not null check (dominio in ('registo-civil','identificacao','registo-criminal','cartorio','registo-automovel')),
  tipo text not null check (char_length(trim(tipo)) between 2 and 160),
  requerente text not null check (char_length(trim(requerente)) between 2 and 180),
  bi_nif text not null check (char_length(trim(bi_nif)) between 5 and 40),
  estado text not null default 'pendente' check (estado in ('pendente','em_analise','aprovado','concluido','rejeitado')),
  valor numeric(14,2) not null default 0 check (valor >= 0),
  provincia text not null,
  observacoes text not null default '',
  dados_adicionais jsonb not null default '{}'::jsonb,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists processos_dominio_estado_idx on public.processos (dominio, estado);
create index if not exists processos_provincia_idx on public.processos (provincia);
create index if not exists processos_created_by_idx on public.processos (created_by);
create index if not exists processos_created_at_idx on public.processos (created_at desc);

alter table public.processos enable row level security;
revoke all on public.processos from anon;
grant select, insert, update on public.processos to authenticated;

drop policy if exists "processos read by area" on public.processos;
create policy "processos read by area"
on public.processos for select to authenticated
using (private.has_area_access(dominio));

drop policy if exists "processos create by area" on public.processos;
create policy "processos create by area"
on public.processos for insert to authenticated
with check (created_by = (select auth.uid()) and private.has_area_access(dominio));

drop policy if exists "processos update by area" on public.processos;
create policy "processos update by area"
on public.processos for update to authenticated
using (private.has_area_access(dominio))
with check (private.has_area_access(dominio));

create table if not exists public.process_history (
  id uuid primary key default gen_random_uuid(),
  processo_id uuid not null references public.processos(id) on delete cascade,
  estado_anterior text,
  estado_novo text not null check (estado_novo in ('pendente','em_analise','aprovado','concluido','rejeitado')),
  observacao text not null default '',
  actor_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists process_history_processo_idx on public.process_history (processo_id, created_at desc);
alter table public.process_history enable row level security;
revoke all on public.process_history from anon;
grant select, insert on public.process_history to authenticated;

drop policy if exists "history read through process access" on public.process_history;
create policy "history read through process access"
on public.process_history for select to authenticated
using (exists (
  select 1 from public.processos p where p.id = processo_id
));

drop policy if exists "history insert through process access" on public.process_history;
create policy "history insert through process access"
on public.process_history for insert to authenticated
with check (
  actor_id = (select auth.uid())
  and exists (select 1 from public.processos p where p.id = processo_id)
);

create table if not exists public.process_documents (
  id uuid primary key default gen_random_uuid(),
  processo_id uuid not null references public.processos(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  mime_type text,
  file_size bigint check (file_size is null or file_size between 0 and 20971520),
  uploaded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists process_documents_processo_idx on public.process_documents (processo_id, created_at desc);
alter table public.process_documents enable row level security;
revoke all on public.process_documents from anon;
grant select, insert, delete on public.process_documents to authenticated;

drop policy if exists "documents read through process access" on public.process_documents;
create policy "documents read through process access"
on public.process_documents for select to authenticated
using (exists (select 1 from public.processos p where p.id = processo_id));

drop policy if exists "documents insert through process access" on public.process_documents;
create policy "documents insert through process access"
on public.process_documents for insert to authenticated
with check (
  uploaded_by = (select auth.uid())
  and exists (select 1 from public.processos p where p.id = processo_id)
);

drop policy if exists "documents delete by uploader or admin" on public.process_documents;
create policy "documents delete by uploader or admin"
on public.process_documents for delete to authenticated
using (uploaded_by = (select auth.uid()) or private.has_area_access('gestao-documental'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('process-documents', 'process-documents', false, 20971520,
  array['application/pdf','image/jpeg','image/png'])
on conflict (id) do update
set public = false, file_size_limit = 20971520,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "process document upload by process access" on storage.objects;
create policy "process document upload by process access"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'process-documents'
  and exists (
    select 1 from public.processos p
    where p.id::text = (storage.foldername(name))[1]
  )
);

drop policy if exists "process document read by process access" on storage.objects;
create policy "process document read by process access"
on storage.objects for select to authenticated
using (
  bucket_id = 'process-documents'
  and exists (
    select 1 from public.processos p
    where p.id::text = (storage.foldername(name))[1]
  )
);
