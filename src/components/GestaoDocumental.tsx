import { useState } from 'react';
import { Funcionario } from '../types';
import { categorias, servicos, delegacoes } from '../data';
import { 
  FolderOpen, 
  Users, 
  Plus, 
  Search, 
  FileText,
  X,
  Edit,
  Trash2,
  Download,
  Printer,
  Eye,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  AlertCircle,
  CheckCircle,
  UserCheck
} from 'lucide-react';

export default function GestaoDocumental() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFunc, setEditingFunc] = useState<Funcionario | null>(null);
  const [showDetail, setShowDetail] = useState<Funcionario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServico, setSelectedServico] = useState('todos');
  const [selectedCategoria, setSelectedCategoria] = useState('todos');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lista' | 'estatisticas'>('lista');

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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.numeroAgente.trim()) errors.numeroAgente = 'Número de agente é obrigatório';
    if (!formData.nome.trim()) errors.nome = 'Nome é obrigatório';
    if (!formData.categoria) errors.categoria = 'Categoria é obrigatória';
    if (!formData.servico) errors.servico = 'Serviço é obrigatório';
    if (!formData.provincia) errors.provincia = 'Província é obrigatória';
    if (!formData.dataInicio) errors.dataInicio = 'Data de início é obrigatória';
    if (!formData.contacto.trim()) errors.contacto = 'Contacto é obrigatório';
    if (!formData.email.trim()) errors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email inválido';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingFunc) {
      setFuncionarios(funcionarios.map(f => 
        f.id === editingFunc.id ? { ...f, ...formData } : f
      ));
    } else {
      const novoFuncionario: Funcionario = {
        id: Date.now().toString(),
        ...formData
      };
      setFuncionarios([novoFuncionario, ...funcionarios]);
    }
    
    setShowForm(false);
    setEditingFunc(null);
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
    setFormErrors({});
  };

  const handleEdit = (func: Funcionario) => {
    setEditingFunc(func);
    setFormData({
      numeroAgente: func.numeroAgente,
      nome: func.nome,
      categoria: func.categoria,
      servico: func.servico,
      provincia: func.provincia,
      dataInicio: func.dataInicio,
      contacto: func.contacto,
      email: func.email
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setFuncionarios(funcionarios.filter(f => f.id !== id));
    setShowDeleteConfirm(null);
  };

  const filteredFuncionarios = funcionarios.filter(f => {
    const matchSearch = f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       f.numeroAgente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       f.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchServico = selectedServico === 'todos' || f.servico === selectedServico;
    const matchCategoria = selectedCategoria === 'todos' || f.categoria === selectedCategoria;
    return matchSearch && matchServico && matchCategoria;
  });

  const orgaos = [
    { nome: 'DRH', full: 'Direcção de Recursos Humanos', count: funcionarios.filter(f => f.servico.includes('DRH')).length, icon: Users, color: 'from-blue-500 to-blue-600' },
    { nome: 'Gabinete Jurídico', full: 'Gabinete Jurídico', count: funcionarios.filter(f => f.servico.includes('Jurídico')).length, icon: FileText, color: 'from-purple-500 to-purple-600' },
    { nome: 'GEPE', full: 'Gabinete de Estudos e Planeamento', count: funcionarios.filter(f => f.servico.includes('GEPE')).length, icon: FolderOpen, color: 'from-green-500 to-green-600' },
    { nome: 'Secretaria Geral', full: 'Secretaria Geral', count: funcionarios.filter(f => f.servico.includes('Secretaria')).length, icon: Briefcase, color: 'from-orange-500 to-orange-600' },
    { nome: 'GTIC', full: 'Gabinete de Tecnologias de Informação', count: funcionarios.filter(f => f.servico.includes('GTIC')).length, icon: FileText, color: 'from-red-500 to-red-600' }
  ];

  const stats = {
    total: funcionarios.length,
    porCategoria: categorias.map(cat => ({
      categoria: cat,
      count: funcionarios.filter(f => f.categoria === cat).length
    })).filter(c => c.count > 0),
    porProvincia: delegacoes.slice(0, 10).map(d => ({
      provincia: d.provincia,
      count: funcionarios.filter(f => f.provincia === d.provincia).length
    })).filter(p => p.count > 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão Documental</h1>
          <p className="text-sm text-gray-500 mt-1">Órgãos centrais do Ministério da Justiça</p>
        </div>
        <button
          onClick={() => {
            setEditingFunc(null);
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
            setFormErrors({});
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#800706] to-[#5a0504] hover:from-[#5a0504] hover:to-[#800706] text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Cadastrar Funcionário
        </button>
      </div>

      {/* Orgaos Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {orgaos.map((orgao, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${orgao.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <orgao.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 truncate">{orgao.nome}</p>
                <p className="text-2xl font-bold text-gray-900">{orgao.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <div className="flex gap-1 p-2">
            <button
              onClick={() => setActiveTab('lista')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'lista'
                  ? 'bg-[#800706] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Lista de Funcionários
            </button>
            <button
              onClick={() => setActiveTab('estatisticas')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'estatisticas'
                  ? 'bg-[#800706] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Estatísticas
            </button>
          </div>
        </div>

        {activeTab === 'lista' ? (
          <div className="p-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar por nome, número ou email..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706] transition-all"
                />
              </div>
              <select
                value={selectedServico}
                onChange={e => setSelectedServico(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
              >
                <option value="todos">Todos os serviços</option>
                {servicos.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={selectedCategoria}
                onChange={e => setSelectedCategoria(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
              >
                <option value="todos">Todas as categorias</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Funcionarios List */}
            {filteredFuncionarios.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">Nenhum funcionário cadastrado</h3>
                <p className="text-gray-500 mt-2">Comece por cadastrar um novo funcionário.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-[#800706] to-[#5a0504] text-white rounded-lg font-medium hover:shadow-xl transition-all"
                >
                  Cadastrar Primeiro Funcionário
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nº Agente</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Categoria</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Serviço</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Província</th>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acções</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredFuncionarios.map(func => (
                      <tr key={func.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm font-mono text-gray-900 font-medium">{func.numeroAgente}</td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{func.nome}</p>
                            <p className="text-xs text-gray-500">{func.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">{func.categoria}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell">{func.servico}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">{func.provincia}</td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setShowDetail(func)}
                              className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Ver detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(func)}
                              className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(func.id)}
                              className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                <p className="text-sm opacity-90">Total de Funcionários</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
                <p className="text-sm opacity-90">Categorias Activas</p>
                <p className="text-3xl font-bold mt-2">{stats.porCategoria.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                <p className="text-sm opacity-90">Províncias com Pessoal</p>
                <p className="text-3xl font-bold mt-2">{stats.porProvincia.length}</p>
              </div>
            </div>

            {/* By Category */}
            {stats.porCategoria.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Distribuição por Categoria</h3>
                <div className="space-y-3">
                  {stats.porCategoria.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700 w-48">{item.categoria}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#800706] to-[#5a0504] flex items-center justify-end px-3 transition-all"
                          style={{ width: `${(item.count / stats.total) * 100}%` }}
                        >
                          <span className="text-xs font-bold text-white">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* By Province */}
            {stats.porProvincia.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Distribuição por Província</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stats.porProvincia.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{item.provincia}</span>
                      <span className="text-lg font-bold text-[#800706]">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.total === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Cadastre funcionários para ver as estatísticas</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingFunc ? 'Editar Funcionário' : 'Cadastrar Funcionário'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {editingFunc ? 'Actualizar informações do funcionário' : 'Registar novo funcionário no sistema'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingFunc(null);
                  setFormErrors({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Agente *</label>
                  <input
                    type="text"
                    value={formData.numeroAgente}
                    onChange={e => {
                      setFormData({...formData, numeroAgente: e.target.value});
                      if (formErrors.numeroAgente) setFormErrors({...formErrors, numeroAgente: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formErrors.numeroAgente 
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                    }`}
                    placeholder="AG-00000"
                  />
                  {formErrors.numeroAgente && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.numeroAgente}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={e => {
                      setFormData({...formData, nome: e.target.value});
                      if (formErrors.nome) setFormErrors({...formErrors, nome: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formErrors.nome 
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                    }`}
                  />
                  {formErrors.nome && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.nome}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                  <select
                    value={formData.categoria}
                    onChange={e => {
                      setFormData({...formData, categoria: e.target.value});
                      if (formErrors.categoria) setFormErrors({...formErrors, categoria: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formErrors.categoria 
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                    }`}
                  >
                    <option value="">Selecione...</option>
                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {formErrors.categoria && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.categoria}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Serviço *</label>
                  <select
                    value={formData.servico}
                    onChange={e => {
                      setFormData({...formData, servico: e.target.value});
                      if (formErrors.servico) setFormErrors({...formErrors, servico: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formErrors.servico 
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                    }`}
                  >
                    <option value="">Selecione...</option>
                    {servicos.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {formErrors.servico && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.servico}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Província *</label>
                  <select
                    value={formData.provincia}
                    onChange={e => {
                      setFormData({...formData, provincia: e.target.value});
                      if (formErrors.provincia) setFormErrors({...formErrors, provincia: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formErrors.provincia 
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                    }`}
                  >
                    <option value="">Selecione...</option>
                    {delegacoes.map(d => <option key={d.id} value={d.provincia}>{d.provincia}</option>)}
                  </select>
                  {formErrors.provincia && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.provincia}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início *</label>
                  <input
                    type="date"
                    value={formData.dataInicio}
                    onChange={e => {
                      setFormData({...formData, dataInicio: e.target.value});
                      if (formErrors.dataInicio) setFormErrors({...formErrors, dataInicio: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formErrors.dataInicio 
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                    }`}
                  />
                  {formErrors.dataInicio && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.dataInicio}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contacto *</label>
                  <input
                    type="tel"
                    value={formData.contacto}
                    onChange={e => {
                      setFormData({...formData, contacto: e.target.value});
                      if (formErrors.contacto) setFormErrors({...formErrors, contacto: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formErrors.contacto 
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                    }`}
                    placeholder="+244 900 000 000"
                  />
                  {formErrors.contacto && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.contacto}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => {
                      setFormData({...formData, email: e.target.value});
                      if (formErrors.email) setFormErrors({...formErrors, email: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formErrors.email 
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingFunc(null);
                    setFormErrors({});
                  }}
                  className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#800706] to-[#5a0504] hover:from-[#5a0504] hover:to-[#800706] text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  {editingFunc ? 'Actualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Detalhes do Funcionário</h3>
              <button
                onClick={() => setShowDetail(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-[#800706] to-[#5a0504] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {showDetail.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{showDetail.nome}</h4>
                  <p className="text-sm text-gray-500 font-mono">{showDetail.numeroAgente}</p>
                  <p className="text-sm text-[#800706] font-medium mt-1">{showDetail.categoria}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Serviço</p>
                    <p className="text-sm font-medium text-gray-900">{showDetail.servico}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Província</p>
                    <p className="text-sm font-medium text-gray-900">{showDetail.provincia}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Data de Início</p>
                    <p className="text-sm font-medium text-gray-900">{showDetail.dataInicio}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Contacto</p>
                    <p className="text-sm font-medium text-gray-900">{showDetail.contacto}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{showDetail.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium">
                  <Printer className="w-4 h-4" />
                  Imprimir
                </button>
                <button
                  onClick={() => {
                    setShowDetail(null);
                    handleEdit(showDetail);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar Eliminação</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja eliminar este funcionário? Esta acção não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
