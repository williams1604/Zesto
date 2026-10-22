import { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Minus, Search, X, Check, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { navigate } from '@/hooks/useRouter';
import type { Product, Category, CartItem } from '@/types';

export default function ShopPage() {
  const { profile, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').order('name'),
      supabase.from('categories').select('*').order('name'),
    ]).then(([prodRes, catRes]) => {
      setProducts((prodRes.data as Product[]) ?? []);
      setCategories((catRes.data as Category[]) ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = activeCat === 'all' || p.category_id === activeCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.product.id === id ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.product.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const placeOrder = async () => {
    if (!checkoutAddress.trim()) return;
    setPlacing(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total: cartTotal,
          delivery_address: checkoutAddress,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const items = cart.map((c) => ({
        order_id: order.id,
        product_id: c.product.id,
        product_name: c.product.name,
        quantity: c.quantity,
        price: c.product.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(items);
      if (itemsError) throw itemsError;

      setSuccess(true);
      setCart([]);
      setCheckoutAddress('');
      setTimeout(() => {
        setSuccess(false);
        setCartOpen(false);
        navigate('orders');
      }, 1500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream-50">
        <div className="text-ink-400">Loading products…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <ShopNav
        profileName={profile?.full_name || 'Customer'}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onSignOut={signOut}
        isAdmin={profile?.role === 'admin'}
      />

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-medium lowercase text-ink-900">shop fresh</h1>
            <p className="mt-1 text-ink-500">browse {products.length} products across {categories.length} categories</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 outline-none focus:border-coral-500"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <CatPill active={activeCat === 'all'} onClick={() => setActiveCat('all')}>
            all
          </CatPill>
          {categories.map((c) => (
            <CatPill key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
              {c.name}
            </CatPill>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-cream-100">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.stock <= 0 && (
                  <div className="absolute inset-0 grid place-items-center bg-ink-900/60">
                    <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-ink-900">
                      out of stock
                    </span>
                  </div>
                )}
                {product.stock > 0 && product.stock < 20 && (
                  <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">
                    low stock
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-display text-lg font-medium text-ink-900">{product.name}</h3>
                <p className="mt-0.5 text-xs text-ink-400">{product.description}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div>
                    <span className="font-display text-xl font-bold text-coral-600">
                      ₹{product.price}
                    </span>
                    <span className="ml-1 text-xs text-ink-400">/{product.unit}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className="grid h-9 w-9 place-items-center rounded-full bg-coral-500 text-white transition-all hover:bg-coral-600 disabled:bg-ink-200 disabled:text-ink-400"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-ink-400">No products found.</div>
        )}
      </div>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative flex h-full w-full max-w-md flex-col bg-cream-50 shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
              <h2 className="font-display text-xl font-medium lowercase text-ink-900">your cart</h2>
              <button onClick={() => setCartOpen(false)} className="text-ink-400 hover:text-ink-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {success ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600">
                  <Check className="h-8 w-8" />
                </div>
                <p className="font-display text-xl font-medium text-ink-900">order placed!</p>
                <p className="text-sm text-ink-500">redirecting to your orders…</p>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingCart className="h-12 w-12 text-ink-300" />
                <p className="text-ink-500">Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 py-3">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-ink-900">{item.product.name}</p>
                        <p className="text-sm text-ink-400">₹{item.product.price}/{item.product.unit}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.product.id, -1)}
                          className="grid h-7 w-7 place-items-center rounded-full bg-ink-100 text-ink-600 hover:bg-ink-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.product.id, 1)}
                          className="grid h-7 w-7 place-items-center rounded-full bg-coral-500 text-white hover:bg-coral-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-ink-100 px-6 py-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-ink-500">total</span>
                    <span className="font-display text-2xl font-bold text-coral-600">
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <textarea
                    placeholder="delivery address"
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    rows={2}
                    className="mb-3 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-coral-500"
                  />
                  <button
                    onClick={placeOrder}
                    disabled={placing || !checkoutAddress.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-coral-500 px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-coral-600 disabled:opacity-50"
                  >
                    <Package className="h-5 w-5" />
                    {placing ? 'placing order…' : 'place order'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating cart button */}
      {cartCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-coral-500 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-coral-500/30 transition-all hover:bg-coral-600"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount} items · ₹{cartTotal.toFixed(0)}
        </button>
      )}
    </div>
  );
}

function ShopNav({
  profileName,
  cartCount,
  onCartClick,
  onSignOut,
  isAdmin,
}: {
  profileName: string;
  cartCount: number;
  onCartClick: () => void;
  onSignOut: () => void;
  isAdmin: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-cream-50/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-coral-500 font-display text-xl font-bold text-white">
            Z
          </span>
          <span className="font-display text-2xl font-semibold text-ink-900">Zesto</span>
        </a>
        <div className="flex items-center gap-3 sm:gap-5">
          <button onClick={onCartClick} className="relative text-ink-600 hover:text-coral-600">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-coral-500 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          {isAdmin && (
            <a
              href="#/admin"
              className="hidden rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 sm:inline-block"
            >
              admin
            </a>
          )}
          <a href="#/orders" className="hidden text-sm font-medium lowercase text-ink-600 hover:text-coral-600 sm:inline">
            my orders
          </a>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-medium text-ink-700 sm:inline">{profileName}</span>
            <button
              onClick={onSignOut}
              className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:border-coral-500 hover:text-coral-600"
            >
              sign out
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

function CatPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium lowercase transition-all ${
        active
          ? 'bg-coral-500 text-white shadow-md'
          : 'bg-white text-ink-600 hover:bg-cream-100'
      }`}
    >
      {children}
    </button>
  );
}
