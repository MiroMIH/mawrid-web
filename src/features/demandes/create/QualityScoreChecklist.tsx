import { Check, X } from 'lucide-react';
import { QualityScoreRing } from '../components/QualityScoreRing';
import { getScoreItems, computeQualityScore, type ScoreInput } from '../hooks/useQualityScore';

interface Props { input: ScoreInput; }

export function QualityScoreChecklist({ input }: Props) {
  const items = getScoreItems(input);
  const score = computeQualityScore(input);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2">
        <QualityScoreRing score={score} size={80} strokeWidth={6} />
        <p className="text-sm font-semibold text-gray-700">Score de qualité</p>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-2.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.earned ? 'bg-emerald-100' : 'bg-gray-100'}`}>
              {item.earned
                ? <Check className="w-3 h-3 text-emerald-600" />
                : <X className="w-3 h-3 text-gray-400" />}
            </div>
            <span className={`text-xs flex-1 ${item.earned ? 'text-gray-700' : 'text-gray-400'}`}>{item.label}</span>
            <span className={`text-xs font-semibold tabular-nums ${item.earned ? 'text-emerald-600' : 'text-gray-300'}`}>+{item.points}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Score total</span>
        <span className="text-lg font-bold" style={{ color: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444' }}>{score}/100</span>
      </div>
    </div>
  );
}
