import React from "react";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section-two";
import FeaturesSection from "@/components/features-seven";

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
        <FeaturesSection />
      </div>
    </div>
  );
}
