import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import SneakerCanvas from './SneakerCanvas';

export default function SneakerLab() {
  const [interacted, setInteracted] = useState(false);

  return (
    <section id="sneaker-lab" className="sneaker-lab" style={{ padding: '6rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="lab-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <span className="micro-label" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
            Atelier
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, letterSpacing: '-0.02em', color: '#ffffff', margin: 0 }}>
            Sneaker Lab
          </h2>
        </div>
        <span className="micro-label" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.15em' }}>
          PlayCanvas 3D · Drag to orbit
        </span>
      </div>

      <div className="lab-viewer" style={{ width: '100%', height: '70vh', minHeight: '550px', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="lab-viewer-inner" style={{ width: '100%', height: '100%' }}>
          <SneakerCanvas interacted={interacted} onInteract={() => setInteracted(true)} />
        </div>
        <div className={`lab-hint ${interacted ? 'is-hidden' : ''}`} style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)', pointerEvents: 'none', zIndex: 10 }}>
          <RotateCw size={14} style={{ opacity: 0.8, color: '#fff' }} />
          <span className="micro-label" style={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em' }}>
            Drag to explore
          </span>
        </div>
      </div>
    </section>
  );
}
