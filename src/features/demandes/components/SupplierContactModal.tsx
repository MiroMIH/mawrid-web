import { useState } from 'react';
import { Phone, Copy, Check, X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  supplierName: string;
  supplierCompany: string;
  supplierPhone: string;
}

export function SupplierContactModal({ open, onClose, supplierName, supplierCompany, supplierPhone }: Props) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(supplierPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Phone className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>{supplierName}</h2>
          <p className="text-sm text-gray-500">{supplierCompany}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between gap-3 mb-4">
          <span className="text-xl font-bold text-gray-900 tabular-nums tracking-wide">{supplierPhone}</span>
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: copied ? '#10b981' : '#0D0D0D', color: '#fff' }}>
            {copied ? <><Check className="w-3.5 h-3.5" />Copié !</> : <><Copy className="w-3.5 h-3.5" />Copier</>}
          </button>
        </div>
        <p className="text-xs text-center text-gray-400">Contactez ce fournisseur directement par téléphone</p>
      </div>
    </div>
  );
}
