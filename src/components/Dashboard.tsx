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
  FileText
} from 'lucide-react';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const stats = [
    { label: 'Total de Processos', value: '1.746', icon: FileText, color: 'bg-blue-500', change: '+12%' },
    { label: 'Delegações Activas', value: '21', icon: MapPin, color: 'bg-green-500', change: '+4' },
    { label: 'Funcionários', value: '337', icon: Users, color: 'bg-purple-500', change: '+8%' },
    { label: 'Processos Hoje', value: '47', icon: TrendingUp, color: 'bg-orange-500', change: '+15%' },
  ];

  const modules = [
    { id: 'registo-nascimento', label: 'Registo de Nascimento', icon: Baby, count: 234, color: 'from-blue-500 to-blue-600' },
    { id: 'emissao-bi', label: 'Emissão do BI', icon: CreditCard, count: 456, color: 'from-green-500 to-green-600' },
    { id: 'registo-criminal', label: 'Registo Criminal', icon: Shield, count: 189, color: 'from-red-500 to-red-600' },
    { id: 'cartorio-notarial', label: 'Cartório Notarial', icon: FileSignature, count: 312, color: 'from-purple-500 to-purple-600' },
    { id: 'registo-automovel', label: 'Registo Automóvel', icon: Car, count: 278, color: 'from-orange-500 to-orange-600' },
    { id: 'cofre-geral', label: 'Cofre Geral de Justiça', icon: Landmark, count: 277, color: 'from-yellow-500 to-yellow-600' },
  ];

  const recentActivity = [
    { type: 'Registo de Nascimento', person: 'Maria da Silva', time: 'Há 5 minutos', status: 'Concluído' },
    { type: 'Emissão de BI', person: 'João Santos', time: 'Há 12 minutos', status: 'Em análise' },
    { type: 'Registo Criminal', person: 'Ana Ferreira', time: 'Há 25 minutos', status: 'Concluído' },
    { type: 'Cartório Notarial', person: 'Pedro Costa', time: 'Há 1 hora', status: 'Pendente' },
    { type: 'Registo Automóvel', person: 'Luanda Motors', time: 'Há 2 horas', status: 'Concluído' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#800706] to-[#5a0504] rounded-2xl p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold">Bem-vindo, {user.nome}</h1>
        <p className="text-white/80 mt-1">
          {user.perfil === 'admin' ? 'Administrador do Sistema' : 'Utilizador'} • Ministério da Justiça e dos Direitos Humanos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Módulos do Sistema</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map(mod => (
            <div key={mod.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-4`}>
                <mod.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">{mod.label}</h3>
              <p className="text-sm text-gray-500 mt-1">{mod.count} processos activos</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Actividade Recente</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivity.map((activity, i) => (
            <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-500">{activity.person}</p>
                </div>
                <div className="text-right">
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
