import { useState } from 'react';
import { emolumentos, delegacoes } from '../data';
import { Processo } from '../types';
import { Search, Plus, FileText, Download, Eye, Filter } from 'lucide-react';

interface ServicoModuleProps {
  titulo: string;
  dominio: string;
  icon: React.ReactNode;
}

export default function ServicoModule({ titulo, dominio, icon }: ServicoModuleProps) {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const emols = emolumentos.filter(e => e.dominio === dominio || e.dominio === 'isencao');

  const [formData, setFormData] = useState({
    requerente: '',
    bi_nif: '',
    provincia: '',
    tipo: '',
    observacoes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoProcesso: Processo = {
      id: Date.now().toString(),
      numero: `${dominio.toUpperCase()}-${Date.now()}`,
      tipo: formData.tipo,
      requerente: formData.requerente,
      bi_nif: formData.bi_nif,
      estado: 'pendente',
      valor: emols.find(e => e.descricao === formData.tipo)?.valor || 0,
      dataCriacao: new Date().toISOString().split('T')[0],
      dataAtualizacao: new Date().toISOString().split('T')[0],
      provincia: formData.provincia,
      observacoes: formData.observacoes
    };
    setProcessos([novoProcesso, ...processos]);
    setShowForm(false);
    setFormData({ requerente: '', bi_nif: '', provincia: '', tipo: '', observacoes: '' });
  };

  const filteredProcessos = processos.filter(p => {
    const matchSearch = p.requerente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.bi_nif.includes(searchTerm);
    const matchStatus = filterStatus === 'todos' || p.estado === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    pendente: 'bg-yellow-100 text-yellow-700',
    em_analise: 'bg-blue-100 text-blue-700',
    aprovado: 'bg-green-100 text-green-700',
    concluido: 'bg-emerald-100 text-emerald-700',
    rejeitado: 'bg-red-100 text-red-700'
  };

  const statusLabels: Record<string, string> = {
    pendente: 'Pendente',
    em_analise: 'Em Análise',
    aprovado: 'Aprovado',
    concluido: 'Concluído',
    rejeitado: 'Rejeitado'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#800706] rounded-xl flex items-center justify-center text-white">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>
            <p className="text-sm text-gray-500">{processos.length} processos registados</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#800706] hover:bg-[#5a0504] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Processo
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Processo</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Requerente</label>
              <input
                type="text"
                value={formData.requerente}
                onChange={e => setFormData({...formData, requerente: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BI / NIF</label>
              <input
                type="text"
                value={formData.bi_nif}
                onChange={e => setFormData({...formData, bi_nif: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
                placeholder="000000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
              <select
                value={formData.tipo}
                onChange={e => setFormData({...formData, tipo: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
              >
                <option value="">Selecione...</option>
                {emols.map(e => (
                  <option key={e.id} value={e.descricao}>
                    {e.descricao} - {e.valor.toLocaleString('pt-AO')} AKZ
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Província</label>
              <select
                value={formData.provincia}
                onChange={e => setFormData({...formData, provincia: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
              >
                <option value="">Selecione...</option>
                {delegacoes.map(d => (
                  <option key={d.id} value={d.provincia}>{d.provincia}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                value={formData.observacoes}
                onChange={e => setFormData({...formData, observacoes: e.target.value})}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
                placeholder="Observações adicionais..."
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#800706] hover:bg-[#5a0504] text-white rounded-lg font-medium transition-colors"
              >
                Registar Processo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome, número ou BI..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
          >
            <option value="todos">Todos os estados</option>
            <option value="pendente">Pendente</option>
            <option value="em_analise">Em Análise</option>
            <option value="aprovado">Aprovado</option>
            <option value="concluido">Concluído</option>
            <option value="rejeitado">Rejeitado</option>
          </select>
        </div>
      </div>

      {/* Process List */}
      {filteredProcessos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Nenhum processo encontrado</h3>
          <p className="text-gray-500 mt-2">Comece por criar um novo processo.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nº</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Requerente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">BI/NIF</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Valor</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProcessos.map(processo => (
                  <tr key={processo.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{processo.numero}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{processo.requerente}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{processo.bi_nif}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{processo.tipo}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[processo.estado]}`}>
                        {statusLabels[processo.estado]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 hidden md:table-cell">
                      {processo.valor.toLocaleString('pt-AO')} AKZ
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
