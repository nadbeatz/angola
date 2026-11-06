import { useCallback, useEffect, useMemo, useState } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { Activity, AlertCircle, Baby, BarChart3, CheckCircle2, Clock, CreditCard, FileSignature, FileText, Landmark, MapPin, RefreshCw, Shield, Users } from 'lucide-react';

interface DashboardProps { user: User }
interface Processo { id: string; numero: string; dominio: string; tipo: string; requerente: string; estado: string; provincia: string | null; created_at: string }

const modules = [
  { id: 'registo-civil', label: 'Registo de Nascimento', icon: Baby, color: 'bg-blue-600' },
  { id: 'identificacao', label: 'Emissão do BI', icon: CreditCard, color: 'bg-green-600' },
  { id: 'registo-criminal', label: 'Registo Criminal', icon: Shield, color: 'bg-red-600' },
  { id: 'cartorio', label: 'Cartório Notarial', icon: FileSignature, color: 'bg-purple-600' },
  { id: 'registo-automovel', label: 'Registo Automóvel', icon: Activity, color: 'bg-orange-600' },
  { id: 'cofre-geral', label: 'Cofre Geral de Justiça', icon: Landmark, color: 'bg-amber-600' },
];
const labels: Record<string, string> = { pendente: 'Pendente', em_analise: 'Em análise', aprovado: 'Aprovado', concluido: 'Concluído', rejeitado: 'Rejeitado' };
const formatDate = (value: string) => new Intl.DateTimeFormat('pt-AO', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));

