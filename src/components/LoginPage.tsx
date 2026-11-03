import React, { useState } from 'react';
import { login } from '../auth';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      onLogin(await login(email, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível iniciar sessão.');
    } finally {
      setPassword('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#800706] via-[#5a0504] to-[#2d0202] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src="https://med.gov.ao/themes/portalweb/assets/public/app-assets/img/simbolos/RepublicaAngola_InsigniaOficial.png" alt="Insígnia da República de Angola" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">República de Angola</h1>
          <p className="text-sm text-gray-600 mt-1">Ministério da Justiça e dos Direitos Humanos</p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-[#800706]">Sistema Integrado de Gestão</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]" placeholder="nome@exemplo.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Palavra-passe</label>
            <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]" placeholder="Introduza a palavra-passe" />
          </div>
          {error && <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-[#800706] hover:bg-[#5a0504] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'A validar...' : 'Entrar'}
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">© 2026 Ministério da Justiça e dos Direitos Humanos</p>
          <p className="text-xs text-gray-400 mt-1">Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}
