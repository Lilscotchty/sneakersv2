import { useEffect, useState } from 'react';
import { ShoppingBag, Volume2, VolumeX } from 'lucide-react';
import { isAudioMuted, toggleAudioMute, subscribeAudioMute } from '@/lib/soundHaptics';

const LINKS = [
  { label: '3D Cross', href: '#spatial-cross' },
  { label: 'Page Slice', href: '#slice-reveal'},
  { label: 'Sneaker Lab', href: '#sneaker-lab' },
  { label: 'Collections', href: '#collections' },
  { label: 'Store', href: '#store' },
  { label: 'Craft & Maison', href: '#about' },
];

interface NavProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function Nav({ cartCount = 0, onOpenCart }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [muted, setMuted] = useState(isAudioMuted());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return subscribeAudioMute((val) => setMuted(val));
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <nav
      style={{
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.04)' : 'none',
      }}
    >
      <a href="#" className="nav-logo" style={{ letterSpacing: '-0.03em' }}>
        Amarni
      </a>

      <div className="nav-links" style={{ display: window.innerWidth > 960 ? 'flex' : 'none' }}>
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            style={{
              position: 'relative',
              transition: 'color 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {l.icon && <l.icon size={13} style={{ opacity: 0.6 }} />}
            <span>{l.label}</span>
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Sound Haptics Acoustic Toggle */}
        <button
          onClick={() => toggleAudioMute()}
          title={muted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid var(--border-soft)',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-main)',
            transition: 'border-color 0.2s ease',
          }}
        >
          {muted ? <VolumeX size={15} style={{ opacity: 0.5 }} /> : <Volume2 size={15} />}
        </button>

        {/* Atelier Bag Trigger */}
        <button
          onClick={onOpenCart}
          className="btn btn-ghost"
          style={{
            padding: '8px 16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
          }}
        >
          <ShoppingBag size={15} />
          <span>Bag</span>
          <span
            style={{
              background: 'var(--text-main)',
              color: '#ffffff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          >
            {cartCount}
          </span>
        </button>

        <a href="#store" className="btn btn-primary" style={{ padding: '10px 22px' }}>
          Boutique
        </a>

        <button
          className="btn btn-ghost"
          aria-label="Menu"
          onClick={() => setMobileOpen((v) => !v)}
          style={{ display: window.innerWidth > 960 ? 'none' : 'inline-flex', padding: '10px 14px' }}
        >
          Menu
        </button>
      </div>

      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--nav-h)',
            left: 0,
            width: '100%',
            background: 'rgba(250, 250, 250, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-soft)',
            padding: '2rem 4vw',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            zIndex: 99,
          }}
        >
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: '1.1rem',
                textDecoration: 'none',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {l.icon && <l.icon size={16} />}
              <span>{l.label}</span>
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
