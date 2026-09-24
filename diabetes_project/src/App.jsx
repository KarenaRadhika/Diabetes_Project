import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PredictorPage from './pages/PredictorPage';
import './App.css';

export default function App() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'about', 'predictor'].includes(hash)) setPage(hash);
  }, []);

  const navigate = (p) => {
    setPage(p);
    window.location.hash = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <div className="bg-grid" />
      <div className="bg-blob blob-a" />
      <div className="bg-blob blob-b" />

      <Navbar page={page} onNavigate={navigate} />

      {page === 'home' && <HomePage onNavigate={navigate} />}
      {page === 'about' && <AboutPage />}
      {page === 'predictor' && <PredictorPage />}
    </div>
  );
}
