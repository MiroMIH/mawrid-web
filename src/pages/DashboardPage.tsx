import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  FileText, TrendingUp, ShoppingBag, MessageSquare,
  ArrowUpRight, Activity, CheckCircle2, Zap,
  Plus, Store, Send, ChevronRight, Package,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'tween' as const, duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: 'tween' as const, duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ── static data ── */
const buyerActivityData = [
  { day: 'Lun', demandes: 4, offres: 12 },
  { day: 'Mar', demandes: 7, offres: 18 },
  { day: 'Mer', demandes: 5, offres: 15 },
  { day: 'Jeu', demandes: 9, offres: 22 },
  { day: 'Ven', demandes: 6, offres: 20 },
  { day: 'Sam', demandes: 3, offres: 8 },
  { day: 'Dim', demandes: 2, offres: 5 },
];

const supplierActivityData = [
  { day: 'Lun', appels: 6, propositions: 3 },
  { day: 'Mar', appels: 11, propositions: 5 },
  { day: 'Mer', appels: 8, propositions: 4 },
  { day: 'Jeu', appels: 14, propositions: 7 },
  { day: 'Ven', appels: 10, propositions: 6 },
  { day: 'Sam', appels: 4, propositions: 2 },
  { day: 'Dim', appels: 3, propositions: 1 },
];

const statusItems = [
  { label: 'Plateforme MAWRID', status: 'Opérationnelle' },
  { label: 'Matching en temps réel', status: 'Actif' },
  { label: 'Notifications', status: 'Actif' },
  { label: 'Support', status: 'Disponible' },
];

/* ── custom tooltip ── */
function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── stat card ── */
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  change: string;
  accent: string;
  iconBg: string;
  index: number;
}

