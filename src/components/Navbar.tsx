import React, { useState, useEffect } from 'react';
import { SITE } from '../data/portfolioData';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-3 md:px-6 pt-3">
      <div
        className={`glass max-w-7xl mx-auto rounded-2xl px-5 md:px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'py-2.5 !bg-[#111113]/80' : 'py-3.5'
        }`}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Home - Sudarson B"
          className="group relative flex items-center justify-center transition-transform duration-300 hover:scale-105 focus:outline-none"
        >
          <img
            src="/assets/sb-crown-logo.png"
            alt="SB Crown Logo"
            className="w-auto h-10 sm:h-11 md:h-13 lg:h-14 aspect-square object-contain transition-all duration-300 drop-shadow-[0_0_8px_rgba(220,38,38,0.35)] group-hover:drop-shadow-[0_0_18px_rgba(255,185,0,0.75)] group-hover:brightness-110"
          />
        </a>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {['Projects', 'About', 'Achievements', 'Skills', 'Resume', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-xs md:text-sm font-bold text-gray-400 uppercase tracking-[0.15em] transition-colors duration-300 hover:text-white group"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 ease-out group-hover:w-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            </a>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden sm:block">
          <a
            href="#contact"
            className="glass-red inline-block px-5 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider"
          >
            Let's Talk
          </a>
        </div>
      </div>
    </nav>
  );
};
