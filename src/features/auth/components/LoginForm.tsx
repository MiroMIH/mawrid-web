import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Check, ArrowRight, ShoppingCart, Store, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '../hooks/useAuth';

const schema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  role:     z.enum(['BUYER', 'SUPPLIER']),
});

type FormData = z.infer<typeof schema>;

const ROLES = [
  {
    value: 'BUYER' as const,
    label: 'Acheteur',
    icon: ShoppingCart,
    description: 'Trouvez les meilleurs fournisseurs',
  },
  {
    value: 'SUPPLIER' as const,
    label: 'Fournisseur',
    icon: Store,
    description: 'Développez votre clientèle',
  },
];

const roleSubheading: Record<string, string> = {
  BUYER:    'Accédez à des centaines de fournisseurs vérifiés.',
  SUPPLIER: 'Répondez aux appels d\'offres en temps réel.',
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [shaking, setShaking]           = useState(false);
  const [success, setSuccess]           = useState(false);
  const login = useLogin();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', role: 'BUYER' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    try {
      await login.mutateAsync(data);
      setSuccess(true);
    } catch {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div style={{ animation: shaking ? 'authShake 0.55s ease-in-out' : undefined }}>

      {/* ── Header ── */}
      <div className="mb-7">
        <h1
          className="text-[27px] font-bold text-foreground leading-tight mb-1.5"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Bon retour 👋
        </h1>
        <p
          className="text-sm text-muted-foreground"
          style={{ fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}
        >
          {roleSubheading[selectedRole]}
        </p>
      </div>

      {/* ── Role Cards ── */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {ROLES.map(({ value, label, icon: Icon, description }) => {
          const active = selectedRole === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setValue('role', value)}
              className="relative flex flex-col items-start gap-1.5 p-3.5 rounded-xl border-2 text-left transition-all duration-150"
              style={{
                borderColor:     active ? '#F5A623' : 'rgba(0,0,0,0.10)',
                background:      active ? 'rgba(245,166,35,0.05)' : '#FFFFFF',
                boxShadow:       active ? '0 0 0 3px rgba(245,166,35,0.12)' : undefined,
              }}
            >
              {/* Active dot */}
              {active && (
                <span
                  className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full"
                  style={{ background: '#F5A623' }}
                />
              )}
              <div
                className="p-1.5 rounded-lg"
                style={{ background: active ? 'rgba(245,166,35,0.15)' : 'rgba(0,0,0,0.05)' }}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: active ? '#D4880A' : '#888' }}
                />
              </div>
              <div>
                <p
                  className="text-[13px] font-semibold leading-tight"
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    color: active ? '#0D0D0D' : '#555',
                  }}
                >
                  {label}
                </p>
                <p
                  className="text-[10.5px] leading-tight mt-0.5"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: active ? '#888' : '#AAA',
                  }}
                >
                  {description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

        {/* ── Email ── */}
        <div className="space-y-1.5">
          <Label htmlFor="email" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Adresse email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.dz"
            className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-[11px] text-destructive" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* ── Password ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Mot de passe
            </Label>
            <button
              type="button"
              className="text-[11px] font-medium transition-colors"
              style={{ fontFamily: 'DM Sans, sans-serif', color: '#D4880A' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0D0D0D')}
              onMouseLeave={e => (e.currentTarget.style.color = '#D4880A')}
            >
              Mot de passe oublié ?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className={[
                'pr-10',
                errors.password ? 'border-destructive focus-visible:ring-destructive' : '',
              ].join(' ')}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-destructive" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* ── Error ── */}
        {login.isError && (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.18)',
              color: '#C53030',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Email ou mot de passe incorrect. Vérifiez vos identifiants.
          </div>
        )}

        {/* ── Trust line ── */}
        <div
          className="flex items-center gap-2 py-0.5"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#AAAAAA' }}
        >
          <Users className="w-3.5 h-3.5 shrink-0" style={{ color: '#D4880A' }} />
          <span>+2 400 entreprises algériennes font confiance à MAWRID</span>
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={login.isPending || success}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-[10px] font-semibold text-[15px] transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed"
          style={{
            background: success ? '#1A6B3C' : '#0D0D0D',
            color: '#FFFFFF',
            border: '1.5px solid transparent',
            fontFamily: 'Syne, sans-serif',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={(e) => {
            if (!login.isPending && !success) {
              const b = e.currentTarget;
              b.style.transform   = 'translateY(-1px)';
              b.style.boxShadow   = '0 6px 20px rgba(0,0,0,0.18)';
              b.style.borderColor = '#F5A623';
            }
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget;
            b.style.transform   = '';
            b.style.boxShadow   = '';
            b.style.borderColor = 'transparent';
          }}
        >
          {login.isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Connexion…</>
          ) : success ? (
            <><Check className="w-4 h-4" /> Connecté !</>
          ) : (
            <>
              Se connecter
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

      {/* ── Sign up link ── */}
      <p
        className="text-center mt-5 text-[12.5px]"
        style={{ fontFamily: 'DM Sans, sans-serif', color: '#AAAAAA' }}
      >
        Pas encore inscrit ?{' '}
        <button
          type="button"
          className="font-semibold transition-colors"
          style={{ color: '#0D0D0D' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#D4880A')}
          onMouseLeave={e => (e.currentTarget.style.color = '#0D0D0D')}
        >
          Créer un compte gratuit
        </button>
      </p>

    </div>
  );
}
