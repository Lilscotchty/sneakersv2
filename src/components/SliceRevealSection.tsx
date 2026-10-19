import { useState, useRef, useEffect, type MouseEvent, type TouchEvent } from 'react';
import { Scissors, Sparkles, ArrowRight, Eye, Sliders } from 'lucide-react';
import type { Product } from '@/lib/supabase';

interface SliceRevealSectionProps {
  onOpenProduct?: (product: Product) => void;
}

export default function SliceRevealSection({ onOpenProduct }: SliceRevealSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slicePos, setSlicePos] = useState(48);
  const [isDragging, setIsDragging] = useState(false);
  const [xrayActive, setXrayActive] = useState(false);
  const [hasPreviewed, setHasPreviewed] = useState(false);
  const [sparks, setSparks] = useState<{ id: number; y: number }[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPreviewed) {
            setHasPreviewed(true);
            setSlicePos(20);
            setTimeout(() => {
              setSlicePos(55);
            }, 500);
            setTimeout(() => {
              setSlicePos(48);
            }, 1000);
          }
        });
      },
      { threshold: 0.35 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasPreviewed]);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(4, Math.min(96, (x / rect.width) * 100));
    setSlicePos(pct);

    if (Math.random() > 0.4) {
      const sparkY = Math.random() * 80 + 10;
      setSparks((prev) => [...prev.slice(-6), { id: Date.now() + Math.random(), y: sparkY }]);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  };

  const secretShoe: Product = {
    id: 'secret-prototipo-01',
    price_cents: 145000,
    image_url: 'https://images.pexels.com/photos/15557052/pexels-photo-15557052.jpeg?auto=compress&cs=tinysrgb&w=1200',
    is_featured: true,
    category_id: 'cat-1',
  };

  // 45-degree diagonal blade cut
  const getTopLayerClipPath = () => {
    const topX = Math.min(100, slicePos + 18);
    const bottomX = Math.max(0, slicePos - 18);
    return `polygon(0 0, ${topX}% 0, ${bottomX}% 100%, 0 100%)`;
  };

  return (
    <section
      id="slice-reveal"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '85vh',
        background: '#0d0f11',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Minimal Header Notice */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          padding: '1.5rem 4vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(to bottom, rgba(13,15,17,0.9) 0%, transparent 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#b81414',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Scissors size={14} style={{ color: '#ffffff' }} />
          </div>
          <span className="micro-label" style={{ color: '#ffffff', letterSpacing: '0.2em' }}>
            Nika Stern Page Slice & Reveal
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        style={{
          position: 'relative',
          width: '100%',
          height: '85vh',
          overflow: 'hidden',
          cursor: isDragging ? 'ew-resize' : 'default',
        }}
      >
        {/* UNDERPAGE LAYER */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: xrayActive ? '#150508' : '#ad1414',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '7vw 5vw 4vw',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '1440px',
              margin: '0 auto',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 900 ? '1.2fr 1fr' : '1fr',
              alignItems: 'center',
              gap: '4rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(0,0,0,0.4)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <Sparkles size={12} style={{ color: '#ffd166' }} />
                <span>ARCHIVE SUBTERRANEAN</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.25rem',
                  color: '#ffffff',
                }}
              >
                THE CRIMSON ARCHIVE
              </h2>

              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  maxWidth: '480px',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '2rem',
                  fontWeight: 300,
                }}
              >
                Experimental hand-dyed cordovan uppers and proprietary rebound soles tested in absolute isolation.
              </p>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                  onClick={() => onOpenProduct && onOpenProduct(secretShoe)}
                  style={{
                    padding: '14px 28px',
                    borderRadius: '999px',
                    background: '#0d0f11',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Eye size={15} />
                  <span>Inspect Prototipo X</span>
                  <ArrowRight size={13} />
                </button>

                <button
                  onClick={() => setXrayActive((v) => !v)}
                  style={{
                    padding: '14px 20px',
                    borderRadius: '999px',
                    background: xrayActive ? '#ffffff' : 'rgba(0,0,0,0.3)',
                    color: xrayActive ? '#000000' : '#ffffff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Sliders size={13} />
                  <span>{xrayActive ? 'Normal' : 'X-Ray'}</span>
                </button>
              </div>
            </div>

            {/* Visual */}
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(0,0,0,0.35)',
              }}
            >
              <img
                src={secretShoe.image_url}
                alt="Secret Archive Prototipo"
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  display: 'block',
                  filter: xrayActive ? 'invert(0.9) hue-rotate(180deg) contrast(1.4)' : 'contrast(1.15)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1.25rem 1.5rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <div>
                  <span className="micro-label" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Unreleased Archive
                  </span>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Strata Prototipo X</div>
                </div>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.8rem' }}>$1,450</div>
              </div>
            </div>
          </div>
        </div>

        {/* TOP LAYER */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#121619',
            color: '#ffffff',
            clipPath: getTopLayerClipPath(),
            transition: isDragging ? 'none' : 'clip-path 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '7vw 5vw 4vw',
            overflow: 'hidden',
            boxShadow: '-20px 0 40px rgba(0,0,0,0.8)',
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '1440px',
              margin: '0 auto',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 900 ? '1.2fr 1fr' : '1fr',
              alignItems: 'center',
              gap: '4rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(255,255,255,0.06)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  marginBottom: '1.25rem',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <span>SURFACE FACADE</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.25rem',
                  color: '#ffffff',
                }}
              >
                THE MONOLITH FAÇADE
              </h2>

              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  maxWidth: '480px',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 300,
                }}
              >
                Restrained geometries and polished calfskin surfaces engineered for modern urban gallery walks.
              </p>
            </div>

            {/* Facade Visual */}
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#16191c',
              }}
            >
              <img
                src="https://images.pexels.com/photos/15557047/pexels-photo-15557047.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Amarni Monolith Façade"
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1.25rem 1.5rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <div>
                  <span className="micro-label" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Commercial Release
                  </span>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Onyx Derb Standard</div>
                </div>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.8rem' }}>$890</div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE BLADE DIVIDER */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${slicePos}%`,
            width: '3px',
            background: 'linear-gradient(to bottom, #ffffff, #e63946, #ffffff)',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 10px #e63946',
            cursor: 'ew-resize',
            zIndex: 35,
            transform: 'translateX(-50%) rotate(-6deg)',
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {sparks.map((s) => (
            <div
              key={s.id}
              style={{
                position: 'absolute',
                top: `${s.y}%`,
                left: '50%',
                width: '5px',
                height: '5px',
                background: '#ffd166',
                borderRadius: '50%',
                boxShadow: '0 0 8px #ff3366',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0d0f11',
              cursor: 'ew-resize',
              border: '2px solid #b81414',
            }}
          >
            <Scissors size={18} style={{ transform: 'rotate(-45deg)', color: '#b81414' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
