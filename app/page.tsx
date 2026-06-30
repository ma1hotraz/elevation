import styles from "./page.module.css";
import { BottomCta } from "./components/home/BottomCta/BottomCta";
import { Faq } from "./components/home/Faq/Faq";
import { Founder } from "./components/home/Founder/Founder";
import { Hero } from "./components/home/Hero/Hero";
import { MarqueeRibbon } from "./components/home/MarqueeRibbon/MarqueeRibbon";
import { Mission } from "./components/home/Mission/Mission";
import { Programs } from "./components/home/Programs/Programs";
import { SampleAssessments } from "./components/home/SampleAssessments/SampleAssessments";
import { SiteFooter } from "./components/home/SiteFooter/SiteFooter";
import { Testimonials } from "./components/home/Testimonials/Testimonials";

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      <MarqueeRibbon />
      <Programs />
      <SampleAssessments />
      <Mission />
      <Founder />
      <Testimonials />
      <Faq />
      <BottomCta />
      <SiteFooter />
    </main>
  );
}
