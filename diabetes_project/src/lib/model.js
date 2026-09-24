import fallbackSummary from './models_summary.json';

export const FEATURES = [
  { key: 'pregnancies', label: 'Pregnancies', min: 0, max: 20, step: 1, default: 1, unit: '' },
  { key: 'glucose', label: 'Glucose (plasma)', min: 0, max: 250, step: 1, default: 115, unit: 'mg/dL' },
  { key: 'bloodPressure', label: 'Blood Pressure', min: 0, max: 140, step: 1, default: 72, unit: 'mmHg' },
  { key: 'skinThickness', label: 'Skin Thickness', min: 0, max: 100, step: 1, default: 23, unit: 'mm' },
  { key: 'insulin', label: 'Insulin (2-hr serum)', min: 0, max: 400, step: 1, default: 35, unit: 'mu U/ml' },
  { key: 'bmi', label: 'BMI', min: 0, max: 70, step: 0.1, default: 28.5, unit: 'kg/m²' },
  { key: 'dpf', label: 'Diabetes Pedigree', min: 0, max: 3, step: 0.01, default: 0.42, unit: '' },
  { key: 'age', label: 'Age', min: 1, max: 120, step: 1, default: 30, unit: 'yrs' },
];

export function defaultValues() {
  const v = {};
  for (const f of FEATURES) v[f.key] = f.default;
  return v;
}

// Client-side quick estimator for live slider preview
export function predictProbability(values) {
  // Approximate sigmoid calibrated against the trained dataset
  const z = -5.85
    + 0.11 * (values.pregnancies ?? 1)
    + 0.032 * (values.glucose ?? 115)
    + -0.008 * (values.bloodPressure ?? 72)
    + 0.001 * (values.skinThickness ?? 23)
    + 0.0004 * (values.insulin ?? 35)
    + 0.075 * (values.bmi ?? 28.5)
    + 0.85 * (values.dpf ?? 0.42)
    + 0.02 * (values.age ?? 30);

  const p = 1 / (1 + Math.exp(-z));
  return Math.min(0.99, Math.max(0.01, p));
}

export function riskBand(p) {
  return p < 0.33 ? 'low' : p < 0.66 ? 'moderate' : 'high';
}

/**
 * Sends prediction request to the Python Flask backend serving the best pickled model.
 * Automatically falls back to offline model if backend is disconnected.
 */
export async function predictWithBackend(values) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  const apiBase = import.meta.env.VITE_API_URL || '';
  try {
    const res = await fetch(`${apiBase}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    return {
      success: true,
      isOffline: false,
      probability: data.probability,
      percentage: data.percentage,
      prediction: data.prediction,
      diagnosis: data.diagnosis,
      riskLevel: data.risk_level,
      riskBand: data.risk_band,
      activeModel: data.active_model,
      contributingFactors: data.contributing_factors || [],
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('[API] Backend unavailable, utilizing calibrated client model:', err.message);

    // Resilient offline fallback using cached model metadata
    const prob = predictProbability(values);
    const band = riskBand(prob);
    const bestInfo = fallbackSummary.best_model || { name: 'XGBoost (Offline)', accuracy: 77.27 };

    const factors = [];
    if ((values.glucose ?? 0) >= 140) factors.push(`High Glucose: ${values.glucose} mg/dL`);
    if ((values.bmi ?? 0) >= 30) factors.push(`High BMI: ${values.bmi} kg/m²`);
    if ((values.age ?? 0) >= 45) factors.push(`Age risk factor: ${values.age} yrs`);

    return {
      success: true,
      isOffline: true,
      probability: prob,
      percentage: Math.round(prob * 100),
      prediction: prob >= 0.5 ? 1 : 0,
      diagnosis: prob >= 0.5 ? 'Diabetic' : 'Non-Diabetic',
      riskLevel: band.charAt(0).toUpperCase() + band.slice(1),
      riskBand: band,
      activeModel: {
        name: `${bestInfo.name} (Client Fallback)`,
        accuracy: bestInfo.accuracy,
        f1_score: bestInfo.f1_score,
      },
      contributingFactors: factors,
    };
  }
}

/**
 * Retrieves the full classification models leaderboard.
 */
export async function getModelsLeaderboard() {
  const apiBase = import.meta.env.VITE_API_URL || '';
  try {
    const res = await fetch(`${apiBase}/api/models`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fall back to bundled summary
  }
  return fallbackSummary;
}
