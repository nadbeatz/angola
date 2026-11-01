export type DocumentStatus = 'em_andamento' | 'concluso' | 'arquivado' | 'aguardando' | 'despachado';
export type DocumentType = 'peticao' | 'sentenca' | 'despacho' | 'certidao' | 'ata' | 'oficio' | 'parecer' | 'recurso';
export type Priority = 'baixa' | 'media' | 'alta' | 'urgente';
export type CourtType = 'civil' | 'criminal' | 'trabalho' | 'familia' | 'fazenda';

export interface Document {
  id: string;
  numero: string;
  titulo: string;
  tipo: DocumentType;
  status: DocumentStatus;
  prioridade: Priority;
  vara: string;
  comarca: string;
  area: CourtType;
  partes: string[];
  descricao: string;
  dataCriacao: string;
  dataAtualizacao: string;
  responsavel: string;
  anexos: number;
  observacoes: string;
}

export interface DashboardStats {
  totalDocumentos: number;
  emAndamento: number;
  concluidos: number;
  urgentes: number;
  novosHoje: number;
  prazoVencendo: number;
}

export interface ActivityLog {
  id: string;
  acao: string;
  documento: string;
  usuario: string;
  data: string;
  tipo: 'criacao' | 'atualizacao' | 'anexo' | 'movimentacao' | 'despacho';
}
