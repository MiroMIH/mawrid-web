interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  disponibleCount: number;
}

export function CancelDemandDialog({ open, onClose, onConfirm, isLoading, disponibleCount }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-red-700 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Annuler cette demande ?</h2>
        {disponibleCount > 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700 font-medium">
              ⚠️ {disponibleCount} fournisseur{disponibleCount > 1 ? 's ont' : ' a'} confirmé leur disponibilité.
            </p>
            <p className="text-sm text-red-600 mt-1">Annuler quand même ?</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-4">Cette action est irréversible. La demande sera définitivement annulée.</p>
        )}
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Retour
          </button>
          <button onClick={onConfirm} disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors">
            {isLoading ? 'Annulation...' : 'Annuler la demande'}
          </button>
        </div>
      </div>
    </div>
  );
}
