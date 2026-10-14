import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HeroBlocks from "@/components/HeroBlocks";
import Values from "@/components/Values";
import Catalog from "@/components/Catalog";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <HeroBlocks />
      <main className="relative z-10">
        <Hero />
        <Values />
        <Catalog />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
