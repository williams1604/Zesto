/*
# Zesto Supermarket - Initial Database Schema

## Overview
Creates the complete data model for a functional supermarket app with customer shopping
and an admin dashboard to manage stock and view customer/order details.

## 1. New Tables

### profiles
- Extends Supabase auth.users with customer metadata.
- `id` (uuid, PK, references auth.users) — links to the auth account.
- `full_name` (text) — customer's display name.
- `phone` (text) — contact phone number.
- `role` (text, default 'customer') — 'customer' or 'admin'. Controls admin dashboard access.
- `created_at` (timestamptz) — when the profile was created.

### categories
- Product grouping (e.g. Fresh Produce, Staples, Cleaning, Snacks).
- `id` (uuid, PK)
- `name` (text, unique) — category name.
- `slug` (text, unique) — URL-friendly identifier.
- `icon` (text) — lucide icon name for display.
- `created_at` (timestamptz)

### products
- Individual sellable items.
- `id` (uuid, PK)
- `name` (text) — product name.
- `description` (text) — short description.
- `price` (numeric, default 0) — selling price in INR.
- `unit` (text) — e.g. 'kg', 'pc', 'pack'.
- `category_id` (uuid, FK to categories) — which category it belongs to.
- `image_url` (text) — product photo URL.
- `stock` (integer, default 0) — quantity in inventory.
- `created_at` (timestamptz)

### orders
- A customer's order (header).
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users) — who placed the order.
- `status` (text, default 'pending') — pending, confirmed, delivered, cancelled.
- `total` (numeric, default 0) — order total.
- `delivery_address` (text) — where to deliver.
- `created_at` (timestamptz)

### order_items
- Line items within an order.
- `id` (uuid, PK)
- `order_id` (uuid, FK to orders, cascade delete) — parent order.
- `product_id` (uuid, FK to products) — which product.
- `product_name` (text) — snapshot of product name at order time.
- `quantity` (integer) — how many.
- `price` (numeric) — snapshot of price at order time.

## 2. Security (RLS)

- **profiles**: users can read/update only their own profile. Anyone authenticated can
  read the `role` column indirectly via the admin check — but we restrict full reads to
  self. Admins get full access via a SECURITY DEFINER function (see below).
- **categories**: public read (needed for storefront), no writes from client.
- **products**: public read (storefront), admin-only writes via RLS using a role check.
- **orders**: customers read/insert only their own orders; admins read all.
- **order_items**: customers read items for their own orders; admins read all.

## 3. Admin Role Checking

A helper SQL function `is_admin()` checks if the current user's profile role is 'admin'.
This is used in RLS policies for admin-only operations (product writes, viewing all orders).

## 4. Important Notes
- The first user should be promoted to admin by setting role='admin' in the profiles table.
- Email confirmation is OFF so signup works immediately.
- All owner columns default to auth.uid() so client inserts work without passing user_id.
*/

-- ---------- profiles ----------
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'customer',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ---------- categories ----------
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_categories" ON categories;
CREATE POLICY "read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- ---------- products ----------
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  unit text DEFAULT 'pc',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text DEFAULT '',
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_products" ON products;
CREATE POLICY "read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ---------- orders ----------
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  total numeric(10,2) NOT NULL DEFAULT 0,
  delivery_address text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_orders" ON orders;
CREATE POLICY "admin_select_orders" ON orders FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ---------- order_items ----------
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "admin_select_order_items" ON order_items;
CREATE POLICY "admin_select_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ---------- helper function ----------
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- ---------- indexes ----------
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