export default function Dashboard({ user }: DashboardProps) {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [staffCount, setStaffCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!supabase) { setError('A ligação à base de dados não está configurada.'); setLoading(false); return; }
    setLoading(true); setError('');
    try {
      const [processResult, staffResult] = await Promise.all([
        supabase.from('processos').select('id, numero, dominio, tipo, requerente, estado, provincia, created_at').order('created_at', { ascending: false }).limit(1000),
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }).eq('activo', true),
      ]);
      if (processResult.error) throw processResult.error;
      if (staffResult.error) throw staffResult.error;
      setProcessos((processResult.data ?? []) as Processo[]);
      setStaffCount(staffResult.count ?? 0);
      setLastUpdated(new Date());
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível carregar os indicadores.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const todayStart = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
  const todayCount = processos.filter(p => new Date(p.created_at).getTime() >= todayStart).length;
  const completed = processos.filter(p => p.estado === 'concluido').length;
  const pending = processos.filter(p => ['pendente', 'em_analise'].includes(p.estado)).length;
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(new Date().getFullYear(), new Date().getMonth() - 5 + i, 1);
      return { key: d.getFullYear() + '-' + d.getMonth(), label: new Intl.DateTimeFormat('pt-AO', { month: 'short' }).format(d), total: 0, completed: 0 };
    });
    processos.forEach(p => {
      const d = new Date(p.created_at); const item = months.find(m => m.key === d.getFullYear() + '-' + d.getMonth());
      if (item) { item.total++; if (p.estado === 'concluido') item.completed++; }
    });
    return months;
  }, [processos]);
  const maxMonthly = Math.max(1, ...monthlyData.map(m => m.total));
  const provinces = useMemo(() => {
    const counts = new Map<string, number>();
    processos.forEach(p => { const name = p.provincia?.trim(); if (name) counts.set(name, (counts.get(name) ?? 0) + 1); });
    return [...counts.entries()].map(([nome, total]) => ({ nome, total })).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [processos]);
  const stats = [
    { label: 'Total de Processos', value: processos.length, icon: FileText, color: 'bg-blue-600' },
    { label: 'Processos Hoje', value: todayCount, icon: Activity, color: 'bg-orange-600' },
    { label: 'Em tratamento', value: pending, icon: Clock, color: 'bg-amber-600' },
    { label: 'Concluídos', value: completed, icon: CheckCircle2, color: 'bg-green-600' },
  ];

  return <div className="space-y-6">
    <section className="rounded-2xl bg-gradient-to-r from-[#800706] via-[#5a0504] to-[#800706] p-6 md:p-8 text-white shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div>
        <p className="text-sm text-white/75">{new Date().toLocaleDateString('pt-AO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <h1 className="mt-2 text-3xl font-bold">Bem-vindo, {user.nome.split(' ')[0]}!</h1>
        <p className="mt-2 text-sm text-white/80">{user.perfil === 'admin' ? 'Administrador' : 'Utilizador'} · Painel de gestão</p>
        {lastUpdated && <p className="mt-1 text-xs text-white/60">Actualizado às {lastUpdated.toLocaleTimeString('pt-AO')}</p>}
      </div><button onClick={() => void loadDashboard()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold hover:bg-white/25 disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar dados</button></div>
    </section>
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="mr-2 inline h-4 w-4" />{error}</div>}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(s => <article key={s.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}><s.icon className="h-6 w-6 text-white" /></div><span className="text-xs text-gray-400">Dados reais</span></div><p className="mt-4 text-3xl font-bold text-gray-900">{loading ? '—' : s.value.toLocaleString('pt-AO')}</p><p className="mt-1 text-sm text-gray-500">{s.label}</p></article>)}</div>
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-6 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-[#800706]" /><div><h2 className="font-bold text-gray-900">Evolução dos Processos</h2><p className="text-sm text-gray-500">Registos dos últimos seis meses</p></div></div>
      {loading ? <p className="py-12 text-center text-sm text-gray-500">A carregar estatísticas…</p> : processos.length === 0 ? <p className="py-12 text-center text-sm text-gray-500">Ainda não existem processos registados para apresentar.</p> : <div className="flex h-64 items-end justify-around gap-3 border-b border-gray-100 px-2">{monthlyData.map(m => <div key={m.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-xs font-semibold text-gray-600">{m.total}</span><div className="flex h-[78%] w-full items-end justify-center gap-1"><div title={`${m.total} processos`} className="w-1/2 rounded-t-md bg-blue-500" style={{ height: `${m.total / maxMonthly * 100}%`, minHeight: m.total ? 4 : 0 }} /><div title={`${m.completed} concluídos`} className="w-1/2 rounded-t-md bg-green-500" style={{ height: `${m.completed / maxMonthly * 100}%`, minHeight: m.completed ? 4 : 0 }} /></div><span className="text-xs capitalize text-gray-500">{m.label}</span></div>)}</div>}
      <div className="mt-4 flex justify-center gap-6 text-xs text-gray-600"><span><i className="mr-2 inline-block h-3 w-3 rounded-sm bg-blue-500" />Criados</span><span><i className="mr-2 inline-block h-3 w-3 rounded-sm bg-green-500" />Concluídos</span></div>
    </section>
    <section><h2 className="mb-4 text-lg font-bold text-gray-900">Módulos do Sistema</h2><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{modules.map(m => { const count = processos.filter(p => p.dominio === m.id).length; return <article key={m.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${m.color}`}><m.icon className="h-5 w-5 text-white" /></div><div><h3 className="font-semibold text-gray-900">{m.label}</h3><p className="text-sm text-gray-500">{loading ? 'A carregar…' : `${count} processos registados`}</p></div></div></article>; })}</div></section>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-2"><div className="border-b border-gray-100 p-5"><h2 className="flex items-center gap-2 font-bold text-gray-900"><Activity className="h-5 w-5 text-[#800706]" /> Actividade Recente</h2></div>{processos.length === 0 ? <p className="p-6 text-sm text-gray-500">Sem actividade registada.</p> : <div className="divide-y divide-gray-100">{processos.slice(0, 6).map(p => <div key={p.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="font-semibold text-gray-900">{p.tipo || p.dominio} · {p.numero}</p><p className="text-sm text-gray-500">{p.requerente || 'Requerente não indicado'}</p><p className="text-xs text-gray-400">{formatDate(p.created_at)}</p></div><span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{labels[p.estado] ?? p.estado}</span></div>)}</div>}</section>
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h2 className="mb-1 flex items-center gap-2 font-bold text-gray-900"><MapPin className="h-5 w-5 text-[#800706]" /> Processos por Província</h2><p className="mb-5 text-sm text-gray-500">Distribuição dos registos</p>{provinces.length === 0 ? <p className="text-sm text-gray-500">Sem províncias registadas.</p> : <div className="space-y-4">{provinces.map(p => <div key={p.nome}><div className="mb-1 flex justify-between text-sm"><span className="font-medium text-gray-700">{p.nome}</span><span className="font-semibold text-gray-900">{p.total}</span></div><div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#800706]" style={{ width: `${p.total / provinces[0].total * 100}%` }} /></div></div>)}</div>}<div className="mt-6 border-t border-gray-100 pt-4"><div className="flex items-center gap-2 text-sm text-gray-600"><Users className="h-4 w-4" /> Funcionários activos: <strong className="text-gray-900">{staffCount ?? '—'}</strong></div></div></section>
    </div>
    <p className="text-center text-xs text-gray-400">Os indicadores respeitam as permissões de acesso definidas na base de dados.</p>
  </div>;
}
