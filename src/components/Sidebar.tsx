import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Upload,
  Search,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Scale,
  LogOut,
  User,
  HelpCircle,
  CalendarDays
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'processes', label: 'Processos', icon: FolderOpen },
    { id: 'new-document', label: 'Novo Documento', icon: Upload },
    { id: 'calendar', label: 'Agenda', icon: CalendarDays },
    { id: 'search', label: 'Pesquisa', icon: Search },
  ];

  const bottomItems = [
    { id: 'notifications', label: 'Notificações', icon: Bell, badge: 3 },
    { id: 'help', label: 'Ajuda', icon: HelpCircle },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-[#1a237e] to-[#0d1642] text-white flex flex-col transition-all duration-300 relative min-h-screen`}>
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Scale className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg leading-tight">SGD</h1>
            <p className="text-xs text-blue-200 leading-tight">Gestão Documental</p>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {!collapsed && <p className="text-xs uppercase text-blue-300 font-semibold px-3 mb-3 tracking-wider">Menu Principal</p>}
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              activeView === item.id
                ? 'bg-white/15 text-white shadow-lg'
                : 'text-blue-200 hover:bg-white/8 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${activeView === item.id ? 'text-amber-400' : 'text-blue-300 group-hover:text-amber-400'}`} />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            {activeView === item.id && !collapsed && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="py-4 px-3 space-y-1 border-t border-white/10">
        {bottomItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
              activeView === item.id
                ? 'bg-white/15 text-white'
                : 'text-blue-200 hover:bg-white/8 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            {item.badge && (
              <span className={`${collapsed ? 'absolute top-1 right-1' : 'ml-auto'} bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Dr. Administrador</p>
              <p className="text-xs text-blue-300 truncate">Tribunal de Justiça</p>
            </div>
          )}
          {!collapsed && (
            <button className="text-blue-300 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
