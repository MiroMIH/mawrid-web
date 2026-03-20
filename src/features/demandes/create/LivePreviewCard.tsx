import { Calendar, MapPin, Package, Tag } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { QualityScoreRing } from '../components/QualityScoreRing';

interface Props {
  title: string;
  categoryPath: string;
  quantity: string;
  unit: string;
  deadline: string;
  wilaya: string;
  score: number;
}

export function LivePreviewCard({ title, categoryPath, quantity, unit, deadline, wilaya, score }: Props) {
  const days = deadline ? differenceInDays(new Date(deadline), new Date()) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="h-1 bg-[#F5A623]" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Aperçu de votre demande</p>
            <h3 className="font-bold text-gray-900 text-base leading-snug" style={{ fontFamily: 'Syne, sans-serif' }}>
              {title || <span className="text-gray-300 font-normal italic">Titre de votre demande...</span>}
            </h3>
          </div>
          <QualityScoreRing score={score} size={44} strokeWidth={4} />
        </div>

        <div className="space-y-2">
          {categoryPath && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{categoryPath}</span>
            </div>
          )}
          {(quantity || unit) && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Package className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{quantity || '—'} {unit || ''}</span>
            </div>
          )}
          {deadline && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className={days !== null && days < 3 ? 'text-red-500 font-medium' : ''}>
                {days !== null ? (days <= 0 ? 'Délai dépassé' : `Dans ${days} jour${days > 1 ? 's' : ''}`) : '—'}
              </span>
            </div>
          )}
          {wilaya && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{wilaya}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
