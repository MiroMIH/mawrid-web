import { Bell, ChevronDown, LogOut, LayoutDashboard, FileText, Plus } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../api/client';

function getInitials(first?: string, last?: string) {
  return ((first?.[0] ?? '') + (last?.[0] ?? '')).toUpperCase() || 'U';
}

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setVisible(current < lastScrollY.current || current < 10);
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try { await apiClient.post('/auth/logout'); } catch { /* ignore */ }
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <header className={`fixed top-0 inset-x-0 h-16 bg-white border-b border-gray-100 z-50 shadow-sm transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-[#F5A623] rounded-lg flex items-center justify-center">
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 15, color: '#0D0D0D' }}>م</span>
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 17, color: '#0D0D0D', letterSpacing: '0.1em' }}>MAWRID</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          <NavLink to="/dashboard" className={linkClass} end><LayoutDashboard className="w-4 h-4" />Tableau de bord</NavLink>
          <NavLink to="/demandes" className={linkClass}><FileText className="w-4 h-4" />Mes Demandes</NavLink>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/demandes/new"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: '#0D0D0D', color: '#F5A623' }}
          >
            <Plus className="w-4 h-4" />Nouvelle demande
          </Link>

          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F5A623] rounded-full" />
          </button>

          <div className="relative" ref={ref}>
            <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
              <div className="w-8 h-8 bg-[#F5A623] rounded-full flex items-center justify-center shrink-0">
                <span className="text-[#0D0D0D] text-xs font-bold">{getInitials(user?.firstName, user?.lastName)}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-none">{user?.firstName ?? 'Mon compte'}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[90px]">{user?.companyName ?? 'Acheteur'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{user?.email}</p>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" />Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
