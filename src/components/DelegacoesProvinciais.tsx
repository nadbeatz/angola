import { useState } from 'react';
import { delegacoes } from '../data';
import { 
  MapPin, 
  Users, 
  FileText, 
  Search,
  X,
  TrendingUp,
  Building2,
  Calendar,
  Phone,
  Mail,
  Eye,
  Filter
} from 'lucide-react';

export default function DelegacoesProvinciais() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNova, setFilterNova] = useState<'todas' | 'antigas' | 'novas'>('todas');
  const [selectedDelegacao, setSelectedDelegacao] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
  const avgFuncionarios = Math.round(totalFuncionarios / delegacoes.length);

  const selected = selectedDelegacao ? delegacoes.find(d => d.id === selectedDelegacao) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Delegações Provinciais</h1>
        <p className="text-sm text-gray-500 mt-1">21 províncias de Angola • Sistema Integrado de Gestão</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Delegações</p>
              <p className="text-3xl font-bold mt-2">{delegacoes.length}</p>
            </div>
            <Building2 className="w-10 h-10 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Funcionários</p>
              <p className="text-3xl font-bold mt-2">{totalFuncionarios}</p>
            </div>
            <Users className="w-10 h-10 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Processos</p>
              <p className="text-3xl font-bold mt-2">{totalProcessos}</p>
            </div>
            <FileText className="w-10 h-10 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Novas (2025)</p>
              <p className="text-3xl font-bold mt-2">{novasDelegacoes}</p>
            </div>
            <TrendingUp className="w-10 h-10 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por província ou capital..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706] transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid' ? 'bg-[#800706] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list' ? 'bg-[#800706] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Lista
            </button>
          </div>
          <div className="flex gap-2">
            {['todas', 'antigas', 'novas'].map(filter => (
              <button
                key={filter}
                onClick={() => setFilterNova(filter as any)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  filterNova === filter ? 'bg-[#800706] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter === 'todas' ? 'Todas' : filter === 'antigas' ? 'Antigas' : `Novas (${novasDelegacoes})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Delegations Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDelegacoes.map(delegacao => (
            <div 
              key={delegacao.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
              onClick={() => setSelectedDelegacao(delegacao.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#800706] transition-colors">{delegacao.provincia}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {delegacao.capital}
                  </p>
                </div>
                {delegacao.nova && (
                  <span className="px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                    NOVA 2025
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Funcionários</p>
                  <p className="text-2xl font-bold text-gray-900">{delegacao.funcionarios}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Processos</p>
                  <p className="text-2xl font-bold text-gray-900">{delegacao.processos}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Média por funcionário</span>
                  <span className="font-semibold text-[#800706]">
                    {(delegacao.processos / delegacao.funcionarios).toFixed(1)} processos
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Província</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Capital</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Funcionários</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Processos</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDelegacoes.map(delegacao => (
                  <tr key={delegacao.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{delegacao.provincia}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{delegacao.capital}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-gray-900">{delegacao.funcionarios}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-gray-900">{delegacao.processos}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {delegacao.nova ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Nova 2025
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                          Existente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedDelegacao(delegacao.id)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#800706] to-[#5a0504] text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Delegação Provincial</h3>
                <p className="text-white/80 text-sm mt-1">{selected.provincia}</p>
              </div>
              <button
                onClick={() => setSelectedDelegacao(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <p className="text-xs text-blue-600 font-medium">Capital</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selected.capital}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <p className="text-xs text-green-600 font-medium">Funcionários</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selected.funcionarios}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <p className="text-xs text-purple-600 font-medium">Processos</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selected.processos}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <p className="text-xs text-orange-600 font-medium">Média</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {(selected.processos / selected.funcionarios).toFixed(1)}
                  </p>
                </div>
              </div>

              {selected.nova && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                  <p className="font-semibold">🎉 Delegação Nova (2025)</p>
                  <p className="text-sm opacity-90 mt-1">
                    Esta delegação foi criada em 2025 como parte da reorganização administrativa de Angola.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">Informações de Contacto</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Delegação Provincial do Ministério da Justiça</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{selected.capital}, {selected.provincia}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">+244 2XX XXX XXX</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">dp.{selected.provincia.toLowerCase()}@mjdh.gov.ao</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
