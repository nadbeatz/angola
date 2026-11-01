import { useState } from 'react';
import { delegacoes } from '../data';
import { MapPin, Users, FileText, Search } from 'lucide-react';

export default function DelegacoesProvinciais() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNova, setFilterNova] = useState<'todas' | 'antigas' | 'novas'>('todas');

  const filteredDelegacoes = delegacoes.filter(d => {
    const matchSearch = d.provincia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       d.capital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterNova === 'todas' || 
                       (filterNova === 'novas' && d.nova) || 
                       (filterNova === 'antigas' && !d.nova);
    return matchSearch && matchFilter;
  });

  const totalFuncionarios = delegacoes.reduce((sum, d) => sum + d.funcionarios, 0);
  const totalProcessos = delegacoes.reduce((sum, d) => sum + d.processos, 0);
  const novasDelegacoes = delegacoes.filter(d => d.nova).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Delegações Provinciais</h1>
        <p className="text-sm text-gray-500 mt-1">21 províncias de Angola</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{delegacoes.length}</p>
              <p className="text-sm text-gray-500">Delegações</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalFuncionarios}</p>
              <p className="text-sm text-gray-500">Funcionários</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalProcessos}</p>
              <p className="text-sm text-gray-500">Processos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por província ou capital..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterNova('todas')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                filterNova === 'todas' ? 'bg-[#800706] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterNova('antigas')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                filterNova === 'antigas' ? 'bg-[#800706] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Antigas
            </button>
            <button
              onClick={() => setFilterNova('novas')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                filterNova === 'novas' ? 'bg-[#800706] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Novas ({novasDelegacoes})
            </button>
          </div>
        </div>
      </div>

      {/* Delegations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDelegacoes.map(delegacao => (
          <div key={delegacao.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{delegacao.provincia}</h3>
                <p className="text-sm text-gray-500">{delegacao.capital}</p>
              </div>
              {delegacao.nova && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  NOVA 2025
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Funcionários</p>
                <p className="text-lg font-bold text-gray-900">{delegacao.funcionarios}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Processos</p>
                <p className="text-lg font-bold text-gray-900">{delegacao.processos}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
