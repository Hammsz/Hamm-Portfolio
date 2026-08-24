import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Works from "@/components/Works";
import Skills from "@/components/Skills";
import SectionWords from "@/components/SectionWords";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Works />
        <Skills />
        <SectionWords />
      </main>
      <Footer />
    </>
  );
}
