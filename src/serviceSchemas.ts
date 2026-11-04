/**
 * Esquemas de referência para formulários e permissões dos serviços.
 * Valores emolumentares e documentos obrigatórios devem ser confirmados
 * pelo órgão competente antes de serem usados como regras legais.
 */
export type FieldKind = 'text' | 'date' | 'time' | 'number' | 'select' | 'textarea' | 'file';

export interface FieldSchema {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  options?: readonly string[];
  dependsOn?: string;
  help?: string;
}

export interface ServiceSchema {
  title: string;
  processTypes: readonly string[];
  sections: readonly { title: string; fields: readonly FieldSchema[] }[];
}

const field = (name: string, label: string, kind: FieldKind = 'text', required = false, help?: string): FieldSchema =>
  ({ name, label, kind, required, help });

export const birthRegistrationSchema: ServiceSchema = {
  title: 'Registo de Nascimento',
  processTypes: ['Registo de nascimento'],
  sections: [
    { title: 'Dados da criança', fields: [
      field('nomeCrianca', 'Nome completo da criança', 'text', true),
      field('sexo', 'Sexo', 'select', true), field('dataNascimento', 'Data de nascimento', 'date', true),
      field('horaNascimento', 'Hora de nascimento', 'time'), field('localNascimento', 'Local de nascimento', 'text', true),
      field('provincia', 'Província', 'text', true), field('municipio', 'Município', 'text', true),
      field('comuna', 'Comuna / localidade', 'text'), field('maternidade', 'Hospital / maternidade', 'text'),
    ]},
    { title: 'Filiação', fields: [
      field('nomeMae', 'Nome completo da mãe', 'text', true), field('biMae', 'BI da mãe'),
      field('naturalidadeMae', 'Naturalidade da mãe'), field('nomePai', 'Nome completo do pai'),
      field('biPai', 'BI do pai'), field('naturalidadePai', 'Naturalidade do pai'),
    ]},
    { title: 'Avós e declarante', fields: [
      field('avoMaterno1', 'Avô materno'), field('avoMaterno2', 'Avó materna'),
      field('avoPaterno1', 'Avô paterno'), field('avoPaterno2', 'Avó paterna'),
      field('nomeDeclarante', 'Nome do declarante', 'text', true), field('biDeclarante', 'BI do declarante', 'text', true),
      field('relacaoDeclarante', 'Relação com a criança'), field('documentos', 'Documentos de suporte', 'file', true),
    ]},
  ],
};

export const identitySchema: ServiceSchema = {
  title: 'Bilhete de Identidade',
  processTypes: ['Primeira via', 'Segunda via', 'Renovação'],
  sections: [
    { title: 'Pedido e identificação', fields: [
      field('tipoPedido', 'Tipo de pedido', 'select', true),
      field('nomeCompleto', 'Nome completo', 'text', true), field('numeroBIAnterior', 'Número do BI anterior'),
      field('dataNascimento', 'Data de nascimento', 'date', true), field('naturalidade', 'Naturalidade', 'text', true),
      field('filiacao', 'Filiação', 'textarea', true), field('morada', 'Morada', 'textarea', true),
      field('contacto', 'Contacto telefónico', 'text', true),
    ]},
    { title: 'Documentação', fields: [
      field('certidaoNascimento', 'Certidão / assento de nascimento', 'file', true),
      field('biAnterior', 'BI anterior (quando aplicável)', 'file'),
      field('comprovativo', 'Comprovativo específico do pedido', 'file'),
    ]},
  ],
};

export const vehicleRegistrationSchema: ServiceSchema = {
  title: 'Registo Automóvel',
  processTypes: ['Primeiro registo', 'Transferência de propriedade', 'Actualização de dados', 'Segunda via', 'Cancelamento'],
  sections: [
    { title: 'Características do veículo', fields: [
      field('marca', 'Marca', 'select', true, 'Lista controlada; inclusão de nova marca sujeita a autorização.'),
      field('modelo', 'Modelo', 'select', true, 'A lista de modelos deve depender da marca seleccionada.'),
      field('versao', 'Versão'), field('ano', 'Ano de fabrico', 'number', true),
      field('matricula', 'Matrícula'), field('vin', 'Número de chassis / VIN', 'text', true),
      field('numeroMotor', 'Número do motor'), field('categoria', 'Categoria', 'select', true),
      field('cor', 'Cor', 'text', true), field('combustivel', 'Combustível', 'select', true),
      field('cilindrada', 'Cilindrada (cm³)', 'number'), field('lugares', 'Número de lugares', 'number'),
    ]},
    { title: 'Titularidade e processo', fields: [
      field('tipoProcesso', 'Tipo de processo', 'select', true),
      field('nomeProprietario', 'Nome do proprietário', 'text', true), field('biNifProprietario', 'BI / NIF do proprietário', 'text', true),
      field('representante', 'Representante (se aplicável)'), field('documentosOrigem', 'Documentos de origem / importação', 'file'),
      field('documentoPropriedade', 'Documento de propriedade', 'file'), field('observacoes', 'Observações', 'textarea'),
    ]},
  ],
};

export const cartorioSchema: ServiceSchema = {
  title: 'Cartório',
  processTypes: [
    'Escritura pública', 'Reconhecimento de assinatura', 'Autenticação de documento',
    'Procuração', 'Certidão', 'Termo / declaração', 'Outro acto (configurado pelo órgão competente)',
  ],
  sections: [
    { title: 'Requerente e acto', fields: [
      field('tipoActo', 'Tipo de acto', 'select', true), field('requerente', 'Requerente', 'text', true),
      field('biNif', 'BI / NIF', 'text', true), field('intervenientes', 'Outros intervenientes', 'textarea'),
      field('objectoActo', 'Objecto / descrição do acto', 'textarea', true),
      field('documentos', 'Documentos apresentados', 'file', true),
      field('observacoes', 'Observações', 'textarea'),
    ]},
  ],
};

export const documentAccessRules = {
  central: {
    scope: 'all-delegations',
    actions: ['view', 'create', 'classify', 'assign', 'route', 'dispatch', 'archive', 'audit'],
  },
  provincial: {
    scope: 'own-delegation',
    actions: ['view', 'create', 'edit-draft', 'submit', 'consult-history'],
  },
  note: 'A autorização efectiva deve ser aplicada no servidor e reforçada por políticas RLS; esconder menus não é controlo de acesso.',
} as const;
