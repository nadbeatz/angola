import { useState } from 'react';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  X
} from 'lucide-react';
import { Document } from '../types';
import { mockDocuments } from '../data';

interface DocumentListProps {
  onSelectDocument: (doc: Document) => void;
}

const statusColors: Record<string, string> = {
  em_andamento: 'bg-blue-100 text-blue-800',
  concluso: 'bg-green-100 text-green-800',
  arquivado: 'bg-gray-100 text-gray-800',
  aguardando: 'bg-amber-100 text-amber-800',
  despachado: 'bg-purple-100 text-purple-800',
};

const statusLabels: Record<string, string> = {
  em_andamento: 'Em Andamento',
  concluso: 'Concluído',
  arquivado: 'Arquivado',
  aguardando: 'Aguardando',
  despachado: 'Despachado',
};

const statusDot: Record<string, string> = {
  em_andamento: 'bg-blue-500',
  concluso: 'bg-green-500',
  arquivado: 'bg-gray-500',
  aguardando: 'bg-amber-500',
  despachado: 'bg-purple-500',
};

const priorityColors: Record<string, string> = {
  urgente: 'bg-red-100 text-red-700 border-red-200',
  alta: 'bg-orange-100 text-orange-700 border-orange-200',
  media: 'bg-amber-100 text-amber-700 border-amber-200',
  baixa: 'bg-green-100 text-green-700 border-green-200',
};

const typeLabels: Record<string, string> = {
  peticao: 'Petição',
  sentenca: 'Sentença',
  despacho: 'Despacho',
  certidao: 'Certidão',
  ata: 'Ata',
  oficio: 'Ofício',
  parecer: 'Parecer',
  recurso: 'Recurso',
};

const typeIcons: Record<string, string> = {
  peticao: '📝',
  sentenca: '⚖️',
  despacho: '📋',
  certidao: '📜',
  ata: '📑',
  oficio: '✉️',
  parecer: '🔍',
  recurso: '↗️',
};

export default function DocumentList({ onSelectDocument }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'dataAtualizacao' | 'prioridade' | 'titulo'>('dataAtualizacao');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredDocs = mockDocuments
    .filter(doc => {
      const matchesSearch = searchTerm === '' ||
        doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.partes.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      const matchesType = typeFilter === 'all' || doc.tipo === typeFilter;
      const matchesPriority = priorityFilter === 'all' || doc.prioridade === priorityFilter;
      const matchesArea = areaFilter === 'all' || doc.area === areaFilter;
      return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesArea;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'dataAtualizacao') {
        comparison = new Date(a.dataAtualizacao).getTime() - new Date(b.dataAtualizacao).getTime();
      } else if (sortField === 'titulo') {
        comparison = a.titulo.localeCompare(b.titulo);
      } else {
        const priorityOrder = { urgente: 4, alta: 3, media: 2, baixa: 1 };
        comparison = priorityOrder[a.prioridade] - priorityOrder[b.prioridade];
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const paginatedDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setPriorityFilter('all');
    setAreaFilter('all');
    setSearchTerm('');
  };

  const activeFiltersCount = [statusFilter, typeFilter, priorityFilter, areaFilter].filter(f => f !== 'all').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
          <p className="text-gray-500 text-sm mt-1">{filteredDocs.length} documentos encontrados</p>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número, título ou partes..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-all ${
              showFilters || activeFiltersCount > 0
                ? 'border-blue-500 text-blue-700 bg-blue-50'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
          >
            {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
            Ordenar
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="all">Todos os status</option>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Tipo</label>
                <select
                  value={typeFilter}
                  onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="all">Todos os tipos</option>
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Prioridade</label>
                <select
                  value={priorityFilter}
                  onChange={e => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="all">Todas</option>
                  <option value="urgente">Urgente</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Área</label>
                <select
                  value={areaFilter}
                  onChange={e => { setAreaFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="all">Todas as áreas</option>
                  <option value="civil">Cível</option>
                  <option value="criminal">Criminal</option>
                  <option value="trabalho">Trabalho</option>
                  <option value="familia">Família</option>
                  <option value="fazenda">Fazenda Pública</option>
                </select>
              </div>
            </div>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                Limpar todos os filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {paginatedDocs.map(doc => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
            onClick={() => onSelectDocument(doc)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-2xl">{typeIcons[doc.tipo]}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                    {doc.titulo}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{doc.numero}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[doc.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[doc.status]}`} />
                  {statusLabels[doc.status]}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityColors[doc.prioridade]}`}>
                {doc.prioridade.charAt(0).toUpperCase() + doc.prioridade.slice(1)}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                {typeLabels[doc.tipo]}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                {doc.vara}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(doc.dataAtualizacao).toLocaleDateString('pt-BR')}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {doc.anexos} anexos
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Nenhum documento encontrado</h3>
          <p className="text-gray-500 text-sm mt-2">Tente ajustar os filtros ou termos de busca.</p>
          <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Limpar filtros
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-5 py-3 shadow-sm">
          <p className="text-sm text-gray-500">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredDocs.length)} de {filteredDocs.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
