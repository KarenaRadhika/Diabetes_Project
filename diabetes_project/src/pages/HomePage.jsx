import TiltCard from '../components/TiltCard';

const HIGHLIGHTS = [
  {
    icon: '⚡',
    title: 'Pickled ML Pipeline',
    desc: 'Serialized end-to-end model pipeline with automatic median imputation and standard scaling.',
  },
  {
    icon: '🏆',
    title: 'Top-Accuracy Model',
    desc: 'Benchmarked across 10 classification algorithms; the highest-performing model is connected.',
  },
  {
    icon: '🩺',
    title: '8 Clinical Biomarkers',
    desc: 'Glucose, BMI, Insulin, Blood Pressure, and genetics — identical to clinical diagnostic screenings.',
  },
  {
    icon: '📊',
    title: 'Model Leaderboard',
    desc: 'Inspect all 10 candidate models, comparative test accuracy, F1-scores, and ROC-AUC metrics.',
  },
];

export default function HomePage({ onNavigate }) {
  return (
    <div className="page home-page animate-fade-in">
      <section className="home-hero">
        <div className="badge hero-badge animate-bounce-subtle">
          🏆 Top Classifier: XGBoost (77.27% Test Accuracy)
        </div>
        <h1>
          Predict Diabetes Risk<br />
          <span className="grad">with Machine Learning.</span>
        </h1>
        <p>
          An interactive health AI platform that evaluates patient vitals against trained
          machine learning classification algorithms — powered by a serialized pipeline with
          instant risk profiling.
        </p>
        <div className="home-cta">
          <button className="cta-primary glow-button" onClick={() => onNavigate('predictor')}>
            Launch Predictor 🚀
          </button>
          <button className="cta-secondary" onClick={() => onNavigate('about')}>
            View ML Pipeline Details
          </button>
        </div>
      </section>

      <section className="highlights">
        {HIGHLIGHTS.map((h, i) => (
          <TiltCard
            key={h.title}
            className="highlight-card animate-card-entrance"
            intensity={12}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="highlight-icon">{h.icon}</div>
            <h3>{h.title}</h3>
            <p>{h.desc}</p>
          </TiltCard>
        ))}
      </section>

      <section className="home-stats animate-fade-in">
        <div className="stat">
          <span className="stat-num">10</span>
          <span className="stat-label">Models Tested</span>
        </div>
        <div className="stat">
          <span className="stat-num">77.3%</span>
          <span className="stat-label">Best Test Accuracy</span>
        </div>
        <div className="stat">
          <span className="stat-num">8</span>
          <span className="stat-label">Input Biomarkers</span>
        </div>
        <div className="stat">
          <span className="stat-num">768</span>
          <span className="stat-label">Dataset Records</span>
        </div>
      </section>
    </div>
  );
}
