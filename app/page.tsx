import React from "react";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section-two";
import Example from "@/components/bento";
import FAQs from "@/components/faqs-section-one";
import Pricing from "@/components/pricing-section-two";
import FooterSection from "@/components/footer-three";
import { Gallery4 } from "@/components/gallery4";
import TestimonialSection from "@/components/testimonials-two";

export default function page() {
  return (
    <div>
      <div>
        <HeroHeader />
      </div>
      <div>
        <HeroSection />
      </div>

      <div>
        <Example />
      </div>
      <div>
        <TestimonialSection />
      </div>
      <div>
        <Gallery4 />
      </div>
      <div>
        <Pricing />
      </div>

      <div>
        <FAQs />
      </div>
      <div>
        <FooterSection />
      </div>
    </div>
  );
}
