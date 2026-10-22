import { ArrowRight } from 'lucide-react';
import { brands } from '@/lib/content';

export default function Brands() {
  return (
    <section id="brands" className="bg-cream-50 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-coral-600">
            our house brands
          </span>
          <h2 className="mt-2 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
            quality brands by Zesto
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-600">
            Crafted with care to bring you premium quality products at everyday affordable prices.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider text-coral-400">
                    {brand.tagline}
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-semibold">{brand.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
