import { apiClient } from './client';
import type { Demande, CreateDemandeRequest, PaginatedResponse, SupplierReponse } from '../types';

export interface ListDemandesParams {
  page?: number;
  size?: number;
  sort?: string;
  status?: string;
}

function unwrap<T>(res: { data: { data?: T } | T }): T {
  const d = res.data as { data?: T };
  return d?.data !== undefined ? d.data : (res.data as T);
}

export const demandesApi = {
  list: (params: ListDemandesParams = {}): Promise<PaginatedResponse<Demande>> =>
    apiClient.get('/buyer/demandes', { params: { page: 0, size: 20, sort: 'createdAt,desc', ...params } }).then(unwrap),

  getById: (id: string): Promise<Demande> =>
    apiClient.get(`/buyer/demandes/${id}`).then(unwrap),

  create: (payload: CreateDemandeRequest): Promise<Demande> =>
    apiClient.post('/buyer/demandes', payload).then(unwrap),

  close: (id: string): Promise<Demande> =>
    apiClient.patch(`/buyer/demandes/${id}/close`).then(unwrap),

  cancel: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/buyer/demandes/${id}`).then(unwrap),

  getReponses: (id: string, page = 0): Promise<PaginatedResponse<SupplierReponse>> =>
    apiClient.get(`/buyer/demandes/${id}/reponses`, { params: { page, size: 20 } }).then(unwrap),
};
