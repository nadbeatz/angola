import { useState } from 'react';
import { User } from '../types';
import { delegacoes } from '../data';
import { 
  Baby, 
  CreditCard, 
  Shield, 
  FileSignature, 
  Car, 
  Landmark, 
  MapPin,
  TrendingUp,
  Users,
  FileText,
  Bell,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [showNotifications, setShowNotifications] = useState(false);

  const stats = [
    { label: 'Total de Processos', value: '1.746', icon: FileText, color: 'from-blue-500 to-blue-600', change: '+12%', trend: 'up' },
    { label: 'Delegações Activas', value: '21', icon: MapPin, color: 'from-green-500 to-green-600', change: '+4', trend: 'up' },
    { label: 'Funcionários', value: '337', icon: Users, color: 'from-purple-500 to-purple-600', change: '+8%', trend: 'up' },
    { label: 'Processos Hoje', value: '47', icon: TrendingUp, color: 'from-orange-500 to-orange-600', change: '+15%', trend: 'up' },
  ];

  const modules = [
    { id: 'registo-nascimento', label: 'Registo de Nascimento', icon: Baby, count: 234, color: 'from-blue-500 to-blue-600', progress: 78 },
    { id: 'emissao-bi', label: 'Emissão do BI', icon: CreditCard, count: 456, color: 'from-green-500 to-green-600', progress: 92 },
    { id: 'registo-criminal', label: 'Registo Criminal', icon: Shield, count: 189, color: 'from-red-500 to-red-600', progress: 65 },
    { id: 'cartorio-notarial', label: 'Cartório Notarial', icon: FileSignature, count: 312, color: 'from-purple-500 to-purple-600', progress: 85 },
    { id: 'registo-automovel', label: 'Registo Automóvel', icon: Car, count: 278, color: 'from-orange-500 to-orange-600', progress: 71 },
    { id: 'cofre-geral', label: 'Cofre Geral de Justiça', icon: Landmark, count: 277, color: 'from-yellow-500 to-yellow-600', progress: 88 },
  ];

  const recentActivity = [
    { type: 'Registo de Nascimento', person: 'Maria da Silva', time: 'Há 5 minutos', status: 'Concluído', icon: Baby },
    { type: 'Emissão de BI', person: 'João Santos', time: 'Há 12 minutos', status: 'Em análise', icon: CreditCard },
    { type: 'Registo Criminal', person: 'Ana Ferreira', time: 'Há 25 minutos', status: 'Concluído', icon: Shield },
    { type: 'Cartório Notarial', person: 'Pedro Costa', time: 'Há 1 hora', status: 'Pendente', icon: FileSignature },
    { type: 'Registo Automóvel', person: 'Luanda Motors', time: 'Há 2 horas', status: 'Concluído', icon: Car },
  ];

  const notifications = [
    { id: 1, title: 'Novo processo pendente', message: 'Registo de nascimento aguardando aprovação', time: 'Há 5 min', type: 'warning', read: false },
    { id: 2, title: 'Processo concluído', message: 'BI emitido com sucesso para João Santos', time: 'Há 12 min', type: 'success', read: false },
    { id: 3, title: 'Prazo a vencer', message: '3 processos com prazo vencendo amanhã', time: 'Há 1 hora', type: 'error', read: false },
    { id: 4, title: 'Novo funcionário', message: 'Maria Silva foi adicionada ao DRH', time: 'Há 2 horas', type: 'info', read: true },
  ];

  const chartData = [
    { mes: 'Jan', processos: 120, concluidos: 95 },
    { mes: 'Fev', processos: 145, concluidos: 118 },
    { mes: 'Mar', processos: 168, concluidos: 142 },
    { mes: 'Abr', processos: 192, concluidos: 165 },
    { mes: 'Mai', processos: 215, concluidos: 189 },
    { mes: 'Jun', processos: 238, concluidos: 212 },
  ];

  const maxProcessos = Math.max(...chartData.map(d => d.processos));

  return (
    <div className="space-y-6">
      {/* Header with Notifications */}
      <div className="bg-gradient-to-r from-[#800706] to-[#5a0504] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Bem-vindo, {user.nome}</h1>
            <p className="text-white/80 mt-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleDateString('pt-AO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                {notifications.filter(n => !n.read).length}
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notif.type === 'success' ? 'bg-green-500' :
                          notif.type === 'warning' ? 'bg-yellow-500' :
                          notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
                stat.trend === 'up' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
              }`}>
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Evolução de Processos</h2>
            <p className="text-sm text-gray-500 mt-1">Últimos 6 meses</p>
          </div>
          <div className="flex gap-2">
            {['semana', 'mes', 'ano'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-[#800706] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-64 flex items-end justify-around gap-2 px-4">
          {chartData.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col gap-1 items-center" style={{ height: '200px' }}>
                <div className="w-full flex gap-1 items-end h-full">
                  <div
                    className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(data.processos / maxProcessos) * 100}%` }}
                    title={`${data.processos} processos`}
                  />
                  <div
                    className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(data.concluidos / maxProcessos) * 100}%` }}
                    title={`${data.concluidos} concluídos`}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">{data.mes}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded" />
            Processos Criados
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded" />
            Processos Concluídos
          </span>
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Módulos do Sistema</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map(mod => (
            <div key={mod.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <mod.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">{mod.label}</h3>
              <p className="text-sm text-gray-500 mt-1">{mod.count} processos activos</p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progresso</span>
                  <span className="font-semibold">{mod.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${mod.color} transition-all`}
                    style={{ width: `${mod.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Actividade Recente</h2>
          <button className="text-sm text-[#800706] hover:text-[#5a0504] font-medium">
            Ver tudo
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivity.map((activity, i) => (
            <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <activity.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-500">{activity.person}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`
                    inline-block px-3 py-1 rounded-full text-xs font-medium
                    ${activity.status === 'Concluído' ? 'bg-green-100 text-green-700' : 
                      activity.status === 'Em análise' ? 'bg-blue-100 text-blue-700' : 
                      'bg-yellow-100 text-yellow-700'}
                  `}>
                    {activity.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
