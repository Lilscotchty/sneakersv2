import { useEffect, useRef, useState } from 'react';
import { ArrowLeftRight, Compass } from 'lucide-react';
import { CINEMATIC_FRAMES, FRAME_COUNT } from '@/lib/frameCache';

const SMOOTHING = 0.12;

export default function ScrollScrub({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const targetRef = useRef(0);
  const smoothRef = useRef(0);
  const [smoothVal, setSmoothVal] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const p = -rect.top / total;
      targetRef.current = Math.max(0, Math.min(1, p));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const animate = () => {
      smoothRef.current += (targetRef.current - smoothRef.current) * SMOOTHING;
      if (Math.abs(targetRef.current - smoothRef.current) < 0.0005) {
        smoothRef.current = targetRef.current;
      }
      setSmoothVal(smoothRef.current);
      const el = sectionRef.current;
      if (el) {
        const bar = el.querySelector<HTMLElement>('.scrub-progress-fill');
        if (bar) bar.style.width = `${smoothRef.current * 100}%`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  const activeFrameIndex = Math.max(
    0,
    Math.min(FRAME_COUNT - 1, Math.floor(smoothVal * FRAME_COUNT * 0.999))
  );
  const currentFrame = CINEMATIC_FRAMES[activeFrameIndex];

  // Kinetic typography horizontal slide offsets
  const slideLeft = (smoothVal - 0.5) * 400;
  const slideRight = (0.5 - smoothVal) * 400;

  return (
    <section className="video-scrub-section" id="scrub-section" ref={sectionRef}>
      <div className="video-sticky">
        {/* Render smooth cross-fading frames */}
        {CINEMATIC_FRAMES.map((f, idx) => {
          const isActive = idx === activeFrameIndex;
          return (
            <img
              key={f.url}
              src={f.url}
              alt={f.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isActive ? 0.92 : 0,
                transform: `scale(${1 + (smoothVal % (1 / FRAME_COUNT)) * 0.12})`,
                transition: 'opacity 0.45s ease-out, transform 0.1s linear',
                filter: 'brightness(0.85) contrast(1.08)',
              }}
            />
          );
        })}

        {/* Ambient Dark Gradient Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%), linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Kinetic Scrolling Watermark Lines (Top & Bottom) */}
        <div
          style={{
            position: 'absolute',
            top: '4rem',
            left: '50%',
            transform: `translateX(-50%) translate3d(${slideLeft}px, 0, 0)`,
            whiteSpace: 'nowrap',
            fontSize: 'clamp(3rem, 7vw, 7rem)',
            fontFamily: 'Instrument Serif, serif',
            color: 'rgba(255, 255, 255, 0.08)',
            letterSpacing: '0.05em',
            pointerEvents: 'none',
            userSelect: 'none',
            willChange: 'transform',
          }}
        >
          MAISON AMARNI ATELIER ARCHITECTURE FORM FLUIDITY
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '5rem',
            left: '50%',
            transform: `translateX(-50%) translate3d(${slideRight}px, 0, 0)`,
            whiteSpace: 'nowrap',
            fontSize: 'clamp(3rem, 7vw, 7rem)',
            fontFamily: 'Instrument Serif, serif',
            color: 'rgba(255, 255, 255, 0.08)',
            letterSpacing: '0.05em',
            pointerEvents: 'none',
            userSelect: 'none',
            willChange: 'transform',
          }}
        >
          14 SPI CALFSKIN SUEDE EQUILIBRIUM MILAN
        </div>

        {/* Dynamic Center Title & Annotation */}
        <div className="video-overlay" style={{ opacity: 1, zIndex: 3 }}>
          <span
            className="micro-label"
            style={{
              color: 'rgba(255,255,255,0.75)',
              marginBottom: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              letterSpacing: '0.2em',
            }}
          >
            <Compass size={14} /> {currentFrame.phase}
          </span>
          <h2 style={{ textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            {currentFrame.title}
          </h2>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 460,
              textAlign: 'center',
              fontWeight: 300,
              letterSpacing: '0.02em',
            }}
          >
            {currentFrame.subtitle}
          </p>
        </div>

        {/* Progress Hint & Scrub Bar */}
        <div className="scrub-progress-hint" style={{ zIndex: 4 }}>
          <span
            className="micro-label"
            style={{ color: 'rgba(255,255,255,0.8)', minWidth: '40px', textAlign: 'right' }}
          >
            {Math.round(smoothVal * 100)}%
          </span>
          <div className="scrub-progress-track">
            <div className="scrub-progress-fill" style={{ width: `${smoothVal * 100}%` }} />
          </div>
          <span
            className="micro-label"
            style={{ color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <ArrowLeftRight size={12} /> Scrub
          </span>
        </div>
      </div>
    </section>
  );
}
