import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FileText, Users, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import { useDemandes } from '../../hooks/useDemandes';
import { useAuthStore } from '../../store/authStore';
import { DemandeStatusBadge } from '../demandes/components/DemandeStatusBadge';
import { QualityScoreRing } from '../demandes/components/QualityScoreRing';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Demande } from '../../types';

function SkeletonKPI() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
        <div className="w-12 h-4 bg-gray-100 rounded" />
      </div>
      <div className="h-7 bg-gray-200 rounded w-1/2 mb-1" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
    </div>
  );
}

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  delay?: number;
}

function KPICard({ icon, label, value, sub, color, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: color + '20' }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useDemandes({ size: 50 });

  const content = data?.content ?? [];

  const demandesActives = content.filter((d: Demande) => d.status === 'OPEN').length;
  const reponsesRecues = content.reduce((s: number, d: Demande) => s + d.totalReponses, 0);
  const fournisseursDisponibles = content.reduce((s: number, d: Demande) => s + d.disponibleCount, 0);
  const tauxReponse = reponsesRecues > 0 ? Math.round((fournisseursDisponibles / reponsesRecues) * 100) : 0;

  const recentDemandes = [...content]
    .sort((a: Demande, b: Demande) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
          {greeting()}, {user?.firstName ?? 'Acheteur'} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Voici un aperçu de votre activité d'achat.</p>
      </motion.div>

      {/* KPIs */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={<FileText className="w-5 h-5" />}
            label="Demandes actives"
            value={demandesActives}
            sub={`${content.length} au total`}
            color="#F5A623"
            delay={0}
          />
          <KPICard
            icon={<Users className="w-5 h-5" />}
            label="Réponses reçues"
            value={reponsesRecues}
            sub="de tous vos fournisseurs"
            color="#6366f1"
            delay={0.1}
          />
          <KPICard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Fournisseurs disponibles"
            value={fournisseursDisponibles}
            sub="prêts à traiter votre besoin"
            color="#10b981"
            delay={0.2}
          />
          <KPICard
            icon={<BarChart3 className="w-5 h-5" />}
            label="Taux de disponibilité"
            value={`${tauxReponse}%`}
            sub="des réponses positives"
            color="#ef4444"
            delay={0.3}
          />
        </div>
      )}

      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: '#0D0D0D' }}
      >
        <div>
          <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
            Vous avez besoin d'un fournisseur ?
          </h2>
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            Publiez votre demande en moins de 3 minutes et recevez des réponses qualifiées.
          </p>
        </div>
        <Link
          to="/demandes/new"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
          style={{ background: '#F5A623', color: '#0D0D0D' }}
        >
          <Plus className="w-4 h-4" />Nouvelle demande
        </Link>
      </motion.div>

      {/* Recent demandes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>Demandes récentes</h2>
          <Link to="/demandes" className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors">
            Voir toutes <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentDemandes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <FileText className="w-8 h-8 text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">Aucune demande encore.</p>
            <Link to="/demandes/new" className="text-xs text-amber-600 hover:text-amber-700 mt-2 font-medium">
              Créer ma première demande →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentDemandes.map((demande: Demande) => (
              <Link
                key={demande.id}
                to={`/demandes/${demande.id}`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
              >
                <QualityScoreRing score={demande.qualityScore} size={32} strokeWidth={3} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-amber-700 transition-colors">{demande.title}</p>
                  <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(demande.createdAt), { addSuffix: true, locale: fr })}</p>
                </div>
                <DemandeStatusBadge status={demande.status} />
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
