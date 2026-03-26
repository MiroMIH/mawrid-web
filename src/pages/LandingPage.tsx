import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, ArrowRight, Check, Star, ChevronRight,
  Search, Building2, Bell, Phone,
  Settings, Flame, Layers, Leaf, Activity, Zap,
  Car, FileText, Package, Sun, Hammer, Droplet, Wrench,
  Scissors, Box, TrendingUp,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// FONTS: Space Grotesk (headings) + Inter (body)
// ─────────────────────────────────────────────────────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration:.01ms!important; transition-duration:.01ms!important; }
  }

  :root {
    --amber:   #F5A623;
    --amber-d: #C4811A;
    --dark:    #0A0A0A;
    --canvas:  #F5F4F1;
    --muted:   #6B6B66;
    --border:  rgba(0,0,0,0.08);
    --f-head:  'Space Grotesk', system-ui, sans-serif;
    --f-body:  'Inter', system-ui, sans-serif;
  }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes ticker   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes cardUp0  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-7px)} }
  @keyframes cardUp1  { 0%,100%{transform:translateY(-3px)} 50%{transform:translateY(4px)} }
  @keyframes cardUp2  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-5px)} }
  @keyframes navDrop  { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
  @keyframes drawer   { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes glowPulse    { 0%,100%{opacity:.55} 50%{opacity:.85} }
  @keyframes livePulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:.4} }
  @keyframes underlineDraw { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes toastIn      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes toastOut     { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(10px)} }

  .live-dot { display:inline-block; width:7px; height:7px; border-radius:50%; background:#22C55E; animation:livePulse 1.8s ease-in-out infinite; flex-shrink:0; }
  .hero-underline { position:relative; display:inline-block; }
  .hero-underline::after { content:''; position:absolute; bottom:4px; left:0; right:0; height:4px; background:#F5A623; border-radius:3px; transform-origin:left; animation:underlineDraw .65s .9s ease-out both; }
  .toast-enter { animation:toastIn .32s ease-out both; }
  .toast-exit  { animation:toastOut .26s ease-in both; }

  .ticker-track         { display:flex; width:max-content; animation:ticker 40s linear infinite; }
  .ticker-track:hover   { animation-play-state:paused; }
  .trust-card           { transition:border-color .22s ease,transform .22s ease; }
  .trust-card:hover     { border-color:rgba(255,255,255,0.22) !important; transform:translateY(-4px); }

  .sr     { opacity:0; transform:translateY(16px); transition:opacity .65s ease,transform .65s ease; }
  .sr.in  { opacity:1; transform:translateY(0); }

  .hov-lift { transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease; }
  .hov-lift:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(0,0,0,.1); }

  .hov-card { transition:border-color .2s ease,box-shadow .2s ease; }
  .hov-card:hover { border-color:rgba(245,166,35,.35)!important; box-shadow:0 8px 32px rgba(0,0,0,.07); }

  html { scroll-behavior:smooth; }
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { -webkit-font-smoothing:antialiased; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const COMPANIES = [
  { name: 'ArcelorMittal Annaba', init: 'AM', color: '#2563EB' },
  { name: 'CEVITAL Béjaïa',       init: 'CV', color: '#16A34A' },
  { name: 'SONATRACH',            init: 'SN', color: '#C4811A' },
  { name: 'Cosider Groupe',       init: 'CG', color: '#475569' },
  { name: 'ENMTP Constantine',    init: 'EN', color: '#4F46E5' },
  { name: 'SNVI Rouiba',          init: 'SV', color: '#DC2626' },
  { name: 'Pharmal Alger',        init: 'PH', color: '#0D9488' },
  { name: 'Lafarge Algérie',      init: 'LF', color: '#EA580C' },
  { name: 'SAIDAL Groupe',        init: 'SA', color: '#7C3AED' },
  { name: 'ETUSA',                init: 'ET', color: '#0284C7' },
  { name: 'Groupe Hasnaoui',      init: 'GH', color: '#B45309' },
  { name: 'NCA Rouiba',           init: 'NC', color: '#15803D' },
];

// Top 3 reference clients — spotlighted in hero cards
const FEATURED = [
  { name: 'SONATRACH',         init: 'SN', color: '#C4811A', sector: 'Énergie & Pétrochimie' },
  { name: 'CEVITAL Béjaïa',    init: 'CV', color: '#16A34A', sector: 'Agroalimentaire' },
  { name: 'ArcelorMittal Annaba', init: 'AM', color: '#2563EB', sector: 'Sidérurgie' },
];

const SECTORS = [
  { Icon: Settings,   name: 'Sidérurgie & Métallurgie',  count: 24 },
  { Icon: Flame,      name: 'Hydrocarbures & Énergie',   count: 18 },
  { Icon: Layers,     name: 'Mines & Carrières',          count: 12 },
  { Icon: Building2,  name: 'Matériaux de Construction', count: 31 },
  { Icon: Leaf,       name: 'Agroalimentaire',            count: 47 },
  { Icon: Box,        name: 'Agriculture & Machinisme',   count: 19 },
  { Icon: Activity,   name: 'Pharmaceutique',             count: 22 },
  { Icon: Zap,        name: 'Chimie & Pétrochimie',       count: 15 },
  { Icon: TrendingUp, name: 'Électronique & Électrique',  count: 28 },
  { Icon: Car,        name: 'Automobile & Transport',     count: 33 },
  { Icon: Scissors,   name: 'Textile & Cuir',             count: 16 },
  { Icon: Package,    name: 'Bois & Ameublement',         count: 14 },
  { Icon: FileText,   name: 'Papier & Imprimerie',        count: 11 },
  { Icon: Box,        name: 'Plasturgie & Caoutchouc',    count: 13 },
  { Icon: Sun,        name: 'Énergies Renouvelables',     count: 9  },
  { Icon: Hammer,     name: 'BTP & Travaux Publics',      count: 38 },
  { Icon: Droplet,    name: 'Eau & Environnement',        count: 17 },
  { Icon: Wrench,     name: 'Services Industriels',       count: 42 },
];

const TESTIMONIALS = [
  {
    quote: "Avant Mawrid, trouver un fournisseur de roulements à Annaba prenait deux semaines. Maintenant j'ai des réponses qualifiées en quelques heures.",
    name: 'Karim B.',
    role: 'Responsable Achats',
    company: 'Groupe Sidérurgique',
    stars: 5,
  },
  {
    quote: "En tant que fournisseur CNC à Sétif, Mawrid m'a ouvert des marchés dans tout l'Est algérien. Des clients que je n'aurais jamais pu atteindre seul.",
    name: 'Yacine M.',
    role: 'Gérant',
    company: 'MECA PRECISION Sétif',
    stars: 5,
  },
  {
    quote: "La transparence du système nous a convaincus. Le score de correspondance explique exactement pourquoi chaque fournisseur est sélectionné.",
    name: 'Sofiane H.',
    role: 'Directeur Logistique',
    company: 'CEVITAL',
    stars: 5,
  },
];

const BUYER_STEPS = [
  {
    Icon: Search, num: '01',
    title: 'Publiez votre demande',
    desc: 'Décrivez votre besoin : produit, quantité, délai, wilaya. Notre moteur calcule un score de qualité instantanément.',
  },
  {
    Icon: Bell, num: '02',
    title: 'Recevez des offres',
    desc: 'Les fournisseurs les mieux classés sont notifiés en temps réel — selon la correspondance, la proximité et l\'urgence.',
  },
  {
    Icon: Phone, num: '03',
    title: 'Contactez directement',
    desc: 'Accédez à la liste classée des disponibles. Appelez sans passer par nous — 0% de commission, 100% direct.',
  },
];

const SUPPLIER_STEPS = [
  {
    Icon: Building2, num: '01',
    title: 'Créez votre profil',
    desc: 'Inscrivez-vous en 5 minutes. Sélectionnez vos catégories et vos wilayas de couverture. C\'est gratuit.',
  },
  {
    Icon: Bell, num: '02',
    title: 'Recevez des alertes',
    desc: 'Notification instantanée dès qu\'une demande correspond à votre secteur et votre zone. Répondez avant les autres.',
  },
  {
    Icon: Phone, num: '03',
    title: 'Répondez, l\'acheteur appelle',
    desc: 'Confirmez votre disponibilité en un clic. L\'acheteur vous contacte directement. Aucun intermédiaire.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

function useScrolled(px = 40) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > px);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [px]);
  return s;
}

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible: v };
}

