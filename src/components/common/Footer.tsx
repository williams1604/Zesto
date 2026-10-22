import { Share2, MessageSquareShare, Smartphone, Mail, MapPin, Phone } from 'lucide-react';

const columns = [
  { title: 'shop', links: ['find a store', 'fresh produce', 'in-house brands', 'offers'] },
  { title: 'zesto+', links: ['membership', 'diamond rewards', 'cashback', 'coupons'] },
  { title: 'company', links: ['about us', 'careers', 'press', 'sustainability'] },
  { title: 'support', links: ['help center', 'orders', 'delivery', 'contact us'] },
];

export default function Footer() {
  return (
    <footer className="bg-ink-900 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-coral-500 font-display text-xl font-bold text-white">
                Z
              </span>
              <span className="font-display text-3xl font-semibold text-white">Zesto</span>
            </a>
            <p className="mt-5 max-w-sm text-white/70">
              your supermarket. get more of life with Zesto — the freshest produce,
              premium in-house brands, and rewards on every order.
            </p>

            <div className="mt-6 space-y-3 text-sm text-white/65">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-coral-400" /> 50+ stores across India
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-coral-400" /> 1800-123-4567
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-coral-400" /> hello@zesto.in
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              {[Share2, MessageSquareShare, Smartphone, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#top"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-coral-500"
                  aria-label="Social link"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="font-display text-sm font-medium lowercase tracking-wider text-white">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#top"
                        className="text-sm lowercase text-white/60 transition-colors hover:text-coral-400"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/50">© {new Date().getFullYear()} Zesto. All rights reserved.</p>
          <div className="flex gap-6 text-sm lowercase text-white/50">
            <a href="#top" className="transition-colors hover:text-white">privacy</a>
            <a href="#top" className="transition-colors hover:text-white">terms</a>
            <a href="#top" className="transition-colors hover:text-white">cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
