import { useState } from 'react';
import { Funcionario } from '../types';
import { categorias, servicos, delegacoes } from '../data';
import { FolderOpen, Users, Plus, Search, FileText } from 'lucide-react';

export default function GestaoDocumental() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServico, setSelectedServico] = useState('todos');

  const [formData, setFormData] = useState({
    numeroAgente: '',
    nome: '',
    categoria: '',
    servico: '',
    provincia: '',
    dataInicio: '',
    contacto: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoFuncionario: Funcionario = {
      id: Date.now().toString(),
      ...formData
    };
    setFuncionarios([novoFuncionario, ...funcionarios]);
    setShowForm(false);
    setFormData({
      numeroAgente: '',
      nome: '',
      categoria: '',
      servico: '',
      provincia: '',
      dataInicio: '',
      contacto: '',
      email: ''
    });
  };

  const filteredFuncionarios = funcionarios.filter(f => {
    const matchSearch = f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       f.numeroAgente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchServico = selectedServico === 'todos' || f.servico === selectedServico;
    return matchSearch && matchServico;
  });

  const orgaos = [
    { nome: 'DRH - Direcção de Recursos Humanos', count: funcionarios.filter(f => f.servico.includes('DRH')).length },
    { nome: 'Gabinete Jurídico', count: funcionarios.filter(f => f.servico.includes('Jurídico')).length },
    { nome: 'GEPE', count: funcionarios.filter(f => f.servico.includes('GEPE')).length },
    { nome: 'Secretaria Geral', count: funcionarios.filter(f => f.servico.includes('Secretaria')).length },
    { nome: 'GTIC', count: funcionarios.filter(f => f.servico.includes('GTIC')).length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão Documental</h1>
          <p className="text-sm text-gray-500 mt-1">Órgãos centrais do Ministério</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#800706] hover:bg-[#5a0504] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Cadastrar Funcionário
        </button>
      </div>

      {/* Orgaos Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {orgaos.map((orgao, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#800706] rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 truncate">{orgao.nome}</p>
                <p className="text-lg font-bold text-gray-900">{orgao.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cadastrar Funcionário</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Agente</label>
              <input
                type="text"
                value={formData.numeroAgente}
                onChange={e => setFormData({...formData, numeroAgente: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
                placeholder="AG-00000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                value={formData.nome}
                onChange={e => setFormData({...formData, nome: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={formData.categoria}
                onChange={e => setFormData({...formData, categoria: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
              >
                <option value="">Selecione...</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
              <select
                value={formData.servico}
                onChange={e => setFormData({...formData, servico: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
              >
                <option value="">Selecione...</option>
                {servicos.map(s => <option key={s} value={s}>{s}</option>)}
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
                {delegacoes.map(d => <option key={d.id} value={d.provincia}>{d.provincia}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
              <input
                type="date"
                value={formData.dataInicio}
                onChange={e => setFormData({...formData, dataInicio: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
              <input
                type="tel"
                value={formData.contacto}
                onChange={e => setFormData({...formData, contacto: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
                placeholder="+244 900 000 000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
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
                Cadastrar
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
              placeholder="Pesquisar por nome ou número de agente..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
            />
          </div>
          <select
            value={selectedServico}
            onChange={e => setSelectedServico(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
          >
            <option value="todos">Todos os serviços</option>
            {servicos.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Funcionarios List */}
      {filteredFuncionarios.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Nenhum funcionário cadastrado</h3>
          <p className="text-gray-500 mt-2">Comece por cadastrar um novo funcionário.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nº Agente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Categoria</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Serviço</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Província</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Contacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFuncionarios.map(func => (
                  <tr key={func.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{func.numeroAgente}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{func.nome}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{func.categoria}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{func.servico}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{func.provincia}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{func.contacto}</td>
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
