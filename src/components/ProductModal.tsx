import { useState } from 'react';
import { X, Check, ShieldCheck, Ruler } from 'lucide-react';
import type { Product } from '@/lib/supabase';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: number) => void;
}

const SIZES = [40, 41, 42, 43, 44, 45];

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<number>(42);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2vw',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 15, 15, 0.65)',
          backdropFilter: 'blur(16px)',
          animation: 'fadeIn 0.25s ease-out forwards',
        }}
      />

      {/* Modal Dialog */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 1.1fr' : '1fr',
          zIndex: 2,
          animation: 'scaleUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 10,
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <X size={18} />
        </button>

        {/* Product Image Column */}
        <div
          style={{
            position: 'relative',
            background: '#f4f4f4',
            overflow: 'hidden',
            minHeight: '360px',
          }}
        >
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(10px)',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Handcrafted in Italy
          </div>
        </div>

        {/* Information Column */}
        <div
          style={{
            padding: '2.5rem 2.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <span className="micro-label" style={{ letterSpacing: '0.15em' }}>
                Atelier Silhouette
              </span>
              <span style={{ fontSize: '1.35rem', fontWeight: 600, fontFamily: 'Public Sans, sans-serif' }}>
                ${(product.price_cents / 100).toLocaleString('en-US')}
              </span>
            </div>

            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1 }}>{product.name}</h2>
            {product.subtitle && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {product.subtitle}
              </p>
            )}

            {/* Size Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="micro-label">Select Size (EU)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Ruler size={12} /> Standard Fit
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
                {SIZES.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: '10px 0',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--text-main)' : 'var(--border-soft)',
                        background: isSelected ? 'var(--text-main)' : 'var(--bg-base)',
                        color: isSelected ? '#ffffff' : 'var(--text-main)',
                        fontWeight: isSelected ? 600 : 400,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specifications Strip */}
            <div
              style={{
                background: 'var(--bg-base)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                fontSize: '0.8rem',
                marginBottom: '2rem',
                border: '1px solid var(--border-soft)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Construction</span>
                <span style={{ fontWeight: 500 }}>Blake Rapid 14 SPI</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tanning</span>
                <span style={{ fontWeight: 500 }}>Vegetal Infused Organic</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Allocation</span>
                <span style={{ fontWeight: 500 }}>Limited 500 Pairs Worldwide</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleAdd}
              disabled={added}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
              }}
            >
              {added ? (
                <>
                  <Check size={18} />
                  <span>Added to Atelier Bag</span>
                </>
              ) : (
                <span>Add to Bag · EU {selectedSize}</span>
              )}
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '1rem',
              }}
            >
              <ShieldCheck size={14} />
              <span>Includes Certificate of Authenticity & Hand-Carved Last Key</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
