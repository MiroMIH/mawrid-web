import { useState } from 'react';
import { Search, Info } from 'lucide-react';
import type { Category } from '../../../types';
import { useCategoryTree } from '../../../hooks/useCategories';
import { CategoryTreeNode } from './CategoryTreeNode';

interface SelectedCategory { id: number; name: string; path: string; depth: number; }

interface Props {
  selected: SelectedCategory | null;
  onSelect: (cat: SelectedCategory) => void;
  onNext: () => void;
}

export function Step1Category({ selected, onSelect, onNext }: Props) {
  const { data: tree, isLoading } = useCategoryTree();
  const [search, setSearch] = useState('');

  const handleSelect = (id: number, name: string, path: string, depth: number) => {
    onSelect({ id, name, path, depth });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Choisissez une catégorie</h2>
        <p className="text-sm text-gray-500">Sélectionnez la catégorie qui correspond le mieux à votre besoin.</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-amber-400 transition-colors">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une catégorie..."
          className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Selected breadcrumb */}
      {selected && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <span className="text-xs text-amber-600 font-medium">Sélectionnée :</span>
          <span className="text-xs text-amber-800 font-semibold truncate">{selected.path}</span>
        </div>
      )}

      {/* Tree */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 max-h-72 overflow-y-auto space-y-0.5">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${60 + i * 5}%` }} />
            ))}
          </div>
        ) : !tree?.length ? (
          <p className="text-sm text-gray-400 text-center py-4">Aucune catégorie disponible</p>
        ) : (
          tree.map((node: Category) => (
            <CategoryTreeNode key={node.id} node={node} selectedId={selected?.id ?? null} onSelect={handleSelect} searchQuery={search} />
          ))
        )}
      </div>

      {/* Hint */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">Plus votre catégorie est précise, mieux votre demande sera matchée avec les bons fournisseurs.</p>
      </div>

      {/* Continue */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          disabled={!selected}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: selected ? '#0D0D0D' : '#e5e7eb', color: selected ? '#F5A623' : '#9ca3af' }}
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
