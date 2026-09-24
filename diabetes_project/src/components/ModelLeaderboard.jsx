import { useState } from 'react';

export default function ModelLeaderboard({ summary, activeModelName = 'XGBoost' }) {
  const [viewMode, setViewMode] = useState('bars'); // 'bars' or 'table'
  const leaderboard = summary?.leaderboard || [];
  const bestModel = summary?.best_model || {};

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="leaderboard-title-group">
          <span className="leaderboard-badge">
            <span className="pulse-dot"></span> ML Model Leaderboard
          </span>
          <h3>Classification Benchmark (10 Models Evaluated)</h3>
          <p className="leaderboard-subtitle">
            Every classification model was trained and evaluated on the dataset. The frontend connects directly to{' '}
            <strong className="text-primary">{bestModel.name || 'XGBoost'}</strong>, which achieved the largest accuracy (
            {bestModel.accuracy || 77.27}%).
          </p>
        </div>

        <div className="leaderboard-controls">
          <button
            className={`mode-btn ${viewMode === 'bars' ? 'active' : ''}`}
            onClick={() => setViewMode('bars')}
          >
            Visual Ranking
          </button>
          <button
            className={`mode-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            Detailed Metrics
          </button>
        </div>
      </div>

      {viewMode === 'bars' ? (
        <div className="model-bars-list">
          {leaderboard.map((m, idx) => {
            const isWinner = idx === 0;
            return (
              <div
                key={m.name}
                className={`model-bar-row ${isWinner ? 'winner-row' : ''}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="model-bar-meta">
                  <div className="model-rank-name">
                    <span className={`rank-tag ${isWinner ? 'winner-tag' : ''}`}>
                      {isWinner ? '🏆 #1' : `#${idx + 1}`}
                    </span>
                    <span className="model-name">{m.name}</span>
                    {isWinner && (
                      <span className="active-pill animate-pulse">
                        Connected to Frontend
                      </span>
                    )}
                  </div>
                  <div className="model-stats">
                    <span className="stat-acc">
                      <strong>{m.accuracy}%</strong> Acc
                    </span>
                    <span className="stat-secondary">F1: {m.f1_score}</span>
                    <span className="stat-secondary">AUC: {m.roc_auc}</span>
                  </div>
                </div>

                <div className="model-progress-track">
                  <div
                    className={`model-progress-fill ${isWinner ? 'fill-winner' : ''}`}
                    style={{
                      width: `${Math.max(10, ((m.accuracy - 60) / 25) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="leaderboard-table-wrap">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Model</th>
                <th>Test Accuracy</th>
                <th>F1 Score</th>
                <th>ROC-AUC</th>
                <th>CV Accuracy</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((m, idx) => {
                const isWinner = idx === 0;
                return (
                  <tr key={m.name} className={isWinner ? 'winner-tr' : ''}>
                    <td>
                      <span className={`table-rank ${isWinner ? 'winner-rank' : ''}`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="table-model-name">
                      {m.name} {isWinner && <span className="winner-star">★</span>}
                    </td>
                    <td className="metric-acc">{m.accuracy}%</td>
                    <td>{m.f1_score}</td>
                    <td>{m.roc_auc}</td>
                    <td>{m.cv_mean_accuracy ? `${m.cv_mean_accuracy}%` : '—'}</td>
                    <td>
                      {isWinner ? (
                        <span className="connected-status">● Active (Pickle)</span>
                      ) : (
                        <span className="evaluated-status">Evaluated</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
