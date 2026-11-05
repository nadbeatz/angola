import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { AlertCircle, Edit, Loader2, RefreshCw, Save, Users, X } from 'lucide-react';

type UserProfile = User & { activo: boolean };

const roleLabels: Record<User['perfil'], string> = {
  admin: 'Administrador',
  super_user: 'Super Utilizador',
  user: 'Utilizador',
};

export default function GestaoUtilizadores() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ nome: '', perfil: 'user' as User['perfil'], areas: '', activo: true });

  const loadUsers = useCallback(async () => {
    if (!supabase) {
      setError('Supabase não está configurado. Verifique as variáveis de ambiente.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const { data, error: queryError } = await supabase
      .from('user_profiles')
      .select('id, email, nome, perfil, areas, criado_em, activo')
      .order('nome', { ascending: true });
    if (queryError) {
      setError(queryError.message);
      setUsers([]);
    } else {
      setUsers((data ?? []).map(profile => ({
        id: profile.id,
        username: profile.email?.split('@')[0] ?? '',
        email: profile.email ?? '',
        nome: profile.nome ?? '',
        perfil: profile.perfil,
        areas: profile.areas ?? [],
        criadoEm: profile.criado_em,
        ultimoAcesso: '',
        activo: profile.activo === true,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { void loadUsers(); }, [loadUsers]);

  const openEdit = (user: UserProfile) => {
    setEditing(user);
    setForm({
      nome: user.nome,
      perfil: user.perfil,
      areas: user.areas.join(', '),
      activo: user.activo,
    });
    setError('');
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !editing) return;
    setSaving(true);
    setError('');
    const areas = form.perfil === 'admin'
      ? ['todos']
      : form.areas.split(',').map(area => area.trim()).filter(Boolean);
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ nome: form.nome.trim(), perfil: form.perfil, areas, activo: form.activo })
      .eq('id', editing.id);
    if (updateError) {
      setError(updateError.message);
    } else {
      setEditing(null);
      await loadUsers();
    }
    setSaving(false);
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Utilizadores</h1>
          <p className="mt-1 text-sm text-gray-500">Consultar perfis e actualizar permissões de acesso.</p>
        </div>
        <button onClick={() => void loadUsers()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50">
          <RefreshCw className="h-4 w-4" /> Actualizar
        </button>
      </header>

      {error && <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}

      <div className="rounded-xl border bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-gray-500"><Loader2 className="h-5 w-5 animate-spin" /> A carregar utilizadores…</div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-gray-500"><Users className="h-8 w-8" />Não foram encontrados perfis.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr><th className="px-5 py-3">Utilizador</th><th className="px-5 py-3">Perfil</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3 text-right">Acção</th></tr>
              </thead>
              <tbody className="divide-y">
                {users.map(user => <tr key={user.id}>
                  <td className="px-5 py-4"><div className="font-medium text-gray-900">{user.nome}</div><div className="text-gray-500">{user.email}</div></td>
                  <td className="px-5 py-4">{roleLabels[user.perfil]}</td>
                  <td className="px-5 py-4"><span className={user.activo ? 'text-green-700' : 'text-red-700'}>{user.activo ? 'Activo' : 'Inactivo'}</span></td>
                  <td className="px-5 py-4 text-right"><button onClick={() => openEdit(user)} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50"><Edit className="h-4 w-4" /> Editar</button></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <form onSubmit={saveProfile} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Editar perfil</h2><button type="button" onClick={() => setEditing(null)} aria-label="Fechar"><X className="h-5 w-5" /></button></div>
          <p className="text-sm text-gray-500">{editing.email}</p>
          <label className="block text-sm font-medium">Nome completo<input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
          <label className="block text-sm font-medium">Perfil<select value={form.perfil} onChange={e => setForm({...form, perfil: e.target.value as User['perfil']})} className="mt-1 w-full rounded-lg border px-3 py-2"><option value="user">Utilizador</option><option value="super_user">Super Utilizador</option><option value="admin">Administrador</option></select></label>
          {form.perfil !== 'admin' && <label className="block text-sm font-medium">Áreas autorizadas <span className="font-normal text-gray-500">(separadas por vírgulas)</span><input value={form.areas} onChange={e => setForm({...form, areas: e.target.value})} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>}
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.activo} onChange={e => setForm({...form, activo: e.target.checked})} /> Conta activa</label>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2">Cancelar</button><button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#800706] px-4 py-2 font-medium text-white disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'A guardar…' : 'Guardar'}</button></div>
        </form>
      </div>}
    </section>
  );
}
