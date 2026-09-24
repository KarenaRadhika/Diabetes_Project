export default function HistoryPanel({ history, onClear, onRestore }) {
  return (
    <div className="history">
      <div className="history-head">
        <h3>Prediction History</h3>
        {history.length > 0 && (
          <button type="button" className="ghost-btn" onClick={onClear}>Clear</button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="history-empty">No predictions yet. Run one to see it here.</p>
      ) : (
        <ul className="history-list">
          {history.map((h) => (
            <li key={h.id} onClick={() => onRestore(h.values)}>
              <div className="history-row">
                <span className={`dot ${h.risk}`} />
                <span className="history-pct">{Math.round(h.probability * 100)}%</span>
                <span className="history-time">{h.time}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
