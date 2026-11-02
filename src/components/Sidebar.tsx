import { ModuloType, User } from '../types';
import { hasAccess } from '../auth';
import { 
  LayoutDashboard, 
  Baby, 
  CreditCard, 
  Shield, 
  FileSignature, 
  Car, 
  Landmark, 
  MapPin, 
  FolderOpen, 
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeModulo: ModuloType;
  onModuloChange: (modulo: ModuloType) => void;
  user: User;
  onLogout: () => void;
}

export default function Sidebar({ activeModulo, onModuloChange, user, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as ModuloType, label: 'Painel', icon: LayoutDashboard },
    { id: 'registo-nascimento' as ModuloType, label: 'Registo de Nascimento', icon: Baby },
    { id: 'emissao-bi' as ModuloType, label: 'Emissão do BI', icon: CreditCard },
    { id: 'registo-criminal' as ModuloType, label: 'Registo Criminal', icon: Shield },
    { id: 'cartorio-notarial' as ModuloType, label: 'Cartório Notarial', icon: FileSignature },
    { id: 'registo-automovel' as ModuloType, label: 'Registo Automóvel', icon: Car },
    { id: 'cofre-geral' as ModuloType, label: 'Cofre Geral de Justiça', icon: Landmark },
    { id: 'delegacoes' as ModuloType, label: 'Delegações Provinciais', icon: MapPin },
    { id: 'gestao-documental' as ModuloType, label: 'Gestão Documental', icon: FolderOpen },
    { id: 'gestao-utilizadores' as ModuloType, label: 'Gestão de Utilizadores', icon: Users },
  ];

  const filteredItems = menuItems.filter(item => hasAccess(user, item.id));

  const handleModuloChange = (modulo: ModuloType) => {
    onModuloChange(modulo);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#800706] text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-gradient-to-b from-[#800706] to-[#5a0504] text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img 
              src="https://med.gov.ao/themes/portalweb/assets/public/app-assets/img/simbolos/RepublicaAngola_InsigniaOficial.png" 
              alt="Insígnia" 
              className="w-12 h-12"
            />
            <div>
              <h1 className="font-bold text-lg leading-tight">MINJUDH</h1>
              <p className="text-xs text-white/70 leading-tight">Sistema Integrado</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {filteredItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleModuloChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                    ${activeModulo === item.id 
                      ? 'bg-white/20 text-white font-semibold' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{user.nome.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.nome}</p>
              <p className="text-xs text-white/60 truncate">{user.perfil === 'admin' ? 'Administrador' : 'Utilizador'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
