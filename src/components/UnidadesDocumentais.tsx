import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Building2, Loader2, Plus, RefreshCw, Save, ToggleLeft, ToggleRight, X } from 'lucide-react';

type UnidadeTipo = 'ministerio'|'direccao'|'departamento'|'reparticao'|'servico'|'delegacao'|'posto'|'outro';
interface Unidade { id:string; codigo:string; nome:string; tipo:UnidadeTipo; unidade_pai_id:string|null; activo:boolean }
const tipos: {value:UnidadeTipo;label:string}[] = [
 {value:'ministerio',label:'Ministério'},{value:'direccao',label:'Direcção'},{value:'departamento',label:'Departamento'},
 {value:'reparticao',label:'Repartição'},{value:'servico',label:'Serviço'},{value:'delegacao',label:'Delegação'},
 {value:'posto',label:'Posto'},{value:'outro',label:'Outro'}
];
const emptyForm = {codigo:'',nome:'',tipo:'servico' as UnidadeTipo,unidade_pai_id:''};

export default function UnidadesDocumentais(){
 const [items,setItems]=useState<Unidade[]>([]);
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const [editing,setEditing]=useState<Unidade|null>(null);
 const [formOpen,setFormOpen]=useState(false);
 const [form,setForm]=useState(emptyForm);

 const load=useCallback(async()=>{
  if(!supabase){setError('Base de dados não configurada.');setLoading(false);return;}
  setLoading(true);setError('');
  const {data,error}=await supabase.from('unidades_documentais').select('id,codigo,nome,tipo,unidade_pai_id,activo').order('nome');
  if(error)setError(error.message);else setItems((data??[]) as Unidade[]);
  setLoading(false);
 },[]);
 useEffect(()=>{void load();},[load]);

 const startNew=()=>{setEditing(null);setForm(emptyForm);setFormOpen(true);setError('');setNotice('');};
 const startEdit=(u:Unidade)=>{setEditing(u);setFormOpen(true);setForm({codigo:u.codigo,nome:u.nome,tipo:u.tipo,unidade_pai_id:u.unidade_pai_id??''});setError('');setNotice('');};
 const save=async(e:React.FormEvent)=>{
  e.preventDefault();if(!supabase)return;
  setSaving(true);setError('');setNotice('');
  try{
   const {data:{user}}=await supabase.auth.getUser();if(!user)throw new Error('Sessão expirada.');
   const payload={codigo:form.codigo.trim().toUpperCase(),nome:form.nome.trim(),tipo:form.tipo,unidade_pai_id:form.unidade_pai_id||null};
   const result=editing
    ? await supabase.from('unidades_documentais').update(payload).eq('id',editing.id)
    : await supabase.from('unidades_documentais').insert({...payload,criado_por:user.id});
   if(result.error)throw result.error;
   setNotice(editing?'Unidade actualizada.':'Unidade criada.');setEditing(null);setForm(emptyForm);setFormOpen(false);await load();
  }catch(err){setError(err instanceof Error?err.message:'Não foi possível guardar a unidade.');}
  finally{setSaving(false);}
 };
 const toggle=async(u:Unidade)=>{
  if(!supabase)return;setError('');setNotice('');
  const {error}=await supabase.from('unidades_documentais').update({activo:!u.activo}).eq('id',u.id);
  if(error)setError(error.message);else{setNotice(u.activo?'Unidade desactivada.':'Unidade activada.');await load();}
 };

 return <section className="space-y-5">
  <header className="flex flex-wrap items-center justify-between gap-3">
   <div><h2 className="text-xl font-bold text-gray-900">Directório de unidades orgânicas</h2><p className="mt-1 text-sm text-gray-500">Registe departamentos, repartições, serviços, delegações e postos para uniformizar os encaminhamentos.</p></div>
   <div className="flex gap-2"><button onClick={()=>void load()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><RefreshCw className="h-4 w-4"/>Actualizar</button><button onClick={startNew} className="inline-flex items-center gap-2 rounded-lg bg-[#800706] px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4"/>Nova unidade</button></div>
  </header>
  {error&&<p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
  {notice&&<p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
  {formOpen&&<form onSubmit={save} className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
   <label className="text-sm font-medium">Código *<input required maxLength={30} value={form.codigo} onChange={e=>setForm({...form,codigo:e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g,'')})} placeholder="Ex.: DNRH" className="mt-1 w-full rounded-lg border p-2.5"/></label>
   <label className="text-sm font-medium sm:col-span-2">Nome da unidade *<input required minLength={2} maxLength={160} value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} placeholder="Nome oficial da unidade" className="mt-1 w-full rounded-lg border p-2.5"/></label>
   <label className="text-sm font-medium">Tipo<select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value as UnidadeTipo})} className="mt-1 w-full rounded-lg border p-2.5">{tipos.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select></label>
   <label className="text-sm font-medium sm:col-span-2">Unidade hierarquicamente superior<select value={form.unidade_pai_id} onChange={e=>setForm({...form,unidade_pai_id:e.target.value})} className="mt-1 w-full rounded-lg border p-2.5"><option value="">Sem unidade superior</option>{items.filter(i=>i.id!==editing?.id&&i.activo).map(i=><option key={i.id} value={i.id}>{i.codigo} — {i.nome}</option>)}</select></label>
   <div className="flex items-end gap-2"><button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#800706] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Save className="h-4 w-4"/>{saving?'A guardar…':'Guardar unidade'}</button><button type="button" onClick={()=>{setFormOpen(false);setEditing(null);setForm(emptyForm);}} className="rounded-lg border px-4 py-2.5 text-sm">Cancelar</button></div>
  </form>}
  <div className="overflow-hidden rounded-xl border bg-white">
   {loading?<div className="p-10 text-center text-gray-500"><Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin"/>A carregar unidades…</div>:items.length===0?<div className="p-10 text-center text-sm text-gray-500"><Building2 className="mx-auto mb-2 h-8 w-8 text-gray-300"/>Ainda não existem unidades registadas. Crie a primeira unidade orgânica.</div>:<div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-4 py-3">Código</th><th className="px-4 py-3">Unidade</th><th className="px-4 py-3">Tipo</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Acções</th></tr></thead><tbody className="divide-y">{items.map(u=><tr key={u.id}><td className="px-4 py-3 font-mono font-semibold">{u.codigo}</td><td className="px-4 py-3 font-medium">{u.nome}</td><td className="px-4 py-3 capitalize">{tipos.find(t=>t.value===u.tipo)?.label??u.tipo}</td><td className="px-4 py-3"><span className={u.activo?'text-green-700':'text-gray-500'}>{u.activo?'Activa':'Inactiva'}</span></td><td className="px-4 py-3 text-right"><button onClick={()=>startEdit(u)} className="mr-2 rounded-lg border px-3 py-1.5">Editar</button><button onClick={()=>void toggle(u)} title={u.activo?'Desactivar':'Activar'} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5">{u.activo?<ToggleRight className="h-4 w-4"/>:<ToggleLeft className="h-4 w-4"/>}{u.activo?'Desactivar':'Activar'}</button></td></tr>)}</tbody></table></div>}
  </div>
 </section>;
}
