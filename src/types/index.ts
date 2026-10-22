export type Role = 'customer' | 'admin';

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  role: Role;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category_id: string | null;
  image_url: string;
  stock: number;
  created_at: string;
};

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  delivery_address: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
