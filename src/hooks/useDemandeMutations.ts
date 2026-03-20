import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { demandesApi } from '../api/demandes.api';
import type { CreateDemandeRequest } from '../types';
import { queryKeys } from './queryKeys';

export function useCreateDemande() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: CreateDemandeRequest) => demandesApi.create(payload),
    onSuccess: (demande) => {
      qc.invalidateQueries({ queryKey: queryKeys.demandes.all });
      navigate(`/demandes/${demande.id}`, { state: { justCreated: true } });
    },
    onError: () => toast.error('Erreur lors de la publication. Veuillez réessayer.'),
  });
}

export function useCloseDemande(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => demandesApi.close(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.demandes.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.demandes.all });
      toast.success('Demande fermée avec succès.');
    },
    onError: () => toast.error('Erreur lors de la fermeture de la demande.'),
  });
}

export function useCancelDemande(id: string) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => demandesApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.demandes.all });
      toast.success('Demande annulée.');
      navigate('/demandes');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 409) {
        toast.error("Impossible d'annuler : des fournisseurs ont confirmé leur disponibilité.");
      } else {
        toast.error("Erreur lors de l'annulation.");
      }
    },
  });
}
