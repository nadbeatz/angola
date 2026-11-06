create table if not exists public.expediente_guias (
 id uuid primary key default gen_random_uuid(),
 expediente_id uuid not null references public.expedientes(id) on delete cascade,
 numero_guia text not null unique,
 unidade_origem text not null,
 unidade_destino text not null,
 despacho text not null default '',
 emitida_por uuid not null references auth.users(id),
 created_at timestamptz not null default now()
);
create index if not exists expediente_guias_expediente_idx on public.expediente_guias(expediente_id, created_at desc);
alter table public.expediente_guias enable row level security;
revoke all on public.expediente_guias from anon;
grant select, insert on public.expediente_guias to authenticated;
drop policy if exists "expediente guides read" on public.expediente_guias;
create policy "expediente guides read" on public.expediente_guias for select to authenticated
 using (exists(select 1 from public.expedientes e where e.id=expediente_id));
drop policy if exists "expediente guides create" on public.expediente_guias;
create policy "expediente guides create" on public.expediente_guias for insert to authenticated
 with check (emitida_por=(select auth.uid()) and exists(select 1 from public.expedientes e where e.id=expediente_id));
comment on table public.expediente_guias is 'Guias numeradas de encaminhamento interno de expedientes.';