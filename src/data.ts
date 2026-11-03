import { Delegacao, Emolumento } from './types';

// 21 Províncias de Angola (incluindo as 4 novas de 2025)
export const delegacoes: Delegacao[] = [
  { id: '1', provincia: 'Bengo', capital: 'Caxito', funcionarios: 15, processos: 82, nova: false },
  { id: '2', provincia: 'Benguela', capital: 'Lobito', funcionarios: 22, processos: 145, nova: false },
  { id: '3', provincia: 'Bié', capital: 'Kuito', funcionarios: 18, processos: 98, nova: false },
  { id: '4', provincia: 'Cabinda', capital: 'Cabinda', funcionarios: 20, processos: 112, nova: false },
  { id: '5', provincia: 'Cuando', capital: 'Menongue', funcionarios: 14, processos: 67, nova: true },
  { id: '6', provincia: 'Cubango', capital: 'Cuito Cuanavale', funcionarios: 12, processos: 54, nova: true },
  { id: '7', provincia: 'Cuanza Norte', capital: 'Ndalatando', funcionarios: 16, processos: 89, nova: false },
  { id: '8', provincia: 'Cuanza Sul', capital: 'Sumbe', funcionarios: 17, processos: 94, nova: false },
  { id: '9', provincia: 'Cunene', capital: 'Ondjiva', funcionarios: 15, processos: 78, nova: false },
  { id: '10', provincia: 'Huambo', capital: 'Huambo', funcionarios: 24, processos: 156, nova: false },
  { id: '11', provincia: 'Huíla', capital: 'Lubango', funcionarios: 21, processos: 134, nova: false },
  { id: '12', provincia: 'Ícolo e Bengo', capital: 'Ícolo e Bengo', funcionarios: 13, processos: 61, nova: true },
  { id: '13', provincia: 'Luanda', capital: 'Luanda', funcionarios: 35, processos: 245, nova: false },
  { id: '14', provincia: 'Lunda Norte', capital: 'Dundo', funcionarios: 16, processos: 87, nova: false },
  { id: '15', provincia: 'Lunda Sul', capital: 'Saurimo', funcionarios: 15, processos: 82, nova: false },
  { id: '16', provincia: 'Malanje', capital: 'Malanje', funcionarios: 17, processos: 93, nova: false },
  { id: '17', provincia: 'Moxico', capital: 'Luena', funcionarios: 14, processos: 71, nova: false },
  { id: '18', provincia: 'Moxico Leste', capital: 'Caiundo', funcionarios: 12, processos: 58, nova: true },
  { id: '19', provincia: 'Namibe', capital: 'Moçâmedes', funcionarios: 16, processos: 85, nova: false },
  { id: '20', provincia: 'Uíge', capital: 'Uíge', funcionarios: 18, processos: 96, nova: false },
  { id: '21', provincia: 'Zaire', capital: 'Mbanza-Kongo', funcionarios: 15, processos: 79, nova: false }
];

// Tabela de emolumentos (Decretos 300/19 e 301/19)
export const emolumentos: Emolumento[] = [
  { id: '1', codigo: 'RC001', descricao: 'Registo de Nascimento', valor: 2500, dominio: 'registo-civil', isento: false },
  { id: '2', codigo: 'RC002', descricao: 'Registo de Casamento', valor: 5000, dominio: 'registo-civil', isento: false },
  { id: '3', codigo: 'RC003', descricao: 'Registo de Óbito', valor: 2500, dominio: 'registo-civil', isento: false },
  { id: '4', codigo: 'RC004', descricao: 'Certidão de Nascimento', valor: 1500, dominio: 'registo-civil', isento: false },
  { id: '5', codigo: 'IC001', descricao: 'Emissão de BI (1ª vez)', valor: 3500, dominio: 'identificacao', isento: false },
  { id: '6', codigo: 'IC002', descricao: 'Emissão de BI (2ª vez)', valor: 5000, dominio: 'identificacao', isento: false },
  { id: '7', codigo: 'IC003', descricao: 'Duplicado de BI', valor: 7500, dominio: 'identificacao', isento: false },
  { id: '8', codigo: 'RCR001', descricao: 'Certificado do Registo Criminal', valor: 3000, dominio: 'registo-criminal', isento: false },
  { id: '9', codigo: 'RCR002', descricao: 'Certificado para fins de emprego', valor: 2000, dominio: 'registo-criminal', isento: false },
  { id: '10', codigo: 'CN001', descricao: 'Escritura Pública', valor: 15000, dominio: 'cartorio', isento: false },
  { id: '11', codigo: 'CN002', descricao: 'Reconhecimento de Assinatura', valor: 1000, dominio: 'cartorio', isento: false },
  { id: '12', codigo: 'CN003', descricao: 'Autenticação de Documento', valor: 1500, dominio: 'cartorio', isento: false },
  { id: '13', codigo: 'RA001', descricao: 'Registo de Viatura Nova', valor: 25000, dominio: 'registo-automovel', isento: false },
  { id: '14', codigo: 'RA002', descricao: 'Transferência de Propriedade', valor: 15000, dominio: 'registo-automovel', isento: false },
  { id: '15', codigo: 'RA003', descricao: 'Certidão de Registo', valor: 3000, dominio: 'registo-automovel', isento: false },
  { id: '16', codigo: 'ISE001', descricao: 'Registo de Nascimento (Menores de 5 anos)', valor: 0, dominio: 'isencao', isento: true },
  { id: '17', codigo: 'ISE002', descricao: '1ª Emissão de BI (Cidadãos carenciados)', valor: 0, dominio: 'isencao', isento: true }
];

// Categorias de funcionários
export const categorias = [
  'Técnico Superior',
  'Técnico',
  'Assistente Técnico',
  'Assistente Operacional',
  'Conservador',
  'Notário',
  'Oficial de Justiça',
  'Escrivão',
  'Director de Serviços'
];

// Serviços do Ministério
export const servicos = [
  'DRH - Direcção de Recursos Humanos',
  'Gabinete Jurídico',
  'GEPE - Gabinete de Estudos e Planeamento',
  'Secretaria Geral',
  'GTIC - Gabinete de Tecnologias de Informação',
  'Registo Civil',
  'Identificação Civil',
  'Registo Criminal',
  'Cartório Notarial',
  'Registo Automóvel',
  'Cofre Geral de Justiça'
];
