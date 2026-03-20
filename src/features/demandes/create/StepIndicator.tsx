import { Check } from 'lucide-react';

const STEPS = ['Catégorie', 'Détails', 'Attributs', 'Révision'];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = currentStep > step;
        const active = currentStep === step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                done ? 'bg-[#F5A623] border-[#F5A623] text-[#0D0D0D]' :
                active ? 'bg-white border-[#F5A623] text-[#F5A623]' :
                'bg-white border-gray-200 text-gray-400'
              }`}>
                {done ? <Check className="w-4 h-4" /> : step}
              </div>
              <span className={`text-xs mt-1 font-medium whitespace-nowrap ${active ? 'text-[#F5A623]' : done ? 'text-gray-700' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-2 mb-4 transition-colors ${done ? 'bg-[#F5A623]' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
