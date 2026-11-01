import { useState, type ReactNode } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DocumentList from './components/DocumentList';
import DocumentDetail from './components/DocumentDetail';
import NewDocument from './components/NewDocument';
import { Document } from './types';
import {
  Calendar,
  Clock,
  FileText,
  Search,
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Scale
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleSelectDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setActiveView('document-detail');
  };

  const handleBack = () => {
    setSelectedDocument(null);
    setActiveView('documents');
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setSelectedDocument(null);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'documents':
      case 'processes':
        return <DocumentList onSelectDocument={handleSelectDocument} />;
      case 'document-detail':
        return selectedDocument ? (
          <DocumentDetail document={selectedDocument} onBack={handleBack} />
        ) : (
          <DocumentList onSelectDocument={handleSelectDocument} />
        );
      case 'new-document':
        return <NewDocument onCreated={() => handleViewChange('documents')} />;
      case 'search':
        return <SearchView />;
      case 'calendar':
        return <CalendarView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      case 'help':
        return <HelpView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={handleViewChange} />
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <Scale className="w-4 h-4 text-blue-600" />
                <span>Tribunal de Justiça</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-900 font-medium capitalize">
                  {activeView === 'document-detail' ? 'Detalhes do Documento' :
                   activeView === 'new-document' ? 'Novo Documento' :
                   activeView === 'documents' ? 'Documentos' :
                   activeView === 'processes' ? 'Processos' :
                   activeView === 'calendar' ? 'Agenda' :
                   activeView === 'search' ? 'Pesquisa Avançada' :
                   activeView === 'notifications' ? 'Notificações' :
                   activeView === 'settings' ? 'Configurações' :
                   activeView === 'help' ? 'Central de Ajuda' :
                   'Painel'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Busca rápida..."
                  className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Additional Views
function SearchView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pesquisa Avançada</h1>
        <p className="text-gray-500 text-sm mt-1">Busque documentos com filtros detalhados</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Número do Processo</label>
            <input type="text" placeholder="0000000-00.0000.8.26.0000" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nome da Parte</label>
            <input type="text" placeholder="Nome completo" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">CPF/CNPJ</label>
            <input type="text" placeholder="000.000.000-00" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Data Inicial</label>
            <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Data Final</label>
            <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Palavras-chave</label>
            <input type="text" placeholder="Termos para busca" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Limpar</button>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Pesquisar
          </button>
        </div>
      </div>
    </div>
  );
}

function CalendarView() {
  const events = [
    { time: '09:00', title: 'Audiência de Instrução', process: '0009012-34.2024', type: 'audiencia', color: 'blue' },
    { time: '10:30', title: 'Prazo para Contestação', process: '0001234-56.2024', type: 'prazo', color: 'red' },
    { time: '14:00', title: 'Julgamento de Recurso', process: '0006789-01.2024', type: 'julgamento', color: 'purple' },
    { time: '15:30', title: 'Reunião de Equipe', process: '', type: 'interno', color: 'green' },
    { time: '16:00', title: 'Prazo de Manifestação', process: '0007890-12.2024', type: 'prazo', color: 'red' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    green: 'bg-green-50 border-green-200 text-green-800',
  };

  const dotMap: Record<string, string> = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
        <p className="text-gray-500 text-sm mt-1">Compromissos e prazos do dia</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {events.map((event, i) => (
            <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
              <div className="text-sm font-mono text-gray-500 w-14">{event.time}</div>
              <div className={`w-2 h-2 rounded-full ${dotMap[event.color]}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                {event.process && <p className="text-xs text-gray-500 font-mono">{event.process}</p>}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colorMap[event.color]}`}>
                {event.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsView() {
  const notifications = [
    { id: 1, title: 'Novo prazo determinado', message: 'Prazo de 15 dias para manifestação no processo 0001234-56.2024', time: 'Há 30 minutos', read: false, type: 'warning' },
    { id: 2, title: 'Documento anexado', message: 'Petição inicial anexada ao processo 0005678-90.2024', time: 'Há 2 horas', read: false, type: 'info' },
    { id: 3, title: 'Audiência confirmada', message: 'Audiência de instrução confirmada para 15/04/2024', time: 'Há 3 horas', read: false, type: 'success' },
    { id: 4, title: 'Processo concluído', message: 'Sentença proferida no processo 0005678-90.2024', time: 'Há 5 horas', read: true, type: 'success' },
    { id: 5, title: 'Lembrete de prazo', message: 'Prazo vencendo em 2 dias para o processo 0007890-12.2024', time: 'Há 1 dia', read: true, type: 'warning' },
  ];

  const typeColors: Record<string, string> = {
    warning: 'bg-amber-100 text-amber-600',
    info: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
  };

  const typeIcons: Record<string, ReactNode> = {
    warning: <AlertTriangle className="w-4 h-4" />,
    info: <FileText className="w-4 h-4" />,
    success: <CheckCircle2 className="w-4 h-4" />,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
          <p className="text-gray-500 text-sm mt-1">3 notificações não lidas</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Marcar todas como lidas</button>
      </div>
      <div className="space-y-3">
        {notifications.map(notif => (
          <div key={notif.id} className={`bg-white rounded-xl border p-4 shadow-sm flex items-start gap-4 transition-all hover:shadow-md ${notif.read ? 'border-gray-100 opacity-70' : 'border-blue-100'}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[notif.type]}`}>
              {typeIcons[notif.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-900">{notif.title}</h4>
                {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>
              <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie as preferências do sistema</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-600" />
            Perfil do Usuário
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nome</label>
              <input type="text" defaultValue="Dr. Administrador" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input type="email" defaultValue="admin@tj.sp.gov.br" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Cargo</label>
              <input type="text" defaultValue="Servidor Judiciário" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            Notificações
          </h3>
          <div className="space-y-4">
            {['Notificar novos prazos', 'Alertas de documentos urgentes', 'Resumo diário por email', 'Notificar movimentações'].map((item, i) => (
              <label key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item}</span>
                <div className="relative">
                  <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpView() {
  const faqs = [
    { q: 'Como cadastrar um novo documento?', a: 'Acesse o menu "Novo Documento" no painel lateral, preencha as informações obrigatórias e clique em "Registrar Documento".' },
    { q: 'Como alterar o status de um processo?', a: 'Abra o documento desejado, clique em "Editar" e altere o campo de status na seção de informações principais.' },
    { q: 'Como adicionar anexos?', a: 'Na tela de novo documento, arraste os arquivos para a área de upload ou clique para selecionar. Formatos aceitos: PDF, DOC, DOCX, JPG, PNG.' },
    { q: 'Como pesquisar documentos?', a: 'Use a barra de busca rápida no topo ou acesse "Pesquisa Avançada" para filtros mais detalhados.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Central de Ajuda</h1>
        <p className="text-gray-500 text-sm mt-1">Perguntas frequentes e suporte</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {faqs.map((faq, i) => (
          <details key={i} className="group p-5">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Precisa de mais ajuda?</h3>
        <p className="text-sm text-blue-700">Entre em contato com o suporte técnico pelo ramal 1234 ou email: suporte@tj.sp.gov.br</p>
      </div>
    </div>
  );
}
