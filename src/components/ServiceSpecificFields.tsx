import { FieldSchema, ServiceSchema } from '../serviceSchemas';

type Props = {
  schema?: ServiceSchema;
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onFileChange: (name: string, files: File[]) => void;
};

export default function ServiceSpecificFields({ schema, values, onChange, onFileChange }: Props) {
  if (!schema) return null;
  return <div className="space-y-5">
    {schema.sections.map(section => <section key={section.title} className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-800 border-b pb-2">{section.title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {section.fields.map((field: FieldSchema) => <div key={field.name} className={field.kind === 'textarea' ? 'md:col-span-2' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}{field.required ? ' *' : ''}</label>
          {field.kind === 'textarea' ? <textarea value={values[field.name] || ''} required={field.required} onChange={e => onChange(field.name,e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" /> :
          field.kind === 'select' ? <select value={values[field.name] || ''} required={field.required} onChange={e => onChange(field.name,e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg">
            <option value="">Selecione...</option>{(field.options || (field.name === 'sexo' ? ['Masculino','Feminino'] : field.name === 'tipoPedido' ? ['Primeira via','Segunda via','Renovação'] : field.name === 'tipoProcesso' ? ['Primeiro registo','Transferência de propriedade','Actualização de dados','Segunda via','Cancelamento'] : [])).map(option => <option key={option}>{option}</option>)}
          </select> :
          field.kind === 'file' ? <input type="file" accept="application/pdf,image/jpeg,image/png" multiple required={field.required} onChange={e => { const files = Array.from(e.target.files || []); onFileChange(field.name, files); onChange(field.name, files.map(file => file.name).join(', ')); }} className="w-full text-sm" /> :
          <input type={field.kind === 'number' ? 'number' : field.kind} required={field.required} value={values[field.name] || ''} onChange={e => onChange(field.name,e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />}
          {field.help && <p className="text-xs text-gray-500 mt-1">{field.help}</p>}
        </div>)}
      </div>
    </section>)}
  </div>;
}
