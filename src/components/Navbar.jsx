import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Download, Cpu } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Background change on scroll
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Detect active section on scroll
      const sections = navLinks.map(link => document.querySelector(link.href));
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        if (!section) return;
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth',
      });
      setActiveSection(href.replace('#', ''));
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'py-4 glass-panel shadow-glass-dark dark:shadow-glass-dark border-b dark:border-white/10 border-black/5'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo / Brand Name */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, '#home')}
          className="flex items-center space-x-2 text-xl font-bold font-outfit tracking-wide group"
        >
          <Cpu className="w-6 h-6 text-accentCyan group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-slate-900 dark:text-white transition-colors">
            Sudarson<span className="text-accentCyan font-medium">.AI</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-sm font-medium transition-colors hover:text-accentCyan relative py-1 ${
                    activeSection === link.href.replace('#', '')
                      ? 'text-accentCyan'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {link.name}
                  {activeSection === link.href.replace('#', '') && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accentCyan rounded-full" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Theme Toggle & CTA Buttons */}
          <div className="flex items-center space-x-4 border-l border-slate-200 dark:border-white/10 pl-6">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            <a
              href="https://drive.google.com/drive/folders/12fZAOVld3XP_NQ9zyB6BiZnqmjE_6f0z?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-accentCyan to-accentPurple hover:shadow-neon-cyan transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Resume</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation Toggle & Theme Switcher */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle Dark/Light Mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-900 dark:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-panel shadow-2xl border-t dark:border-white/10 border-black/5 animate-fadeIn">
          <div className="px-6 py-8 flex flex-col space-y-6">
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`block text-lg font-medium transition-colors hover:text-accentCyan py-2 ${
                      activeSection === link.href.replace('#', '')
                        ? 'text-accentCyan'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            
            <a
              href="https://drive.google.com/drive/folders/12fZAOVld3XP_NQ9zyB6BiZnqmjE_6f0z?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-accentCyan to-accentPurple shadow-lg hover:shadow-neon-cyan transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Download Resume</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
