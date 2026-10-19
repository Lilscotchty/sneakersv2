import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  price_cents: number;
  image_url: string;
  is_featured: boolean;
  category_id: string | null;
  position?: number;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  position: number;
};

export const PRODUCTS_DATA: Product[] = [
  { id: 'f1', slug: 'onyx-derb', name: 'Onyx Derb', subtitle: 'Calfskin Leather', price_cents: 89000, image_url: 'https://images.pexels.com/photos/15557047/pexels-photo-15557047.jpeg?auto=compress&cs=tinysrgb&w=800', is_featured: false, category_id: 'cat-1', position: 1 },
  { id: 'f2', slug: 'strata-chelsea', name: 'Strata Chelsea', subtitle: 'Suede / Rubber', price_cents: 112000, image_url: 'https://images.pexels.com/photos/38277608/pexels-photo-38277608.jpeg?auto=compress&cs=tinysrgb&w=800', is_featured: false, category_id: 'cat-2', position: 2 },
  { id: 'f3', slug: 'aero-runner', name: 'Aero Runner', subtitle: 'Technical Mesh', price_cents: 75000, image_url: 'https://images.pexels.com/photos/9853346/pexels-photo-9853346.jpeg?auto=compress&cs=tinysrgb&w=800', is_featured: true, category_id: 'cat-3', position: 3 },
  { id: 'f4', slug: 'monolith-oxford', name: 'Monolith Oxford', subtitle: 'Polished Cordovan', price_cents: 95000, image_url: 'https://images.pexels.com/photos/4161710/pexels-photo-4161710.jpeg?auto=compress&cs=tinysrgb&w=800', is_featured: false, category_id: 'cat-1', position: 4 },
  { id: 'f5', slug: 'court-legacy-70', name: 'Court Legacy 70', subtitle: 'Nubuck / Gum Sole', price_cents: 62000, image_url: 'https://images.pexels.com/photos/12740481/pexels-photo-12740481.jpeg?auto=compress&cs=tinysrgb&w=800', is_featured: true, category_id: 'cat-3', position: 5 },
  { id: 'f6', slug: 'terra-trail-gtx', name: 'Terra Trail GTX', subtitle: 'Ripstop / Vibram', price_cents: 84000, image_url: 'https://images.pexels.com/photos/31650329/pexels-photo-31650329.jpeg?auto=compress&cs=tinysrgb&w=800', is_featured: false, category_id: 'cat-3', position: 6 },
  { id: 'f7', slug: 'ballete-flat', name: 'Ballete Flat', subtitle: 'Patent Leather', price_cents: 54000, image_url: 'https://images.pexels.com/photos/10743774/pexels-photo-10743774.jpeg?auto=compress&cs=tinysrgb&w=800', is_featured: false, category_id: 'cat-1', position: 7 },
  { id: 'f8', slug: 'aero-runner-mono', name: 'Aero Runner Mono', subtitle: 'Knit / Recycled', price_cents: 68000, image_url: 'https://images.pexels.com/photos/18202585/pexels-photo-18202585.jpeg?auto=compress&cs=tinysrgb&w=800', is_featured: false, category_id: 'cat-3', position: 8 },
];

export const CATEGORIES_DATA: Category[] = [
  { id: 'cat-1', slug: 'avant-garde', name: 'Avant-Garde', description: 'Formal and experimental silhouettes', position: 1 },
  { id: 'cat-2', slug: 'essentials', name: 'Essentials', description: 'Timeless daily wear', position: 2 },
  { id: 'cat-3', slug: 'performance-heritage', name: 'Performance Heritage', description: 'Technical runners and court shoes', position: 3 },
];

type QueryResult<T> = {
  data: T | null;
  error: { code?: string; message: string } | null;
};

class MockSupabaseQueryBuilder {
  private table: string;
  private action: 'select' | 'insert' = 'select';
  private insertData: Record<string, unknown> | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select() {
    this.action = 'select';
    return this;
  }

  order() {
    return this;
  }

  insert(data: Record<string, unknown>) {
    this.action = 'insert';
    this.insertData = data;
    return this;
  }

  async then(resolve: (res: QueryResult<unknown>) => void) {
    if (this.table === 'products') {
      resolve({ data: PRODUCTS_DATA, error: null });
    } else if (this.table === 'categories') {
      resolve({ data: CATEGORIES_DATA, error: null });
    } else if (this.table === 'newsletter_subscribers') {
      if (this.action === 'insert') {
        const email = String(this.insertData?.email || '');
        const subs: string[] = JSON.parse(localStorage.getItem('amarni_subscribers') || '[]');
        if (subs.includes(email)) {
          resolve({ data: null, error: { code: '23505', message: 'Already subscribed' } });
        } else {
          subs.push(email);
          localStorage.setItem('amarni_subscribers', JSON.stringify(subs));
          resolve({ data: this.insertData, error: null });
        }
      } else {
        resolve({ data: [], error: null });
      }
    } else {
      resolve({ data: [], error: null });
    }
  }
}

class MockSupabaseClient {
  from(table: string) {
    return new MockSupabaseQueryBuilder(table);
  }
}

export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new MockSupabaseClient() as ReturnType<typeof createClient>);
