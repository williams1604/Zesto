import { ArrowRight, Apple } from 'lucide-react';

const heroPoster =
  'https://images.pexels.com/photos/33214226/pexels-photo-33214226.jpeg?auto=compress&cs=tinysrgb&h=1400&w=1920';
const appMockup =
  'https://images.pexels.com/photos/8939261/pexels-photo-8939261.jpeg?auto=compress&cs=tinysrgb&h=1000&w=600';

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-ink-900">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={heroPoster}
        >
          <source src="./hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/55 via-ink-900/30 to-ink-900/80" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-5 pt-28 pb-10 sm:px-8">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="font-display text-5xl font-medium leading-[1.02] text-white sm:text-7xl lg:text-8xl">
            your supermarket
          </h1>
          <p className="mt-5 font-display text-3xl font-medium text-white/95 sm:text-5xl lg:text-6xl">
            <span className="text-coral-400">get more</span> of life with Zesto
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#stores"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-ink-900 shadow-xl transition-all hover:gap-3.5 hover:bg-cream-100"
            >
              find a store
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="mt-8 flex justify-center sm:justify-end">
          <a
            href="#membership"
            className="group relative block w-full max-w-xs overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-3 backdrop-blur-md transition-all hover:bg-white/10 sm:max-w-[260px]"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-2xl animate-float-slow">
                <img src={appMockup} alt="The Zesto app" className="h-full w-full object-cover" />
              </div>
              <div className="text-left">
                <p className="font-display text-lg font-semibold text-white">get the app</p>
                <p className="mt-1 text-xs text-white/70">
                  Shop on the go with Zesto+
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-coral-400">
                  <Apple className="h-3.5 w-3.5" />
                  download now
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
