import { useRef } from 'react';

export default function TiltCard({ children, className = '', intensity = 14 }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * intensity;
    const ry = (px - 0.5) * intensity;
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="tilt-glare" />
      <div className="tilt-inner">{children}</div>
    </div>
  );
}
