alter table public.expedientes
  add column if not exists sentido text not null default 'entrada',
  add column if not exists referencia_externa text not null default '',
  add column if not exists data_registo date not null default current_date;
alter table public.expedientes drop constraint if exists expedientes_sentido_check;
alter table public.expedientes add constraint expedientes_sentido_check check (sentido in ('entrada','saida'));
create index if not exists expedientes_sentido_created_idx on public.expedientes(sentido, created_at desc);
create index if not exists expedientes_prazo_abertos_idx on public.expedientes(prazo) where prazo is not null and estado not in ('concluido','arquivado');
comment on column public.expedientes.sentido is 'Direcção da correspondência: entrada ou saida.';
comment on column public.expedientes.referencia_externa is 'Referência atribuída pela entidade remetente ou destinatária.';
comment on column public.expedientes.data_registo is 'Data em que a correspondência foi registada no sistema.';