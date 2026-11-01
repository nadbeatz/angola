import { useState, useEffect } from 'react';
import { User } from '../types';
import { getUsers, createUser, updateUser, deleteUser } from '../auth';
import { Users, Plus, Edit, Trash2, Search, Shield } from 'lucide-react';

export default function GestaoUtilizadores() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nome: '',
    perfil: 'user' as 'admin' | 'super_user' | 'user',
    areas: [] as string[]
  });

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const allAreas = [
    'dashboard',
    'registo-nascimento',
    'emissao-bi',
    'registo-criminal',
    'cartorio-notarial',
    'registo-automovel',
    'cofre-geral',
    'delegacoes',
    'gestao-documental',
    'gestao-utilizadores'
  ];

  const areaLabels: Record<string, string> = {
    'dashboard': 'Painel',
    'registo-nascimento': 'Registo de Nascimento',
    'emissao-bi': 'Emissão do BI',
    'registo-criminal': 'Registo Criminal',
    'cartorio-notarial': 'Cartório Notarial',
    'registo-automovel': 'Registo Automóvel',
    'cofre-geral': 'Cofre Geral',
    'delegacoes': 'Delegações Provinciais',
    'gestao-documental': 'Gestão Documental',
    'gestao-utilizadores': 'Gestão de Utilizadores'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      createUser(formData);
    }
    setUsers(getUsers());
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      nome: '',
      perfil: 'user',
      areas: []
    });
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
    if (confirm('Tem certeza que deseja eliminar este utilizador?')) {
      deleteUser(id);
      setUsers(getUsers());
    }
  };

  const toggleArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area]
    }));
  };

  const filteredUsers = users.filter(u =>
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const perfilColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    super_user: 'bg-blue-100 text-blue-700',
    user: 'bg-gray-100 text-gray-700'
  };

  const perfilLabels: Record<string, string> = {
    admin: 'Administrador',
    super_user: 'Super Utilizador',
    user: 'Utilizador'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Utilizadores</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} utilizadores registados</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({ username: '', email: '', password: '', nome: '', perfil: 'user', areas: [] });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-[#800706] hover:bg-[#5a0504] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Utilizador
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingUser ? 'Editar Utilizador' : 'Novo Utilizador'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser && '(deixe vazio para manter)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                <select
                  value={formData.perfil}
                  onChange={e => setFormData({...formData, perfil: e.target.value as any})}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
                >
                  <option value="user">Utilizador</option>
                  <option value="super_user">Super Utilizador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            {/* Areas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Áreas de Acesso</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allAreas.map(area => (
                  <label key={area} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.areas.includes(area)}
                      onChange={() => toggleArea(area)}
                      className="w-4 h-4 text-[#800706] border-gray-300 rounded focus:ring-[#800706]"
                    />
                    <span className="text-sm text-gray-700">{areaLabels[area]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                }}
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#800706] hover:bg-[#5a0504] text-white rounded-lg font-medium transition-colors"
              >
                {editingUser ? 'Actualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome, username ou email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800706]/20 focus:border-[#800706]"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Username</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Perfil</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.nome}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{user.username}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${perfilColors[user.perfil]}`}>
                      {perfilLabels[user.perfil]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.username !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
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
