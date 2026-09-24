import TiltCard from '../components/TiltCard';
import { FEATURES } from '../lib/model';

const PIPELINE = [
  { step: '01', title: 'Data Loading & Cleaning', desc: 'Loaded diabetes.csv (768 records). Detected physiologically impossible 0s in Glucose, BP, Skin Thickness, Insulin, and BMI.' },
  { step: '02', title: 'Median Imputation & Scaling', desc: 'Applied SimpleImputer(strategy="median") followed by StandardScaler() to ensure numerical stability without data leakage.' },
  { step: '03', title: 'Stratified Train / Test Split', desc: 'Partitioned into 80% train (614 rows) and 20% test (154 rows) maintaining positive/negative class proportions.' },
  { step: '04', title: 'Comprehensive Model Benchmarking', desc: 'Trained and evaluated 10 classification algorithms with 5-fold cross-validation, measuring Accuracy, F1, and ROC-AUC.' },
  { step: '05', title: 'Model Selection & Pickle Export', desc: 'Identified the model with the largest test accuracy (XGBoost at 77.27%) and serialized the full pipeline into best_model.pkl.' },
  { step: '06', title: 'Full-Stack Integration', desc: 'Connected a Flask REST API backend with a modern animated React interface for instant client inference.' },
];

const MODELS_BENCHMARKED = [
  { name: 'XGBoost', acc: '77.27%', role: 'Winning Model (Serialized to Pickle)' },
  { name: 'Decision Tree', acc: '75.97%', role: 'Rule-based decision partitioning' },
  { name: 'Gradient Boosting', acc: '75.97%', role: 'Sequential residual gradient boosting' },
  { name: 'AdaBoost', acc: '75.32%', role: 'Adaptive weighted ensemble' },
  { name: 'K-Nearest Neighbors (KNN)', acc: '74.03%', role: 'Non-parametric proximity classifier' },
  { name: 'Support Vector Machine (SVC)', acc: '74.03%', role: 'Maximum-margin hyperplane with RBF kernel' },
  { name: 'Random Forest', acc: '74.03%', role: 'Bootstrap bagging ensemble' },
  { name: 'Extra Trees', acc: '72.73%', role: 'Extremely randomized trees' },
  { name: 'Logistic Regression', acc: '70.78%', role: 'Linear log-odds baseline' },
  { name: 'Gaussian Naive Bayes', acc: '70.13%', role: 'Probabilistic conditional independence' },
];

const STACK = [
  { name: 'Python 3', role: 'Core language' },
  { name: 'XGBoost', role: 'Gradient-boosted decision trees' },
  { name: 'scikit-learn', role: 'Pipelines, imputer, scaler' },
  { name: 'joblib & pickle', role: 'Pipeline serialization' },
  { name: 'Flask & CORS', role: 'REST API backend' },
  { name: 'React 18 + Vite', role: 'Modern animated frontend' },
];

export default function AboutPage() {
  return (
    <div className="page about-page animate-fade-in">
      <header className="about-hero">
        <div className="badge hero-badge">Machine Learning Pipeline</div>
        <h1>How the Best Model Was Selected</h1>
        <p>
          Every applicable classification model was benchmarked on the Pima Indians
          Diabetes dataset. The winning model with the largest accuracy was serialized as a
          pickle file and deployed to power this application.
        </p>
      </header>

      <TiltCard className="about-card" intensity={6}>
        <h2>Evaluated Classification Models</h2>
        <p className="about-text">
          Below is the test set ranking of all 10 candidate algorithms evaluated under identical preprocessed conditions:
        </p>
        <div className="models-summary-grid">
          {MODELS_BENCHMARKED.map((m, idx) => (
            <div key={m.name} className={`model-card-item ${idx === 0 ? 'top-winner' : ''}`}>
              <div className="m-card-top">
                <span className="m-rank">{idx === 0 ? '🏆 #1' : `#${idx + 1}`}</span>
                <span className="m-acc">{m.acc}</span>
              </div>
              <strong>{m.name}</strong>
              <p>{m.role}</p>
            </div>
          ))}
        </div>
      </TiltCard>

      <TiltCard className="about-card" intensity={6}>
        <h2>End-to-End ML Pipeline</h2>
        <p className="about-text">
          A robust scikit-learn <code>Pipeline</code> wraps preprocessing and inference, eliminating training-serving skew:
        </p>
        <div className="pipeline">
          {PIPELINE.map((p) => (
            <div className="pipeline-step" key={p.step}>
              <span className="pipeline-num">{p.step}</span>
              <div>
                <strong>{p.title}</strong>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </TiltCard>

      <TiltCard className="about-card" intensity={6}>
        <h2>Clinical Biomarkers & Features</h2>
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-item" key={f.key}>
              <span className="feature-idx">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <strong>{f.label}</strong>
                {f.unit && <span className="feature-unit"> · {f.unit}</span>}
                <p className="feature-range">
                  Range: {f.min}–{f.max}{f.step < 1 ? ` (step ${f.step})` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      </TiltCard>

      <TiltCard className="about-card" intensity={6}>
        <h2>Technology Stack</h2>
        <div className="stack-grid">
          {STACK.map((s) => (
            <div className="stack-item" key={s.name}>
              <strong>{s.name}</strong>
              <span>{s.role}</span>
            </div>
          ))}
        </div>
      </TiltCard>

      <div className="disclaimer">
        <strong>Medical Disclaimer:</strong> This application is intended for research, educational,
        and machine-learning demonstration purposes only. It should not be used as a substitute for professional
        medical diagnosis, advice, or treatment.
      </div>
    </div>
  );
}
