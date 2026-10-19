import { X, Plus, Minus, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/supabase';

export interface CartItem {
  product: Product;
  size: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, size: number, delta: number) => void;
  onRemoveItem: (id: string, size: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotalCents = items.reduce(
    (sum, item) => sum + item.product.price_cents * item.quantity,
    0
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.25s ease-out forwards',
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: '#ffffff',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2,
          animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.75rem 2rem',
            borderBottom: '1px solid var(--border-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span className="micro-label" style={{ letterSpacing: '0.15em' }}>
              Atelier Bag
            </span>
            <h3 style={{ fontSize: '1.5rem', marginTop: '0.2rem' }}>
              {items.length === 0 ? 'Your Bag is Empty' : `${items.length} Silhouettes`}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--text-muted)',
                textAlign: 'center',
                gap: '1rem',
              }}
            >
              <Sparkles size={36} style={{ opacity: 0.4 }} />
              <p style={{ fontSize: '0.95rem', maxWidth: 260 }}>
                Explore the latest arrivals and select your size to curate an allocation.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid var(--border-soft)',
                }}
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  style={{
                    width: '90px',
                    height: '90px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    background: '#f2f2f2',
                  }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '1rem' }}>{item.product.name}</span>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.size)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Size EU {item.size} · {item.product.subtitle}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Stepper */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#f4f4f4',
                        padding: '4px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.size, -1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.size, 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      ${((item.product.price_cents * item.quantity) / 100).toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.75rem 2rem',
              borderTop: '1px solid var(--border-soft)',
              background: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 600 }}>
                ${(subtotalCents / 100).toLocaleString('en-US')}
              </span>
            </div>

            <button
              onClick={() => {
                alert('Private Allocation Request received. A bespoke courier confirmation has been initiated.');
                onClose();
              }}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
              }}
            >
              <span>Acquire Private Allocation</span>
              <ArrowRight size={16} />
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <ShieldCheck size={14} />
              <span>Complimentary Worldwide Insured Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
