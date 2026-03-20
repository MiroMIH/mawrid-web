interface Props { score: number; size?: number; strokeWidth?: number; showLabel?: boolean; }

export function QualityScoreRing({ score, size = 48, strokeWidth = 4, showLabel = true }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={strokeWidth} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }} />
      </svg>
      {showLabel && (
        <span className="absolute font-bold tabular-nums" style={{ fontSize: size * 0.22, color }}>{score}</span>
      )}
    </div>
  );
}
