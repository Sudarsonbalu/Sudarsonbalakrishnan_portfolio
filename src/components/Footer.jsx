import React, { useState, useEffect } from 'react';
import { ArrowUp, Github, Linkedin, Mail, Cpu } from 'lucide-react';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 border-t dark:border-white/10 border-black/5 bg-slate-100/50 dark:bg-black/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand */}
        <div className="flex items-center space-x-2 font-bold font-outfit">
          <Cpu className="w-5 h-5 text-accentCyan" />
          <span className="text-slate-900 dark:text-white">
            Sudarson<span className="text-accentCyan font-medium">.AI</span>
          </span>
        </div>

        {/* Signature */}
        <div className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-inter">
          &copy; {currentYear} · Designed & Developed by <span className="text-gradient-cyan-purple font-semibold">Sudarson Balakrishnan</span>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 text-slate-400">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accentCyan transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accentCyan transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:sudarsonbalu@gmail.com"
            className="hover:text-accentCyan transition-colors"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Floating Back-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-accentCyan to-accentPurple text-white shadow-neon-cyan hover:shadow-2xl active:scale-95 z-40 transition-all duration-300 animate-fadeIn"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
