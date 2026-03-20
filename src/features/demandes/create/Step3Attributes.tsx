import { Plus, X, Info } from 'lucide-react';
import type { CategoryAttribute } from '../../../types';
import { useCategoryAttributes } from '../../../hooks/useCategories';

interface FreeAttribute { key: string; value: string; }

interface Props {
  categoryId: number;
  schemaValues: Record<string, string>;
  onSchemaChange: (key: string, value: string) => void;
  freeAttributes: FreeAttribute[];
  onFreeChange: (attrs: FreeAttribute[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function BooleanToggle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const checked = value === 'true';
  return (
    <button
      type="button"
      onClick={() => onChange(checked ? 'false' : 'true')}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function AttributeField({ attr, value, onChange }: { attr: CategoryAttribute; value: string; onChange: (v: string) => void }) {
  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-amber-400 transition-colors';

  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
        {attr.label}
        {attr.required && <span className="text-red-500">*</span>}
        {attr.inherited && attr.inheritedFrom && (
          <span className="text-xs text-gray-400 font-normal ml-1">— hérité de {attr.inheritedFrom}</span>
        )}
        {attr.unit && <span className="text-xs text-gray-400 font-normal">({attr.unit})</span>}
      </label>
      {attr.type === 'TEXT' && (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
      )}
      {attr.type === 'NUMBER' && (
        <input type="number" value={value} onChange={e => onChange(e.target.value)} step="any" className={inputClass} />
      )}
      {attr.type === 'SELECT' && (
        <select value={value} onChange={e => onChange(e.target.value)} className={inputClass}>
          <option value="">Sélectionner...</option>
          {attr.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}
      {attr.type === 'BOOLEAN' && (
        <div className="flex items-center gap-3">
          <BooleanToggle value={value} onChange={onChange} />
          <span className="text-sm text-gray-600">{value === 'true' ? 'Oui' : 'Non'}</span>
        </div>
      )}
    </div>
  );
}

export function Step3Attributes({ categoryId, schemaValues, onSchemaChange, freeAttributes, onFreeChange, onNext, onBack }: Props) {
  const { data: attrs, isLoading } = useCategoryAttributes(categoryId);

  const addFreeAttr = () => {
    if (freeAttributes.length >= 10) return;
    onFreeChange([...freeAttributes, { key: '', value: '' }]);
  };

  const removeFreeAttr = (i: number) => {
    onFreeChange(freeAttributes.filter((_, idx) => idx !== i));
  };

  const updateFreeAttr = (i: number, field: 'key' | 'value', val: string) => {
    const updated = [...freeAttributes];
    updated[i] = { ...updated[i], [field]: val };
    onFreeChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Attributs de la demande</h2>
        <p className="text-sm text-gray-500">Précisez les caractéristiques techniques de votre besoin.</p>
      </div>

      {/* Schema attributes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Attributs de catégorie</h3>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !attrs?.length ? (
          <div className="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-500">Aucun attribut défini pour cette catégorie. Vous pouvez ajouter des attributs libres ci-dessous.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attrs.map((attr: CategoryAttribute) => (
              <AttributeField
                key={attr.key}
                attr={attr}
                value={schemaValues[attr.key] ?? ''}
                onChange={v => onSchemaChange(attr.key, v)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Free attributes */}
      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Attributs libres</h3>
            <p className="text-xs text-gray-400">{freeAttributes.length}/10 attributs libres</p>
          </div>
          <button
            onClick={addFreeAttr}
            disabled={freeAttributes.length >= 10}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />Ajouter
          </button>
        </div>

        {freeAttributes.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">Aucun attribut libre ajouté.</p>
        ) : (
          <div className="space-y-2">
            {freeAttributes.map((attr, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={attr.key}
                  onChange={e => updateFreeAttr(i, 'key', e.target.value)}
                  placeholder="Nom de l'attribut"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-amber-400 transition-colors"
                />
                <input
                  value={attr.value}
                  onChange={e => updateFreeAttr(i, 'value', e.target.value)}
                  placeholder="Valeur"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  onClick={() => removeFreeAttr(i)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
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
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: '#0D0D0D', color: '#F5A623' }}
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
