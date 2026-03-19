import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Zap, FileText, ShoppingBag,
  MessageSquare, Store, User, TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const buyerNav = [
  {
    group: 'Mon Espace',
    items: [
      { to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
      { to: '/demandes', label: 'Mes Demandes', icon: FileText },
      { to: '/offres', label: 'Offres Reçues', icon: ShoppingBag },
      { to: '/negociations', label: 'Négociations', icon: TrendingUp },
    ],
  },
  {
    group: 'Découverte',
    items: [
      { to: '/fournisseurs', label: 'Fournisseurs', icon: Store },
      { to: '/messages', label: 'Messagerie', icon: MessageSquare },
    ],
  },
];

const supplierNav = [
  {
    group: 'Mon Espace',
    items: [
      { to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
      { to: '/appels', label: "Appels d'Offres", icon: FileText },
      { to: '/propositions', label: 'Mes Propositions', icon: TrendingUp },
    ],
  },
  {
    group: 'Activité',
    items: [
      { to: '/catalogue', label: 'Mon Catalogue', icon: Store },
      { to: '/messages', label: 'Messagerie', icon: MessageSquare },
    ],
  },
];

const roleLabel: Record<string, string> = {
  BUYER: 'Acheteur',
  SUPPLIER: 'Fournisseur',
  ADMIN: 'Admin',
  SUPERADMIN: 'Super Admin',
};

const roleColor: Record<string, string> = {
  BUYER: 'bg-blue-500/20 text-blue-300',
  SUPPLIER: 'bg-amber-500/20 text-amber-300',
  ADMIN: 'bg-red-500/20 text-red-300',
  SUPERADMIN: 'bg-purple-500/20 text-purple-300',
};

function getInitials(firstName?: string, lastName?: string) {
  const f = firstName?.[0] ?? '';
  const l = lastName?.[0] ?? '';
  return (f + l).toUpperCase() || 'U';
}

export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const isSupplier = user?.role === 'SUPPLIER';
  const navGroups = isSupplier ? supplierNav : buyerNav;
  const role = user?.role ?? 'BUYER';

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#111111] flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-[#FFC107] rounded-lg flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-[#111111]" />
        </div>
        <div>
          <span className="text-white font-bold text-lg tracking-tight">MAWRID</span>
          <p className="text-white/40 text-[10px] uppercase tracking-widest">Espace Client</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {navGroups.map(({ group, items }) => (
          <div key={group}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
              {group}
            </p>
            <div className="space-y-0.5">
              {items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive
                      ? 'bg-[#FFC107] text-[#111111]'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile card */}
      <div className="px-3 py-4 border-t border-white/10">
        <NavLink
          to="/profil"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/8 transition-colors group"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#FFC107] flex items-center justify-center shrink-0 text-[#111111] text-xs font-bold">
            {getInitials(user?.firstName, user?.lastName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate leading-tight">
              {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : 'Mon Compte'}
            </p>
            <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 ${roleColor[role] ?? roleColor.BUYER}`}>
              {roleLabel[role] ?? role}
            </span>
          </div>
          <User className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 shrink-0" />
        </NavLink>
      </div>
    </aside>
  );
}
