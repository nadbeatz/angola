import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  MapPin,
  Tag,
  Paperclip,
  Clock,
  AlertCircle,
  Download,
  Printer,
  Share2,
  Edit3,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { Document } from '../types';

interface DocumentDetailProps {
  document: Document;
  onBack: () => void;
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

const priorityColors: Record<string, string> = {
  urgente: 'bg-red-100 text-red-700',
  alta: 'bg-orange-100 text-orange-700',
  media: 'bg-amber-100 text-amber-700',
  baixa: 'bg-green-100 text-green-700',
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

const areaLabels: Record<string, string> = {
  civil: 'Cível',
  criminal: 'Criminal',
  trabalho: 'Trabalho',
  familia: 'Família',
  fazenda: 'Fazenda Pública',
};

const timeline = [
  { date: '2024-03-22', event: 'Última atualização do documento', user: 'Sistema' },
  { date: '2024-03-15', event: 'Anexo adicionado ao processo', user: 'Cartório' },
  { date: '2024-03-10', event: 'Movimentação processual registrada', user: 'Servidor' },
  { date: '2024-02-28', event: 'Despacho proferido', user: 'Magistrado' },
  { date: '2024-02-15', event: 'Documento juntado aos autos', user: 'Cartório' },
  { date: '2024-01-15', event: 'Processo distribuído', user: 'Sistema' },
];

export default function DocumentDetail({ document: doc, onBack }: DocumentDetailProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={onBack} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Documentos
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 truncate max-w-xs">{doc.titulo}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" />
            Compartilhar
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <Edit3 className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[doc.status]}`}>
                  {statusLabels[doc.status]}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[doc.prioridade]}`}>
                  {doc.prioridade.charAt(0).toUpperCase() + doc.prioridade.slice(1)}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                  {typeLabels[doc.tipo]}
                </span>
              </div>
              <h1 className="text-xl font-bold text-white">{doc.titulo}</h1>
              <p className="text-blue-200 font-mono text-sm mt-1">{doc.numero}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Vara / Comarca</p>
                <p className="text-sm font-semibold text-gray-900">{doc.vara}</p>
                <p className="text-xs text-gray-500">{doc.comarca}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Tag className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Área</p>
                <p className="text-sm font-semibold text-gray-900">{areaLabels[doc.area]}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Responsável</p>
                <p className="text-sm font-semibold text-gray-900">{doc.responsavel}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Data de Criação</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(doc.dataCriacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Última Atualização</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(doc.dataAtualizacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Paperclip className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Anexos</p>
                <p className="text-sm font-semibold text-gray-900">{doc.anexos} arquivos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description & Parties */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Descrição</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{doc.descricao}</p>
          </div>

          {/* Parties */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Partes Envolvidas</h3>
            <div className="space-y-3">
              {doc.partes.map((parte, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{parte}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Observations */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-gray-900">Observações</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed bg-amber-50 border border-amber-100 rounded-lg p-4">
              {doc.observacoes}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Histórico de Movimentações</h3>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-3 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full border-2 ${i === 0 ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`} />
                  {i < timeline.length - 1 && <div className="w-0.5 h-full bg-gray-200 min-h-[40px]" />}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-medium text-gray-900">{item.event}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.user}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
