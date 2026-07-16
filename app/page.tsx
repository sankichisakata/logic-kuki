import ScrollChrome from '@/components/ScrollChrome';
import ScrollReveal from '@/components/ScrollReveal';
import BackgroundScene from '@/components/BackgroundScene';
import Hero from '@/components/Hero';
import Statement from '@/components/Statement';
import Spec from '@/components/Spec';
import Zoning from '@/components/Zoning';
import Access from '@/components/Access';
import AreaGuide from '@/components/AreaGuide';
import Gallery from '@/components/Gallery';
import Viewing from '@/components/Viewing';
import Footer from '@/components/Footer';

/**
 * トップページ。背景3Dシーン・ナビ・各セクションを組み立てる。
 */
export default function Home() {
  return (
    <>
      <BackgroundScene />
      <ScrollChrome />
      <ScrollReveal />
      <main id="top" className="page-content">
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
