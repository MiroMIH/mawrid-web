import { useState, useRef } from 'react';
import { differenceInDays } from 'date-fns';
import { Upload, X, FileIcon } from 'lucide-react';

export interface Step2Data {
  title: string;
  description: string;
  quantity: string;
  unit: string;
  deadline: string;
  wilaya: string;
  file: File | null;
}

interface Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
  onNext: () => void;
  onBack: () => void;
}

const UNITS = ['pièces', 'kg', 'm', 'lot', 'tonne', 'litre', 'm²', 'm³'];

const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', "M'Sila", 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane',
];

interface Errors {
  title?: string;
  quantity?: string;
  deadline?: string;
  wilaya?: string;
}

const todayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

export function Step2Details({ data, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Errors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const set = (key: keyof Step2Data, value: string | File | null) =>
    onChange({ ...data, [key]: value });

  const deadlineDays = data.deadline
    ? differenceInDays(new Date(data.deadline), new Date())
    : null;

  const validate = (): boolean => {
    const errs: Errors = {};
    if (data.title.trim().length < 5) errs.title = 'Le titre doit contenir au moins 5 caractères.';
    if (!data.quantity || isNaN(parseFloat(data.quantity)) || parseFloat(data.quantity) <= 0)
      errs.quantity = 'Veuillez entrer une quantité valide.';
    if (!data.deadline) errs.deadline = 'Veuillez choisir un délai.';
    if (!data.wilaya) errs.wilaya = 'Veuillez sélectionner une wilaya.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) set('file', file);
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
      hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-amber-400'
    }`;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Détails de la demande</h2>
        <p className="text-sm text-gray-500">Renseignez les informations essentielles de votre besoin.</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          value={data.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Ex : Fourniture de câbles électriques 6mm²"
          className={inputClass(!!errors.title)}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Description <span className="text-gray-400 font-normal">(optionnel)</span>
        </label>
        <textarea
          value={data.description}
          onChange={e => set('description', e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="Décrivez votre besoin en détail : spécifications techniques, conditions, etc."
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-amber-400 transition-colors resize-none"
        />
        <p className="text-xs text-gray-400 text-right mt-0.5">{data.description.length}/2000</p>
      </div>

      {/* Quantity + Unit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Quantité <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0.01"
            step="any"
            value={data.quantity}
            onChange={e => set('quantity', e.target.value)}
            placeholder="0"
            className={inputClass(!!errors.quantity)}
          />
          {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unité</label>
          <select
            value={data.unit}
            onChange={e => set('unit', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-amber-400 transition-colors"
          >
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Date limite <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          min={todayStr()}
          value={data.deadline}
          onChange={e => set('deadline', e.target.value)}
          className={inputClass(!!errors.deadline)}
        />
        {errors.deadline && <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>}
        {deadlineDays !== null && !errors.deadline && (
          <p className={`text-xs mt-1 font-medium ${
            deadlineDays < 3 ? 'text-red-500' : deadlineDays < 7 ? 'text-orange-500' : 'text-emerald-600'
          }`}>
            {deadlineDays <= 0 ? 'Délai dépassé' : `Dans ${deadlineDays} jour${deadlineDays > 1 ? 's' : ''}`}
          </p>
        )}
      </div>

      {/* Wilaya */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Wilaya <span className="text-red-500">*</span>
        </label>
        <select
          value={data.wilaya}
          onChange={e => set('wilaya', e.target.value)}
          className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
            errors.wilaya ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-amber-400'
          }`}
        >
          <option value="">Sélectionner une wilaya...</option>
          {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        {errors.wilaya && <p className="text-xs text-red-500 mt-1">{errors.wilaya}</p>}
      </div>

      {/* File upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Fichier joint <span className="text-gray-400 font-normal">(optionnel)</span>
        </label>
        {data.file ? (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <FileIcon className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="text-sm text-amber-800 font-medium truncate flex-1">{data.file.name}</span>
            <button
              onClick={() => set('file', null)}
              className="p-1 hover:bg-amber-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-amber-600" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition-colors ${
              dragOver ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-5 h-5 text-gray-400" />
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-amber-600">Cliquez pour téléverser</span> ou glissez un fichier
            </p>
            <p className="text-xs text-gray-400">PDF, PNG, JPG, DOCX jusqu'à 10 Mo</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) set('file', f);
              }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          ← Retour
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: '#0D0D0D', color: '#F5A623' }}
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
