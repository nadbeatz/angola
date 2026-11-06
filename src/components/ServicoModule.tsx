import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { emolumentos, delegacoes } from '../data';
import { Processo } from '../types';
import ServiceSpecificFields from './ServiceSpecificFields';
import { birthRegistrationSchema, identitySchema, vehicleRegistrationSchema, cartorioSchema } from '../serviceSchemas';
import { 
  Search, 
  Plus, 
  FileText, 
  Download, 
  Eye, 
  Filter,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  QrCode,
  Printer,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface ServicoModuleProps {
  titulo: string;
  dominio: string;
  icon: React.ReactNode;
}

export default function ServicoModule({ titulo, dominio, icon }: ServicoModuleProps) {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState<Processo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let active = true;
    const loadProcessos = async () => {
      if (!supabase) {
        setLoadError('A ligação à base de dados não está configurada.');
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('processos')
        .select('id, numero, dominio, tipo, requerente, bi_nif, estado, valor, provincia, observacoes, dados_adicionais, created_at, updated_at')
        .eq('dominio', dominio)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) {
        setLoadError(error.message);
      } else {
        setLoadError('');
        setProcessos((data ?? []).map(row => ({
          id: row.id,
          numero: row.numero,
          tipo: row.tipo,
          requerente: row.requerente,
          bi_nif: row.bi_nif,
          estado: row.estado as Processo['estado'],
          valor: Number(row.valor),
          dataCriacao: row.created_at.slice(0, 10),
          dataAtualizacao: row.updated_at.slice(0, 10),
          provincia: row.provincia,
          observacoes: row.observacoes,
          dadosAdicionais: (row.dados_adicionais ?? {}) as Record<string, string>,
        })));
      }
      setLoading(false);
    };
    void loadProcessos();
    return () => { active = false; };
  }, [dominio]);

  const emols = emolumentos.filter(e => e.dominio === dominio || e.dominio === 'isencao');
  const schema = dominio === 'registo-civil' ? birthRegistrationSchema : dominio === 'identificacao' ? identitySchema : dominio === 'registo-automovel' ? vehicleRegistrationSchema : dominio === 'cartorio' ? cartorioSchema : undefined;
  const [extraData, setExtraData] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    requerente: '',
    bi_nif: '',
    provincia: '',
    tipo: '',
    observacoes: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.requerente.trim()) errors.requerente = 'Nome é obrigatório';
    if (!formData.bi_nif.trim()) errors.bi_nif = 'BI/NIF é obrigatório';
    else if (formData.bi_nif.length < 9) errors.bi_nif = 'BI/NIF inválido';
    if (!formData.provincia) errors.provincia = 'Província é obrigatória';
    if (!formData.tipo) errors.tipo = 'Tipo de serviço é obrigatório';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!supabase) {
      setFormErrors({ general: 'A ligação à base de dados não está configurada.' });
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      setFormErrors({ general: 'A sessão expirou. Entre novamente no sistema.' });
      return;
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const numero = `${dominio.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)}-${now.slice(0, 10).replace(/-/g, '')}-${id.slice(0, 8).toUpperCase()}`;
    const { data, error } = await supabase
      .from('processos')
      .insert({
        numero,
        dominio,
        tipo: formData.tipo,
        requerente: formData.requerente.trim(),
        bi_nif: formData.bi_nif.trim(),
        estado: 'pendente',
        valor: emols.find(item => item.descricao === formData.tipo)?.valor || 0,
        provincia: formData.provincia,
        observacoes: formData.observacoes.trim(),
        dados_adicionais: extraData,
        created_by: authData.user.id,
      })
      .select('id, numero, tipo, requerente, bi_nif, estado, valor, provincia, observacoes, dados_adicionais, created_at, updated_at')
      .single();

    if (error || !data) {
      setFormErrors({ general: error?.message || 'Não foi possível guardar o processo.' });
      return;
    }

    const novoProcesso: Processo = {
      id: data.id,
      numero: data.numero,
      tipo: data.tipo,
      requerente: data.requerente,
      bi_nif: data.bi_nif,
      estado: data.estado as Processo['estado'],
      valor: Number(data.valor),
      dataCriacao: data.created_at.slice(0, 10),
      dataAtualizacao: data.updated_at.slice(0, 10),
      provincia: data.provincia,
      observacoes: data.observacoes,
      dadosAdicionais: (data.dados_adicionais ?? {}) as Record<string, string>,
    };
    setProcessos(current => [novoProcesso, ...current]);
    setShowForm(false);
    setFormData({ requerente: '', bi_nif: '', provincia: '', tipo: '', observacoes: '' });
    setExtraData({});
    setFormErrors({});
  };

  const filteredProcessos = processos.filter(p => {
    const matchSearch = p.requerente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.bi_nif.includes(searchTerm);
    const matchStatus = filterStatus === 'todos' || p.estado === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    pendente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    em_analise: 'bg-blue-100 text-blue-700 border-blue-200',
    aprovado: 'bg-green-100 text-green-700 border-green-200',
    concluido: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejeitado: 'bg-red-100 text-red-700 border-red-200'
  };

  const statusLabels: Record<string, string> = {
    pendente: 'Pendente',
    em_analise: 'Em Análise',
    aprovado: 'Aprovado',
    concluido: 'Concluído',
    rejeitado: 'Rejeitado'
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pendente: <Clock className="w-4 h-4" />,
    em_analise: <AlertCircle className="w-4 h-4" />,
    aprovado: <CheckCircle className="w-4 h-4" />,
    concluido: <CheckCircle className="w-4 h-4" />,
    rejeitado: <X className="w-4 h-4" />
  };

  const totalValor = processos.reduce((sum, p) => sum + p.valor, 0);
  const concluidos = processos.filter(p => p.estado === 'concluido').length;
  const pendentes = processos.filter(p => p.estado === 'pendente').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-[#800706] to-[#5a0504] rounded-xl flex items-center justify-center text-white shadow-lg">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>
            <p className="text-sm text-gray-500">{loading ? 'A carregar processos…' : `${processos.length} processos registados`}</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#800706] to-[#5a0504] hover:from-[#5a0504] hover:to-[#800706] text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Novo Processo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{processos.length}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pendentes}</p>
              <p className="text-sm text-gray-500">Pendentes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalValor.toLocaleString('pt-AO')}</p>
              <p className="text-sm text-gray-500">Valor Total (AKZ)</p>
            </div>
          </div>
        </div>
      </div>

      {loadError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{loadError}</div>}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Novo Processo</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormErrors({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formErrors.general && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formErrors.general}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Requerente *
                  </label>
                  <input
                    type="text"
                    value={formData.requerente}
                    onChange={e => {
                      setFormData({...formData, requerente: e.target.value});
                      if (formErrors.requerente) setFormErrors({...formErrors, requerente: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formErrors.requerente 
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                    }`}
                    placeholder="Nome completo"
                  />
                  {formErrors.requerente && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.requerente}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    BI / NIF *
                  </label>
                  <input
                    type="text"
                    value={formData.bi_nif}
                    onChange={e => {
                      setFormData({...formData, bi_nif: e.target.value});
                      if (formErrors.bi_nif) setFormErrors({...formErrors, bi_nif: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formErrors.bi_nif 
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                    }`}
                    placeholder="000000000"
                  />
                  {formErrors.bi_nif && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.bi_nif}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Serviço *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={e => {
                      setFormData({...formData, tipo: e.target.value});
                      if (formErrors.tipo) setFormErrors({...formErrors, tipo: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formErrors.tipo 
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                    }`}
                  >
                    <option value="">Selecione...</option>
                    {emols.map(e => (
                      <option key={e.id} value={e.descricao}>
                        {e.descricao} - {e.valor.toLocaleString('pt-AO')} AKZ
                      </option>
                    ))}
                  </select>
                  {formErrors.tipo && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.tipo}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Província *
                  </label>
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
                    {delegacoes.map(d => (
                      <option key={d.id} value={d.provincia}>{d.provincia}</option>
                    ))}
                  </select>
                  {formErrors.provincia && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.provincia}
                    </p>
                  )}
                </div>
              </div>
              <ServiceSpecificFields schema={schema} values={extraData} onChange={(name, value) => setExtraData(prev => ({ ...prev, [name]: value }))} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={e => setFormData({...formData, observacoes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706] transition-all"
                  placeholder="Observações adicionais..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
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
                  Registar Processo
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
              <h3 className="text-xl font-bold text-gray-900">Detalhes do Processo</h3>
              <button
                onClick={() => setShowDetail(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Número do Processo</p>
                  <p className="text-lg font-mono font-bold text-gray-900">{showDetail.numero}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[showDetail.estado]}`}>
                  {statusLabels[showDetail.estado]}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Requerente</p>
                  <p className="text-base font-medium text-gray-900">{showDetail.requerente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">BI/NIF</p>
                  <p className="text-base font-mono text-gray-900">{showDetail.bi_nif}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Serviço</p>
                  <p className="text-base font-medium text-gray-900">{showDetail.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Província</p>
                  <p className="text-base font-medium text-gray-900">{showDetail.provincia}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Criação</p>
                  <p className="text-base font-medium text-gray-900">{showDetail.dataCriacao}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="text-2xl font-bold text-[#800706]">{showDetail.valor.toLocaleString('pt-AO')} AKZ</p>
                </div>
              </div>

              {showDetail.dadosAdicionais && Object.entries(showDetail.dadosAdicionais).some(([,v]) => v) && <div><p className="text-sm text-gray-500 mb-2">Dados específicos do serviço</p><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{Object.entries(showDetail.dadosAdicionais).filter(([,v])=>v).map(([k,v])=><div key={k} className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">{k}</p><p className="text-sm text-gray-800">{v}</p></div>)}</div></div>}
              {showDetail.observacoes && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Observações</p>
                  <p className="text-base text-gray-700 bg-gray-50 p-4 rounded-lg">{showDetail.observacoes}</p>
                </div>
              )}

              {/* QR Code Placeholder */}
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <QrCode className="w-32 h-32 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 font-medium">QR Code do Processo</p>
                <p className="text-xs text-gray-500 mt-1">{showDetail.numero}</p>
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
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium">
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome, número ou BI..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706] transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 border rounded-lg text-sm font-medium transition-all ${
              showFilters || filterStatus !== 'todos'
                ? 'border-[#800706] text-[#800706] bg-[#800706]/5'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {['todos', 'pendente', 'em_analise', 'aprovado', 'concluido', 'rejeitado'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-[#800706] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'todos' ? 'Todos' : statusLabels[status]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Process List */}
      {loading ? <div className="rounded-xl border bg-white p-10 text-center text-gray-500">A carregar processos…</div> : filteredProcessos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Nenhum processo encontrado</h3>
          <p className="text-gray-500 mt-2">Comece por criar um novo processo.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-[#800706] to-[#5a0504] text-white rounded-lg font-medium hover:shadow-xl transition-all"
          >
            Criar Primeiro Processo
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nº</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requerente</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">BI/NIF</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Tipo</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Valor</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProcessos.map(processo => (
                  <tr key={processo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-mono text-gray-900 font-medium">{processo.numero}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{processo.requerente}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 font-mono hidden md:table-cell">{processo.bi_nif}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell">{processo.tipo}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusColors[processo.estado]}`}>
                        {statusIcons[processo.estado]}
                        {statusLabels[processo.estado]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gray-900 hidden md:table-cell">
                      {processo.valor.toLocaleString('pt-AO')} AKZ
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setShowDetail(processo)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
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
        </div>
      )}
    </div>
  );
}
