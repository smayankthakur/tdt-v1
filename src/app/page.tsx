'use client';

import Hero from '@/components/layout/Hero';
import ProblemStrip from '@/components/home/ProblemStrip';
import HowItWorks from '@/components/home/HowItWorks';
import Preview from '@/components/home/Preview';
import Testimonials from '@/components/home/Testimonials';
import WhySection from '@/components/home/WhySection';
import FinalCTA from '@/components/home/FinalCTA';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <Hero />
      
      {/* Below Hero Sections */}
      <ProblemStrip />
      <HowItWorks />
      <Preview />
      <Testimonials />
      <WhySection />
      <FinalCTA />
    </div>
  );
}