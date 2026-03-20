export const queryKeys = {
  demandes: {
    all: ['demandes'] as const,
    list: (filters: Record<string, unknown>) => ['demandes', 'list', filters] as const,
    detail: (id: string) => ['demandes', id] as const,
    reponses: (id: string, page: number) => ['demandes', id, 'reponses', page] as const,
  },
  categories: {
    all: ['categories'] as const,
    tree: () => ['categories', 'tree'] as const,
    detail: (id: number) => ['categories', id] as const,
    attributes: (id: number) => ['categories', id, 'attributes'] as const,
  },
} as const;
