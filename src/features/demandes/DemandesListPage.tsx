import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal, FileText } from 'lucide-react';
import { useDemandes } from '../../hooks/useDemandes';
import { useCloseDemande, useCancelDemande } from '../../hooks/useDemandeMutations';
import { DemandeCard } from './components/DemandeCard';
import { CloseDemandDialog } from './components/CloseDemandDialog';
import { CancelDemandDialog } from './components/CancelDemandDialog';
import type { DemandeStatus, Demande } from '../../types';

type StatusFilter = '' | DemandeStatus;
type SortBy = 'date' | 'deadline' | 'reponses';

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'Toutes', value: '' },
  { label: 'Ouvertes', value: 'OPEN' },
  { label: 'Fermées', value: 'CLOSED' },
  { label: 'Annulées', value: 'CANCELLED' },
  { label: 'Expirées', value: 'EXPIRED' },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="w-16 h-5 bg-gray-200 rounded-full" />
      </div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
      <div className="h-3 bg-gray-100 rounded mb-3 w-1/2" />
      <div className="space-y-1.5 mb-3">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full" />
    </div>
  );
}

export function DemandesListPage() {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [closeTargetId, setCloseTargetId] = useState<number | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);

  const { data, isLoading } = useDemandes(activeStatus ? { status: activeStatus } : {});

  const closeMutation = useCloseDemande(closeTargetId ?? 0);
  const cancelMutation = useCancelDemande(cancelTargetId ?? 0);

  const cancelTarget = data?.content.find(d => d.id === cancelTargetId);

  const filtered = (data?.content ?? [])
    .filter((d: Demande) => {
      if (!searchQuery) return true;
      return d.title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a: Demande, b: Demande) => {
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'deadline') return a.daysUntilDeadline - b.daysUntilDeadline;
      if (sortBy === 'reponses') return b.totalReponses - a.totalReponses;
      return 0;
    });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>Mes Demandes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.totalElements ?? 0} demande{(data?.totalElements ?? 0) !== 1 ? 's' : ''} au total</p>
        </div>
        <Link
          to="/demandes/new"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: '#0D0D0D', color: '#F5A623' }}
        >
          <Plus className="w-4 h-4" />Nouvelle demande
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                activeStatus === tab.value
                  ? 'bg-[#F5A623] text-[#0D0D0D]'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 focus-within:border-amber-400 transition-colors">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre..."
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            className="bg-transparent text-sm outline-none text-gray-700 cursor-pointer"
          >
            <option value="date">Date de création</option>
            <option value="deadline">Délai</option>
            <option value="reponses">Nombre de réponses</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Aucune demande trouvée</h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Vous n\'avez pas encore de demandes dans cette catégorie.'}
          </p>
          <Link
            to="/demandes/new"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#0D0D0D', color: '#F5A623' }}
          >
            <Plus className="w-4 h-4" />Créer une demande
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((demande: Demande) => (
            <DemandeCard
              key={demande.id}
              demande={demande}
              onClose={(id) => setCloseTargetId(id)}
              onCancel={(id) => setCancelTargetId(id)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CloseDemandDialog
        open={closeTargetId !== null}
        onClose={() => setCloseTargetId(null)}
        onConfirm={() => {
          if (closeTargetId !== null) {
            closeMutation.mutate(undefined, { onSuccess: () => setCloseTargetId(null) });
          }
        }}
        isLoading={closeMutation.isPending}
      />

      <CancelDemandDialog
        open={cancelTargetId !== null}
        onClose={() => setCancelTargetId(null)}
        onConfirm={() => {
          if (cancelTargetId !== null) {
            cancelMutation.mutate(undefined, { onSuccess: () => setCancelTargetId(null) });
          }
        }}
        isLoading={cancelMutation.isPending}
        disponibleCount={cancelTarget?.disponibleCount ?? 0}
      />
    </div>
  );
}
