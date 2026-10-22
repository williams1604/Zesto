import Navbar from '@/components/common/Navbar';
import Hero from '@/components/home/Hero';
import FeaturedStores from '@/components/home/FeaturedStores';
import Membership from '@/components/home/Membership';
import FreshProduce from '@/components/home/FreshProduce';
import Brands from '@/components/home/Brands';
import Reviews from '@/components/home/Reviews';
import CTA from '@/components/home/CTA';
import Footer from '@/components/common/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <main>
        <Hero />
        <FeaturedStores />
        <Membership />
        <FreshProduce />
        <Brands />
        <Reviews />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
