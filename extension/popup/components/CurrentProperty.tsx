interface CurrentPropertyProps {
  url: string;
  score: number;
  reasons: string[];
}

export function CurrentProperty({ score, reasons }: CurrentPropertyProps) {
  const scorePercent = Math.round(score * 100);

  const getScoreClass = (score: number) => {
    if (score >= 0.85) return 'high';
    if (score >= 0.70) return 'medium';
    return 'low';
  };

  const getGlowColor = (score: number) => {
    if (score >= 0.85) return 'rgba(255, 255, 255, 0.4)';
    if (score >= 0.70) return 'rgba(255, 255, 255, 0.3)';
    return 'rgba(255, 255, 255, 0.2)';
  };

  return (
    <div
      className="glass-card rounded-2xl p-4 hover-lift"
      style={{
        boxShadow: `0 8px 32px ${getGlowColor(score)}, inset 0 1px 0 rgba(255,255,255,0.2)`
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="glass p-2 rounded-xl">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-800">Propiedad actual</span>
        </div>
        <div className={`score-badge ${getScoreClass(score)}`}>
          {scorePercent}%
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {reasons.map((reason, i) => (
          <div
            key={i}
            className="glass px-3 py-1.5 rounded-lg animate-fade-in"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <span className="text-xs text-gray-600">{reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
