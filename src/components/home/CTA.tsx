import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-coral-500 via-coral-600 to-clay-700 py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-black/15 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="font-display text-4xl font-medium lowercase leading-tight text-white sm:text-5xl">
          get more of life with Zesto
        </h2>
        <p className="mt-5 text-lg text-white/85">
          download the app, join zesto+, and start earning cashback on every order today
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#membership"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-coral-600 shadow-xl transition-all hover:gap-3.5"
          >
            get the app
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#stores"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            find a store
          </a>
        </div>
      </div>
    </section>
  );
}
