import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tag, Package, Calendar, MapPin, FileIcon, ChevronLeft } from 'lucide-react';
import { QualityScoreChecklist } from './QualityScoreChecklist';
import type { ScoreInput } from '../hooks/useQualityScore';

interface FreeAttribute { key: string; value: string; }

interface Props {
  category: { id: number; name: string; path: string; depth: number } | null;
  details: { title: string; description: string; quantity: string; unit: string; deadline: string; wilaya: string; file: File | null };
  schemaAttributes: Record<string, string>;
  freeAttributes: FreeAttribute[];
  scoreInput: ScoreInput;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function Step4Review({ category, details, schemaAttributes, freeAttributes, scoreInput, onSubmit, onBack, isSubmitting }: Props) {
  const formattedDeadline = details.deadline
    ? format(new Date(details.deadline), 'dd MMMM yyyy', { locale: fr })
    : '—';

  const schemaEntries = Object.entries(schemaAttributes).filter(([, v]) => v);
  const freeEntries = freeAttributes.filter(a => a.key && a.value);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Révision finale</h2>
        <p className="text-sm text-gray-500">Vérifiez les informations avant de publier votre demande.</p>
      </div>

      {/* Summary card */}
      <div className="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-100">
        {/* Title */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Titre</p>
          <p className="font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>{details.title}</p>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Tag className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-xs">{category?.path ?? '—'}</span>
        </div>

        {/* Description */}
        {details.description && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{details.description}</p>
          </div>
        )}

        {/* Quantity + Deadline + Wilaya */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{details.quantity} {details.unit}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{formattedDeadline}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{details.wilaya}</span>
          </div>
        </div>

        {/* File */}
        {details.file && (
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <FileIcon className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">{details.file.name}</span>
          </div>
        )}

        {/* Schema attributes */}
        {schemaEntries.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Attributs de catégorie</p>
            <div className="grid grid-cols-2 gap-2">
              {schemaEntries.map(([key, value]) => (
                <div key={key} className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                  <p className="text-xs text-gray-400">{key}</p>
                  <p className="text-sm font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Free attributes */}
        {freeEntries.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Attributs libres</p>
            <div className="grid grid-cols-2 gap-2">
              {freeEntries.map((attr, i) => (
                <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                  <p className="text-xs text-gray-400">{attr.key}</p>
                  <p className="text-sm font-medium text-gray-800">{attr.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Score */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <QualityScoreChecklist input={scoreInput} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />Modifier
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
          style={{ background: '#0D0D0D', color: '#F5A623' }}
        >
          {isSubmitting ? 'Publication en cours...' : 'Publier la demande'}
        </button>
      </div>
    </div>
  );
}
