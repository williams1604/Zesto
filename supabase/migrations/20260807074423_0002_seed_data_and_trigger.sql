/*
# Auto-create profile on signup + seed data

## 1. Trigger: auto-create profile on signup
- When a new row is inserted into auth.users, automatically create a matching row in
  the profiles table with the default 'customer' role.
- This ensures every signed-up user has a profile row the frontend can read.

## 2. Seed data
- 7 categories matching the Zesto brand sections.
- 21 sample products (3 per category) with real images, prices in INR, and stock levels.
- This gives the storefront and admin dashboard data to display immediately.
*/

-- ---------- auto-create profile ----------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;

-- ---------- seed categories ----------
INSERT INTO categories (name, slug, icon) VALUES
  ('Fresh Produce', 'fresh-produce', 'LeafyGreen'),
  ('Staples', 'staples', 'Wheat'),
  ('Cleaning Essentials', 'cleaning', 'Sparkles'),
  ('Snacks & Fun Foods', 'snacks', 'Popcorn'),
  ('Ready To Eat', 'ready-to-eat', 'Utensils'),
  ('Dairy', 'dairy', 'Milk'),
  ('Beverages', 'beverages', 'CupSoda')
ON CONFLICT (name) DO NOTHING;

-- ---------- seed products ----------
INSERT INTO products (name, description, price, unit, category_id, image_url, stock)
SELECT 'Potatoes', 'Fresh farm potatoes', 32.00, 'kg', c.id, 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 120
FROM categories c WHERE c.slug = 'fresh-produce'
UNION ALL
SELECT 'Broccoli', 'Green fresh broccoli', 80.00, 'kg', c.id, 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 45
FROM categories c WHERE c.slug = 'fresh-produce'
UNION ALL
SELECT 'Tomatoes', 'Ripe red tomatoes', 40.00, 'kg', c.id, 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 90
FROM categories c WHERE c.slug = 'fresh-produce'
UNION ALL
SELECT 'Basmati Rice', 'Premium long grain basmati', 145.00, 'kg', c.id, 'https://images.pexels.com/photos/36346840/pexels-photo-36346840.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 200
FROM categories c WHERE c.slug = 'staples'
UNION ALL
SELECT 'Toor Dal', 'Yellow split pigeon peas', 120.00, 'kg', c.id, 'https://images.pexels.com/photos/7665442/pexels-photo-7665442.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 150
FROM categories c WHERE c.slug = 'staples'
UNION ALL
SELECT 'Wheat Flour', 'Whole wheat atta', 55.00, 'kg', c.id, 'https://images.pexels.com/photos/18328392/pexels-photo-18328392.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 300
FROM categories c WHERE c.slug = 'staples'
UNION ALL
SELECT 'Dishwash Liquid', 'Powerful grease cleaner', 99.00, 'bottle', c.id, 'https://images.pexels.com/photos/5217889/pexels-photo-5217889.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 80
FROM categories c WHERE c.slug = 'cleaning'
UNION ALL
SELECT 'Floor Cleaner', 'Anti-bacterial floor cleaner', 110.00, 'bottle', c.id, 'https://images.pexels.com/photos/3177257/pexels-photo-3177257.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 60
FROM categories c WHERE c.slug = 'cleaning'
UNION ALL
SELECT 'Detergent Powder', 'Front load detergent', 220.00, 'pack', c.id, 'https://images.pexels.com/photos/10573262/pexels-photo-10573262.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 75
FROM categories c WHERE c.slug = 'cleaning'
UNION ALL
SELECT 'Corn Chips', 'Crunchy salted corn chips', 45.00, 'pack', c.id, 'https://images.pexels.com/photos/5463227/pexels-photo-5463227.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 140
FROM categories c WHERE c.slug = 'snacks'
UNION ALL
SELECT 'Potato Chips', 'Classic potato chips', 35.00, 'pack', c.id, 'https://images.pexels.com/photos/34466116/pexels-photo-34466116.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 110
FROM categories c WHERE c.slug = 'snacks'
UNION ALL
SELECT 'Tortilla Chips', 'Salted tortilla chips', 50.00, 'pack', c.id, 'https://images.pexels.com/photos/7033900/pexels-photo-7033900.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 95
FROM categories c WHERE c.slug = 'snacks'
UNION ALL
SELECT 'Veg Biryani', 'Ready to eat vegetable biryani', 90.00, 'pack', c.id, 'https://images.pexels.com/photos/30635719/pexels-photo-30635719.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 50
FROM categories c WHERE c.slug = 'ready-to-eat'
UNION ALL
SELECT 'Pasta Salad', 'Chilled pasta salad', 75.00, 'bowl', c.id, 'https://images.pexels.com/photos/18338496/pexels-photo-18338496.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 40
FROM categories c WHERE c.slug = 'ready-to-eat'
UNION ALL
SELECT 'Noodle Box', 'Gourmet noodles', 85.00, 'box', c.id, 'https://images.pexels.com/photos/31094845/pexels-photo-31094845.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 65
FROM categories c WHERE c.slug = 'ready-to-eat'
UNION ALL
SELECT 'Fresh Milk', 'Full cream milk 1L', 28.00, 'L', c.id, 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 250
FROM categories c WHERE c.slug = 'dairy'
UNION ALL
SELECT 'Paneer', 'Fresh cottage cheese', 65.00, 'pack', c.id, 'https://images.pexels.com/photos/6191736/pexels-photo-6191736.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 70
FROM categories c WHERE c.slug = 'dairy'
UNION ALL
SELECT 'Greek Yogurt', 'Thick greek yogurt', 45.00, 'cup', c.id, 'https://images.pexels.com/photos/5946753/pexels-photo-5946753.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 85
FROM categories c WHERE c.slug = 'dairy'
UNION ALL
SELECT 'Orange Juice', 'Fresh squeezed 1L', 110.00, 'bottle', c.id, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 55
FROM categories c WHERE c.slug = 'beverages'
UNION ALL
SELECT 'Green Tea', 'Organic green tea bags', 95.00, 'box', c.id, 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 130
FROM categories c WHERE c.slug = 'beverages'
UNION ALL
SELECT 'Cold Coffee', 'Chilled coffee 200ml', 60.00, 'bottle', c.id, 'https://images.pexels.com/photos/372725/pexels-photo-372725.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 90
FROM categories c WHERE c.slug = 'beverages'
ON CONFLICT DO NOTHING;
