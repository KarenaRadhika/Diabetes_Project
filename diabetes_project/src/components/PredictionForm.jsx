import { FEATURES } from '../lib/model';

const PRESETS = [
  {
    label: 'Typical Healthy',
    values: { pregnancies: 1, glucose: 95, bloodPressure: 68, skinThickness: 19, insulin: 60, bmi: 22.4, dpf: 0.25, age: 24 }
  },
  {
    label: 'Average Patient',
    values: { pregnancies: 3, glucose: 115, bloodPressure: 72, skinThickness: 23, insulin: 79, bmi: 28.5, dpf: 0.42, age: 33 }
  },
  {
    label: 'High Risk Clinical',
    values: { pregnancies: 6, glucose: 165, bloodPressure: 84, skinThickness: 38, insulin: 195, bmi: 36.8, dpf: 0.85, age: 52 }
  }
];

export default function PredictionForm({ values, onChange, onSubmit, onApplyPreset, loading }) {
  return (
    <form className="prediction-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="preset-bar">
        <span className="preset-label">Quick Presets:</span>
        <div className="preset-buttons">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className="preset-pill"
              onClick={() => onApplyPreset(p.values)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-grid">
        {FEATURES.map((f) => {
          const val = values[f.key] ?? f.default;
          const pct = Math.min(100, Math.max(0, ((val - f.min) / (f.max - f.min)) * 100));

          return (
            <div className="field-card" key={f.key}>
              <div className="field-header">
                <span className="field-label">{f.label}</span>
                <span className="field-value">
                  {val}{f.unit ? ` ${f.unit}` : ''}
                </span>
              </div>

              <div className="range-wrapper">
                <input
                  id={f.key}
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={val}
                  style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, rgba(255,255,255,0.08) ${pct}%, rgba(255,255,255,0.08) 100%)`
                  }}
                  onChange={(e) => onChange(f.key, parseFloat(e.target.value))}
                />
              </div>

              <div className="field-footer">
                <span className="field-min-max">{f.min}</span>
                <input
                  type="number"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  className="field-num-input"
                  value={val}
                  onChange={(e) => onChange(f.key, parseFloat(e.target.value) || 0)}
                />
                <span className="field-min-max">{f.max}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button type="submit" className="predict-btn glow-button" disabled={loading}>
        {loading ? (
          <span className="btn-loading">
            <span className="btn-spinner" />
            Analyzing with ML Pipeline...
          </span>
        ) : (
          <span className="btn-content">
            <span className="btn-icon">⚡</span> Run Prediction (Highest Accuracy Model)
          </span>
        )}
      </button>
    </form>
  );
}
