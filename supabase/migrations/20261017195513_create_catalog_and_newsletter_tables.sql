/*
# Create store catalog and newsletter tables

1. Plain-English summary
   This migration creates the database foundation for the Amarni storefront.
   It adds three tables: one for product categories, one for the products
   themselves, and one for newsletter subscribers captured by the footer
   subscribe form. The public website can read the catalog (categories and
   products) and can add new newsletter subscribers. Nothing else is writable
   from the website, and subscriber emails can never be read back by the
   public site.

2. New Tables
   - `categories`
     - `id` (uuid, primary key, auto-generated)
     - `slug` (text, unique, url-friendly identifier e.g. "sneakers")
     - `name` (text, display name e.g. "Sneaker Atelier")
     - `description` (text, optional short description)
     - `position` (integer, display ordering, default 0)
     - `created_at` (timestamp, auto)
   - `products`
     - `id` (uuid, primary key, auto-generated)
     - `category_id` (uuid, foreign key to categories, nullable)
     - `slug` (text, unique, url-friendly identifier)
     - `name` (text, product display name)
     - `subtitle` (text, short material/finish line e.g. "Calfskin Leather")
     - `price_cents` (integer, price in cents, must be >= 0)
     - `image_url` (text, product photo URL)
     - `is_featured` (boolean, highlight flag, default false)
     - `position` (integer, display ordering, default 0)
     - `created_at` (timestamp, auto)
   - `newsletter_subscribers`
     - `id` (uuid, primary key, auto-generated)
     - `email` (text, unique, subscriber address)
     - `created_at` (timestamp, auto)

3. Modified Tables
   - None. All tables are new.

4. Security
   - Row Level Security (RLS) is ENABLED on all three tables.
   - `categories` and `products` are a public catalog: anyone (anonymous
     visitors included) may READ them. There are deliberately NO insert,
     update, or delete policies, so catalog content can only be changed
     through the Supabase dashboard by the store owner.
   - `newsletter_subscribers` allows anonymous INSERT only (so the footer
     subscribe form works). There is no SELECT policy, so collected email
     addresses are never exposed through the website.

5. Important notes
   - `price_cents` stores money as an integer number of cents to avoid
     floating point rounding problems.
   - Unique constraints on `slug` and `email` prevent duplicate catalog
     entries and duplicate subscriptions.
   - Indexes are added on `products.category_id` for fast category lookups.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  subtitle text,
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  image_url text NOT NULL,
  is_featured boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "anon_insert_newsletter_subscribers" ON newsletter_subscribers;
CREATE POLICY "anon_insert_newsletter_subscribers" ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
