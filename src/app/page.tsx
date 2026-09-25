import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Loader from "@/components/Loader";
import About from "@/components/About";
import Services from "@/components/Services";
import Works from "@/components/Works";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Loader />
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Works />
        <Skills />
      </main>
      <Footer />
    </>
  );
}
