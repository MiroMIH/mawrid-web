/**
 * AuthLeftPanel — premium dark panel with soft aurora gradient orbs.
 * Customer-facing: benefit bullets + testimonial card.
 */

import { Zap, CheckCircle2, Quote } from 'lucide-react';

const BENEFITS = [
  'Matching instantané avec des fournisseurs vérifiés',
  'Couverture de toutes les 48 wilayas d\'Algérie',
  '18 secteurs industriels disponibles',
  'Négociations et contrats sécurisés en ligne',
];

const TESTIMONIAL = {
  quote: '«\u202fGrâce à MAWRID, j\'ai trouvé un fournisseur fiable en moins de 24h. Impressionnant.\u202f»',
  name: 'Karim B.',
  role: 'Directeur Achats',
  company: 'Groupe ENAC, Alger',
};

export function AuthLeftPanel() {
  return (
    <div
      className="relative flex flex-col h-full overflow-hidden select-none"
      style={{ background: '#080909' }}
    >
      <style>{`
        @keyframes lp-drift-a {
          0%,100% { transform: translate(0%,    0%)   scale(1);    opacity: 0.80; }
          20%     { transform: translate(8%,  -13%)   scale(1.12); opacity: 1;    }
          55%     { transform: translate(-5%,   7%)   scale(0.92); opacity: 0.60; }
          80%     { transform: translate(3%,   -5%)   scale(1.05); opacity: 0.90; }
        }
        @keyframes lp-drift-b {
          0%,100% { transform: translate(0%,    0%)   scale(1);    opacity: 0.75; }
          30%     { transform: translate(-9%,  10%)   scale(1.10); opacity: 1;    }
          65%     { transform: translate(6%,   -7%)   scale(0.91); opacity: 0.55; }
        }
        @keyframes lp-drift-c {
          0%,100% { transform: translate(0%,   0%)   scale(1);    opacity: 0.50; }
          50%     { transform: translate(6%,  -9%)   scale(1.10); opacity: 1;    }
        }
        @keyframes lp-drift-d {
          0%,100% { transform: translate(0%,   0%)   scale(1);    opacity: 0.70; }
          35%     { transform: translate(-5%,  11%)  scale(0.90); opacity: 0.45; }
          70%     { transform: translate(5%,  -4%)   scale(1.08); opacity: 1;    }
        }
        @keyframes lp-drift-e {
          0%,100% { transform: translate(0%,   0%)   scale(1);    opacity: 0.55; }
          25%     { transform: translate(-5%,  -9%)  scale(1.28); opacity: 1;    }
          60%     { transform: translate(5%,   7%)   scale(0.78); opacity: 0.40; }
          85%     { transform: translate(-2%,  -4%)  scale(1.10); opacity: 0.80; }
        }
        @keyframes lp-logo-in   { from { opacity:0; transform: translateY(-10px); } to { opacity:1; transform: translateY(0); } }
        @keyframes lp-text-in   { from { opacity:0; transform: translateY(18px);  } to { opacity:1; transform: translateY(0); } }
        @keyframes lp-stats-in  { from { opacity:0; transform: translateY(10px);  } to { opacity:1; transform: translateY(0); } }
        @keyframes lp-orb-in    { from { opacity:0; } to { opacity:1; } }
        @keyframes lp-accent-breathe {
          0%,100% { opacity:0.65; transform: scaleX(1);    }
          50%     { opacity:1;    transform: scaleX(1.06); }
        }
        .lp-orb-base { animation: lp-orb-in 2s ease-out both; }
        .lp-logo     { animation: lp-logo-in  0.7s 0.2s  cubic-bezier(.4,0,.2,1) both; }
        .lp-text     { animation: lp-text-in  0.8s 0.4s  cubic-bezier(.4,0,.2,1) both; }
        .lp-stats    { animation: lp-stats-in 0.7s 0.65s cubic-bezier(.4,0,.2,1) both; }
        .lp-accent   { animation: lp-accent-breathe 5s ease-in-out infinite; }
      `}</style>

      {/* ── Background orbs ── */}

      {/* A — large top-right, bright amber, fast pulse */}
      <div className="lp-orb-base absolute pointer-events-none" style={{ width:'90%', height:'90%', top:'-30%', right:'-20%', background:'radial-gradient(circle at 38% 38%, rgba(245,166,35,0.26) 0%, rgba(245,140,20,0.10) 45%, transparent 65%)', filter:'blur(52px)', animation:'lp-orb-in 1.8s 0s both, lp-drift-a 11s 2s ease-in-out infinite' }} />

      {/* B — large bottom-left, warm orange tint for aurora depth */}
      <div className="lp-orb-base absolute pointer-events-none" style={{ width:'80%', height:'78%', bottom:'-26%', left:'-22%', background:'radial-gradient(circle at 55% 55%, rgba(225,95,15,0.20) 0%, rgba(210,120,20,0.08) 50%, transparent 68%)', filter:'blur(60px)', animation:'lp-orb-in 2s 0.2s both, lp-drift-b 15s 2.3s ease-in-out infinite' }} />

      {/* C — full-screen soft center ambient */}
      <div className="lp-orb-base absolute pointer-events-none" style={{ inset:'-10%', background:'radial-gradient(ellipse 55% 45% at 52% 48%, rgba(245,166,35,0.09) 0%, transparent 70%)', filter:'blur(32px)', animation:'lp-orb-in 2.6s 0.6s both, lp-drift-c 22s 3s ease-in-out infinite' }} />

      {/* D — top-left secondary amber */}
      <div className="lp-orb-base absolute pointer-events-none" style={{ width:'58%', height:'58%', top:'-8%', left:'-12%', background:'radial-gradient(circle at 58% 58%, rgba(245,166,35,0.16) 0%, transparent 62%)', filter:'blur(46px)', animation:'lp-orb-in 2s 0.4s both, lp-drift-d 13s 2.5s ease-in-out infinite' }} />

      {/* E — NEW: small hot-core orb, bottom-right, fast dramatic pulse */}
      <div className="lp-orb-base absolute pointer-events-none" style={{ width:'42%', height:'42%', bottom:'6%', right:'4%', background:'radial-gradient(circle at 50% 50%, rgba(255,190,50,0.42) 0%, rgba(245,140,20,0.18) 40%, transparent 65%)', filter:'blur(20px)', animation:'lp-orb-in 1.5s 1.0s both, lp-drift-e 7s 2.5s ease-in-out infinite' }} />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:'radial-gradient(rgba(255,255,255,0.032) 1px, transparent 1px)', backgroundSize:'24px 24px' }} />

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:'repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.010) 47px, rgba(255,255,255,0.010) 48px)' }} />

      {/* Edge vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background:[ 'radial-gradient(ellipse 80% 60% at 0% 0%,    rgba(8,9,9,0.75) 0%, transparent 55%)', 'radial-gradient(ellipse 60% 70% at 100% 100%, rgba(8,9,9,0.65) 0%, transparent 55%)', 'linear-gradient(to top,    rgba(8,9,9,0.72) 0%, transparent 35%)', 'linear-gradient(to bottom, rgba(8,9,9,0.52) 0%, transparent 28%)', 'linear-gradient(to right,  rgba(8,9,9,0.30) 0%, transparent 40%)', ].join(', ') }} />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col h-full px-10 py-10">

        {/* Logo */}
        <div className="lp-logo flex items-center gap-3.5">
          <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg, rgba(245,166,35,0.20) 0%, rgba(245,166,35,0.06) 100%)', border:'1px solid rgba(245,166,35,0.28)', boxShadow:'0 0 20px rgba(245,166,35,0.08), inset 0 1px 0 rgba(245,166,35,0.10)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Zap style={{ width:22, height:22, color:'#F5A623', filter:'drop-shadow(0 0 8px rgba(245,166,35,0.5))' }} />
          </div>
          <div>
            <div style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:15, color:'#FFFFFF', letterSpacing:'0.18em', lineHeight:1.1 }}>MAWRID</div>
            <div style={{ fontFamily:'DM Sans, sans-serif', fontSize:9.5, color:'rgba(255,255,255,0.22)', letterSpacing:'0.05em', marginTop:2 }}>Espace Client · B2B Industriel</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Main brand block */}
        <div className="lp-text" style={{ marginBottom: 36 }}>
          <div style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:52, color:'#FFFFFF', letterSpacing:'0.18em', lineHeight:1, marginBottom:16 }}>
            MAWRID
          </div>

          {/* Amber accent line */}
          <div className="lp-accent" style={{ height:2, width:68, borderRadius:1, marginBottom:20, background:'linear-gradient(90deg, #F5A623 0%, rgba(245,166,35,0.12) 100%)', transformOrigin:'left' }} />

          {/* Tagline */}
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:13.5, color:'rgba(255,255,255,0.38)', lineHeight:1.75, maxWidth:285, marginBottom:28 }}>
            La marketplace B2B qui connecte acheteurs
            <br />et fournisseurs à travers toute l'Algérie.
          </p>

          {/* Benefit bullets */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {BENEFITS.map((benefit) => (
              <div key={benefit} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                <CheckCircle2 style={{ width:15, height:15, color:'#F5A623', marginTop:1, flexShrink:0, opacity:0.85 }} />
                <span style={{ fontFamily:'DM Sans, sans-serif', fontSize:12.5, color:'rgba(255,255,255,0.40)', lineHeight:1.5 }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial card */}
        <div
          className="lp-stats"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: '18px 20px',
            marginBottom: 28,
          }}
        >
          <Quote style={{ width:16, height:16, color:'#F5A623', opacity:0.7, marginBottom:10 }} />
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:12.5, color:'rgba(255,255,255,0.50)', lineHeight:1.65, fontStyle:'italic', marginBottom:14 }}>
            {TESTIMONIAL.quote}
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {/* Avatar initials */}
            <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(245,166,35,0.20)', border:'1px solid rgba(245,166,35,0.30)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:11, color:'#F5A623' }}>
                {TESTIMONIAL.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:11.5, color:'rgba(255,255,255,0.65)', lineHeight:1.2 }}>
                {TESTIMONIAL.name}
              </div>
              <div style={{ fontFamily:'DM Sans, sans-serif', fontSize:10, color:'rgba(255,255,255,0.28)', marginTop:2 }}>
                {TESTIMONIAL.role} · {TESTIMONIAL.company}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust stats */}
        <div className="lp-stats" style={{ display:'flex', gap:0 }}>
          {[
            { value: '892', label: 'fournisseurs actifs' },
            { value: '48',  label: 'wilayas couvertes' },
            { value: '2.4k', label: 'transactions' },
          ].map((stat, i) => (
            <div key={stat.value} style={{ display:'flex', alignItems:'center' }}>
              {i > 0 && <div style={{ width:1, alignSelf:'stretch', background:'rgba(255,255,255,0.07)', margin:'0 20px', minHeight:30 }} />}
              <div>
                <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:20, color:'#F5A623', lineHeight:1, textShadow:'0 0 20px rgba(245,166,35,0.28)' }}>{stat.value}</div>
                <div style={{ fontFamily:'DM Sans, sans-serif', fontSize:9.5, color:'rgba(255,255,255,0.26)', lineHeight:1.4, marginTop:3, letterSpacing:'0.02em' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