function StatCard({ label, value, icon: Icon, change, accent, iconBg, index }: StatCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden border-border/60 bg-card h-full cursor-pointer">
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${accent}`} />
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
              <motion.p
                key={String(value)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-foreground tabular-nums"
              >
                {value}
              </motion.p>
              <div className="flex items-center gap-1 pt-0.5">
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">{change}</span>
                <span className="text-xs text-muted-foreground">cette semaine</span>
              </div>
            </div>
            <div className={`p-2.5 rounded-xl ${iconBg} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ── quick action button ── */
interface QuickActionProps {
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  index: number;
}

function QuickAction({ label, description, icon: Icon, color, bgColor, index }: QuickActionProps) {
  return (
    <motion.button
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left bg-white border border-border/60 rounded-xl p-4 flex items-center gap-4 hover:border-[#FFC107]/50 hover:shadow-sm transition-all duration-200 group"
    >
      <div className={`p-2.5 rounded-xl ${bgColor} shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-[#FFC107] transition-colors shrink-0" />
    </motion.button>
  );
}

/* ── page ── */
export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isSupplier = user?.role === 'SUPPLIER';

  const buyerStats: Omit<StatCardProps, 'index'>[] = [
    { label: 'Mes Demandes', value: 12, icon: FileText, accent: 'bg-amber-500', iconBg: 'bg-amber-50', change: '+3' },
    { label: 'Offres Reçues', value: 48, icon: ShoppingBag, accent: 'bg-blue-500', iconBg: 'bg-blue-50', change: '+8' },
    { label: 'En Négociation', value: 5, icon: TrendingUp, accent: 'bg-emerald-500', iconBg: 'bg-emerald-50', change: '+2' },
    { label: 'Messages', value: 3, icon: MessageSquare, accent: 'bg-violet-500', iconBg: 'bg-violet-50', change: '+1' },
  ];

  const supplierStats: Omit<StatCardProps, 'index'>[] = [
    { label: "Appels d'Offres", value: 34, icon: FileText, accent: 'bg-amber-500', iconBg: 'bg-amber-50', change: '+6' },
    { label: 'Mes Propositions', value: 9, icon: Send, accent: 'bg-blue-500', iconBg: 'bg-blue-50', change: '+2' },
    { label: 'Contrats Actifs', value: 3, icon: Package, accent: 'bg-emerald-500', iconBg: 'bg-emerald-50', change: '+1' },
    { label: 'Messages', value: 7, icon: MessageSquare, accent: 'bg-violet-500', iconBg: 'bg-violet-50', change: '+3' },
  ];

  const buyerActions: Omit<QuickActionProps, 'index'>[] = [
    { label: 'Nouvelle Demande', description: 'Publier un appel à fournisseurs', icon: Plus, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { label: 'Parcourir Fournisseurs', description: '892 fournisseurs disponibles', icon: Store, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Voir mes Offres', description: '48 offres en attente de réponse', icon: ShoppingBag, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  ];

  const supplierActions: Omit<QuickActionProps, 'index'>[] = [
    { label: 'Soumettre une Offre', description: 'Répondre à un appel en cours', icon: Send, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { label: "Voir les Appels d'Offres", description: '34 nouvelles opportunités', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Mettre à jour le Catalogue', description: 'Gérer vos produits & services', icon: Package, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  ];

  const statCards = isSupplier ? supplierStats : buyerStats;
  const quickActions = isSupplier ? supplierActions : buyerActions;
  const activityData = isSupplier ? supplierActivityData : buyerActivityData;
  const chartKey1 = isSupplier ? 'appels' : 'demandes';
  const chartKey2 = isSupplier ? 'propositions' : 'offres';
  const chartLabel1 = isSupplier ? "Appels d'offres" : 'Demandes';
  const chartLabel2 = isSupplier ? 'Propositions' : 'Offres reçues';

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const firstName = user?.firstName ?? '';
  const roleLabel = isSupplier ? 'Fournisseur' : 'Acheteur';
  const greetingMessage = isSupplier
    ? 'Découvrez les nouvelles opportunités du jour.'
    : 'Trouvez les meilleurs fournisseurs pour vos besoins.';

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={staggerContainer}
    >
      {/* ── Header ── */}
      <motion.div variants={fadeUp} custom={0} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Bonjour{firstName ? `, ${firstName}` : ''} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">{greetingMessage}</p>
          <p className="text-muted-foreground/60 text-xs mt-1 capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Role badge */}
          <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
            isSupplier
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            {roleLabel}
          </div>
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Plateforme opérationnelle
          </motion.div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} index={i} />
        ))}
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div variants={fadeUp} custom={4}>
        <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action, i) => (
            <QuickAction key={action.label} {...action} index={i} />
          ))}
        </div>
      </motion.div>

      {/* ── Charts + Status ── */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Area chart */}
        <motion.div variants={scaleIn} className="lg:col-span-2">
          <Card className="border-border/60 h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Activité de la semaine</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {isSupplier ? "Appels d'offres & propositions sur 7 jours" : 'Demandes & offres sur 7 jours'}
                  </CardDescription>
                </div>
                <div className="p-2 rounded-lg bg-muted">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFC107]" />
                  {chartLabel1}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#111111]" />
                  {chartLabel2}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={activityData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFC107" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#FFC107" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111111" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey={chartKey1} stroke="#FFC107" strokeWidth={2} fill="url(#gradA)" name={chartLabel1} />
                  <Area type="monotone" dataKey={chartKey2} stroke="#111111" strokeWidth={2} fill="url(#gradB)" name={chartLabel2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column */}
        <motion.div variants={scaleIn} className="flex flex-col gap-4">
          {/* Platform Status */}
          <Card className="border-border/60 flex-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">État de la plateforme</CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs text-emerald-600 font-medium">Live</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {statusItems.map(({ label, status }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-600">{status}</span>
                      </div>
                    </div>
                    {i < statusItems.length - 1 && <Separator className="opacity-50" />}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Marketplace snapshot */}
          <motion.div whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}>
            <Card className="border-border/60 bg-[#111111] text-white">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#FFC107] shrink-0">
                    <Zap className="w-4 h-4 text-[#111111]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">MAWRID Marketplace</p>
                    <p className="text-xs text-white/50">B2B Industriel · Algérie</p>
                  </div>
                </div>
                <Separator className="bg-white/10 mb-3" />
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-[#FFC107]">892</p>
                    <p className="text-[10px] text-white/50 mt-0.5 uppercase tracking-wider">Fournisseurs</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#FFC107]">48</p>
                    <p className="text-[10px] text-white/50 mt-0.5 uppercase tracking-wider">Wilayas</p>
                  </div>
                </div>
                <Separator className="bg-white/10 my-3" />
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-[#FFC107]">18</p>
                    <p className="text-[10px] text-white/50 mt-0.5 uppercase tracking-wider">Secteurs</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#FFC107]">2.4k</p>
                    <p className="text-[10px] text-white/50 mt-0.5 uppercase tracking-wider">Transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
