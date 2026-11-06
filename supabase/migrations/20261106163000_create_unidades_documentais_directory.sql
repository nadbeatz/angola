create table if not exists public.unidades_documentais (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nome text not null,
  tipo text not null default 'servico',
  unidade_pai_id uuid references public.unidades_documentais(id) on delete set null,
  activo boolean not null default true,
  criado_por uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unidades_documentais_codigo_format check (codigo = upper(trim(codigo)) and length(codigo) between 2 and 30),
  constraint unidades_documentais_nome_length check (length(trim(nome)) between 2 and 160),
  constraint unidades_documentais_tipo_check check (tipo in ('ministerio','direccao','departamento','reparticao','servico','delegacao','posto','outro'))
);
create index if not exists unidades_documentais_activo_nome_idx on public.unidades_documentais (activo, nome);
alter table public.unidades_documentais enable row level security;
revoke all on public.unidades_documentais from anon;
grant select, insert, update on public.unidades_documentais to authenticated;
drop policy if exists "unidades documentais read" on public.unidades_documentais;
create policy "unidades documentais read" on public.unidades_documentais for select to authenticated using (private.has_area_access('gestao-documental'));
drop policy if exists "unidades documentais create" on public.unidades_documentais;
create policy "unidades documentais create" on public.unidades_documentais for insert to authenticated with check (private.has_area_access('gestao-documental') and (criado_por is null or criado_por = (select auth.uid())));
drop policy if exists "unidades documentais update" on public.unidades_documentais;
create policy "unidades documentais update" on public.unidades_documentais for update to authenticated using (private.has_area_access('gestao-documental')) with check (private.has_area_access('gestao-documental'));
alter table public.expedientes add column if not exists unidade_origem_id uuid references public.unidades_documentais(id) on delete set null, add column if not exists unidade_destino_id uuid references public.unidades_documentais(id) on delete set null;
alter table public.expediente_guias add column if not exists unidade_origem_id uuid references public.unidades_documentais(id) on delete set null, add column if not exists unidade_destino_id uuid references public.unidades_documentais(id) on delete set null;
create index if not exists expedientes_unidade_origem_idx on public.expedientes(unidade_origem_id);
create index if not exists expedientes_unidade_destino_idx on public.expedientes(unidade_destino_id);
create index if not exists expediente_guias_unidade_destino_idx on public.expediente_guias(unidade_destino_id);
comment on table public.unidades_documentais is 'Directório central de unidades orgânicas para origem e destino de expedientes.';
