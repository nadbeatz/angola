import { supabase } from './lib/supabase';
import { User } from './types';

export async function login(email: string, password: string): Promise<User> {
  if (!supabase) throw new Error('A ligação ao Supabase ainda não está configurada.');
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  if (!data.user) throw new Error('Não foi possível validar a sessão.');

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, email, nome, perfil, areas, criado_em, activo')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile || profile.activo !== true) {
    await supabase.auth.signOut();
    throw new Error('A conta ainda não tem um perfil autorizado. Contacte o administrador.');
  }

  return {
    id: profile.id,
    username: profile.email.split('@')[0],
    email: profile.email,
    nome: profile.nome,
    perfil: profile.perfil,
    areas: profile.areas ?? [],
    criadoEm: profile.criado_em,
    ultimoAcesso: new Date().toISOString(),
  };
}

export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, email, nome, perfil, areas, criado_em, activo')
    .eq('id', user.id)
    .maybeSingle();
  if (profileError || !profile || profile.activo !== true) return null;
  return {
    id: profile.id,
    username: profile.email.split('@')[0],
    email: profile.email,
    nome: profile.nome,
    perfil: profile.perfil,
    areas: profile.areas ?? [],
    criadoEm: profile.criado_em,
    ultimoAcesso: new Date().toISOString(),
  };
}

export async function logout(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function hasAccess(user: User, area: string): boolean {
  return user.perfil === 'admin' || user.areas.includes('todos') || user.areas.includes(area);
}
