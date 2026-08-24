import React from 'react';
import Navbar from '../../components/Layout/Navbar';
import Hero from './Hero';
import ScatteredKnowledge from './ScatteredKnowledge';
import DarkGraphInsights from './DarkGraphInsights';
import AIUnderstanding from './AIUnderstanding';
import NLSearch from './NLSearch';
import Features from './Features';
import HowItWorks from './HowItWorks';
import CTA from './CTA';
import Footer from '../../components/Layout/Footer';

const Landing = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-primary)' }}>
      {/* 1. Header (Translucent Light Inset) */}
      <Navbar />

      {/* 2. Hero (Light Section) */}
      <Hero />

      {/* 3. Scattered Knowledge (Light Section) */}
      <ScatteredKnowledge />

      {/* 4. Dark Graph Insights (Dark Section) */}
      <DarkGraphInsights />

      {/* 5. AI Understanding Pipeline (Light Section) */}
      <AIUnderstanding />

      {/* 6. Natural Language Search (Dark Section) */}
      <NLSearch />

      {/* 7. Asymmetric Features Grid (Light Section) */}
      <Features />

      {/* 8. Visual Stepped Timeline Journey (Dark Section) */}
      <HowItWorks />

      {/* 9. Final Call-to-Action (Dark Section) */}
      <CTA />

      {/* 10. Minimal Editorial Footer (Light Section) */}
      <Footer />
    </div>
  );
};

export default Landing;
