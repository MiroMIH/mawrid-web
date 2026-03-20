import { useQuery } from '@tanstack/react-query';
import { demandesApi, type ListDemandesParams } from '../api/demandes.api';
import { queryKeys } from './queryKeys';

export function useDemandes(params: ListDemandesParams = {}) {
  return useQuery({
    queryKey: queryKeys.demandes.list(params as Record<string, unknown>),
    queryFn: () => demandesApi.list(params),
  });
}

export function useDemande(id: string) {
  return useQuery({
    queryKey: queryKeys.demandes.detail(id),
    queryFn: () => demandesApi.getById(id),
    enabled: !!id,
  });
}

export function useDemandeReponses(id: string, page = 0) {
  return useQuery({
    queryKey: queryKeys.demandes.reponses(id, page),
    queryFn: () => demandesApi.getReponses(id, page),
    enabled: !!id,
  });
}
