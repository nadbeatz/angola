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
        or up.areas @> array[
          case _area
            when 'registo-civil' then 'registo-nascimento'
            when 'identificacao' then 'emissao-bi'
            when 'cartorio' then 'cartorio-notarial'
            else _area
          end
        ]::text[]
      )
  );
$$;

create or replace function private.set_process_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists processos_set_updated_at on public.processos;
create trigger processos_set_updated_at
before update on public.processos
for each row execute function private.set_process_updated_at();

create or replace function private.record_process_state_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.process_history (processo_id, estado_anterior, estado_novo, observacao, actor_id)
    values (new.id, null, new.estado, 'Processo criado', new.created_by);
  elsif new.estado is distinct from old.estado then
    insert into public.process_history (processo_id, estado_anterior, estado_novo, observacao, actor_id)
    values (new.id, old.estado, new.estado, 'Estado actualizado', (select auth.uid()));
  end if;
  return new;
end;
$$;
revoke all on function private.record_process_state_change() from public, anon, authenticated;

drop trigger if exists processos_record_state_change on public.processos;
create trigger processos_record_state_change
after insert or update of estado on public.processos
for each row execute function private.record_process_state_change();

drop policy if exists "process document delete by process access" on storage.objects;
