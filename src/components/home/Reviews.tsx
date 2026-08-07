import { Star, Quote } from 'lucide-react';
import { reviews } from '@/lib/content';

export default function Reviews() {
  return (
    <section id="reviews" className="bg-cream-100/60 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-coral-600">
            testimonials
          </span>
          <h2 className="mt-2 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
            loved by shoppers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-600">
            Here is what our customer community has to say about their Zesto experience.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="relative flex flex-col justify-between rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div>
                <Quote className="h-8 w-8 text-coral-300" />
                <div className="mt-4 flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-700">{rev.text}</p>
              </div>

              <div className="mt-8 flex items-center gap-4 border-t border-ink-100 pt-6">
                <img
                  src={rev.photo}
                  alt={rev.name}
                  className="h-12 w-12 rounded-full object-cover shadow-inner"
                />
                <div>
                  <h3 className="font-display text-base font-semibold text-ink-900">{rev.name}</h3>
                  <span className="text-xs text-ink-500">Verified Shopper</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
