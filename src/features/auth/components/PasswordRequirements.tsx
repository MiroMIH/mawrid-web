import { CheckCircle2, XCircle } from 'lucide-react';

const REQUIREMENTS = [
  { label: '8 caractères minimum', test: (p: string) => p.length >= 8 },
  { label: '1 chiffre',            test: (p: string) => /[0-9]/.test(p) },
  { label: '1 lettre majuscule',   test: (p: string) => /[A-Z]/.test(p) },
  { label: '1 caractère spécial',  test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

interface Props {
  password: string;
}

export function PasswordRequirements({ password }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
      {REQUIREMENTS.map((req) => {
        const ok = req.test(password);
        return (
          <div key={req.label} className="flex items-center gap-1.5">
            {ok
              ? <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
              : <XCircle      className="w-3 h-3 text-[#D0CFCB] shrink-0" />
            }
            <span
              className="text-[11px] transition-colors duration-150"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: ok ? '#16a34a' : '#AAAAAA',
              }}
            >
              {req.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
