import { ArrowRight } from 'lucide-react';
import { produce } from '@/lib/content';

export default function FreshProduce() {
  return (
    <section id="fresh" className="bg-cream-100/60 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-coral-600">
            farm fresh
          </span>
          <h2 className="mt-2 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
            farm-fresh produce
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-600">
            Hand-picked every morning from local partner farms. Guaranteed fresh or your money back.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 lg:grid-cols-4">
          {produce.map((item) => (
            <div
              key={item.name}
              className="group relative overflow-hidden rounded-3xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden rounded-2xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-ink-900">{item.name}</h3>
                <a
                  href="#/shop"
                  className="grid h-9 w-9 place-items-center rounded-full bg-cream-100 text-coral-600 transition-colors group-hover:bg-coral-500 group-hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
