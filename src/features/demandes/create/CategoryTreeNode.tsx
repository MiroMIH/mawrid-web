import { memo, useState } from 'react';
import { ChevronRight, ChevronDown, FolderOpen, Folder, Tag } from 'lucide-react';
import type { Category } from '../../../types';

interface Props {
  node: Category;
  selectedId: number | null;
  onSelect: (id: number, name: string, path: string, depth: number) => void;
  searchQuery: string;
  parentPath?: string;
}

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return <>{text.slice(0, idx)}<mark className="bg-amber-200 text-amber-900 rounded">{text.slice(idx, idx + query.length)}</mark>{text.slice(idx + query.length)}</>;
}

function nodeMatchesSearch(node: Category, query: string): boolean {
  if (!query) return true;
  if (node.name.toLowerCase().includes(query.toLowerCase())) return true;
  return node.children.some(c => nodeMatchesSearch(c, query));
}

export const CategoryTreeNode = memo(function CategoryTreeNode({ node, selectedId, onSelect, searchQuery, parentPath = '' }: Props) {
  const isLeaf = node.children.length === 0;
  const [open, setOpen] = useState(!!searchQuery);
  const selected = selectedId === node.id;
  const path = parentPath ? `${parentPath} > ${node.name}` : node.name;

  if (searchQuery && !nodeMatchesSearch(node, searchQuery)) return null;

  if (isLeaf) {
    return (
      <button
        onClick={() => onSelect(node.id, node.name, path, node.depth)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
          selected ? 'bg-amber-50 text-amber-800 font-semibold border border-amber-300' : 'hover:bg-gray-50 text-gray-700'
        }`}
      >
        <Tag className="w-3.5 h-3.5 shrink-0 text-amber-500" />
        <span>{highlight(node.name, searchQuery)}</span>
        {selected && <span className="ml-auto text-xs text-amber-600">✓</span>}
      </button>
    );
  }

  const isOpen = open || !!searchQuery;

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left hover:bg-gray-50 text-gray-600 font-medium transition-colors"
      >
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
        {isOpen ? <FolderOpen className="w-3.5 h-3.5 shrink-0 text-amber-400" /> : <Folder className="w-3.5 h-3.5 shrink-0 text-gray-400" />}
        <span>{highlight(node.name, searchQuery)}</span>
      </button>
      {isOpen && (
        <div className="ml-5 border-l border-gray-100 pl-2 mt-0.5 space-y-0.5">
          {node.children.map(child => (
            <CategoryTreeNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} searchQuery={searchQuery} parentPath={path} />
          ))}
        </div>
      )}
    </div>
  );
});
