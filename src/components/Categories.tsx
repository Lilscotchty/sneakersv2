import TiltCard from './TiltCard';
import { ArrowUpRight } from 'lucide-react';

const CARDS = [
  {
    span: 'cat-large',
    img: 'https://images.pexels.com/photos/15557052/pexels-photo-15557052.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Formal black leather shoes',
    label: 'Avant-Garde',
    meta: 'Curated 24 Styles',
    categoryId: 'cat-1',
  },
  {
    span: 'cat-small',
    img: 'https://images.pexels.com/photos/11256743/pexels-photo-11256743.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'White chelsea boots',
    label: 'Essentials',
    meta: 'Timeless Daily Silhouettes',
    categoryId: 'cat-2',
  },
  {
    span: 'cat-wide',
    img: 'https://images.pexels.com/photos/12740481/pexels-photo-12740481.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Suede sneaker on concrete',
    label: 'Performance Heritage',
    meta: 'Sneaker Atelier & Court',
    categoryId: 'cat-3',
  },
];

interface CategoriesProps {
  onSelectCategory?: (id: string) => void;
}

export default function Categories({ onSelectCategory }: CategoriesProps) {
  const handleClick = (categoryId: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    const storeEl = document.getElementById('store');
    if (storeEl) {
      storeEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="collections" className="categories">
      <div className="section-header" style={{ maxWidth: 1600, margin: '0 auto 3rem' }}>
        <div>
          <span className="micro-label" style={{ letterSpacing: '0.15em' }}>
            Curated Archetypes
          </span>
          <h2 style={{ fontSize: '3rem' }}>The Categories</h2>
        </div>
        <a href="#store" className="btn btn-ghost" style={{ display: 'inline-flex', gap: '0.4rem' }}>
          <span>View Catalog</span>
          <ArrowUpRight size={14} />
        </a>
      </div>

      <div className="category-grid" style={{ maxWidth: 1600, margin: '0 auto' }}>
        {CARDS.map((c) => (
          <TiltCard
            key={c.label}
            className={`cat-card ${c.span}`}
            maxTilt={6}
            glareOpacity={0.15}
            onClick={() => handleClick(c.categoryId)}
            style={{ overflow: 'hidden' }}
          >
            <img
              src={c.img}
              alt={c.alt}
              loading="lazy"
              style={{
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease',
              }}
            />
            <div className="cat-info">
              <div>
                <span style={{ fontWeight: 500, fontSize: '1.25rem', display: 'block' }}>{c.label}</span>
                {c.meta && <span className="micro-label" style={{ color: 'rgba(255,255,255,0.7)' }}>{c.meta}</span>}
              </div>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <ArrowUpRight size={16} />
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
