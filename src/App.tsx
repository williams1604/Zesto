import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, navigate } from '@/hooks/useRouter';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import ShopPage from '@/pages/ShopPage';
import OrdersPage from '@/pages/OrdersPage';
import AdminPage from '@/pages/AdminPage';

function AppRoutes() {
  const route = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if ((route.name === 'shop' || route.name === 'orders' || route.name === 'admin') && !profile) {
      navigate('login');
    }
  }, [route.name, profile, loading]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream-50">
        <div className="text-ink-400">Loading…</div>
      </div>
    );
  }

  switch (route.name) {
    case 'login':
      return <LoginPage />;
    case 'shop':
      return <ShopPage />;
    case 'orders':
      return <OrdersPage />;
    case 'admin':
      return <AdminPage />;
    default:
      return <HomePage />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
