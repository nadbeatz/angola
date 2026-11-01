import { useState } from 'react';
import { emolumentos } from '../data';
import { 
  Landmark, 
  TrendingUp, 
  DollarSign, 
  FileText,
  Search,
  X,
  Download,
  Printer,
  Eye,
  Filter,
  Calculator,
  CheckCircle,
  AlertCircle,
  Receipt
} from 'lucide-react';

export default function CofreGeralJustica() {
  const [selectedDominio, setSelectedDominio] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const [calcData, setCalcData] = useState({
    codigo: '',
    quantidade: 1,
    isento: false
  });

  const filteredEmolumentos = emolumentos.filter(e => {
    const matchDominio = selectedDominio === 'todos' || e.dominio === selectedDominio;
    const matchSearch = e.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       e.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDominio && matchSearch;
  });

  const totalReceita = emolumentos.filter(e => !e.isento).reduce((sum, e) => sum + e.valor, 0);
  const totalActos = emolumentos.filter(e => !e.isento).length;
  const totalIsentos = emolumentos.filter(e => e.isento).length;
  const avgValor = Math.round(totalReceita / totalActos);

  const dominios = [
    { id: 'todos', label: 'Todos', icon: '📋' },
    { id: 'registo-civil', label: 'Registo Civil', icon: '👶' },
    { id: 'identificacao', label: 'Identificação', icon: '🆔' },
    { id: 'registo-criminal', label: 'Registo Criminal', icon: '🛡️' },
    { id: 'cartorio', label: 'Cartório', icon: '📝' },
    { id: 'registo-automovel', label: 'Registo Automóvel', icon: '🚗' },
    { id: 'isencao', label: 'Isenções', icon: '✅' }
  ];

  const calculateTotal = () => {
    const emol = emolumentos.find(e => e.codigo === calcData.codigo);
    if (!emol) return 0;
    if (calcData.isento || emol.isento) return 0;
    return emol.valor * calcData.quantidade;
  };

  const selectedEmol = showDetail ? emolumentos.find(e => e.id === showDetail) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cofre Geral de Justiça</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão de emolumentos • Decretos 300/19 e 301/19</p>
        </div>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#800706] to-[#5a0504] hover:from-[#5a0504] hover:to-[#800706] text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Calculator className="w-5 h-5" />
          Simulador
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Receita Total</p>
              <p className="text-2xl font-bold mt-2">{totalReceita.toLocaleString('pt-AO')}</p>
              <p className="text-xs opacity-75 mt-1">AKZ</p>
            </div>
            <DollarSign className="w-10 h-10 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Actos Sujeitos</p>
              <p className="text-2xl font-bold mt-2">{totalActos}</p>
              <p className="text-xs opacity-75 mt-1">emolumentos</p>
            </div>
            <FileText className="w-10 h-10 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Actos Isentos</p>
              <p className="text-2xl font-bold mt-2">{totalIsentos}</p>
              <p className="text-xs opacity-75 mt-1">gratuitos</p>
            </div>
            <CheckCircle className="w-10 h-10 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Valor Médio</p>
              <p className="text-2xl font-bold mt-2">{avgValor.toLocaleString('pt-AO')}</p>
              <p className="text-xs opacity-75 mt-1">AKZ</p>
            </div>
            <TrendingUp className="w-10 h-10 opacity-50" />
          </div>
        </div>
      </div>

      {/* Calculator */}
      {showCalculator && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#800706]" />
              Simulador de Emolumentos
            </h3>
            <button
              onClick={() => setShowCalculator(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Acto</label>
              <select
                value={calcData.codigo}
                onChange={e => setCalcData({...calcData, codigo: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706] transition-all"
              >
                <option value="">Selecione...</option>
                {emolumentos.filter(e => !e.isento).map(e => (
                  <option key={e.codigo} value={e.codigo}>
                    {e.descricao} - {e.valor.toLocaleString('pt-AO')} AKZ
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
              <input
                type="number"
                min="1"
                value={calcData.quantidade}
                onChange={e => setCalcData({...calcData, quantidade: parseInt(e.target.value) || 1})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706] transition-all"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={calcData.isento}
                  onChange={e => setCalcData({...calcData, isento: e.target.checked})}
                  className="w-5 h-5 text-[#800706] border-gray-300 rounded focus:ring-[#800706]"
                />
                <span className="text-sm font-medium text-gray-700">Isento</span>
              </label>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-[#800706] to-[#5a0504] rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total a Pagar</p>
                <p className="text-3xl font-bold mt-1">
                  {calculateTotal().toLocaleString('pt-AO')} AKZ
                </p>
              </div>
              <Receipt className="w-12 h-12 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por código ou descrição..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706] transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {dominios.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDominio(d.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedDominio === d.id
                    ? 'bg-[#800706] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{d.icon}</span>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emoluments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#800706]" />
            Tabela de Emolumentos
          </h3>
          <span className="text-sm text-gray-500">{filteredEmolumentos.length} registos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Domínio</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor (AKZ)</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmolumentos.map(emol => (
                <tr key={emol.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900 font-semibold">{emol.codigo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{emol.descricao}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell capitalize">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {emol.dominio.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    {emol.isento ? (
                      <span className="text-green-600">Gratuito</span>
                    ) : (
                      emol.valor.toLocaleString('pt-AO')
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {emol.isento ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Isento
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        <DollarSign className="w-3 h-3" />
                        Sujeito
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setShowDetail(emol.id)}
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

      {/* Detail Modal */}
      {selectedEmol && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="sticky top-0 bg-gradient-to-r from-[#800706] to-[#5a0504] text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Detalhes do Emolumento</h3>
                <p className="text-white/80 text-sm mt-1 font-mono">{selectedEmol.codigo}</p>
              </div>
              <button
                onClick={() => setShowDetail(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Descrição</p>
                <p className="text-lg font-semibold text-gray-900">{selectedEmol.descricao}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Domínio</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize mt-1">
                    {selectedEmol.dominio.replace('-', ' ')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-semibold mt-1">
                    {selectedEmol.isento ? (
                      <span className="text-green-600">Isento</span>
                    ) : (
                      <span className="text-blue-600">Sujeito</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#800706] to-[#5a0504] rounded-xl p-6 text-white text-center">
                <p className="text-sm opacity-90">Valor</p>
                <p className="text-4xl font-bold mt-2">
                  {selectedEmol.isento ? '0' : selectedEmol.valor.toLocaleString('pt-AO')} AKZ
                </p>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium">
                  <Printer className="w-4 h-4" />
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
