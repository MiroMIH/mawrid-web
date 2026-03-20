import type { DemandeStatus } from '../../../types';

const CONFIG: Record<DemandeStatus, { label: string; className: string }> = {
  OPEN:      { label: 'Ouverte',   className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  CLOSED:    { label: 'Fermée',    className: 'bg-gray-100 text-gray-600 border border-gray-200' },
  CANCELLED: { label: 'Annulée',   className: 'bg-red-100 text-red-700 border border-red-200' },
  EXPIRED:   { label: 'Expirée',   className: 'bg-orange-100 text-orange-700 border border-orange-200' },
};

export function DemandeStatusBadge({ status }: { status: DemandeStatus }) {
  const cfg = CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
