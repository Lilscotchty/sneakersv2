import { useState } from 'react';
import { PRODUCTS_DATA, CATEGORIES_DATA, type Product } from '@/lib/supabase';
import TiltCard from './TiltCard';
import { Eye } from 'lucide-react';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

interface ListingsProps {
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
  onOpenProduct?: (product: Product) => void;
}

export default function Listings({
  selectedCategory: externalCategory,
  onSelectCategory: externalSetCategory,
  onOpenProduct,
}: ListingsProps) {
  const [internalCategory, setInternalCategory] = useState<string>('all');
  const activeCategory = externalCategory ?? internalCategory;

  const handleCategoryChange = (id: string) => {
    if (externalSetCategory) {
      externalSetCategory(id);
    } else {
      setInternalCategory(id);
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? PRODUCTS_DATA
    : PRODUCTS_DATA.filter((p) => p.category_id === activeCategory);

  return (
    <section id="store" className="listings">
      <div className="section-header" style={{ maxWidth: 1600, margin: '0 auto 3.5rem' }}>
        <div>
          <span className="micro-label" style={{ letterSpacing: '0.15em' }}>
            Curated Allocation
          </span>
          <h2 style={{ fontSize: '3rem' }}>Latest Arrivals</h2>
        </div>

        {/* Filter Categories */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => handleCategoryChange('all')}
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: activeCategory === 'all' ? 'var(--text-main)' : 'var(--border-soft)',
              background: activeCategory === 'all' ? 'var(--text-main)' : 'transparent',
              color: activeCategory === 'all' ? '#ffffff' : 'var(--text-main)',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            All Silhouettes ({PRODUCTS_DATA.length})
          </button>
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count = PRODUCTS_DATA.filter((p) => p.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--text-main)' : 'var(--border-soft)',
                  background: isSelected ? 'var(--text-main)' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="listing-grid">
        {filteredProducts.map((p) => (
          <TiltCard
            key={p.id}
            className="product-card"
            maxTilt={7}
            glareOpacity={0.12}
            onClick={() => onOpenProduct && onOpenProduct(p)}
          >
            <div className="product-img-wrapper" style={{ position: 'relative' }}>
              <img src={p.image_url} alt={p.name} loading="lazy" />

              {/* Hover Quick View Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(17, 17, 17, 0.88)',
                  backdropFilter: 'blur(10px)',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  opacity: 0,
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  pointerEvents: 'none',
                }}
                className="product-hover-badge"
              >
                <Eye size={13} />
                <span>Quick View</span>
              </div>
            </div>

            <div className="product-meta">
              <div>
                <div className="product-title">{p.name}</div>
                {p.subtitle && <div className="micro-label">{p.subtitle}</div>}
              </div>
              <div className="product-price">{formatPrice(p.price_cents)}</div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
