export default function Navbar({ page, onNavigate }) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'predictor', label: 'Predictor' },
  ];
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => onNavigate('home')}>
        <span className="nav-logo">◆</span>
        <span>DiabetesPredict</span>
      </div>
      <div className="nav-links">
        {links.map((l) => (
          <button
            key={l.id}
            className={`nav-link ${page === l.id ? 'active' : ''}`}
            onClick={() => onNavigate(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
