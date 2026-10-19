import { useEffect, useRef } from 'react';

interface MarqueeProps {
  items?: string[];
  speed?: number; // pixels per second
  reverse?: boolean;
}

const DEFAULT_ITEMS = [
  'ARCHITECTURAL FORM',
  '14 SPI HAND-STITCHED',
  'VEGETAL CALFSKIN',
  'VIBRAM OUTSOLE',
  'ATELIER MILANO',
  'LIMITED ALLOCATION',
  'AUTUMN / WINTER 2026',
];

export default function Marquee({
  items = DEFAULT_ITEMS,
  speed = 40,
  reverse = false,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const direction = reverse ? 1 : -1;
      posRef.current += direction * speed * dt;

      if (containerRef.current) {
        const width = containerRef.current.scrollWidth / 2;
        if (Math.abs(posRef.current) >= width) {
          posRef.current = 0;
        }
        containerRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speed, reverse]);

  const list = [...items, ...items, ...items, ...items];

  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        padding: '1.25rem 0',
        background: 'var(--text-main)',
        color: '#ffffff',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        userSelect: 'none',
      }}
    >
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          width: 'max-content',
          willChange: 'transform',
        }}
      >
        {list.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: '0 2rem',
              opacity: 0.9,
            }}
          >
            {item}
            <span
              style={{
                display: 'inline-block',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.4)',
                marginLeft: '2rem',
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
