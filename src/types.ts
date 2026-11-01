// Tipos principais do sistema

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  nome: string;
  perfil: 'admin' | 'super_user' | 'user';
  areas: string[];
  criadoEm: string;
  ultimoAcesso: string;
}

export interface Processo {
  id: string;
  numero: string;
  tipo: string;
  requerente: string;
  bi_nif: string;
  estado: 'pendente' | 'em_analise' | 'aprovado' | 'concluido' | 'rejeitado';
  valor: number;
  dataCriacao: string;
  dataAtualizacao: string;
  provincia: string;
  observacoes: string;
}

export interface Funcionario {
  id: string;
  numeroAgente: string;
  nome: string;
  categoria: string;
  servico: string;
  provincia: string;
  dataInicio: string;
  contacto: string;
  email: string;
}

export interface Delegacao {
  id: string;
  provincia: string;
  capital: string;
  funcionarios: number;
  processos: number;
  nova: boolean;
}

export interface Emolumento {
  id: string;
  codigo: string;
  descricao: string;
  valor: number;
  dominio: string;
  isento: boolean;
}

export type ModuloType = 
  | 'dashboard'
  | 'registo-nascimento'
  | 'emissao-bi'
  | 'registo-criminal'
  | 'cartorio-notarial'
  | 'registo-automovel'
  | 'cofre-geral'
  | 'delegacoes'
  | 'gestao-documental'
  | 'gestao-utilizadores';
