import React from 'react';
import { TECH_ICONS } from './techIcons';
import { TECH_STACK } from '../data/portfolioData';

const TOOLS = TECH_STACK.map((label) => {
  const icon = TECH_ICONS.find((i) => i.label.toLowerCase() === label.toLowerCase());
  return {
    label,
    color: icon?.color ?? '#ff2a3b',
    path: icon?.path ?? '',
    viewBox: icon?.viewBox ?? '0 0 24 24',
  };
});

/** Software & tools shown as tall capsules (logo on top, name below). Edit TECH_STACK in src/data/portfolioData.ts. */

export const SoftwareStrip: React.FC = () => (
  <div className="relative w-full max-w-7xl mt-24 z-10 flex flex-col items-center">
    <div className="red-halo" aria-hidden="true" />
    <span className="relative text-[#a31515] font-bold uppercase text-sm md:text-base tracking-[0.2em] mb-4">
      Languages &amp; Tools
    </span>
    <h3 className="relative text-4xl md:text-6xl font-black tracking-tight uppercase text-white mb-12">
      MY TECH STACK.
    </h3>
    <ul className="grid-blur relative flex flex-wrap justify-center gap-4 md:gap-6 list-none p-0 m-0">
      {TOOLS.map((tool) => (
        <li
          key={tool.label}
          className="matrix-item glass glass-grid-card group w-[132px] h-[190px] md:w-[148px] md:h-[216px] xl:w-[152px] xl:h-[224px] rounded-3xl flex flex-col items-center justify-center gap-5 px-2"
        >
          <svg
            viewBox={tool.viewBox}
            role="img"
            aria-label={tool.label}
            className="shrink-0 w-14 h-14 md:w-16 md:h-16 transition-transform duration-300 group-hover:scale-110"
            style={{ fill: tool.color, filter: `drop-shadow(0 0 10px ${tool.color}55)` }}
          >
            {tool.path ? (
              <path d={tool.path} />
            ) : (
              <text x="12" y="17" textAnchor="middle" fontSize="16" fontWeight="800">
                {tool.label.charAt(0).toUpperCase()}
              </text>
            )}
          </svg>
          <span className="text-xs md:text-sm font-semibold text-gray-400 group-hover:text-gray-100 transition-colors text-center leading-tight whitespace-pre-line">
            {tool.label}
          </span>
        </li>
      ))}
    </ul>
  </div>
);
