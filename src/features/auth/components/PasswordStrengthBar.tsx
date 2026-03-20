interface Props {
  password: string;
}

export function calcStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0;
  const hasLength6   = password.length >= 6;
  const hasLength8   = password.length >= 8;
  const hasNumber    = /[0-9]/.test(password);
  const hasUpper     = /[A-Z]/.test(password);
  const hasSpecial   = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (hasLength8 && hasNumber && hasUpper && hasSpecial) return 4;
  if (hasLength8 && hasNumber && hasUpper)                return 3;
  if (hasLength8 && hasNumber)                            return 2;
  if (hasLength6)                                         return 1;
  return 0;
}

const SEGMENTS: { color: string; label: string }[] = [
  { color: '#ef4444', label: 'Trop faible' },
  { color: '#f97316', label: 'Faible'      },
  { color: '#eab308', label: 'Moyen'       },
  { color: '#22c55e', label: 'Fort'        },
];

export function PasswordStrengthBar({ password }: Props) {
  const strength = calcStrength(password);

  if (!password) return null;

  const { color, label } = SEGMENTS[strength - 1] ?? SEGMENTS[0];

  return (
    <div className="mt-2 space-y-1.5">
      {/* Segments */}
      <div className="flex gap-1">
        {SEGMENTS.map((seg, i) => {
          const filled = i < strength;
          return (
            <div
              key={i}
              className="h-1 flex-1 rounded-full overflow-hidden"
              style={{ background: '#E5E5E0' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: filled ? '100%' : '0%',
                  background: filled ? seg.color : 'transparent',
                  transition: 'width 300ms cubic-bezier(.4,0,.2,1)',
                }}
              />
            </div>
          );
        })}
      </div>
      {/* Label */}
      <p
        className="text-[10.5px] font-medium transition-colors duration-200"
        style={{ color, fontFamily: 'DM Sans, sans-serif' }}
      >
        {label}
      </p>
    </div>
  );
}
