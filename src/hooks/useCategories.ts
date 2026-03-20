import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';
import { queryKeys } from './queryKeys';

export function useCategoryTree() {
  return useQuery({
    queryKey: queryKeys.categories.tree(),
    queryFn: categoriesApi.getTree,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryAttributes(id: number | null) {
  return useQuery({
    queryKey: queryKeys.categories.attributes(id ?? 0),
    queryFn: () => categoriesApi.getAttributes(id!),
    enabled: id !== null && id > 0,
  });
}
