import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, ArrowRight, Building2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { PasswordStrengthBar } from './PasswordStrengthBar';
import { PasswordRequirements } from './PasswordRequirements';

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  firstName:       z.string().min(1, 'Prénom requis').max(100),
  lastName:        z.string().min(1, 'Nom requis').max(100),
  email:           z.string().email('Email invalide'),
  phone:           z.string().refine((v) => {
    const digits = v.replace(/\D/g, '');
    return digits === '' || /^0[5-7]\d{8}$/.test(digits);
  }, 'Format invalide (ex : 0555 123 456)'),
  companyName:     z.string().max(200),
  password:        z.string().min(8, 'Au moins 8 caractères'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path:    ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

// ── FloatingField helper ──────────────────────────────────────────────────────

function FloatingField({
  label, id, error, hasValue, children,
}: {
  label: string;
  id: string;
  error?: string;
  hasValue: boolean;
  children: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const up = hasValue || focused;

  return (
    <div className="space-y-1">
      <div
        className="relative"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {children}
        <label
          htmlFor={id}
          className="absolute left-3.5 pointer-events-none transition-all duration-200"
          style={{
            top:        up ? 6   : 14,
            fontSize:   up ? 10  : 13,
            color:      up ? 'rgba(13,13,13,0.45)' : '#AAAAAA',
            fontFamily: 'DM Sans, sans-serif',
            lineHeight: 1,
          }}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="text-[11px] text-red-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasErr?: boolean) {
  return [
    'w-full px-3.5 pt-[22px] pb-2 rounded-[10px] border bg-[#FAFAF8]',
    'text-[14px] text-[#0D0D0D] focus:outline-none transition-all duration-150',
    hasErr
      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/10'
      : 'border-[#E2E1DC] focus:border-[#0D0D0D] focus:ring-1 focus:ring-black/5',
  ].join(' ');
}

// ── Component ────────────────────────────────────────────────────────────────

export function RegisterForm() {
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [shaking,     setShaking]     = useState(false);
  const navigate = useNavigate();
  const reg = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '', lastName: '', email: '',
      phone: '', companyName: '', password: '', confirmPassword: '',
    },
  });

  const v   = watch();
  const pw  = v.password ?? '';

  const onSubmit = async (data: FormData) => {
    try {
      await reg.mutateAsync(data);
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
          Créer un compte
        </h1>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg" style={{ background: 'rgba(245,166,35,0.15)' }}>
            <ShoppingCart className="w-4 h-4" style={{ color: '#D4880A' }} />
          </div>
          <span
            className="text-[13px] font-semibold"
            style={{ fontFamily: 'Syne, sans-serif', color: '#0D0D0D' }}
          >
            Acheteur
          </span>
        </div>
        <p className="text-sm text-muted-foreground" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Rejoignez +2&nbsp;400 entreprises algériennes sur MAWRID.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">

        {/* ── Prénom / Nom ── */}
        <div className="grid grid-cols-2 gap-3">
          <FloatingField
            label="Prénom *" id="firstName"
            error={errors.firstName?.message} hasValue={!!v.firstName}
          >
            <input
              id="firstName"
              autoComplete="given-name"
              className={inputCls(!!errors.firstName)}
              {...register('firstName')}
            />
          </FloatingField>

          <FloatingField
            label="Nom *" id="lastName"
            error={errors.lastName?.message} hasValue={!!v.lastName}
          >
            <input
              id="lastName"
              autoComplete="family-name"
              className={inputCls(!!errors.lastName)}
              {...register('lastName')}
            />
          </FloatingField>
        </div>

        {/* ── Email ── */}
        <FloatingField
          label="Adresse email *" id="email"
          error={errors.email?.message} hasValue={!!v.email}
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputCls(!!errors.email)}
            {...register('email')}
          />
        </FloatingField>

        {/* ── Téléphone ── */}
        <FloatingField
          label="Téléphone (optionnel)" id="phone"
          error={errors.phone?.message} hasValue={!!v.phone}
        >
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder={v.phone ? '' : ' '}
            className={inputCls(!!errors.phone)}
            {...register('phone')}
          />
        </FloatingField>

        {/* ── Entreprise ── */}
        <FloatingField
          label="Entreprise (optionnel)" id="companyName"
          error={errors.companyName?.message} hasValue={!!v.companyName}
        >
          <div className="relative">
            <input
              id="companyName"
              autoComplete="organization"
              className={`${inputCls(!!errors.companyName)} pr-10`}
              {...register('companyName')}
            />
            <Building2
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: '#CCCCCC' }}
            />
          </div>
        </FloatingField>

        {/* ── Mot de passe ── */}
        <FloatingField
          label="Mot de passe *" id="password"
          error={errors.password?.message} hasValue={!!v.password}
        >
          <div className="relative">
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              className={`${inputCls(!!errors.password)} pr-10`}
              {...register('password')}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((x) => !x)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </FloatingField>

        {/* ── Strength bar ── */}
        {pw && <PasswordStrengthBar password={pw} />}

        {/* ── Requirements ── */}
        {pw && (
          <div className="pt-0.5 pb-1">
            <PasswordRequirements password={pw} />
          </div>
        )}

        {/* ── Confirmer le mot de passe ── */}
        <FloatingField
          label="Confirmer le mot de passe *" id="confirmPassword"
          error={errors.confirmPassword?.message} hasValue={!!v.confirmPassword}
        >
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              className={`${inputCls(!!errors.confirmPassword)} pr-10`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirm((x) => !x)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </FloatingField>

        {/* ── API Error ── */}
        {reg.isError && (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{
              background:  'rgba(239,68,68,0.06)',
              border:      '1px solid rgba(239,68,68,0.18)',
              color:       '#C53030',
              fontFamily:  'DM Sans, sans-serif',
            }}
          >
            {(reg.error as { response?: { data?: { message?: string } } })?.response?.data?.message
              ?? 'Une erreur est survenue. Veuillez réessayer.'}
          </div>
        )}

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={reg.isPending}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-[10px] font-semibold text-[15px] transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed mt-1"
          style={{
            background:    '#0D0D0D',
            color:         '#FFFFFF',
            border:        '1.5px solid transparent',
            fontFamily:    'Syne, sans-serif',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={(e) => {
            if (!reg.isPending) {
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
          {reg.isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Création en cours…</>
          ) : (
            <>Créer mon compte <ArrowRight className="w-4 h-4" /></>
          )}
        </button>

      </form>

      {/* ── Sign in link ── */}
      <p
        className="text-center mt-5 text-[12.5px]"
        style={{ fontFamily: 'DM Sans, sans-serif', color: '#AAAAAA' }}
      >
        Déjà un compte ?{' '}
        <button
          type="button"
          className="font-semibold transition-colors"
          style={{ color: '#0D0D0D' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#D4880A')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#0D0D0D')}
          onClick={() => navigate('/login')}
        >
          Se connecter
        </button>
      </p>

    </div>
  );
}
