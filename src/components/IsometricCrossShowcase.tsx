import { useState, useRef, useEffect, type MouseEvent } from 'react';
import { Move3d, Eye } from 'lucide-react';
import { PRODUCTS_DATA, type Product } from '@/lib/supabase';
import { playShutterSound, playTickSound } from '@/lib/soundHaptics';

interface IsometricCrossShowcaseProps {
  onOpenProduct?: (product: Product) => void;
}

type ViewMode = 'isometric' | 'exploded' | 'frontal';

export default function IsometricCrossShowcase({ onOpenProduct }: IsometricCrossShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseRot, setMouseRot] = useState({ x: 0, y: 0 });
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('isometric');
  const [orbitAngle, setOrbitAngle] = useState(0);

  const [crossProducts, setCrossProducts] = useState({
    center: PRODUCTS_DATA[2],
    top: PRODUCTS_DATA[1],
    bottom: PRODUCTS_DATA[4],
    left: PRODUCTS_DATA[0],
    right: PRODUCTS_DATA[5],
  });

  useEffect(() => {
    let animId: number;
    const loop = () => {
      setOrbitAngle((prev) => (prev + 0.3) % 360);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseRot({
      x: -y * 18,
      y: x * 22,
    });
  };

  const handleMouseLeave = () => {
    setMouseRot({ x: 0, y: 0 });
  };

  const switchMode = (mode: ViewMode) => {
    playShutterSound();
    setViewMode(mode);
  };

  const getBaseTransform = () => {
    const floatWiggleX = Math.sin(orbitAngle * 0.05) * 3;
    const floatWiggleY = Math.cos(orbitAngle * 0.05) * 5;

    switch (viewMode) {
      case 'isometric':
        return `rotateX(${52 + mouseRot.x + floatWiggleX}deg) rotateZ(${-35 + mouseRot.y + floatWiggleY}deg)`;
      case 'exploded':
        return `rotateX(${60 + mouseRot.x}deg) rotateZ(${-42 + mouseRot.y}deg)`;
      case 'frontal':
        return `rotateX(${8 + mouseRot.x}deg) rotateY(${mouseRot.y}deg)`;
    }
  };

  const getCardOffset = (role: 'center' | 'top' | 'bottom' | 'left' | 'right') => {
    const isExploded = viewMode === 'exploded';
    const dist = isExploded ? 300 : 220;

    switch (role) {
      case 'center':
        return { x: 0, y: 0, z: isExploded ? 110 : 60 };
      case 'top':
        return { x: 0, y: -dist, z: 35 };
      case 'bottom':
        return { x: 0, y: dist, z: 35 };
      case 'left':
        return { x: -dist, y: 0, z: 25 };
      case 'right':
        return { x: dist, y: 0, z: 25 };
    }
  };

  const handlePromoteToCenter = (role: 'center' | 'top' | 'bottom' | 'left' | 'right', prod: Product) => {
    playShutterSound();
    if (role === 'center') {
      onOpenProduct?.(prod);
      return;
    }
    setCrossProducts((prev) => ({
      ...prev,
      center: prod,
      [role]: prev.center,
    }));
  };

  const cards = [
    { role: 'center' as const, product: crossProducts.center, label: 'CORE HERO' },
    { role: 'top' as const, product: crossProducts.top, label: 'NORTH APEX' },
    { role: 'bottom' as const, product: crossProducts.bottom, label: 'SOUTH WING' },
    { role: 'left' as const, product: crossProducts.left, label: 'WEST FLANK' },
    { role: 'right' as const, product: crossProducts.right, label: 'EAST WING' },
  ];

  return (
    <section
      id="spatial-cross"
      style={{
        position: 'relative',
        padding: '6vw 4vw 7vw',
        background: '#0d0f11',
        color: '#ffffff',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vw',
          maxWidth: '900px',
          maxHeight: '900px',
          background: 'radial-gradient(circle, rgba(230,57,70,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          maxWidth: 1500,
          margin: '0 auto 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '2rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Move3d size={15} style={{ color: '#e63946' }} />
            <span className="micro-label" style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em' }}>
              Spatial Constellation
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', color: '#ffffff', lineHeight: 1 }}>
            3D Spatial Cross (+)
          </h2>
        </div>

        {/* Minimal Mode Selector */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(16px)',
            padding: '3px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {(['isometric', 'exploded', 'frontal'] as ViewMode[]).map((mode) => {
            const isActive = viewMode === mode;
            const labels: Record<ViewMode, string> = {
              isometric: 'Isometric +',
              exploded: 'Exploded',
              frontal: 'Frontal',
            };

            return (
              <button
                key={mode}
                onClick={() => switchMode(mode)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  border: 'none',
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#0d0f11' : 'rgba(255,255,255,0.7)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Perspective Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: '1300px',
          width: '100%',
          maxWidth: '1200px',
          height: '660px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'grab',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transform: getBaseTransform(),
            transformStyle: 'preserve-3d',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Subtle Grid Floor */}
          <div
            style={{
              position: 'absolute',
              width: '800px',
              height: '800px',
              border: '1px dashed rgba(255,255,255,0.08)',
              borderRadius: '24px',
              transform: 'translateZ(0px)',
              pointerEvents: 'none',
            }}
          />

          {/* Cross Axis Lines */}
          <div
            style={{
              position: 'absolute',
              width: '680px',
              height: '1.5px',
              background: 'linear-gradient(90deg, transparent, rgba(230,57,70,0.4), #ffffff, rgba(230,57,70,0.4), transparent)',
              transform: 'translateZ(10px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '1.5px',
              height: '680px',
              background: 'linear-gradient(180deg, transparent, rgba(230,57,70,0.4), #ffffff, rgba(230,57,70,0.4), transparent)',
              transform: 'translateZ(10px)',
              pointerEvents: 'none',
            }}
          />

          {/* Floating Cards */}
          {cards.map((c) => {
            const offset = getCardOffset(c.role);
            const isHovered = activeCardId === c.product.id;
            const elevationZ = offset.z + (isHovered ? 40 : 0);

            return (
              <div
                key={c.role}
                onMouseEnter={() => {
                  setActiveCardId(c.product.id);
                  playTickSound();
                }}
                onMouseLeave={() => setActiveCardId(null)}
                onClick={() => handlePromoteToCenter(c.role, c.product)}
                style={{
                  position: 'absolute',
                  width: c.role === 'center' ? '220px' : '195px',
                  height: c.role === 'center' ? '280px' : '255px',
                  transform: `translate3d(${offset.x}px, ${offset.y}px, ${elevationZ}px)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: c.role === 'center' ? 'rgba(28, 32, 36, 0.95)' : 'rgba(20, 24, 27, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: isHovered
                    ? '2px solid #ffffff'
                    : c.role === 'center'
                    ? '1.5px solid rgba(230,57,70,0.6)'
                    : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: isHovered
                    ? '0 30px 60px rgba(0,0,0,0.8)'
                    : '0 15px 35px rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: c.role === 'center' ? 20 : 10,
                }}
              >
                {/* Image Area */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '64%',
                    overflow: 'hidden',
                    background: '#16191c',
                  }}
                >
                  <img
                    src={c.product.image_url}
                    alt={c.product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.6rem',
                      left: '0.6rem',
                      background: 'rgba(0,0,0,0.6)',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: c.role === 'center' ? '#ff7582' : 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {c.label}
                  </div>
                  {isHovered && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.6rem',
                        right: '0.6rem',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        color: '#000000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Eye size={13} />
                    </div>
                  )}
                </div>

                {/* Card Meta */}
                <div
                  style={{
                    padding: '0.75rem 0.9rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                      {c.product.name}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                      ${(c.product.price_cents / 100).toLocaleString('en-US')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.6rem',
                        color: c.role === 'center' ? '#ff7582' : 'rgba(255,255,255,0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                      }}
                    >
                      {c.role === 'center' ? 'CENTER' : 'PROMOTE'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
