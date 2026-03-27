import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Package, Eye, XCircle, CheckCircle } from 'lucide-react';
import type { Demande } from '../../../types';
import { QualityScoreRing } from './QualityScoreRing';
import { DemandeStatusBadge } from './DemandeStatusBadge';

interface Props {
  demande: Demande;
  onClose: (id: string) => void;
  onCancel: (id: string) => void;
}

function DeadlineLabel({ days }: { days: number }) {
  if (days <= 0) return <span className="text-red-600 font-semibold text-xs">Expiré</span>;
  const cls = days < 3 ? 'text-red-500' : days < 7 ? 'text-orange-500' : 'text-gray-500';
  return <span className={`text-xs font-medium ${cls}`}>Dans {days} jour{days > 1 ? 's' : ''}</span>;
}

export function DemandeCard({ demande, onClose, onCancel }: Props) {
  const navigate = useNavigate();
  const total = demande.totalReponses;
  const dispRatio = total > 0 ? (demande.disponibleCount / total) * 100 : 0;
  const indispRatio = total > 0 ? (demande.indisponibleCount / total) * 100 : 0;

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden"
      onClick={() => navigate(`/demandes/${demande.id}`)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <QualityScoreRing score={demande.qualityScore} size={40} strokeWidth={3} />
        <DemandeStatusBadge status={demande.status} />
      </div>

      {/* Title */}
      <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
        {demande.title}
      </h3>

      {/* Category path */}
      <p className="text-xs text-gray-400 truncate mb-3">{demande.categoryPath}</p>

      {/* Meta */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="w-3 h-3 shrink-0" />
          <DeadlineLabel days={demande.daysUntilDeadline} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Package className="w-3 h-3 shrink-0" />
          <span>{demande.quantity} {demande.unit}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="w-3 h-3 shrink-0" />
          <span>{demande.buyerWilaya}</span>
        </div>
      </div>

      {/* Response bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>{total} réponse{total !== 1 ? 's' : ''}</span>
          <span className="text-emerald-600 font-medium">{demande.disponibleCount} dispo.</span>
        </div>
        {total > 0 ? (
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-400 rounded-l-full transition-all" style={{ width: `${dispRatio}%` }} />
            <div className="h-full bg-red-300 transition-all" style={{ width: `${indispRatio}%` }} />
          </div>
        ) : (
          <div className="h-1.5 bg-gray-100 rounded-full" />
        )}
      </div>

      {/* Actions - visible on hover */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={e => e.stopPropagation()}>
        <Link
          to={`/demandes/${demande.id}`}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Eye className="w-3 h-3" />Voir détail
        </Link>
        {demande.status === 'OPEN' && (
          <>
            <button
              onClick={() => onClose(demande.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <CheckCircle className="w-3 h-3" />Fermer
            </button>
            <button
              onClick={() => onCancel(demande.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <XCircle className="w-3 h-3" />Annuler
            </button>
          </>
        )}
      </div>
    </div>
  );
}
