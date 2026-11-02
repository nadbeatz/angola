import { User } from './types';
import { defaultUsers } from './data';

const STORAGE_KEY = 'mjdh_users';
const CURRENT_USER_KEY = 'mjdh_current_user';

// Inicializar utilizadores padrão se não existirem
export function initializeUsers(): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  }
}

// Obter todos os utilizadores
export function getUsers(): User[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    initializeUsers();
    return defaultUsers;
  }
  return JSON.parse(stored);
}

// Guardar utilizadores
export function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Login - aceita username ou email
export function login(usernameOrEmail: string, password: string): User | null {
  const users = getUsers();
  const input = usernameOrEmail.toLowerCase().trim();
  
  const user = users.find(u => 
    (u.username.toLowerCase() === input || u.email.toLowerCase() === input) && 
    u.password === password
  );
  
  if (user) {
    // Atualizar último acesso
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ultimoAcesso: new Date().toISOString() } : u
    );
    saveUsers(updatedUsers);
    
    // Guardar sessão
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  
  return null;
}

// Logout
export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Obter utilizador atual
export function getCurrentUser(): User | null {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
}

// Criar novo utilizador
export function createUser(user: Omit<User, 'id' | 'criadoEm' | 'ultimoAcesso'>): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    criadoEm: new Date().toISOString().split('T')[0],
    ultimoAcesso: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// Atualizar utilizador
export function updateUser(id: string, updates: Partial<User>): void {
  const users = getUsers();
  const updatedUsers = users.map(u => 
    u.id === id ? { ...u, ...updates } : u
  );
  saveUsers(updatedUsers);
}

// Eliminar utilizador
export function deleteUser(id: string): void {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  saveUsers(filtered);
}

// Verificar se utilizador tem acesso a uma área
export function hasAccess(user: User, area: string): boolean {
  if (user.perfil === 'admin') return true;
  return user.areas.includes('todos') || user.areas.includes(area);
}
