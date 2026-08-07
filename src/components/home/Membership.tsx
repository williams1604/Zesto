import { ArrowRight, Sparkles } from 'lucide-react';

export default function Membership() {
  return (
    <section id="membership" className="relative overflow-hidden bg-ink-900 py-20 sm:py-28">
      <div className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-coral-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-coral-500/15 px-4 py-1.5 text-sm font-medium lowercase text-coral-400">
              <Sparkles className="h-4 w-4" />
              zesto+ membership
            </p>
            <h2 className="mt-5 font-display text-4xl font-medium lowercase leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              the world's
              <br />
              <span className="text-coral-400">best grocery</span>
              <br />
              membership
            </h2>
            <p className="mt-6 max-w-md text-lg text-white/75">
              earn 5% zesto+ points cashback on every order.
              <br />
              redeem anytime you like.
            </p>
            <p className="mt-2 text-xs text-white/40">ˆzesto diamond</p>

            <a
              href="#membership"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-coral-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-coral-500/25 transition-all hover:gap-3.5 hover:bg-coral-600"
            >
              explore
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-coral-500/25 to-clay-700/20 blur-2xl" />
            <div className="relative aspect-[1.6/1] overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-clay-800 via-ink-800 to-black p-7 shadow-2xl">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-coral-400">
                      zesto+
                    </p>
                    <p className="mt-1 font-display text-2xl font-medium text-white">diamond</p>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 font-display text-lg font-bold text-white">
                    Z
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 rounded-full bg-coral-500" />
                    <div className="h-1.5 w-6 rounded-full bg-white/20" />
                  </div>
                  <p className="mt-4 font-mono text-sm tracking-widest text-white/60">
                    5304 •••• •••• 2071
                  </p>
                  <p className="mt-2 text-sm text-white/70">member since 2024</p>
                </div>
              </div>
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-coral-500/20 blur-2xl" />
            </div>

            <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white px-5 py-4 shadow-xl">
              <p className="font-display text-3xl font-bold text-coral-600">5%</p>
              <p className="text-xs font-medium lowercase text-ink-500">cashback every order</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
