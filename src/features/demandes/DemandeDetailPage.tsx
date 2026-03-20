import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, XCircle, MapPin, Calendar, Package, Tag, ChevronDown, ChevronUp, AlertCircle, Users, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useDemande, useDemandeReponses } from '../../hooks/useDemandes';
import { useCloseDemande, useCancelDemande } from '../../hooks/useDemandeMutations';
import { DemandeStatusBadge } from './components/DemandeStatusBadge';
import { QualityScoreRing } from './components/QualityScoreRing';
import { CloseDemandDialog } from './components/CloseDemandDialog';
import { CancelDemandDialog } from './components/CancelDemandDialog';
import { ReponseCard } from './components/ReponseCard';
import type { SupplierReponse } from '../../types';

type ReponseFilter = 'all' | 'DISPONIBLE' | 'INDISPONIBLE';

function SkeletonDetail() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-32 bg-gray-100 rounded-2xl" />
      </div>
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-24 bg-gray-100 rounded-2xl" />
        <div className="h-24 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}

export function DemandeDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const location = useLocation();
  const justCreated = (location.state as { justCreated?: boolean } | null)?.justCreated;

  const { data: demande, isLoading: demandeLoading } = useDemande(id);
  const { data: reponsesData, isLoading: reponsesLoading } = useDemandeReponses(id);
  const closeMutation = useCloseDemande(id);
  const cancelMutation = useCancelDemande(id);

  const [closeOpen, setCloseOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [attrsExpanded, setAttrsExpanded] = useState(false);
  const [reponseFilter, setReponseFilter] = useState<ReponseFilter>('all');

  if (demandeLoading) return <SkeletonDetail />;
  if (!demande) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Demande introuvable.</p>
      </div>
    );
  }

  const createdAgo = formatDistanceToNow(new Date(demande.createdAt), { addSuffix: true, locale: fr });
  const formattedDeadline = format(new Date(demande.deadline), 'dd/MM/yyyy');

  const schemaAttrs = demande.attributes.filter(a => !a.custom);
  const freeAttrs = demande.attributes.filter(a => a.custom);

  const reponses: SupplierReponse[] = reponsesData?.content ?? [];
  const sortedReponses = [...reponses].sort((a, b) => b.supplierScore - a.supplierScore);

  const filteredReponses = sortedReponses.filter(r => {
    if (reponseFilter === 'all') return true;
    return r.status === reponseFilter;
  });

  const deadlineDays = demande.daysUntilDeadline;
  const deadlineClass = deadlineDays < 3 ? 'text-red-600' : deadlineDays < 7 ? 'text-orange-600' : 'text-gray-600';

  return (
    <>
      {/* Success banner */}
      {justCreated && (
        <div className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-800 font-medium">
            Votre demande a été publiée. Les fournisseurs correspondants seront notifiés automatiquement.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 leading-snug" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {demande.title}
                </h1>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <QualityScoreRing score={demande.qualityScore} size={48} strokeWidth={4} />
                <DemandeStatusBadge status={demande.status} />
              </div>
            </div>

            {/* Category breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{demande.categoryPath}</span>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <span>Publiée {createdAgo}</span>
              <span className={`font-medium ${deadlineClass}`}>
                {deadlineDays <= 0 ? 'Expirée' : `Expire dans ${deadlineDays} jour${deadlineDays > 1 ? 's' : ''}`}
              </span>
            </div>

            {/* Action bar */}
            {demande.status === 'OPEN' && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCloseOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />Fermer la demande
                </button>
                <button
                  onClick={() => setCancelOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <XCircle className="w-4 h-4" />Annuler
                </button>
              </div>
            )}
          </div>

          {/* Details card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Détails</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Quantité</p>
                <div className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">{demande.quantity} {demande.unit}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Date limite</p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">{formattedDeadline}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Wilaya</p>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">{demande.buyerWilaya}</span>
                </div>
              </div>
            </div>
            {demande.description && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{demande.description}</p>
              </div>
            )}
          </div>

          {/* Attributes section */}
          {demande.attributes.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setAttrsExpanded(v => !v)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Attributs ({demande.attributes.length})
                </span>
                {attrsExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {attrsExpanded && (
                <div className="px-5 pb-5 space-y-4">
                  {schemaAttrs.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Attributs de catégorie</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {schemaAttrs.map(attr => (
                          <div key={attr.key} className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                            <p className="text-xs text-gray-400">{attr.key}</p>
                            <p className="text-sm font-medium text-gray-800">{attr.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {freeAttrs.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Attributs libres</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {freeAttrs.map(attr => (
                          <div key={attr.key} className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                            <p className="text-xs text-amber-500">{attr.key}</p>
                            <p className="text-sm font-medium text-amber-900">{attr.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900">
                {demande.totalReponses} fournisseur{demande.totalReponses !== 1 ? 's ont' : ' a'} répondu
              </h2>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-700">{demande.disponibleCount}</span>
                <span className="text-xs text-gray-400">Disponibles</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-1.5">
                <ThumbsDown className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-600">{demande.indisponibleCount}</span>
                <span className="text-xs text-gray-400">Indisponibles</span>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-4">
              {([['all', 'Tous'], ['DISPONIBLE', 'Disponibles'], ['INDISPONIBLE', 'Indisponibles']] as [ReponseFilter, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setReponseFilter(val)}
                  className={`flex-1 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    reponseFilter === val ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Reponse list */}
            {reponsesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredReponses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex gap-1 mb-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-gray-300" />
                  <p className="text-sm font-medium text-gray-500">
                    {reponseFilter === 'all'
                      ? 'Aucune réponse pour le moment'
                      : `Aucun fournisseur ${reponseFilter === 'DISPONIBLE' ? 'disponible' : 'indisponible'}`}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {reponseFilter === 'all' && 'Les fournisseurs correspondants seront notifiés automatiquement.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReponses.map((reponse, i) => {
                  const rank = sortedReponses.indexOf(reponse) + 1;
                  return <ReponseCard key={`${reponse.supplierId}-${i}`} reponse={reponse} rank={rank} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CloseDemandDialog
        open={closeOpen}
        onClose={() => setCloseOpen(false)}
        onConfirm={() => closeMutation.mutate(undefined, { onSuccess: () => setCloseOpen(false) })}
        isLoading={closeMutation.isPending}
      />
      <CancelDemandDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => cancelMutation.mutate()}
        isLoading={cancelMutation.isPending}
        disponibleCount={demande.disponibleCount}
      />
    </>
  );
}
