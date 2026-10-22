import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { stores } from '@/lib/content';

export default function FeaturedStores() {
  return (
    <section id="stores" className="bg-cream-50 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-coral-600">
              store locator
            </span>
            <h2 className="mt-2 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
              featured stores
            </h2>
          </div>
          <p className="max-w-md text-ink-600">
            Visit any of our flagship Zesto supermarket outlets for a premium in-store shopping experience.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <article
              key={store.code}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1 font-mono text-xs font-semibold text-ink-900 backdrop-blur-md">
                  #{store.code}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold text-ink-900">
                  {store.name}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-ink-600">
                  <MapPin className="h-4 w-4 shrink-0 text-coral-500" />
                  {store.address}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-4">
                  <span className="text-xs font-medium text-emerald-600">Open Today • 8 AM - 10 PM</span>
                  <a
                    href="#stores"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-coral-600 transition-colors hover:text-coral-700"
                  >
                    directions <Navigation className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="#stores"
            className="inline-flex items-center gap-2 rounded-full border border-ink-300 bg-white px-8 py-3 text-sm font-semibold text-ink-900 transition-all hover:border-coral-500 hover:text-coral-600"
          >
            view all 50+ stores <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
