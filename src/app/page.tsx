'use client';

import { useEffect } from 'react';
import Hero from '@/components/layout/Hero';
import ProblemStrip from '@/components/home/ProblemStrip';
import HowItWorks from '@/components/home/HowItWorks';
import Preview from '@/components/home/Preview';
import AboutSection from '@/components/home/AboutSection';
import Testimonials from '@/components/home/Testimonials';
import WhySection from '@/components/home/WhySection';
import FinalCTA from '@/components/home/FinalCTA';
import { useFunnelStore } from '@/store/funnel-store';

export default function Home() {
  const { setCurrentStage } = useFunnelStore();

  useEffect(() => {
    setCurrentStage('homepage');
  }, [setCurrentStage]);

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