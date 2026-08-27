import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Features from './Features';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import FAQ from './FAQ';
import Footer from '../../components/Layout/Footer';

const Landing = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Redirect to dashboard if logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const toggleTheme = () => {
    setIsTransitioning(true);
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div 
      className={`landing-root theme-${theme} ${isTransitioning ? 'theme-transition' : ''}`}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        width: '100%', 
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Navbar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* 1. Hero */}
      <Hero />

      {/* 2. Features */}
      <Features />

      {/* 3. How It Works */}
      <HowItWorks />

      {/* 4. About Us */}
      <AboutUs />

      {/* 5. FAQ */}
      <FAQ />

      {/* 6. Contact Us */}
      <ContactUs />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
