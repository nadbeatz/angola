import { useState, type DragEvent, type ChangeEvent, type FormEvent } from 'react';
import {
  Upload,
  FileText,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  Paperclip,
  Save
} from 'lucide-react';
import { varas, comarcas, responsaveis } from '../data';

interface NewDocumentProps {
  onCreated: () => void;
}

export default function NewDocument({ onCreated }: NewDocumentProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    numero: '',
    tipo: '',
    prioridade: '',
    vara: '',
    comarca: '',
    area: '',
    responsavel: '',
    descricao: '',
    observacoes: '',
    partes: ['', ''],
  });
  const [files, setFiles] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleParteChange = (index: number, value: string) => {
    setFormData(prev => {
      const partes = [...prev.partes];
      partes[index] = value;
      return { ...prev, partes };
    });
  };

  const addParte = () => {
    setFormData(prev => ({ ...prev, partes: [...prev.partes, ''] }));
  };

  const removeParte = (index: number) => {
    setFormData(prev => ({
      ...prev,
      partes: prev.partes.filter((_, i) => i !== index)
    }));
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).map(f => f.name);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => f.name);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.titulo) newErrors.titulo = 'Título é obrigatório';
    if (!formData.numero) newErrors.numero = 'Número do processo é obrigatório';
    if (!formData.tipo) newErrors.tipo = 'Tipo é obrigatório';
    if (!formData.prioridade) newErrors.prioridade = 'Prioridade é obrigatória';
    if (!formData.vara) newErrors.vara = 'Vara é obrigatória';
    if (!formData.area) newErrors.area = 'Área é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setTimeout(() => {
        onCreated();
      }, 2000);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Documento Registrado!</h2>
          <p className="text-gray-500 mt-2">O documento foi cadastrado com sucesso no sistema.</p>
          <p className="text-sm text-gray-400 mt-4">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Novo Documento</h1>
        <p className="text-gray-500 text-sm mt-1">Preencha as informações para cadastrar um novo documento no sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-blue-600" />
            Anexos do Documento
          </h3>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Upload className={`w-10 h-10 mx-auto mb-3 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-sm font-medium text-gray-700">
              Arraste arquivos aqui ou{' '}
              <label className="text-blue-600 hover:text-blue-800 cursor-pointer font-semibold">
                clique para selecionar
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
              </label>
            </p>
            <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (máx. 50MB)</p>
          </div>
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700 flex-1 truncate">{file}</span>
                  <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Information */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Informações Principais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Título do Documento *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={e => handleChange('titulo', e.target.value)}
                placeholder="Ex: Ação de Indenização por Danos Morais"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${errors.titulo ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.titulo && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.titulo}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Número do Processo *</label>
              <input
                type="text"
                value={formData.numero}
                onChange={e => handleChange('numero', e.target.value)}
                placeholder="0000000-00.0000.8.26.0000"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono ${errors.numero ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.numero && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.numero}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo de Documento *</label>
              <select
                value={formData.tipo}
                onChange={e => handleChange('tipo', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${errors.tipo ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              >
                <option value="">Selecione...</option>
                <option value="peticao">Petição</option>
                <option value="sentenca">Sentença</option>
                <option value="despacho">Despacho</option>
                <option value="certidao">Certidão</option>
                <option value="ata">Ata</option>
                <option value="oficio">Ofício</option>
                <option value="parecer">Parecer</option>
                <option value="recurso">Recurso</option>
              </select>
              {errors.tipo && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.tipo}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Prioridade *</label>
              <select
                value={formData.prioridade}
                onChange={e => handleChange('prioridade', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${errors.prioridade ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              >
                <option value="">Selecione...</option>
                <option value="urgente">Urgente</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
              {errors.prioridade && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.prioridade}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Área *</label>
              <select
                value={formData.area}
                onChange={e => handleChange('area', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${errors.area ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              >
                <option value="">Selecione...</option>
                <option value="civil">Cível</option>
                <option value="criminal">Criminal</option>
                <option value="trabalho">Trabalho</option>
                <option value="familia">Família</option>
                <option value="fazenda">Fazenda Pública</option>
              </select>
              {errors.area && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.area}</p>}
            </div>
          </div>
        </div>

        {/* Location & Assignment */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Localização e Responsabilidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Vara *</label>
              <select
                value={formData.vara}
                onChange={e => handleChange('vara', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${errors.vara ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              >
                <option value="">Selecione...</option>
                {varas.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              {errors.vara && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.vara}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Comarca</label>
              <select
                value={formData.comarca}
                onChange={e => handleChange('comarca', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="">Selecione...</option>
                {comarcas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Responsável</label>
              <select
                value={formData.responsavel}
                onChange={e => handleChange('responsavel', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="">Selecione...</option>
                {responsaveis.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Partes Envolvidas</h3>
            <button type="button" onClick={addParte} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              + Adicionar parte
            </button>
          </div>
          <div className="space-y-3">
            {formData.partes.map((parte, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-blue-600">{i + 1}</span>
                </div>
                <input
                  type="text"
                  value={parte}
                  onChange={e => handleParteChange(i, e.target.value)}
                  placeholder={i === 0 ? 'Ex: João Silva (Autor)' : i === 1 ? 'Ex: Empresa XYZ Ltda (Réu)' : 'Nome da parte'}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {formData.partes.length > 2 && (
                  <button type="button" onClick={() => removeParte(i)} className="text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Description & Observations */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Detalhes</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={e => handleChange('descricao', e.target.value)}
                rows={3}
                placeholder="Descreva o documento..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Observações</label>
              <textarea
                value={formData.observacoes}
                onChange={e => handleChange('observacoes', e.target.value)}
                rows={2}
                placeholder="Observações adicionais..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCreated}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Save className="w-4 h-4" />
            Registrar Documento
          </button>
        </div>
      </form>
    </div>
  );
}
