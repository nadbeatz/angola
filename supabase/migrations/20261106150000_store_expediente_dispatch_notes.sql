alter table public.expedientes add column if not exists despacho_ultimo text not null default '';
create or replace function public.log_expediente_status() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if tg_op='INSERT' then
  insert into public.expediente_movimentos(expediente_id,estado_anterior,estado_novo,destino,despacho,actor_id)
  values(new.id,null,new.estado,new.destinatario,coalesce(nullif(new.despacho_ultimo,''),'Registo inicial'),(select auth.uid()));
 elsif old.estado is distinct from new.estado or old.destinatario is distinct from new.destinatario or old.despacho_ultimo is distinct from new.despacho_ultimo then
  insert into public.expediente_movimentos(expediente_id,estado_anterior,estado_novo,destino,despacho,actor_id)
  values(new.id,old.estado,new.estado,new.destinatario,coalesce(nullif(new.despacho_ultimo,''),'Actualização de tramitação'),(select auth.uid()));
 end if; return new;
end; $$;