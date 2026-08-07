import { useEffect, useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { navigate } from '@/hooks/useRouter';

const links = [
  { label: 'find a store', href: '#stores' },
  { label: 'zesto+', href: '#membership' },
  { label: 'fresh', href: '#fresh' },
  { label: 'brands', href: '#brands' },
  { label: 'reviews', href: '#reviews' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { profile, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAuthClick = () => {
    if (profile) {
      signOut();
    } else {
      navigate('login');
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="#/" className="flex items-center gap-2.5">
          <span
            className={`grid h-10 w-10 place-items-center rounded-full font-display text-xl font-bold transition-colors ${
              scrolled ? 'bg-coral-500 text-white' : 'bg-white/90 text-coral-600'
            }`}
          >
            Z
          </span>
          <span
            className={`font-display text-2xl font-semibold tracking-tight transition-colors ${
              scrolled ? 'text-ink-900' : 'text-white'
            }`}
          >
            Zesto
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-sm font-medium lowercase transition-colors ${
                  scrolled ? 'text-ink-600 hover:text-coral-600' : 'text-white/90 hover:text-white'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {profile ? (
            <>
              {profile.role === 'admin' && (
                <a
                  href="#/admin"
                  className={`text-sm font-medium lowercase transition-colors ${
                    scrolled ? 'text-ink-600 hover:text-coral-600' : 'text-white/90 hover:text-white'
                  }`}
                >
                  admin
                </a>
              )}
              <a
                href="#/shop"
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  scrolled
                    ? 'bg-coral-500 text-white hover:bg-coral-600'
                    : 'bg-white/90 text-coral-600 hover:bg-white'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                shop now
              </a>
              <button
                onClick={handleAuthClick}
                className={`text-sm font-medium lowercase transition-colors ${
                  scrolled ? 'text-ink-600 hover:text-coral-600' : 'text-white/90 hover:text-white'
                }`}
              >
                sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleAuthClick}
                className={`text-sm font-medium lowercase transition-colors ${
                  scrolled ? 'text-ink-600 hover:text-coral-600' : 'text-white/90 hover:text-white'
                }`}
              >
                sign in
              </button>
              <a
                href="#/shop"
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  scrolled
                    ? 'bg-coral-500 text-white hover:bg-coral-600'
                    : 'bg-white/90 text-coral-600 hover:bg-white'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                start shopping
              </a>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className={`grid h-10 w-10 place-items-center rounded-full transition-colors md:hidden ${
            scrolled ? 'bg-ink-900/5 text-ink-900' : 'bg-white/15 text-white'
          }`}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden">
          <div className="mx-4 mb-4 rounded-2xl bg-cream-50 p-4 shadow-xl">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-medium lowercase text-ink-700 transition-colors hover:bg-coral-500/10 hover:text-coral-600"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-col gap-2">
              <a
                href="#/shop"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-coral-500 px-5 py-3 text-sm font-semibold text-white"
              >
                <ShoppingBag className="h-4 w-4" />
                {profile ? 'shop now' : 'start shopping'}
              </a>
              <button
                onClick={() => {
                  setOpen(false);
                  handleAuthClick();
                }}
                className="rounded-full border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-600"
              >
                {profile ? 'sign out' : 'sign in'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
