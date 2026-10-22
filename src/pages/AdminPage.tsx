import { useEffect, useState } from 'react';
import {
  Users, Package, ShoppingBag, TrendingUp, Plus, Minus,
  Edit3, X, AlertTriangle, LayoutDashboard, LogOut,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { navigate } from '@/hooks/useRouter';
import type { Product, Order, Profile, Category } from '@/types';

type Tab = 'overview' | 'stock' | 'orders' | 'customers';

type OrderWithDetails = Order & {
  order_items: { product_name: string; quantity: number; price: number }[];
  profiles: { full_name: string } | null;
};

export default function AdminPage() {
  const { profile, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    if (!profile) return;
    Promise.all([
      supabase.from('products').select('*, categories(*)').order('name'),
      supabase
        .from('orders')
        .select('*, order_items(product_name, quantity, price), profiles(full_name)')
        .order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]).then(([pRes, oRes, cRes, catRes]) => {
      setProducts((pRes.data as Product[]) ?? []);
      setOrders((oRes.data as OrderWithDetails[]) ?? []);
      setCustomers((cRes.data as Profile[]) ?? []);
      setCategories((catRes.data as Category[]) ?? []);
      setLoading(false);
    });
  }, [profile]);

  const refreshProducts = async () => {
    const { data } = await supabase.from('products').select('*, categories(*)').order('name');
    setProducts((data as Product[]) ?? []);
  };

  const updateStock = async (id: string, delta: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const newStock = Math.max(0, product.stock + delta);
    await supabase.from('products').update({ stock: newStock }).eq('id', id);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: status as Order['status'] } : o))
    );
  };

  if (!profile) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream-50">
        <div className="text-center">
          <p className="text-ink-500">Please sign in.</p>
          <button onClick={() => navigate('login')} className="mt-3 rounded-full bg-coral-500 px-6 py-2.5 text-sm font-semibold text-white">
            sign in
          </button>
        </div>
      </div>
    );
  }

  if (profile.role !== 'admin') {
    return (
      <div className="grid min-h-screen place-items-center bg-cream-50 px-5">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <h1 className="mt-4 font-display text-2xl font-medium text-ink-900">admin access required</h1>
          <p className="mt-2 text-ink-500">
            Your account doesn't have admin privileges. Contact an administrator to get access.
          </p>
          <button onClick={() => navigate('shop')} className="mt-5 rounded-full bg-coral-500 px-6 py-2.5 text-sm font-semibold text-white">
            back to shop
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream-50">
        <div className="text-ink-400">Loading dashboard…</div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0);
  const lowStock = products.filter((p) => p.stock < 20);
  const pendingOrders = orders.filter((o) => o.status === 'pending');

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 font-display text-xl font-bold text-white">
              Z
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-ink-900">Zesto Admin</p>
              <p className="text-xs text-ink-400">dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="#/shop" className="hidden text-sm font-medium lowercase text-ink-600 hover:text-coral-600 sm:inline">
              view shop
            </a>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:border-coral-500 hover:text-coral-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm">
          <TabBtn active={tab === 'overview'} onClick={() => setTab('overview')} icon={<LayoutDashboard className="h-4 w-4" />}>
            overview
          </TabBtn>
          <TabBtn active={tab === 'stock'} onClick={() => setTab('stock')} icon={<Package className="h-4 w-4" />}>
            stock
          </TabBtn>
          <TabBtn active={tab === 'orders'} onClick={() => setTab('orders')} icon={<ShoppingBag className="h-4 w-4" />}>
            orders
          </TabBtn>
          <TabBtn active={tab === 'customers'} onClick={() => setTab('customers')} icon={<Users className="h-4 w-4" />}>
            customers
          </TabBtn>
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<TrendingUp className="h-6 w-6" />}
                label="total revenue"
                value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                color="bg-green-100 text-green-600"
              />
              <StatCard
                icon={<ShoppingBag className="h-6 w-6" />}
                label="total orders"
                value={String(orders.length)}
                sub={`${pendingOrders.length} pending`}
                color="bg-blue-100 text-blue-600"
              />
              <StatCard
                icon={<Users className="h-6 w-6" />}
                label="customers"
                value={String(customers.length)}
                color="bg-coral-500/15 text-coral-600"
              />
              <StatCard
                icon={<Package className="h-6 w-6" />}
                label="products"
                value={String(products.length)}
                sub={`${lowStock.length} low stock`}
                color="bg-amber-100 text-amber-600"
              />
            </div>

            {lowStock.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h2 className="font-display text-lg font-medium text-ink-900">low stock alerts</h2>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {lowStock.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
                      <span className="text-sm font-medium text-ink-700">{p.name}</span>
                      <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                        {p.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-medium text-ink-900">recent orders</h2>
              <div className="mt-4 space-y-2">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3">
                    <div>
                      <p className="font-medium text-ink-900">
                        {order.profiles?.full_name || 'Unknown customer'}
                      </p>
                      <p className="text-xs text-ink-400">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        {' · '}
                        {order.order_items?.length || 0} items
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-coral-600">₹{Number(order.total).toFixed(0)}</span>
                      <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-sm text-ink-400">No orders yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Stock management */}
        {tab === 'stock' && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-medium lowercase text-ink-900">inventory</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="inline-flex items-center gap-2 rounded-full bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
              >
                <Plus className="h-4 w-4" />
                add product
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-xs font-medium uppercase tracking-wide text-ink-400">
                    <th className="px-5 py-3">product</th>
                    <th className="hidden px-5 py-3 sm:table-cell">category</th>
                    <th className="px-5 py-3">price</th>
                    <th className="px-5 py-3">stock</th>
                    <th className="px-5 py-3 text-right">actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-ink-50 hover:bg-cream-50/50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                          <span className="font-medium text-ink-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="hidden px-5 py-3 text-sm text-ink-500 sm:table-cell">
                        {(p as Product & { categories?: Category }).categories?.name || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-ink-700">₹{p.price}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateStock(p.id, -1)}
                            className="grid h-7 w-7 place-items-center rounded-full bg-ink-100 text-ink-600 hover:bg-ink-200"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span
                            className={`w-10 text-center text-sm font-bold ${
                              p.stock < 20 ? 'text-amber-600' : 'text-ink-700'
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            onClick={() => updateStock(p.id, 1)}
                            className="grid h-7 w-7 place-items-center rounded-full bg-coral-500 text-white hover:bg-coral-600"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-coral-600 hover:text-coral-500"
                        >
                          <Edit3 className="h-4 w-4" />
                          edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="mt-6">
            <h2 className="mb-4 font-display text-2xl font-medium lowercase text-ink-900">all orders</h2>
            {orders.length === 0 ? (
              <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
                <ShoppingBag className="mx-auto h-10 w-10 text-ink-300" />
                <p className="mt-3 text-ink-500">No orders placed yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink-900">
                          {order.profiles?.full_name || 'Unknown customer'}
                        </p>
                        <p className="text-xs text-ink-400">
                          order #{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                        <p className="mt-1 text-sm text-ink-500">{order.delivery_address}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-xl font-bold text-coral-600">
                          ₹{Number(order.total).toFixed(0)}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 outline-none focus:border-coral-500"
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="delivered">delivered</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.order_items?.map((item, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-ink-600"
                        >
                          {item.product_name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Customers */}
        {tab === 'customers' && (
          <div className="mt-6">
            <h2 className="mb-4 font-display text-2xl font-medium lowercase text-ink-900">customers</h2>
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-xs font-medium uppercase tracking-wide text-ink-400">
                    <th className="px-5 py-3">name</th>
                    <th className="hidden px-5 py-3 sm:table-cell">phone</th>
                    <th className="px-5 py-3">role</th>
                    <th className="hidden px-5 py-3 sm:table-cell">joined</th>
                    <th className="px-5 py-3 text-right">orders</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => {
                    const orderCount = orders.filter((o) => o.user_id === c.id).length;
                    return (
                      <tr key={c.id} className="border-b border-ink-50 hover:bg-cream-50/50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${c.role === 'admin' ? 'bg-ink-900 text-white' : 'bg-coral-500/15 text-coral-600'}`}>
                              {(c.full_name || '?')[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium text-ink-900">{c.full_name || 'Unnamed'}</span>
                          </div>
                        </td>
                        <td className="hidden px-5 py-3 text-sm text-ink-500 sm:table-cell">{c.phone || '—'}</td>
                        <td className="px-5 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.role === 'admin' ? 'bg-ink-900 text-white' : 'bg-cream-100 text-ink-600'}`}>
                            {c.role}
                          </span>
                        </td>
                        <td className="hidden px-5 py-3 text-sm text-ink-500 sm:table-cell">
                          {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3 text-right text-sm font-semibold text-ink-700">{orderCount}</td>
                      </tr>
                    );
                  })}
                  {customers.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-ink-400">No customers yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit product modal */}
      {editingProduct && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSaved={() => {
            setEditingProduct(null);
            refreshProducts();
          }}
        />
      )}

      {/* Add product modal */}
      {showAddProduct && (
        <ProductModal
          product={null}
          categories={categories}
          onClose={() => setShowAddProduct(false)}
          onSaved={() => {
            setShowAddProduct(false);
            refreshProducts();
          }}
        />
      )}
    </div>
  );
}

function StatCard({
  icon, label, value, sub, color,
}: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}>{icon}</div>
      <p className="mt-3 text-xs font-medium lowercase tracking-wide text-ink-400">{label}</p>
      <p className="font-display text-2xl font-bold text-ink-900">{value}</p>
      {sub && <p className="text-xs text-ink-400">{sub}</p>}
    </div>
  );
}

