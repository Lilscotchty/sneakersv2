import { useState, useRef } from 'react';
import { ExternalLink, Maximize2, RotateCw } from 'lucide-react';
import type { FrameSet } from './SneakerLab';

interface SneakerCanvasProps {
  activeFeature?: FrameSet;
  interacted: boolean;
  onInteract: () => void;
}

export default function SneakerCanvas({
  activeFeature,
  onInteract,
}: SneakerCanvasProps) {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onInteract}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: '#1d292c',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
      }}
    >
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1d292c',
            zIndex: 2,
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '2px solid rgba(255,255,255,0.15)',
              borderTopColor: '#ffffff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span
            className="micro-label"
            style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em' }}
          >
            Loading PlayCanvas 3D Splat…
          </span>
        </div>
      )}

      <iframe
        src="https://playcanv.as/e/p/EZ7dJzfc/"
        title="PlayCanvas 3D Sneaker Display"
        onLoad={() => setLoading(false)}
        allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking; fullscreen"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          background: '#1d292c',
        }}
      />

      {/* Control Overlay Buttons */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 5,
        }}
      >
        <button
          onClick={toggleFullscreen}
          title="Fullscreen Mode"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <Maximize2 size={16} />
        </button>
        <a
          href="https://playcanv.as/p/EZ7dJzfc/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open in PlayCanvas"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#ffffff',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Interactive Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          zIndex: 5,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(10px)',
          padding: '6px 14px',
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <RotateCw size={12} style={{ color: 'rgba(255,255,255,0.8)' }} />
        <span
          className="micro-label"
          style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '0.1em' }}
        >
          {activeFeature ? `${activeFeature.name} · 3D Gaussian Splat` : 'PlayCanvas 3D'}
        </span>
      </div>
    </div>
  );
}
