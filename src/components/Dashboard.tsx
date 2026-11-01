import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users
} from 'lucide-react';
import { mockDocuments, mockActivities } from '../data';

const statusColors: Record<string, string> = {
  em_andamento: 'bg-blue-500',
  concluso: 'bg-green-500',
  arquivado: 'bg-gray-500',
  aguardando: 'bg-amber-500',
  despachado: 'bg-purple-500',
};

const priorityColors: Record<string, string> = {
  urgente: 'text-red-600 bg-red-50',
  alta: 'text-orange-600 bg-orange-50',
  media: 'text-amber-600 bg-amber-50',
  baixa: 'text-green-600 bg-green-50',
};

const monthlyData = [
  { mes: 'Jan', documentos: 45, concluidos: 32 },
  { mes: 'Fev', documentos: 52, concluidos: 41 },
  { mes: 'Mar', documentos: 48, concluidos: 38 },
  { mes: 'Abr', documentos: 61, concluidos: 50 },
  { mes: 'Mai', documentos: 55, concluidos: 44 },
  { mes: 'Jun', documentos: 67, concluidos: 52 },
];

const areaData = [
  { name: 'Cível', value: 35, color: '#3b82f6' },
  { name: 'Criminal', value: 20, color: '#ef4444' },
  { name: 'Trabalho', value: 18, color: '#f59e0b' },
  { name: 'Família', value: 15, color: '#8b5cf6' },
  { name: 'Fazenda', value: 12, color: '#10b981' },
];

const weeklyData = [
  { dia: 'Seg', entradas: 8, saidas: 5 },
  { dia: 'Ter', entradas: 12, saidas: 9 },
  { dia: 'Qua', entradas: 6, saidas: 8 },
  { dia: 'Qui', entradas: 10, saidas: 7 },
  { dia: 'Sex', entradas: 14, saidas: 11 },
];

const activityIcons: Record<string, string> = {
  criacao: '📄',
  atualizacao: '🔄',
  anexo: '📎',
  movimentacao: '📋',
  despacho: '⚖️',
};

// Simple SVG Chart Components
function AreaChart({ data }: { data: typeof monthlyData }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.documentos, d.concluidos)));
  const width = 100;
  const height = 40;
  const padding = 2;

  const createPath = (key: 'documentos' | 'concluidos') => {
    const points = data.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((d[key] / maxVal) * (height - 2 * padding));
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="w-full h-64 relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${createPath('documentos')} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`} fill="url(#blueGrad)" />
        <path d={createPath('documentos')} fill="none" stroke="#3b82f6" strokeWidth="0.5" />
        <path d={`${createPath('concluidos')} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`} fill="url(#greenGrad)" />
        <path d={createPath('concluidos')} fill="none" stroke="#22c55e" strokeWidth="0.5" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-500">
        {data.map(d => <span key={d.mes}>{d.mes}</span>)}
      </div>
    </div>
  );
}

function PieChart({ data }: { data: typeof areaData }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  const paths = data.map(d => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;

    const x1 = 50 + 35 * Math.cos(startRad);
    const y1 = 50 + 35 * Math.sin(startRad);
    const x2 = 50 + 35 * Math.cos(endRad);
    const y2 = 50 + 35 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`;
  });

  return (
    <div className="w-full h-48 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full max-w-[200px]">
        {paths.map((path, i) => (
          <path key={i} d={path} fill={data[i].color} stroke="white" strokeWidth="0.5" />
        ))}
        <circle cx="50" cy="50" r="20" fill="white" />
      </svg>
    </div>
  );
}

function BarChart({ data }: { data: typeof weeklyData }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.entradas, d.saidas)));
  const barWidth = 12;
  const gap = 4;

  return (
    <div className="w-full h-48 flex items-end justify-around px-4 gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-end gap-1 h-32">
            <div
              className="bg-blue-500 rounded-t w-3 transition-all"
              style={{ height: `${(d.entradas / maxVal) * 100}%` }}
            />
            <div
              className="bg-green-500 rounded-t w-3 transition-all"
              style={{ height: `${(d.saidas / maxVal) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{d.dia}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const totalDocs = mockDocuments.length;
  const emAndamento = mockDocuments.filter(d => d.status === 'em_andamento').length;
  const concluidos = mockDocuments.filter(d => d.status === 'concluso').length;
  const urgentes = mockDocuments.filter(d => d.prioridade === 'urgente').length;

  const stats = [
    { label: 'Total de Documentos', value: totalDocs, icon: FileText, color: 'from-blue-500 to-blue-600', change: '+12%', up: true },
    { label: 'Em Andamento', value: emAndamento, icon: Clock, color: 'from-amber-500 to-orange-500', change: '+5%', up: true },
    { label: 'Concluídos', value: concluidos, icon: CheckCircle2, color: 'from-green-500 to-emerald-600', change: '+18%', up: true },
    { label: 'Urgentes', value: urgentes, icon: AlertTriangle, color: 'from-red-500 to-rose-600', change: '-3%', up: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel de Controle</h1>
          <p className="text-gray-500 text-sm mt-1">Visão geral do sistema de gestão documental</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.up ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Evolução Mensal</h3>
              <p className="text-sm text-gray-500">Documentos criados vs concluídos</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500" /> Criados</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500" /> Concluídos</span>
            </div>
          </div>
          <AreaChart data={monthlyData} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Distribuição por Área</h3>
          <p className="text-sm text-gray-500 mb-4">Processos por área de atuação</p>
          <PieChart data={areaData} />
          <div className="grid grid-cols-2 gap-2 mt-2">
            {areaData.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600">{item.name}</span>
                <span className="ml-auto font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Atividade Semanal</h3>
          <p className="text-sm text-gray-500 mb-4">Entradas e saídas desta semana</p>
          <BarChart data={weeklyData} />
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Documentos Recentes</h3>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {mockDocuments.slice(0, 5).map(doc => (
              <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[doc.status]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.titulo}</p>
                  <p className="text-xs text-gray-500">{doc.numero}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[doc.prioridade]}`}>
                  {doc.prioridade}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Atividades Recentes</h3>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {mockActivities.slice(0, 6).map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <span className="text-base mt-0.5">{activityIcons[activity.tipo]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">{activity.acao}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.usuario}</p>
                  <p className="text-xs text-gray-400">{activity.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
