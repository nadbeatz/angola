import { useState, useEffect } from 'react';
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
  TrendingDown,
  Users,
  FileText,
  Bell,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Activity,
  Zap,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Eye,
  Download,
  Filter,
  RefreshCw,
  Settings
} from 'lucide-react';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [showNotifications, setShowNotifications] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    processos: 0,
    delegacoes: 0,
    funcionarios: 0,
    hoje: 0
  });

  // Animação de contagem
  useEffect(() => {
    const targets = { processos: 1746, delegacoes: 21, funcionarios: 337, hoje: 47 };
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setAnimatedValues({
        processos: Math.round(targets.processos * progress),
        delegacoes: Math.round(targets.delegacoes * progress),
        funcionarios: Math.round(targets.funcionarios * progress),
        hoje: Math.round(targets.hoje * progress)
      });
      
      if (currentStep >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { 
      label: 'Total de Processos', 
      value: animatedValues.processos, 
      icon: FileText, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12.5%', 
      trend: 'up' as const,
      sparkline: [30, 45, 38, 52, 48, 61, 55, 67]
    },
    { 
      label: 'Delegações Activas', 
      value: animatedValues.delegacoes, 
      icon: MapPin, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      change: '+4 novas', 
      trend: 'up' as const,
      sparkline: [15, 16, 17, 18, 19, 20, 21, 21]
    },
    { 
      label: 'Funcionários', 
      value: animatedValues.funcionarios, 
      icon: Users, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      change: '+8.3%', 
      trend: 'up' as const,
      sparkline: [280, 295, 305, 312, 320, 328, 333, 337]
    },
    { 
      label: 'Processos Hoje', 
      value: animatedValues.hoje, 
      icon: Activity, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      change: '+15.2%', 
      trend: 'up' as const,
      sparkline: [25, 32, 28, 38, 35, 42, 40, 47]
    },
  ];

  const modules = [
    { id: 'registo-nascimento', label: 'Registo de Nascimento', icon: Baby, count: 234, color: 'from-blue-500 to-blue-600', progress: 78, trend: '+12%' },
    { id: 'emissao-bi', label: 'Emissão do BI', icon: CreditCard, count: 456, color: 'from-green-500 to-green-600', progress: 92, trend: '+18%' },
    { id: 'registo-criminal', label: 'Registo Criminal', icon: Shield, count: 189, color: 'from-red-500 to-red-600', progress: 65, trend: '+5%' },
    { id: 'cartorio-notarial', label: 'Cartório Notarial', icon: FileSignature, count: 312, color: 'from-purple-500 to-purple-600', progress: 85, trend: '+15%' },
    { id: 'registo-automovel', label: 'Registo Automóvel', icon: Car, count: 278, color: 'from-orange-500 to-orange-600', progress: 71, trend: '+9%' },
    { id: 'cofre-geral', label: 'Cofre Geral de Justiça', icon: Landmark, count: 277, color: 'from-yellow-500 to-yellow-600', progress: 88, trend: '+22%' },
  ];

  const recentActivity = [
    { type: 'Registo de Nascimento', person: 'Maria da Silva', time: 'Há 5 minutos', status: 'Concluído', icon: Baby, color: 'bg-blue-500' },
    { type: 'Emissão de BI', person: 'João Santos', time: 'Há 12 minutos', status: 'Em análise', icon: CreditCard, color: 'bg-green-500' },
    { type: 'Registo Criminal', person: 'Ana Ferreira', time: 'Há 25 minutos', status: 'Concluído', icon: Shield, color: 'bg-red-500' },
    { type: 'Cartório Notarial', person: 'Pedro Costa', time: 'Há 1 hora', status: 'Pendente', icon: FileSignature, color: 'bg-purple-500' },
    { type: 'Registo Automóvel', person: 'Luanda Motors', time: 'Há 2 horas', status: 'Concluído', icon: Car, color: 'bg-orange-500' },
    { type: 'Cofre Geral', person: 'Tribunal Provincial', time: 'Há 3 horas', status: 'Em análise', icon: Landmark, color: 'bg-yellow-500' },
  ];

  const notifications = [
    { id: 1, title: 'Novo processo pendente', message: 'Registo de nascimento aguardando aprovação', time: 'Há 5 min', type: 'warning', read: false, icon: AlertCircle },
    { id: 2, title: 'Processo concluído', message: 'BI emitido com sucesso para João Santos', time: 'Há 12 min', type: 'success', read: false, icon: CheckCircle2 },
    { id: 3, title: 'Prazo a vencer', message: '3 processos com prazo vencendo amanhã', time: 'Há 1 hora', type: 'error', read: false, icon: AlertCircle },
    { id: 4, title: 'Novo funcionário', message: 'Maria Silva foi adicionada ao DRH', time: 'Há 2 horas', type: 'info', read: true, icon: Users },
    { id: 5, title: 'Atualização do sistema', message: 'Nova versão disponível: v2.5.0', time: 'Há 5 horas', type: 'info', read: true, icon: Zap },
  ];

  const chartData = [
    { mes: 'Jan', processos: 120, concluidos: 95, receita: 450 },
    { mes: 'Fev', processos: 145, concluidos: 118, receita: 520 },
    { mes: 'Mar', processos: 168, concluidos: 142, receita: 610 },
    { mes: 'Abr', processos: 192, concluidos: 165, receita: 695 },
    { mes: 'Mai', processos: 215, concluidos: 189, receita: 780 },
    { mes: 'Jun', processos: 238, concluidos: 212, receita: 865 },
  ];

  const maxProcessos = Math.max(...chartData.map(d => d.processos));

  const topProvincias = [
    { nome: 'Luanda', processos: 245, percentage: 100 },
    { nome: 'Huambo', processos: 156, percentage: 64 },
    { nome: 'Benguela', processos: 145, percentage: 59 },
    { nome: 'Huíla', processos: 134, percentage: 55 },
    { nome: 'Bié', processos: 98, percentage: 40 },
  ];

  const performanceMetrics = [
    { label: 'Taxa de Conclusão', value: 89, target: 85, color: 'from-green-500 to-emerald-500' },
    { label: 'Tempo Médio (dias)', value: 3.2, target: 5, color: 'from-blue-500 to-cyan-500' },
    { label: 'Satisfação', value: 94, target: 90, color: 'from-purple-500 to-pink-500' },
    { label: 'Eficiência', value: 92, target: 88, color: 'from-orange-500 to-red-500' },
  ];

  const quickActions = [
    { label: 'Novo Processo', icon: FileText, color: 'bg-blue-500' },
    { label: 'Emitir BI', icon: CreditCard, color: 'bg-green-500' },
    { label: 'Registo Criminal', icon: Shield, color: 'bg-red-500' },
    { label: 'Relatórios', icon: BarChart3, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Notifications */}
      <div className="bg-gradient-to-r from-[#800706] via-[#5a0504] to-[#800706] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                {new Date().toLocaleDateString('pt-AO', { weekday: 'long' })}
              </span>
              <span className="text-white/60 text-sm">
                {new Date().toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Bem-vindo, {user.nome.split(' ')[0]}! 👋
            </h1>
            <p className="text-white/80 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })} • 
              <span className="ml-1">{user.perfil === 'admin' ? 'Administrador' : 'Utilizador'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm hover:scale-105">
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm hover:scale-105"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
                  {notifications.filter(n => !n.read).length}
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-fadeIn overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Notificações</h3>
                      <button className="text-xs text-[#800706] hover:text-[#5a0504] font-semibold">
                        Marcar todas como lidas
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notif.type === 'success' ? 'bg-green-100' :
                            notif.type === 'warning' ? 'bg-yellow-100' :
                            notif.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            <notif.icon className={`w-5 h-5 ${
                              notif.type === 'success' ? 'text-green-600' :
                              notif.type === 'warning' ? 'text-yellow-600' :
                              notif.type === 'error' ? 'text-red-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notif.time}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-[#800706] hover:text-[#5a0504] font-semibold py-2">
                      Ver todas as notificações
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full ${
                stat.trend === 'up' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-4xl font-bold text-gray-900 mb-1">{stat.value.toLocaleString('pt-AO')}</p>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
            {/* Sparkline */}
            <div className="h-12 flex items-end gap-1">
              {stat.sparkline.map((value, idx) => {
                const max = Math.max(...stat.sparkline);
                const height = (value / max) * 100;
                return (
                  <div
                    key={idx}
                    className={`flex-1 bg-gradient-to-t ${stat.color} rounded-t opacity-60 hover:opacity-100 transition-all`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#800706]" />
              Evolução de Processos
            </h2>
            <p className="text-sm text-gray-500 mt-1">Últimos 6 meses</p>
          </div>
          <div className="flex gap-2">
            {['semana', 'mes', 'ano'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedPeriod === period
                    ? 'bg-[#800706] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Bar Chart */}
        <div className="h-72 flex items-end justify-around gap-3 px-4 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="border-t border-gray-100 w-full" />
            ))}
          </div>
          
          {chartData.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 relative z-10">
              <div className="w-full flex flex-col gap-1 items-center" style={{ height: '240px' }}>
                <div className="w-full flex gap-1.5 items-end h-full group">
                  <div
                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative"
                    style={{ height: `${(data.processos / maxProcessos) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.processos} processos
                    </div>
                  </div>
                  <div
                    className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative"
                    style={{ height: `${(data.concluidos / maxProcessos) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.concluidos} concluídos
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-600 font-semibold">{data.mes}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-8 mt-6 pt-4 border-t border-gray-100">
          <span className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded" />
            <span className="text-gray-600 font-medium">Processos Criados</span>
          </span>
          <span className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 bg-gradient-to-t from-green-600 to-green-400 rounded" />
            <span className="text-gray-600 font-medium">Processos Concluídos</span>
          </span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">{metric.label}</p>
              <Target className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-500 mb-1">/ {metric.target}</p>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right">
                {Math.round((metric.value / metric.target) * 100)}% da meta
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Módulos do Sistema</h2>
          <button className="text-sm text-[#800706] hover:text-[#5a0504] font-semibold flex items-center gap-1">
            Ver todos
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map(mod => (
            <div key={mod.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  <mod.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {mod.trend}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{mod.label}</h3>
              <p className="text-sm text-gray-500 mb-3">{mod.count} processos activos</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Progresso mensal</span>
                  <span className="font-bold text-gray-900">{mod.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${mod.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${mod.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#800706]" />
              Actividade Recente
            </h2>
            <button className="text-sm text-[#800706] hover:text-[#5a0504] font-semibold">
              Ver tudo
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity, i) => (
              <div key={i} className="p-4 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${activity.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <activity.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-500">{activity.person}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`
                      inline-block px-3 py-1.5 rounded-full text-xs font-semibold
                      ${activity.status === 'Concluído' ? 'bg-green-100 text-green-700' : 
                        activity.status === 'Em análise' ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'}
                    `}>
                      {activity.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Provincias */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#800706]" />
              Top Províncias
            </h2>
            <p className="text-sm text-gray-500 mt-1">Por volume de processos</p>
          </div>
          <div className="p-5 space-y-4">
            {topProvincias.map((provincia, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                      i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                      i === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      'bg-gradient-to-br from-gray-400 to-gray-600'
                    }`}>
                      {i + 1}
                    </div>
                    <span className="font-semibold text-gray-900">{provincia.nome}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{provincia.processos}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#800706] to-[#5a0504] rounded-full transition-all duration-1000 group-hover:opacity-80"
                    style={{ width: `${provincia.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#800706]" />
          Acções Rápidas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#800706] hover:shadow-lg transition-all group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900 text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
