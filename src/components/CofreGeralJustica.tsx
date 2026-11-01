import { useState } from 'react';
import { emolumentos } from '../data';
import { Landmark, TrendingUp, DollarSign, FileText } from 'lucide-react';

export default function CofreGeralJustica() {
  const [selectedDominio, setSelectedDominio] = useState('todos');

  const filteredEmolumentos = selectedDominio === 'todos' 
    ? emolumentos 
    : emolumentos.filter(e => e.dominio === selectedDominio);

  const totalReceita = emolumentos.reduce((sum, e) => sum + e.valor, 0);
  const totalActos = emolumentos.length;
  const totalIsentos = emolumentos.filter(e => e.isento).length;

  const dominios = [
    { id: 'todos', label: 'Todos' },
    { id: 'registo-civil', label: 'Registo Civil' },
    { id: 'identificacao', label: 'Identificação' },
    { id: 'registo-criminal', label: 'Registo Criminal' },
    { id: 'cartorio', label: 'Cartório' },
    { id: 'registo-automovel', label: 'Registo Automóvel' },
    { id: 'isencao', label: 'Isenções' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cofre Geral de Justiça</h1>
        <p className="text-sm text-gray-500 mt-1">Gestão de emolumentos - Decretos 300/19 e 301/19</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalReceita.toLocaleString('pt-AO')}</p>
              <p className="text-sm text-gray-500">Receita Total (AKZ)</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalActos}</p>
              <p className="text-sm text-gray-500">Actos Sujeitos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalIsentos}</p>
              <p className="text-sm text-gray-500">Actos Isentos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {dominios.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDominio(d.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDominio === d.id 
                  ? 'bg-[#800706] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Emoluments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#800706]" />
            Tabela de Emolumentos
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Descrição</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Domínio</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Valor (AKZ)</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Isento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmolumentos.map(emol => (
                <tr key={emol.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{emol.codigo}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{emol.descricao}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell capitalize">{emol.dominio.replace('-', ' ')}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                    {emol.isento ? 'Gratuito' : `${emol.valor.toLocaleString('pt-AO')}`}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {emol.isento ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Sim</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Não</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
