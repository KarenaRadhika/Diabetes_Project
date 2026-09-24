import { useEffect, useMemo, useState } from 'react';
import TiltCard from '../components/TiltCard';
import PredictionForm from '../components/PredictionForm';
import ResultGauge from '../components/ResultGauge';
import HistoryPanel from '../components/HistoryPanel';
import ModelLeaderboard from '../components/ModelLeaderboard';
import {
  defaultValues,
  predictProbability,
  predictWithBackend,
  getModelsLeaderboard,
  FEATURES,
  riskBand
} from '../lib/model';

const HISTORY_KEY = 'diabetes-history-v2';

export default function PredictorPage() {
  const [values, setValues] = useState(defaultValues);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Load summary and history on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      // ignore
    }

    getModelsLeaderboard().then((data) => {
      if (data) setSummary(data);
    });
  }, []);

  const livePreview = useMemo(() => predictProbability(values), [values]);

  const handleChange = (key, val) => {
    if (Number.isNaN(val)) return;
    setValues((v) => ({ ...v, [key]: val }));
  };

  const handleApplyPreset = (presetVals) => {
    setValues(presetVals);
    setPredictionData(null);
  };

  const handlePredict = async () => {
    setLoading(true);
    setPredictionData(null);
    setLoadingStep(1);

    // Multi-step animated progress feel
    const stepTimer1 = setTimeout(() => setLoadingStep(2), 350);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 700);

    try {
      const result = await predictWithBackend(values);

      // Ensure minimum 800ms for smooth animation transition
      setTimeout(() => {
        setPredictionData(result);
        setLoading(false);
        setLoadingStep(0);

        const entry = {
          id: crypto.randomUUID(),
          probability: result.probability,
          risk: result.riskBand,
          diagnosis: result.diagnosis,
          modelName: result.activeModel?.name || 'XGBoost',
          values: { ...values },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setHistory((h) => {
          const next = [entry, ...h].slice(0, 15);
          try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
      }, 850);
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
      setLoadingStep(0);
      console.error('Prediction failed:', err);
    }
  };

  const handleClear = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
  };

  const handleRestore = (v) => {
    setValues(v);
    setPredictionData(null);
  };

  const bestModelInfo = summary?.best_model || { name: 'XGBoost', accuracy: 77.27 };

  return (
    <div className="page predictor-page animate-fade-in">
      <header className="hero">
        <div className="badge-row">
          <div className="badge model-badge animate-pulse">
            <span className="dot-active" /> Connected: {bestModelInfo.name} ({bestModelInfo.accuracy}% Test Accuracy)
          </div>
          <button
            className="toggle-leaderboard-btn"
            onClick={() => setShowLeaderboard((prev) => !prev)}
          >
            {showLeaderboard ? '✕ Hide Model Leaderboard' : '📊 View All 10 Tested Models'}
          </button>
        </div>

        <h1>Clinical Diabetes Predictor</h1>
        <p>
          Input patient vitals and lab measurements to run inference with our highest-accuracy
          trained classification model pipeline (exported as serialized pickle).
        </p>
      </header>

      {showLeaderboard && (
        <section className="leaderboard-section animate-slide-down">
          <TiltCard className="leaderboard-card" intensity={4}>
            <ModelLeaderboard
              summary={summary}
              activeModelName={bestModelInfo.name}
            />
          </TiltCard>
        </section>
      )}

      <main className="layout">
        <section className="panel-section">
          <TiltCard className="form-card" intensity={8}>
            <div className="panel-title-row">
              <h2>Patient Measurements</h2>
              <span className="panel-tag">8 Features</span>
            </div>
            <PredictionForm
              values={values}
              onChange={handleChange}
              onSubmit={handlePredict}
              onApplyPreset={handleApplyPreset}
              loading={loading}
            />
          </TiltCard>
        </section>

        <section className="panel-section">
          <TiltCard className="result-card" intensity={14}>
            <div className="panel-title-row">
              <h2>Analysis Result</h2>
              {predictionData && (
                <span className="active-engine-pill">
                  {predictionData.isOffline ? 'Offline Fallback' : 'Live Pickle API'}
                </span>
              )}
            </div>

            {loading ? (
              <div className="loader-box animate-fade-in">
                <div className="radar-spinner">
                  <div className="radar-ring ring-1" />
                  <div className="radar-ring ring-2" />
                  <div className="radar-ring ring-3" />
                  <div className="radar-core" />
                </div>
                <div className="loader-steps">
                  <span className={`step-text ${loadingStep >= 1 ? 'step-active' : ''}`}>
                    {loadingStep === 1 && '1. Imputing & normalizing clinical features...'}
                    {loadingStep === 2 && '2. Executing pickled pipeline inference...'}
                    {loadingStep >= 3 && '3. Calculating risk calibration & metrics...'}
                  </span>
                  <div className="step-bar">
                    <div
                      className="step-bar-fill"
                      style={{ width: `${(loadingStep / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : predictionData ? (
              <ResultGauge
                probability={predictionData.probability}
                activeModel={predictionData.activeModel}
                isOffline={predictionData.isOffline}
                diagnosis={predictionData.diagnosis}
                contributingFactors={predictionData.contributingFactors}
              />
            ) : (
              <div className="placeholder animate-fade-in">
                <div className="live-bar">
                  <div
                    className="live-fill"
                    style={{ width: `${Math.round(livePreview * 100)}%` }}
                  />
                </div>
                <p>
                  Instant estimator: <strong>{Math.round(livePreview * 100)}%</strong> risk
                </p>
                <span className="hint">
                  Click <strong>Run Prediction</strong> to evaluate with the best model pipeline.
                </span>
              </div>
            )}
          </TiltCard>

          <TiltCard className="history-card" intensity={8}>
            <HistoryPanel
              history={history}
              onClear={handleClear}
              onRestore={handleRestore}
            />
          </TiltCard>
        </section>
      </main>

      <footer className="foot">
        <span>
          ML Pipeline: Median Imputer → Standard Scaler → {bestModelInfo.name} ({bestModelInfo.accuracy}% Accuracy) · For educational & demo purposes
        </span>
      </footer>
    </div>
  );
}