function useCountUp(target: number, go: boolean, ms = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!go) return;
    const t0 = performance.now();
    const f = (t: number) => {
      const p = Math.min((t - t0) / ms, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }, [go, target, ms]);
  return n;
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────

function Navbar() {
  const navigate = useNavigate();
  const scrolled = useScrolled(50);
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Fonctionnement', href: '#how' },
    { label: 'Acheteurs',      href: '#acheteurs' },
    { label: 'Fournisseurs',   href: '#fournisseurs' },
    { label: 'Secteurs',       href: '#secteurs' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 60,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.05)' : 'none',
      transition: 'all .3s ease',
      animation: 'navDrop .4s ease-out both',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', height: '100%', display: 'flex', alignItems: 'center', gap: 0 }}>

        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginRight: 44 }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'serif', fontSize: 16, color: '#F5A623', lineHeight: 1 }}>م</span>
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: scrolled ? '#0A0A0A' : '#FFFFFF', letterSpacing: '.12em', transition: 'color .3s' }}>
            MAWRID
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center flex-1" style={{ gap: 2 }}>
          {links.map(l => (
            <a key={l.href} href={l.href} style={{
              fontFamily: 'Inter, sans-serif', fontSize: 13.5, fontWeight: 500,
              color: scrolled ? '#5A5A55' : 'rgba(255,255,255,0.65)',
              padding: '7px 13px', borderRadius: 7, textDecoration: 'none',
              transition: 'color .15s, background .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = scrolled ? '#0A0A0A' : '#fff'; e.currentTarget.style.background = scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = scrolled ? '#5A5A55' : 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'transparent'; }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-2.5 ml-auto">
          <button
            onClick={() => navigate('/login')}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, fontWeight: 500, color: scrolled ? '#0A0A0A' : 'rgba(255,255,255,0.8)', padding: '7px 16px', borderRadius: 7, background: 'transparent', border: `1px solid ${scrolled ? 'rgba(0,0,0,0.13)' : 'rgba(255,255,255,0.22)'}`, cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = scrolled ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.5)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = scrolled ? 'rgba(0,0,0,0.13)' : 'rgba(255,255,255,0.22)'; }}
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, fontWeight: 600, color: '#0A0A0A', padding: '7px 18px', borderRadius: 7, background: '#F5A623', border: 'none', cursor: 'pointer', transition: 'opacity .15s,transform .15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '.9'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
          >
            Commencer gratuitement
          </button>
        </div>

        {/* Mobile burger */}
        <button
          className="lg:hidden ml-auto"
          onClick={() => setOpen(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: scrolled ? '#0A0A0A' : '#fff' }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ position: 'absolute', top: 60, left: 0, right: 0, background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '8px 28px 22px', boxShadow: '0 12px 48px rgba(0,0,0,0.12)', animation: 'drawer .22s ease-out' }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 500, color: '#1A1A18', padding: '13px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', textDecoration: 'none' }}
            >
              {l.label} <ChevronRight size={15} style={{ color: '#BBBBB4' }} />
            </a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            <button onClick={() => { navigate('/login'); setOpen(false); }} style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, padding: '11px', borderRadius: 9, background: 'transparent', border: '1px solid rgba(0,0,0,0.12)', cursor: 'pointer' }}>Se connecter</button>
            <button onClick={() => { navigate('/register'); setOpen(false); }} style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, padding: '11px', borderRadius: 9, background: '#F5A623', border: 'none', cursor: 'pointer', color: '#0A0A0A' }}>Commencer gratuitement</button>
          </div>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function PlatformMockup() {
  const ITEMS = [
    { title: 'Roulements à billes 6205', qty: '500 unités', loc: 'Annaba', status: 'Urgent', count: 12, color: '#22C55E' },
    { title: 'Tôles galvanisées 2 mm',   qty: '2 Tonnes',   loc: 'Oran',   status: 'En cours', count: 7,  color: '#F5A623' },
    { title: 'Filtres hydrauliques',      qty: 'Lot de 200', loc: 'Béjaïa', status: 'Nouveau',  count: 4,  color: '#818CF8' },
    { title: 'Câbles électriques 25mm²',  qty: '500m',       loc: 'Alger',  status: 'En cours', count: 9,  color: '#F5A623' },
  ];

  return (
    <div style={{
      background: '#141414',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
      width: '100%',
      animation: 'fadeUp .7s .35s ease-out both',
    }}>
      {/* Chrome bar */}
      <div style={{ background: '#1C1C1C', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '4px 12px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>app.mawrid.dz/demandes</span>
        </div>
      </div>

      {/* Top bar */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>Mes demandes</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>32 demandes actives ce mois</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 7, background: '#F5A623', cursor: 'pointer' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#0A0A0A' }}>+ Nouvelle</span>
        </div>
      </div>

      {/* Items */}
      <div>
        {ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              padding: '13px 18px',
              borderBottom: i < ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              display: 'flex', alignItems: 'center', gap: 12,
              background: i === 0 ? 'rgba(245,166,35,0.04)' : 'transparent',
              transition: 'background .15s',
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, flexShrink: 0, boxShadow: `0 0 6px ${item.color}60` }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: '#F0F0EE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                {item.qty} · {item.loc}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10.5, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: 4 }}>
                {item.status}
              </span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: item.color }}>
                {item.count}
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10.5, color: 'rgba(255,255,255,0.2)' }}>réponses</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div style={{ padding: '11px 18px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Voir toutes les demandes</span>
        <ArrowRight size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
      </div>
    </div>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '30%', width: 600, height: 500, background: 'radial-gradient(ellipse, rgba(245,166,35,0.09) 0%, transparent 65%)', pointerEvents: 'none', animation: 'glowPulse 6s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '0', right: '5%', width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(245,166,35,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Fine grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 28px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: 72 }}
        className="max-lg:!grid-cols-1 max-lg:!gap-10"
      >
        {/* Left */}
        <div>
          {/* Pill badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 13px 5px 5px', borderRadius: 100, border: '1px solid rgba(245,166,35,0.2)', background: 'rgba(245,166,35,0.07)', marginBottom: 28, animation: 'fadeUp .5s .08s ease-out both' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, padding: '2px 8px 2px 7px', borderRadius: 100, background: '#F5A623', color: '#0A0A0A', letterSpacing: '.03em' }}>
              <span className="live-dot" style={{ background: '#0A0A0A', opacity: 0.6 }} />
              EN DIRECT
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>18 secteurs industriels couverts</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(38px,4.8vw,62px)', color: '#FFFFFF', lineHeight: 1.06, letterSpacing: '-.03em', marginBottom: 22, animation: 'fadeUp .55s .16s ease-out both' }}>
            L'approvisionnement<br />
            industriel en Algérie,<br />
            <span className="hero-underline" style={{ color: '#F5A623' }}>réinventé.</span>
          </h1>

          {/* Body */}
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 17, lineHeight: 1.72, color: 'rgba(255,255,255,0.48)', marginBottom: 36, maxWidth: 430, animation: 'fadeUp .55s .24s ease-out both' }}>
            Publiez une demande. Recevez des offres de fournisseurs vérifiés à travers les 48 wilayas.
            Contact direct, zéro commission.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36, animation: 'fadeUp .55s .32s ease-out both' }}>
            <button
              onClick={() => navigate('/register')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, color: '#0A0A0A', padding: '13px 26px', borderRadius: 10, background: '#F5A623', border: 'none', cursor: 'pointer', transition: 'opacity .15s,transform .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '.9'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
            >
              Commencer gratuitement <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/register?role=supplier')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 15, color: 'rgba(255,255,255,0.7)', padding: '13px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'background .15s,border-color .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              Je suis fournisseur
            </button>
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', animation: 'fadeUp .55s .4s ease-out both', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {['Inscription gratuite', '0% commission', 'Contact direct'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Check size={13} style={{ color: '#F5A623' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: platform mockup */}
        <div className="hidden lg:block">
          <PlatformMockup />
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 12, animation: 'fadeUp .6s .5s ease-out both' }}>
            {[{ n: '892+', l: 'fournisseurs' }, { n: '18', l: 'secteurs' }, { n: '48', l: 'wilayas' }].map(s => (
              <div key={s.n} style={{ textAlign: 'center', padding: '14px 8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 20, color: '#F5A623', letterSpacing: '-.01em' }}>{s.n}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGO TICKER
// ─────────────────────────────────────────────────────────────────────────────

function LogoTicker() {
  const rest = COMPANIES.filter(c => !FEATURED.find(f => f.name === c.name));
  const items = [...rest, ...rest];
  return (
    <section style={{ background: '#0F0F0E', padding: '72px 0 60px', overflow: 'hidden' }}>

      {/* Badge */}
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <span style={{
          display: 'inline-block',
          fontFamily: 'Inter, sans-serif',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: '#C4811A',
          border: '1px solid rgba(196,129,26,0.4)',
          borderRadius: 100,
          padding: '5px 16px',
        }}>
          Références clients
        </span>
      </div>

      {/* Headline */}
      <p style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 'clamp(26px, 3.5vw, 40px)',
        fontWeight: 700,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 1.15,
        marginBottom: 52,
      }}>
        Ils font confiance à{' '}
        <span style={{ color: '#C4811A' }}>Mawrid</span>
      </p>

      {/* 3 Hero cards */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        padding: '0 24px',
        flexWrap: 'wrap',
        marginBottom: 56,
      }}>
        {FEATURED.map((c) => (
          <div
            key={c.name}
            className="trust-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 22,
              padding: '36px 44px',
              minWidth: 200,
              cursor: 'default',
            }}
          >
            {/* Glowing monogram */}
            <div style={{
              width: 68,
              height: 68,
              borderRadius: 18,
              background: c.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 40px ${c.color}50, 0 0 80px ${c.color}20`,
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 800,
                fontSize: 19,
                color: '#fff',
                letterSpacing: '.03em',
              }}>{c.init}</span>
            </div>

            {/* Name + sector */}
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                color: '#FFFFFF',
                marginBottom: 5,
                whiteSpace: 'nowrap',
              }}>{c.name}</p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '.04em',
                textTransform: 'uppercase',
              }}>{c.sector}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        maxWidth: 860,
        margin: '0 auto 28px',
        padding: '0 32px',
      }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.22)',
          whiteSpace: 'nowrap',
          letterSpacing: '.1em',
          textTransform: 'uppercase',
        }}>
          + {rest.length} autres entreprises
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* Ticker — remaining companies */}
      <div style={{
        overflow: 'hidden',
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}>
        <div className="ticker-track" style={{ gap: 12, padding: '4px 0' }}>
          {items.map((c, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '8px 16px',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.025)',
              flexShrink: 0,
              height: 44,
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: c.color + '28',
                border: `1px solid ${c.color}50`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 9.5,
                  color: c.color,
                  letterSpacing: '.03em',
                }}>{c.init}</span>
              </div>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.5)',
                whiteSpace: 'nowrap',
              }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────

function HowItWorks() {
  const [tab, setTab] = useState<'buyer' | 'supplier'>('buyer');
  const { ref, visible } = useReveal(0.08);
  const steps = tab === 'buyer' ? BUYER_STEPS : SUPPLIER_STEPS;

  return (
    <section id="how" style={{ background: '#F5F4F1', padding: '104px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div className={`sr ${visible ? 'in' : ''}`} style={{ maxWidth: 560, marginBottom: 56 }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#F5A623', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Comment ça marche
          </p>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(28px,3.2vw,42px)', color: '#0A0A0A', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 14 }}>
            Simple. Rapide. Direct.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#6B6B66', lineHeight: 1.7 }}>
            Que vous soyez acheteur ou fournisseur, Mawrid simplifie chaque étape de l'approvisionnement industriel.
          </p>
        </div>

        {/* Tabs */}
        <div className={`sr ${visible ? 'in' : ''}`} style={{ display: 'flex', gap: 8, marginBottom: 40, transitionDelay: '.08s' }}>
          {(['buyer', 'supplier'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13.5,
                padding: '9px 20px', borderRadius: 8, border: tab === t ? '1px solid #0A0A0A' : '1px solid rgba(0,0,0,0.1)',
                cursor: 'pointer', transition: 'all .2s',
                background: tab === t ? '#0A0A0A' : '#fff',
                color: tab === t ? '#fff' : '#6B6B66',
              }}
            >
              {t === 'buyer' ? '  Acheteurs' : '  Fournisseurs'}
            </button>
          ))}
        </div>

        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 14 }}>
          {steps.map((step, i) => (
            <div key={`${tab}-${i}`} className={`sr ${visible ? 'in' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '32px 28px', height: '100%', position: 'relative', overflow: 'hidden' }}>

                {/* Number watermark */}
                <div style={{ position: 'absolute', top: -8, right: 14, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 80, color: 'rgba(245,166,35,0.055)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
                  {step.num}
                </div>

                {/* Icon */}
                <div style={{ width: 44, height: 44, borderRadius: 11, background: '#F5F4F1', border: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <step.Icon size={19} style={{ color: '#C4811A' }} />
                </div>

                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: '#F5A623', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 7 }}>
                  Étape {step.num}
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 17, color: '#0A0A0A', marginBottom: 10, lineHeight: 1.3, letterSpacing: '-.01em' }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#6B6B66', lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────

function StatBox({ target, suffix, label, sub }: { target: number; suffix: string; label: string; sub?: string }) {
  const { ref, visible } = useReveal(0.5);
  const n = useCountUp(target, visible);
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '16px 12px' }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(44px,5vw,68px)', color: '#F5A623', lineHeight: 1, letterSpacing: '-.03em' }}>
        {n}{suffix}
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, color: '#fff', marginTop: 10, letterSpacing: '-.01em' }}>
        {label}
      </div>
      {sub && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12.5, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function StatsSection() {
  return (
    <section style={{ background: '#0A0A0A', padding: '88px 28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 300, background: 'radial-gradient(ellipse, rgba(245,166,35,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0 }}>
          {[
            { target: 892, suffix: '+', label: 'Fournisseurs actifs',      sub: 'à travers l\'Algérie' },
            { target: 18,  suffix: '',  label: 'Secteurs industriels',     sub: 'de la mine au textile' },
            { target: 48,  suffix: '',  label: 'Wilayas couvertes',         sub: 'couverture nationale' },
            { target: 2,   suffix: 'h', label: 'Temps de réponse moyen',   sub: 'en moyenne' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'relative' }}>
              {i > 0 && <div className="hidden lg:block" style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: 1, background: 'rgba(255,255,255,0.07)' }} />}
              <StatBox {...s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTORS
// ─────────────────────────────────────────────────────────────────────────────

function SectorCard({ s, i, visible }: { s: typeof SECTORS[0]; i: number; visible: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={`sr ${visible ? 'in' : ''}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hov ? 'rgba(245,166,35,0.32)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 12,
        padding: '18px 16px',
        transitionDelay: `${i * 0.025}s`,
        cursor: 'default',
        transition: 'border-color .2s, box-shadow .2s',
        boxShadow: hov ? '0 6px 28px rgba(245,166,35,0.09)' : 'none',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: hov ? 'rgba(245,166,35,0.1)' : '#F5F4F1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10,
        transition: 'background .2s, box-shadow .2s',
        boxShadow: hov ? '0 0 0 1px rgba(245,166,35,0.22)' : 'none',
      }}>
        <s.Icon size={17} style={{ color: hov ? '#F5A623' : '#C4811A', transition: 'color .2s' }} />
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12.5, color: '#0A0A0A', lineHeight: 1.4, marginBottom: 3 }}>
        {s.name}
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: hov ? '#C4811A' : '#AAAAA4', transition: 'color .2s' }}>
        {s.count} sous-catégories
      </div>
    </div>
  );
}

function SectorsGrid() {
  const { ref, visible } = useReveal(0.05);
  return (
    <section id="secteurs" style={{ background: '#fff', padding: '104px 28px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className={`sr ${visible ? 'in' : ''}`} style={{ marginBottom: 52 }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#F5A623', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Secteurs
          </p>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(28px,3.2vw,42px)', color: '#0A0A0A', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 12 }}>
            18 secteurs industriels
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#6B6B66', lineHeight: 1.6, maxWidth: 500 }}>
            De la sidérurgie à l'agroalimentaire, toute l'industrie algérienne en un seul endroit.
          </p>
        </div>

        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(174px, 1fr))', gap: 10 }}>
          {SECTORS.map((s, i) => (
            <SectorCard key={s.name} s={s} i={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────

function Testimonials() {
  const { ref, visible } = useReveal(0.08);
  return (
    <section style={{ background: '#F5F4F1', padding: '104px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className={`sr ${visible ? 'in' : ''}`} style={{ marginBottom: 52 }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#F5A623', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Témoignages
          </p>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(28px,3.2vw,42px)', color: '#0A0A0A', letterSpacing: '-.025em', lineHeight: 1.1 }}>
            Ce que disent nos clients
          </h2>
        </div>

        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`hov-lift sr ${visible ? 'in' : ''}`}
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '30px 28px', transitionDelay: `${i * 0.1}s`, position: 'relative', overflow: 'hidden' }}
            >
              {/* Quote watermark */}
              <div style={{ position: 'absolute', top: 10, right: 20, fontFamily: 'Georgia, serif', fontSize: 96, color: 'rgba(245,166,35,0.07)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>"</div>

              <div style={{ display: 'flex', gap: 2, marginBottom: 18 }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={13} style={{ color: '#F5A623', fill: '#F5A623' }} />
                ))}
              </div>

              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#3A3A36', lineHeight: 1.74, marginBottom: 24 }}>
                "{t.quote}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 11, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245,166,35,0.1)', border: '1.5px solid rgba(245,166,35,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: '#C4811A' }}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13.5, color: '#0A0A0A' }}>{t.name}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9A9A94', marginTop: 1 }}>
                    {t.role} · <span style={{ color: '#C4811A' }}>{t.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DUAL CTA
// ─────────────────────────────────────────────────────────────────────────────

function DualCTA() {
  const navigate = useNavigate();
  const { ref, visible } = useReveal(0.1);

  return (
    <section style={{ background: '#0A0A0A', padding: '104px 28px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        <div className={`sr ${visible ? 'in' : ''}`} style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,46px)', color: '#fff', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 12 }}>
            Prêt à commencer ?
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.38)', maxWidth: 380, margin: '0 auto' }}>
            Gratuit. Sans engagement. Zéro commission.
          </p>
        </div>

        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
          {/* Buyer */}
          <div className={`sr ${visible ? 'in' : ''}`} style={{
            background: 'rgba(245,166,35,0.07)', border: '1px solid rgba(245,166,35,0.16)',
            borderRadius: 16, padding: '40px 36px', transitionDelay: '0s',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245,166,35,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, border: '1px solid rgba(245,166,35,0.18)' }}>
              <Search size={21} style={{ color: '#F5A623' }} />
            </div>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 21, color: '#fff', marginBottom: 10, letterSpacing: '-.015em', lineHeight: 1.25 }}>
              Vous cherchez un fournisseur ?
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 28 }}>
              Publiez votre demande en quelques minutes. Recevez des offres de fournisseurs qualifiés dans votre région.
            </p>
            <button
              onClick={() => navigate('/register')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#0A0A0A', padding: '11px 22px', borderRadius: 9, background: '#F5A623', border: 'none', cursor: 'pointer', transition: 'opacity .15s,transform .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '.88'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
            >
              Publier une demande <ArrowRight size={15} />
            </button>
          </div>

          {/* Supplier */}
          <div className={`sr ${visible ? 'in' : ''}`} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '40px 36px', transitionDelay: '.1s',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, border: '1px solid rgba(255,255,255,0.09)' }}>
              <Building2 size={21} style={{ color: 'rgba(255,255,255,0.55)' }} />
            </div>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 21, color: '#fff', marginBottom: 10, letterSpacing: '-.015em', lineHeight: 1.25 }}>
              Vous êtes fournisseur ?
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 28 }}>
              Inscrivez-vous gratuitement, sélectionnez vos secteurs et recevez des demandes qualifiées dès aujourd'hui.
            </p>
            <button
              onClick={() => navigate('/register?role=supplier')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#0A0A0A', padding: '11px 22px', borderRadius: 9, background: '#fff', border: 'none', cursor: 'pointer', transition: 'opacity .15s,transform .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '.9'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
            >
              Devenir fournisseur <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
  const COLS = [
    { title: 'Plateforme', links: ['Fonctionnement', 'Pour les acheteurs', 'Pour les fournisseurs', 'Tarifs'] },
    { title: 'Secteurs',   links: ['Sidérurgie', 'Agroalimentaire', 'BTP', 'Énergie', 'Voir tous'] },
    { title: 'Entreprise', links: ['À propos', 'Contact', 'Presse', 'Recrutement'] },
    { title: 'Légal',      links: ['CGU', 'Confidentialité', 'Mentions légales'] },
  ];

  return (
    <footer style={{ background: '#070707', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 28px 28px' }}>

        {/* Brand + cols */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 32, marginBottom: 48, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          className="max-lg:!grid-cols-2"
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'serif', fontSize: 15, color: '#F5A623' }}>م</span>
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: '.12em' }}>MAWRID</span>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.22)', lineHeight: 1.65, maxWidth: 180 }}>
              La plateforme B2B industrielle algérienne.
            </p>
          </div>

          {/* Columns */}
          {COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.28)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: 'rgba(255,255,255,0.26)', textDecoration: 'none', transition: 'color .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.26)'; }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>
            © 2026 Mawrid. Tous droits réservés.
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>
            Fait avec ♥ en Algérie 🇩🇿
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE ACTIVITY TOAST
// ─────────────────────────────────────────────────────────────────────────────

const ACTIVITIES = [
  { icon: '🔔', msg: 'Nouveau fournisseur a répondu', detail: 'Roulements 6205 · Annaba',      time: '2 min' },
  { icon: '📋', msg: 'Demande publiée',               detail: 'Tôles galvanisées 2mm · Oran',  time: '4 min' },
  { icon: '✅', msg: 'Accord conclu',                 detail: 'Câbles électriques · Alger',    time: '9 min' },
  { icon: '🏭', msg: 'Nouveau fournisseur inscrit',   detail: 'MECA PRECISION · Sétif',        time: '12 min' },
  { icon: '🔔', msg: '14 offres reçues',              detail: 'Filtres hydrauliques · Béjaïa', time: '16 min' },
];

function LiveActivity() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    const delay = setTimeout(() => {
      const t = setInterval(() => {
        setPhase('exit');
        setTimeout(() => {
          setIdx(i => (i + 1) % ACTIVITIES.length);
          setPhase('enter');
        }, 320);
      }, 4800);
      return () => clearInterval(t);
    }, 2200);
    return () => clearTimeout(delay);
  }, []);

  const a = ACTIVITIES[idx];
  return (
    <div
      className={phase === 'enter' ? 'toast-enter' : 'toast-exit'}
      style={{
        position: 'fixed', bottom: 28, left: 28, zIndex: 300,
        background: 'rgba(14,14,14,0.94)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14,
        padding: '11px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        maxWidth: 272,
        boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: 'rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17, flexShrink: 0,
      }}>
        {a.icon}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 12.5, fontWeight: 600,
          color: '#FFFFFF', marginBottom: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{a.msg}</p>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 11.5,
          color: 'rgba(255,255,255,0.38)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{a.detail}</p>
      </div>
      <span style={{
        fontFamily: 'Inter, sans-serif', fontSize: 10.5,
        color: 'rgba(255,255,255,0.18)',
        whiteSpace: 'nowrap', flexShrink: 0, alignSelf: 'flex-start',
      }}>
        {a.time}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function LandingPage() {
  useEffect(() => {
    document.title = 'Mawrid — Plateforme B2B Industrielle Algérienne';
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Navbar />
      <LiveActivity />
      <HeroSection />
      <LogoTicker />
      <HowItWorks />
      <StatsSection />
      <SectorsGrid />
      <Testimonials />
      <DualCTA />
      <Footer />
    </>
  );
}
