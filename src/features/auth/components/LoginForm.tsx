import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Check, ArrowRight, ShoppingCart, Users, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '../hooks/useAuth';

const schema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [shaking, setShaking]           = useState(false);
  const [success, setSuccess]           = useState(false);
  const [searchParams]                  = useSearchParams();
  const justRegistered                  = searchParams.get('registered') === 'true';
  const navigate                        = useNavigate();
  const login = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

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
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg" style={{ background: 'rgba(245,166,35,0.15)' }}>
            <ShoppingCart className="w-4 h-4" style={{ color: '#D4880A' }} />
          </div>
          <span className="text-[13px] font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: '#0D0D0D' }}>
            Acheteur
          </span>
        </div>
        <p
          className="text-sm text-muted-foreground"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Accédez à des centaines de fournisseurs vérifiés.
        </p>
      </div>

      {/* ── Registered success banner ── */}
      {justRegistered && (
        <div
          className="flex items-start gap-2.5 rounded-lg px-4 py-3 mb-5 text-sm"
          style={{
            background:  'rgba(34,197,94,0.07)',
            border:      '1px solid rgba(34,197,94,0.22)',
            color:       '#15803d',
            fontFamily:  'DM Sans, sans-serif',
          }}
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#16a34a' }} />
          <span>Compte créé avec succès ! Connectez-vous pour accéder à votre espace.</span>
        </div>
      )}

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
            {(login.error as { response?: { data?: { message?: string } } })?.response?.data?.message
              ?? 'Email ou mot de passe incorrect. Vérifiez vos identifiants.'}
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
          onClick={() => navigate('/register')}
        >
          Créer un compte gratuit
        </button>
      </p>

    </div>
  );
}
