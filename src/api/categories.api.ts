import { apiClient } from './client';
import type { Category, CategoryAttribute } from '../types';

function unwrap<T>(res: { data: { data?: T } | T }): T {
  const d = res.data as { data?: T };
  return d?.data !== undefined ? d.data : (res.data as T);
}

export const categoriesApi = {
  getTree: (): Promise<Category[]> => apiClient.get('/categories/tree').then(unwrap),
  getById: (id: number): Promise<Category> => apiClient.get(`/categories/${id}`).then(unwrap),
  getAttributes: (id: number): Promise<CategoryAttribute[]> => apiClient.get(`/categories/${id}/attributes`).then(unwrap),
};
