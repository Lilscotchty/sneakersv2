import { useRef, useState } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [widgetTilt, setWidgetTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = bgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mouse-x', `${x}%`);
    el.style.setProperty('--mouse-y', `${y}%`);

    // Subtle 3D tilt for the hero widget
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const tiltX = (e.clientY - centerY) / 35;
    const tiltY = -(e.clientX - centerX) / 35;
    setWidgetTilt({ x: tiltX, y: tiltY });
  };

  const titleChars = 'SILHOUETTE'.split('');

  return (
    <header className="hero" ref={containerRef} onMouseMove={handleMove}>
      {/* Dynamic Reveal Canvas */}
      <div className="hero-bg" id="hero-reveal-container" ref={bgRef}>
        <img
          src="https://images.pexels.com/photos/12628400/pexels-photo-12628400.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Amarni hero footwear base"
          className="hero-front"
          style={{ transition: 'transform 0.5s ease-out' }}
        />
        <img
          src="https://images.pexels.com/photos/12628400/pexels-photo-12628400.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Amarni hero footwear monochrome reveal"
          className="hero-reveal"
        />
      </div>

      {/* Floating Center Content with Staggered Kinetic Typography */}
      <div className="hero-content">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            animation: 'fadeInUp 0.8s ease-out forwards',
          }}
        >
         
        </div>

        <h1
          className="hero-title"
          style={{
            display: 'flex',
            justifyContent: 'center',
            letterSpacing: '0.04em',
            overflow: 'hidden',
          }}
        >
          {titleChars.map((char, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                animation: `fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.04}s both`,
                transition: 'transform 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '1.05rem',
            fontWeight: 400,
            maxWidth: '520px',
            lineHeight: 1.6,
            textAlign: 'center',
            marginBottom: '1.75rem',
            animation: 'fadeInUp 0.9s ease-out 0.4s both',
          }}
        >
          Sculpted footwear engineered through structural restraint, 14 SPI hand-craft, and architectural equilibrium.
        </p>

        <div style={{ display: 'flex', gap: '1rem', animation: 'fadeInUp 1s ease-out 0.5s both' }}>
          <a href="#collections" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
            <span>Discover the Form</span>
            <ArrowDown size={14} />
          </a>
          <a href="#sneaker-lab" className="btn btn-ghost">
            <span>Explore 3D Splat</span>
          </a>
        </div>
      </div>

      {/* Floating 3D Tilt Season Widget */}
      <div
        className="hero-widget"
        style={{
          transform: `perspective(600px) rotateX(${widgetTilt.x}deg) rotateY(${widgetTilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <span className="micro-label" style={{ letterSpacing: '0.15em' }}>
          Collection Series
        </span>
        <span style={{ fontWeight: 600, fontSize: '1rem' }}>Automne / Hiver '26</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Limited 500 Pairs Worldwide
        </span>
      </div>
    </header>
  );
}
