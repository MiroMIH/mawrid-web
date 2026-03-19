import { Bell, Search, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../features/auth/api';

const roleLabel: Record<string, string> = {
  BUYER: 'Acheteur',
  SUPPLIER: 'Fournisseur',
  ADMIN: 'Admin',
  SUPERADMIN: 'Super Admin',
};

function getInitials(firstName?: string, lastName?: string) {
  const f = firstName?.[0] ?? '';
  const l = lastName?.[0] ?? '';
  return (f + l).toUpperCase() || 'U';
}

export function Topbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate('/login');
    }
  };

  const initials = getInitials(user?.firstName, user?.lastName);
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : 'Mon Compte';
  const company = user?.companyName;
  const role = user?.role ?? 'BUYER';

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-30 shadow-sm">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-80 transition-all focus-within:border-[#FFC107] focus-within:bg-white focus-within:shadow-sm">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder={role === 'SUPPLIER' ? 'Rechercher des demandes...' : 'Rechercher des fournisseurs...'}
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors group">
          <Bell className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          {/* Badge with count */}
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#FFC107] rounded-full flex items-center justify-center">
            <span className="text-[9px] font-bold text-[#111111] px-0.5">3</span>
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Profile */}
        <div className="flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
          {/* Initials avatar */}
          <div className="w-8 h-8 bg-[#FFC107] rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-[#111111] text-xs font-bold">{initials}</span>
          </div>
          <div className="text-sm leading-tight">
            <p className="font-semibold text-gray-900 truncate max-w-[120px]">{displayName}</p>
            <p className="text-[11px] text-gray-400 truncate max-w-[120px]">
              {company ?? roleLabel[role] ?? role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
          title="Déconnexion"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}
