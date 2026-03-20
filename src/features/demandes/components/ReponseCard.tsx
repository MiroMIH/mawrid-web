import { useState } from 'react';
import { MapPin, Clock, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import type { SupplierReponse } from '../../../types';
import { QualityScoreRing } from './QualityScoreRing';
import { SupplierContactModal } from './SupplierContactModal';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props { reponse: SupplierReponse; rank: number; }

export function ReponseCard({ reponse, rank }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const isDisponible = reponse.status === 'DISPONIBLE';

  const timeAgo = formatDistanceToNow(new Date(reponse.createdAt), { addSuffix: true, locale: fr });

  return (
    <>
      <div className={`bg-white rounded-xl border p-4 transition-shadow hover:shadow-md ${rank === 1 ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-100'}`}>
        <div className="flex items-start gap-3">
          {/* Rank badge */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
            rank === 1 ? 'bg-[#F5A623] text-[#0D0D0D]' :
            rank === 2 ? 'bg-gray-200 text-gray-700' :
            rank === 3 ? 'bg-orange-100 text-orange-700' :
            'bg-gray-100 text-gray-500'
          }`}>
            #{rank}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{reponse.supplierName}</p>
                <p className="text-xs text-gray-500">{reponse.supplierCompany}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <QualityScoreRing score={reponse.supplierScore} size={36} strokeWidth={3} />
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                  isDisponible ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  {isDisponible ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{reponse.supplierWilaya}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo}</span>
            </div>

            {reponse.note && (
              <div className="mt-2">
                <p className={`text-xs text-gray-600 ${!expanded ? 'line-clamp-2' : ''}`}>{reponse.note}</p>
                {reponse.note.length > 100 && (
                  <button onClick={() => setExpanded(v => !v)} className="text-xs text-amber-600 hover:text-amber-700 mt-0.5 flex items-center gap-0.5">
                    {expanded ? <><ChevronUp className="w-3 h-3" />Moins</> : <><ChevronDown className="w-3 h-3" />Plus</>}
                  </button>
                )}
              </div>
            )}

            {isDisponible && (
              <button onClick={() => setContactOpen(true)}
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
                <Phone className="w-3.5 h-3.5" />Contacter
              </button>
            )}
          </div>
        </div>
      </div>

      <SupplierContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        supplierName={reponse.supplierName}
        supplierCompany={reponse.supplierCompany}
        supplierPhone={reponse.supplierPhone}
      />
    </>
  );
}
