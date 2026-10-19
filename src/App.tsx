import { useEffect, useRef, useState } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import IsometricCrossShowcase from '@/components/IsometricCrossShowcase';
import ScrollScrub from '@/components/ScrollScrub';
import Categories from '@/components/Categories';
import SneakerLab from '@/components/SneakerLab';
import Listings from '@/components/Listings';
import About from '@/components/About';
import FinaleFooter from '@/components/FinaleFooter';
import ProductModal from '@/components/ProductModal';
import CartDrawer, { type CartItem } from '@/components/CartDrawer';
import { preloadAllFrames } from '@/lib/frameCache';
import type { Product } from '@/lib/supabase';

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const [ready] = useState(true);

  // Cart & Modal state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    preloadAllFrames(() => {}).catch(() => undefined);
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer.finale-footer');
    const main = mainRef.current;
    const update = () => {
      if (footer && main) {
        main.style.setProperty('--footer-height', `${(footer as HTMLElement).offsetHeight}px`);
      }
    };
    window.addEventListener('resize', update);
    const t = window.setTimeout(update, 50);
    return () => {
      window.removeEventListener('resize', update);
      window.clearTimeout(t);
    };
  }, []);

  const handleAddToCart = (product: Product, size: number) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, size: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string, size: number) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === id && item.size === size))
    );
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <Nav cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main id="main-content" ref={mainRef}>
        <Hero />
        <Marquee speed={35} />

        {/* 3D + Shape Cross Constellation (from Video Frame 00:08) */}
        <IsometricCrossShowcase onOpenProduct={(p) => setModalProduct(p)} />

        <ScrollScrub ready={ready} />

        <Categories onSelectCategory={(catId) => setSelectedCategory(catId)} />

        <SneakerLab />


        <Marquee
          items={[
            'ONYX DERB',
            'STRATA CHELSEA',
            'AERO RUNNER',
            'MONOLITH OXFORD',
            'COURT LEGACY 70',
            'TERRA TRAIL GTX',
            'BALLETE FLAT',
          ]}
          speed={45}
          reverse
        />

        <Listings
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenProduct={(p) => setModalProduct(p)}
        />

        <About />
      </main>

      <FinaleFooter />

      {/* Quick View Modal */}
      <ProductModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-Over Atelier Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </>
  );
}
