import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Check, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '../hooks/useAuth';

const schema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  role:     z.enum(['BUYER', 'SUPPLIER']),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [success, setSuccess] = useState(false);
  const login = useLogin();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email:    '',
      password: '',
      role:     'BUYER',
    },
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

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-[28px] font-bold text-foreground leading-tight mb-1.5"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Bon retour 👋
        </h1>
        <p
          className="text-sm text-muted-foreground"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Connectez-vous à votre espace MAWRID
        </p>
      </div>

      {/* Role toggle */}
      <div className="flex rounded-lg border border-border bg-muted/40 p-1 mb-6">
        {(['BUYER', 'SUPPLIER'] as const).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setValue('role', role)}
            className="flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-150"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              background: selectedRole === role ? '#0D0D0D' : 'transparent',
              color: selectedRole === role ? '#FFFFFF' : undefined,
            }}
          >
            {role === 'BUYER' ? 'Acheteur' : 'Fournisseur'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

        {/* Email */}
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

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Mot de passe
          </Label>
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
              {showPassword
                ? <EyeOff className="w-4 h-4" />
                : <Eye    className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-destructive" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Error */}
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
            Email ou mot de passe incorrect.
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={login.isPending || success}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-[10px] font-semibold text-[15px] transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed mt-2"
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
              b.style.transform = 'translateY(-1px)';
              b.style.boxShadow = '0 6px 20px rgba(0,0,0,0.18)';
              b.style.borderColor = '#F5A623';
            }
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget;
            b.style.transform = '';
            b.style.boxShadow = '';
            b.style.borderColor = 'transparent';
          }}
        >
          {login.isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Connexion…</>
          ) : success ? (
            <><Check className="w-4 h-4" />Connecté !</>
          ) : (
            <>Se connecter<ArrowRight className="w-4 h-4" /></>
          )}
        </button>

      </form>
    </div>
  );
}
