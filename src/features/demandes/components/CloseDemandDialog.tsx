interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function CloseDemandDialog({ open, onClose, onConfirm, isLoading }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Fermer cette demande ?</h2>
        <p className="text-sm text-gray-600 mb-6">Les fournisseurs ne pourront plus répondre à cette demande. Cette action ne peut pas être annulée.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Annuler
          </button>
          <button onClick={onConfirm} disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-60 transition-colors">
            {isLoading ? 'Fermeture...' : 'Fermer la demande'}
          </button>
        </div>
      </div>
    </div>
  );
}
