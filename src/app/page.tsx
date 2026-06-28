import { Hero } from "@/sections/home/Hero";
import { OriginObjects } from "@/sections/home/OriginObjects";
import { FloatingShowcase } from "@/sections/home/FloatingShowcase";
import { WhyTrust } from "@/sections/home/WhyTrust";
import { CapabilitiesShowcase } from "@/sections/home/CapabilitiesShowcase";
import { IndustriesGrid } from "@/sections/home/IndustriesGrid";
import { PortfolioShowcase } from "@/sections/home/PortfolioShowcase";
import { ShowcaseCarousel } from "@/sections/home/ShowcaseCarousel";
import { CaseStudies } from "@/sections/home/CaseStudies";
import { ClientWall } from "@/sections/home/ClientWall";
import { Testimonials } from "@/sections/home/Testimonials";
import { TechEcosystem } from "@/sections/home/TechEcosystem";
import { CTASection } from "@/components/layout/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyTrust />
      <CapabilitiesShowcase />
      <IndustriesGrid />
      <PortfolioShowcase />
      {/* <CaseStudies /> */}
      {/* <FloatingShowcase /> */}
      <ClientWall />
      <Testimonials />
      <TechEcosystem />
      <CTASection />
    </>
  );
}
