import { useState, useEffect } from 'react';
import { User, ModuloType } from './types';
import { getCurrentUser, logout } from './auth';
import { supabase } from './lib/supabase';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ServicoModule from './components/ServicoModule';
import DelegacoesProvinciais from './components/DelegacoesProvinciais';
import CofreGeralJustica from './components/CofreGeralJustica';
import GestaoDocumental from './components/GestaoDocumental';
import GestaoUtilizadores from './components/GestaoUtilizadores';
import { Baby, CreditCard, Shield, FileSignature, Car } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeModulo, setActiveModulo] = useState<ModuloType>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getCurrentUser().then(currentUser => {
      if (active) {
        setUser(currentUser);
        setLoading(false);
      }
    }).catch(() => {
      if (active) setLoading(false);
    });

    const { data } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!session) setUser(null);
      else void getCurrentUser().then(currentUser => { if (active) setUser(currentUser); });
    }) ?? { data: { subscription: null } };

    return () => {
      active = false;
      data.subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = (loggedUser: User) => setUser(loggedUser);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setActiveModulo('dashboard');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><div className="w-16 h-16 border-4 border-[#800706] border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-gray-600">A carregar...</p></div></div>;
  }

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const renderModulo = () => {
    switch (activeModulo) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'registo-nascimento': return <ServicoModule titulo="Registo de Nascimento" dominio="registo-civil" icon={<Baby className="w-6 h-6" />} />;
      case 'emissao-bi': return <ServicoModule titulo="Emissão do BI" dominio="identificacao" icon={<CreditCard className="w-6 h-6" />} />;
      case 'registo-criminal': return <ServicoModule titulo="Registo Criminal" dominio="registo-criminal" icon={<Shield className="w-6 h-6" />} />;
      case 'cartorio-notarial': return <ServicoModule titulo="Cartório Notarial" dominio="cartorio" icon={<FileSignature className="w-6 h-6" />} />;
      case 'registo-automovel': return <ServicoModule titulo="Registo Automóvel" dominio="registo-automovel" icon={<Car className="w-6 h-6" />} />;
      case 'cofre-geral': return <CofreGeralJustica />;
      case 'delegacoes': return <DelegacoesProvinciais />;
      case 'gestao-documental': return <GestaoDocumental />;
      case 'gestao-utilizadores': return user.perfil === 'admin' ? <GestaoUtilizadores /> : <div className="rounded-xl bg-white p-8 text-gray-700">Acesso restrito a administradores.</div>;
      default: return <Dashboard user={user} />;
    }
  };

  return <div className="flex min-h-screen bg-gray-50"><Sidebar activeModulo={activeModulo} onModuloChange={setActiveModulo} user={user} onLogout={handleLogout} /><main className="flex-1 lg:ml-0"><div className="p-4 md:p-6 lg:p-8 pt-16 lg:pt-6">{renderModulo()}</div></main></div>;
}
