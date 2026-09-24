import { useEffect, useState } from 'react';

export default function ResultGauge({
  probability = 0,
  activeModel = null,
  isOffline = false,
  diagnosis = null,
  contributingFactors = [],
}) {
  const [displayedPct, setDisplayedPct] = useState(0);
  const targetPct = Math.round(probability * 100);

  const risk =
    probability < 0.33 ? 'Low' : probability < 0.66 ? 'Moderate' : 'High';
  const tone = risk.toLowerCase();

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - probability);

  // Smooth animated count-up effect
  useEffect(() => {
    let start = 0;
    const duration = 900;
    const startTime = performance.now();

    const animateNumber = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedPct(Math.round(eased * targetPct));

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      }
    };

    requestAnimationFrame(animateNumber);
  }, [targetPct]);

  return (
    <div className={`gauge-wrapper animate-fade-in ${tone}`}>
      <div className="gauge-container">
        <div className={`gauge-glow-aura aura-${tone}`} />

        <svg viewBox="0 0 180 180" className="gauge-svg">
          <defs>
            <linearGradient id="gaugeGradLow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3ddc97" />
              <stop offset="100%" stopColor="#1dd1a1" />
            </linearGradient>
            <linearGradient id="gaugeGradMod" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffc048" />
              <stop offset="100%" stopColor="#ff9f1a" />
            </linearGradient>
            <linearGradient id="gaugeGradHigh" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff5d73" />
              <stop offset="100%" stopColor="#ff3838" />
            </linearGradient>
          </defs>

          <circle className="gauge-track" cx="90" cy="90" r={radius} />
          <circle
            className={`gauge-fill fill-${tone}`}
            cx="90"
            cy="90"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 90 90)"
          />
        </svg>

        <div className="gauge-center">
          <span className="gauge-pct">{displayedPct}%</span>
          <span className={`gauge-badge badge-${tone}`}>{risk} Risk</span>
          {diagnosis && (
            <span className={`diagnosis-tag diag-${tone}`}>
              {diagnosis === 'Diabetic' ? '⚠️ Diabetic Risk' : '✓ Non-Diabetic'}
            </span>
          )}
        </div>
      </div>

      <div className="model-credit-box">
        <span className="model-credit-title">Active Classification Model</span>
        <div className="model-credit-row">
          <span className="model-name-pill">
            <span className="dot-live" /> {activeModel?.name || 'XGBoost (Pickle Pipeline)'}
          </span>
          {activeModel?.accuracy && (
            <span className="model-acc-tag">{activeModel.accuracy}% Accuracy</span>
          )}
        </div>
        <p className="model-credit-desc">
          Evaluated against 10 classification models. The model with the largest accuracy was selected and connected.
        </p>
      </div>

      {contributingFactors && contributingFactors.length > 0 && (
        <div className="factors-box">
          <span className="factors-title">Key Clinical Indicators:</span>
          <ul className="factors-list">
            {contributingFactors.map((fact, idx) => (
              <li key={idx} className="factor-item">
                <span className="factor-bullet">•</span> {fact}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