function TabBtn({
  active, onClick, icon, children,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium lowercase transition-all ${
        active ? 'bg-ink-900 text-white shadow-md' : 'text-ink-600 hover:bg-cream-100'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function ProductModal({
  product, categories, onClose, onSaved,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(String(product?.price || ''));
  const [unit, setUnit] = useState(product?.unit || 'pc');
  const [stock, setStock] = useState(String(product?.stock || '0'));
  const [image, setImage] = useState(product?.image_url || '');
  const [categoryId, setCategoryId] = useState(product?.category_id || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      name,
      description,
      price: parseFloat(price) || 0,
      unit,
      stock: parseInt(stock) || 0,
      image_url: image,
      category_id: categoryId || null,
    };
    if (product) {
      await supabase.from('products').update(payload).eq('id', product.id);
    } else {
      await supabase.from('products').insert(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-5">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-cream-50 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-ink-900">
            {product ? 'edit product' : 'add product'}
          </h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-3">
          <ModalInput label="name" value={name} onChange={setName} />
          <ModalInput label="description" value={description} onChange={setDescription} />
          <div className="grid grid-cols-2 gap-3">
            <ModalInput label="price (₹)" value={price} onChange={setPrice} type="number" />
            <ModalInput label="unit" value={unit} onChange={setUnit} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ModalInput label="stock" value={stock} onChange={setStock} type="number" />
            <div>
              <label className="text-xs font-medium lowercase tracking-wide text-ink-400">category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-coral-500"
              >
                <option value="">none</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <ModalInput label="image URL" value={image} onChange={setImage} />
        </div>
        <button
          onClick={save}
          disabled={saving || !name}
          className="mt-5 w-full rounded-full bg-coral-500 px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-coral-600 disabled:opacity-50"
        >
          {saving ? 'saving…' : product ? 'save changes' : 'add product'}
        </button>
      </div>
    </div>
  );
}

function ModalInput({
  label, value, onChange, type = 'text',
}: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium lowercase tracking-wide text-ink-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-coral-500"
      />
    </div>
  );
}
