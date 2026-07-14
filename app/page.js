import ScrollChrome from '@/components/ScrollChrome';
import ScrollReveal from '@/components/ScrollReveal';
import Hero from '@/components/Hero';
import Statement from '@/components/Statement';
import Spec from '@/components/Spec';
import Zoning from '@/components/Zoning';
import Access from '@/components/Access';
import AreaGuide from '@/components/AreaGuide';
import Gallery from '@/components/Gallery';
import Viewing from '@/components/Viewing';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <ScrollChrome />
      <ScrollReveal />
      <main>
        <Hero />
        <Statement />
        <Spec />
        <Zoning />
        <Access />
        <AreaGuide />
        <Gallery />
        <Viewing />
        <Footer />
      </main>
    </>
  );
}
