import React from 'react';
import { SITE, SOCIALS } from '../data/portfolioData';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="glass-bar w-full text-white py-14 px-6 md:px-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Back to Top"
            className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/assets/sb-crown-logo.png"
              alt="SB Crown Logo"
              className="w-12 h-12 md:w-14 md:h-14 object-contain transition-all duration-300 drop-shadow-[0_0_8px_rgba(220,38,38,0.4)] group-hover:drop-shadow-[0_0_18px_rgba(255,185,0,0.7)]"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight uppercase text-white group-hover:text-red-400 transition-colors">
                {SITE.name}
              </span>
              <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                {SITE.role}
              </span>
            </div>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {SOCIALS.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-chip px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-all hover:scale-105"
            >
              {social.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-gray-400 uppercase tracking-widest font-bold">
            <a href="#about" className="hover:text-red-500 transition-colors">About</a>
            <a href="#achievements" className="hover:text-red-500 transition-colors">Achievements</a>
            <a href="#skills" className="hover:text-red-500 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-red-500 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-red-500 transition-colors">Contact</a>
          </div>
          <div className="text-[11px] text-gray-500 font-mono uppercase tracking-wider">
            &copy; {CURRENT_YEAR} {SITE.name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
