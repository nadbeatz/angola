import { useState, useEffect } from 'react';
import { User } from '../types';
import { getUsers, createUser, updateUser, deleteUser } from '../auth';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Shield,
  X,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
  Key,
  Mail
} from 'lucide-react';

export default function GestaoUtilizadores() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPerfil, setFilterPerfil] = useState('todos');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nome: '',
    perfil: 'user' as 'admin' | 'super_user' | 'user',
    areas: [] as string[]
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const allAreas = [
    { id: 'dashboard', label: 'Painel', icon: '📊' },
    { id: 'registo-nascimento', label: 'Registo de Nascimento', icon: '👶' },
    { id: 'emissao-bi', label: 'Emissão do BI', icon: '🆔' },
    { id: 'registo-criminal', label: 'Registo Criminal', icon: '🛡️' },
    { id: 'cartorio-notarial', label: 'Cartório Notarial', icon: '📝' },
    { id: 'registo-automovel', label: 'Registo Automóvel', icon: '🚗' },
    { id: 'cofre-geral', label: 'Cofre Geral', icon: '💰' },
    { id: 'delegacoes', label: 'Delegações Provinciais', icon: '📍' },
    { id: 'gestao-documental', label: 'Gestão Documental', icon: '📁' },
    { id: 'gestao-utilizadores', label: 'Gestão de Utilizadores', icon: '👥' }
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.nome.trim()) errors.nome = 'Nome é obrigatório';
    if (!formData.username.trim()) errors.username = 'Username é obrigatório';
    else if (formData.username.length < 3) errors.username = 'Username deve ter pelo menos 3 caracteres';
    if (!formData.email.trim()) errors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email inválido';
    
    if (!editingUser) {
      if (!formData.password) errors.password = 'Password é obrigatória';
      else if (formData.password.length < 6) errors.password = 'Password deve ter pelo menos 6 caracteres';
    }
    
    if (formData.perfil !== 'admin' && formData.areas.length === 0) {
      errors.areas = 'Selecione pelo menos uma área de acesso';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingUser) {
      const updates: Partial<User> = {
        username: formData.username,
        email: formData.email,
        nome: formData.nome,
        perfil: formData.perfil,
        areas: formData.perfil === 'admin' ? ['todos'] : formData.areas
      };
      if (formData.password) updates.password = formData.password;
      updateUser(editingUser.id, updates);
    } else {
      createUser({
        ...formData,
        areas: formData.perfil === 'admin' ? ['todos'] : formData.areas
      });
    }
    
    setUsers(getUsers());
    setShowForm(false);
    setEditingUser(null);
    setFormData({ username: '', email: '', password: '', nome: '', perfil: 'user', areas: [] });
    setFormErrors({});
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      nome: user.nome,
      perfil: user.perfil,
      areas: user.areas
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteUser(id);
    setUsers(getUsers());
    setShowDeleteConfirm(null);
  };

  const toggleArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area]
    }));
    if (formErrors.areas) setFormErrors({...formErrors, areas: ''});
  };

  const selectAllAreas = () => {
    setFormData(prev => ({
      ...prev,
      areas: allAreas.map(a => a.id)
    }));
    if (formErrors.areas) setFormErrors({...formErrors, areas: ''});
  };

  const clearAllAreas = () => {
    setFormData(prev => ({ ...prev, areas: [] }));
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPerfil = filterPerfil === 'todos' || u.perfil === filterPerfil;
    return matchSearch && matchPerfil;
  });

  const perfilColors: Record<string, string> = {
    admin: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    super_user: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    user: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
  };

  const perfilLabels: Record<string, string> = {
    admin: 'Administrador',
    super_user: 'Super Utilizador',
    user: 'Utilizador'
  };

  const perfilIcons: Record<string, React.ReactNode> = {
    admin: <Shield className="w-4 h-4" />,
    super_user: <UserCheck className="w-4 h-4" />,
    user: <Users className="w-4 h-4" />
  };

  const stats = {
    total: users.length,
    admin: users.filter(u => u.perfil === 'admin').length,
    superUser: users.filter(u => u.perfil === 'super_user').length,
    user: users.filter(u => u.perfil === 'user').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Utilizadores</h1>
          <p className="text-sm text-gray-500 mt-1">Gerir acessos e permissões do sistema</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({ username: '', email: '', password: '', nome: '', perfil: 'user', areas: [] });
            setFormErrors({});
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#800706] to-[#5a0504] hover:from-[#5a0504] hover:to-[#800706] text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Novo Utilizador
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.admin}</p>
              <p className="text-sm text-gray-500">Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.superUser}</p>
              <p className="text-sm text-gray-500">Super Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.user}</p>
              <p className="text-sm text-gray-500">Utilizadores</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingUser ? 'Editar Utilizador' : 'Novo Utilizador'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {editingUser ? 'Actualizar informações do utilizador' : 'Criar novo utilizador no sistema'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                  setFormErrors({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#800706]" />
                  Informações Básicas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={e => {
                        setFormData({...formData, nome: e.target.value});
                        if (formErrors.nome) setFormErrors({...formErrors, nome: ''});
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        formErrors.nome 
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                          : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                      }`}
                      placeholder="Nome completo"
                    />
                    {formErrors.nome && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.nome}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={e => {
                        setFormData({...formData, username: e.target.value.toLowerCase()});
                        if (formErrors.username) setFormErrors({...formErrors, username: ''});
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        formErrors.username 
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                          : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                      }`}
                      placeholder="utilizador"
                    />
                    {formErrors.username && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.username}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => {
                        setFormData({...formData, email: e.target.value});
                        if (formErrors.email) setFormErrors({...formErrors, email: ''});
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        formErrors.email 
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                          : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                      }`}
                      placeholder="email@mjdh.gov.ao"
                    />
                    {formErrors.email && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Key className="w-4 h-4" />
                      Password {editingUser && '(deixe vazio para manter)'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => {
                        setFormData({...formData, password: e.target.value});
                        if (formErrors.password) setFormErrors({...formErrors, password: ''});
                      }}
                      required={!editingUser}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        formErrors.password 
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                          : 'border-gray-200 focus:ring-[#800706]/20 focus:border-[#800706]'
                      }`}
                      placeholder="••••••••"
                    />
                    {formErrors.password && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Perfil */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#800706]" />
                  Perfil de Acesso
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'user', label: 'Utilizador', desc: 'Acesso básico' },
                    { value: 'super_user', label: 'Super Utilizador', desc: 'Acesso avançado' },
                    { value: 'admin', label: 'Administrador', desc: 'Acesso total' }
                  ].map(perfil => (
                    <button
                      key={perfil.value}
                      type="button"
                      onClick={() => setFormData({...formData, perfil: perfil.value as any})}
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        formData.perfil === perfil.value
                          ? 'border-[#800706] bg-[#800706]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">{perfil.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{perfil.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Areas */}
              {formData.perfil !== 'admin' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#800706]" />
                      Áreas de Acesso *
                    </h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={selectAllAreas}
                        className="text-xs text-[#800706] hover:text-[#5a0504] font-medium"
                      >
                        Selecionar todas
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={clearAllAreas}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allAreas.map(area => (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => toggleArea(area.id)}
                        className={`flex items-center gap-3 p-4 border-2 rounded-xl text-left transition-all ${
                          formData.areas.includes(area.id)
                            ? 'border-[#800706] bg-[#800706]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{area.icon}</span>
                        <span className="text-sm font-medium text-gray-900">{area.label}</span>
                        {formData.areas.includes(area.id) && (
                          <CheckCircle className="w-5 h-5 text-[#800706] ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                  {formErrors.areas && (
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.areas}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                    setFormErrors({});
                  }}
                  className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#800706] to-[#5a0504] hover:from-[#5a0504] hover:to-[#800706] text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  {editingUser ? 'Actualizar Utilizador' : 'Criar Utilizador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserX className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar Eliminação</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja eliminar este utilizador? Esta acção não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome, username ou email..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706] transition-all"
            />
          </div>
          <div className="flex gap-2">
            {['todos', 'admin', 'super_user', 'user'].map(perfil => (
              <button
                key={perfil}
                onClick={() => setFilterPerfil(perfil)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  filterPerfil === perfil
                    ? 'bg-[#800706] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {perfil === 'todos' ? 'Todos' : perfilLabels[perfil]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilizador</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Áreas</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#800706] to-[#5a0504] rounded-full flex items-center justify-center text-white font-bold">
                        {user.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.nome}</p>
                        <p className="text-xs text-gray-500 font-mono">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${perfilColors[user.perfil]}`}>
                      {perfilIcons[user.perfil]}
                      {perfilLabels[user.perfil]}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {user.areas.includes('todos') ? (
                        <span className="text-xs text-gray-500">Acesso total</span>
                      ) : (
                        <>
                          {user.areas.slice(0, 3).map(area => (
                            <span key={area} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {allAreas.find(a => a.id === area)?.label.split(' ')[0]}
                            </span>
                          ))}
                          {user.areas.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{user.areas.length - 3}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.username !== 'admin' && (
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
