import Hero from './components/Hero';
import WhySivana from './components/WhySivana';
import HowItWorks from './components/HowItWorks';
import Results from './components/Results';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WhySivana />
      <HowItWorks />
      <Results />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
