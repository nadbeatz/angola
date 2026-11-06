create table if not exists public.expedientes (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique,
  assunto text not null check (char_length(trim(assunto)) between 3 and 240),
  tipo_documento text not null,
  origem text not null,
  destinatario text not null,
  prioridade text not null default 'normal' check (prioridade in ('baixa','normal','alta','urgente')),
  estado text not null default 'recebido' check (estado in ('recebido','em_analise','encaminhado','aguarda_resposta','concluido','arquivado')),
  data_documento date not null default current_date,
  prazo date,
  descricao text not null default '',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (prazo is null or prazo >= data_documento)
);
create index if not exists expedientes_estado_idx on public.expedientes(estado);
create index if not exists expedientes_created_at_idx on public.expedientes(created_at desc);
create index if not exists expedientes_prazo_idx on public.expedientes(prazo) where prazo is not null;

create table if not exists public.expediente_movimentos (
  id uuid primary key default gen_random_uuid(),
  expediente_id uuid not null references public.expedientes(id) on delete cascade,
  estado_anterior text,
  estado_novo text not null,
  destino text not null default '',
  despacho text not null default '',
  actor_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists expediente_movimentos_idx on public.expediente_movimentos(expediente_id, created_at desc);

create table if not exists public.expediente_documentos (
  id uuid primary key default gen_random_uuid(),
  expediente_id uuid not null references public.expedientes(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  file_size bigint not null check (file_size between 1 and 20971520),
  uploaded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.expedientes enable row level security;
alter table public.expediente_movimentos enable row level security;
alter table public.expediente_documentos enable row level security;
revoke all on public.expedientes, public.expediente_movimentos, public.expediente_documentos from anon;
grant select, insert, update on public.expedientes to authenticated;
grant select, insert on public.expediente_movimentos to authenticated;
grant select, insert on public.expediente_documentos to authenticated;

drop policy if exists "expedientes access" on public.expedientes;
create policy "expedientes access" on public.expedientes for select to authenticated using (private.has_area_access('gestao-documental'));
drop policy if exists "expedientes create" on public.expedientes;
create policy "expedientes create" on public.expedientes for insert to authenticated with check (created_by = (select auth.uid()) and private.has_area_access('gestao-documental'));
drop policy if exists "expedientes update" on public.expedientes;
create policy "expedientes update" on public.expedientes for update to authenticated using (private.has_area_access('gestao-documental')) with check (private.has_area_access('gestao-documental'));

drop policy if exists "expediente movements read" on public.expediente_movimentos;
create policy "expediente movements read" on public.expediente_movimentos for select to authenticated using (exists (select 1 from public.expedientes e where e.id = expediente_id));
drop policy if exists "expediente movements insert" on public.expediente_movimentos;
create policy "expediente movements insert" on public.expediente_movimentos for insert to authenticated with check (actor_id = (select auth.uid()) and exists (select 1 from public.expedientes e where e.id = expediente_id));

drop policy if exists "expediente docs read" on public.expediente_documentos;
create policy "expediente docs read" on public.expediente_documentos for select to authenticated using (exists (select 1 from public.expedientes e where e.id = expediente_id));
drop policy if exists "expediente docs insert" on public.expediente_documentos;
create policy "expediente docs insert" on public.expediente_documentos for insert to authenticated with check (uploaded_by = (select auth.uid()) and exists (select 1 from public.expedientes e where e.id = expediente_id));

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('expediente-documents','expediente-documents',false,20971520,array['application/pdf','image/jpeg','image/png'])
on conflict (id) do update set public=false,file_size_limit=20971520,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "expediente file upload" on storage.objects;
create policy "expediente file upload" on storage.objects for insert to authenticated with check (
 bucket_id='expediente-documents' and exists(select 1 from public.expedientes e where e.id::text=(storage.foldername(name))[1])
);
drop policy if exists "expediente file read" on storage.objects;
create policy "expediente file read" on storage.objects for select to authenticated using (
 bucket_id='expediente-documents' and exists(select 1 from public.expedientes e where e.id::text=(storage.foldername(name))[1])
);

create or replace function public.set_expediente_updated_at()
returns trigger language plpgsql set search_path='' as $$
begin new.updated_at=now(); return new; end;
$$;
drop trigger if exists expedientes_updated_at on public.expedientes;
create trigger expedientes_updated_at before update on public.expedientes for each row execute function public.set_expediente_updated_at();

create or replace function public.log_expediente_status()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if tg_op='INSERT' then
  insert into public.expediente_movimentos(expediente_id,estado_anterior,estado_novo,destino,despacho,actor_id)
  values(new.id,null,new.estado,new.destinatario,'Registo inicial',(select auth.uid()));
 elsif old.estado is distinct from new.estado or old.destinatario is distinct from new.destinatario then
  insert into public.expediente_movimentos(expediente_id,estado_anterior,estado_novo,destino,despacho,actor_id)
  values(new.id,old.estado,new.estado,new.destinatario,'Actualização de tramitação',(select auth.uid()));
 end if;
 return new;
end;
$$;
drop trigger if exists expedientes_log_status on public.expedientes;
create trigger expedientes_log_status after insert or update of estado,destinatario on public.expedientes for each row execute function public.log_expediente_status();
