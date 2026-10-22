import { useEffect, useState } from 'react';
import { Package, ChevronRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { navigate } from '@/hooks/useRouter';
import type { Order, OrderItem } from '@/types';

type OrderWithItems = Order & { items: OrderItem[] };

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { profile, signOut } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as OrderWithItems[]) ?? []);
        setLoading(false);
      });
  }, [profile]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream-50">
        <div className="text-ink-400">Loading orders…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-cream-50/95 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <a href="#/" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-coral-500 font-display text-xl font-bold text-white">
                Z
              </span>
              <span className="font-display text-2xl font-semibold text-ink-900">Zesto</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#/shop" className="text-sm font-medium lowercase text-ink-600 hover:text-coral-600">
              shop
            </a>
            <button
              onClick={signOut}
              className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:border-coral-500 hover:text-coral-600"
            >
              sign out
            </button>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <button
          onClick={() => navigate('shop')}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-coral-600"
        >
          <ArrowLeft className="h-4 w-4" />
          back to shop
        </button>

        <h1 className="font-display text-4xl font-medium lowercase text-ink-900">my orders</h1>
        <p className="mt-1 text-ink-500">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

        {orders.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-white py-16 text-center shadow-sm">
            <Package className="h-12 w-12 text-ink-300" />
            <p className="text-ink-500">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('shop')}
              className="rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
            >
              start shopping
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <p className="font-semibold text-ink-900">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-ink-400">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {' · '}
                      {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status] || ''}`}>
                      {order.status}
                    </span>
                    <span className="font-display text-lg font-bold text-coral-600">
                      ₹{Number(order.total).toFixed(0)}
                    </span>
                    <ChevronRight
                      className={`h-5 w-5 text-ink-300 transition-transform ${expanded === order.id ? 'rotate-90' : ''}`}
                    />
                  </div>
                </button>

                {expanded === order.id && (
                  <div className="border-t border-ink-100 px-5 py-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
                      delivery address
                    </p>
                    <p className="mb-4 text-sm text-ink-600">{order.delivery_address}</p>
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-ink-700">
                            {item.product_name} × {item.quantity}
                          </span>
                          <span className="font-medium text-ink-600">
                            ₹{(Number(item.price) * item.quantity).toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
