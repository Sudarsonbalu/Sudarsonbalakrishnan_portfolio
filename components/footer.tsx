'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { portfolioData } from '../data/portfolio-data'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050505] text-[#f5f5f7] py-16 px-6 sm:px-10 lg:px-16 w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Left Identity */}
        <div className="flex items-center gap-4">
          <div
            className="relative w-12 h-12 flex-shrink-0 transition-all duration-500"
            style={{
              filter: 'hue-rotate(var(--theme-hue-rotate, 0deg))',
            }}
          >
            <Image
              src="/images/logo.png"
              alt="Sudarson Balakrishnan — SB Logo"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
          <div>
            <div className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white mb-1">
              SUDARSON BALAKRISHNAN
            </div>
            <p className="font-mono text-xs text-neutral-400">
              {portfolioData.profile.title} · {portfolioData.profile.location}
            </p>
          </div>
        </div>

        {/* Center Page Links */}
        <nav className="flex flex-wrap items-center gap-6 font-mono text-xs tracking-wider text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">
            HOME
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            ABOUT
          </Link>
          <Link href="/projects" className="hover:text-white transition-colors">
            PROJECTS
          </Link>
          <Link href="/achievements" className="hover:text-white transition-colors">
            ACHIEVEMENTS
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            CONTACT
          </Link>
        </nav>

        {/* Right External Links */}
        <div className="flex items-center gap-5 font-mono text-xs text-neutral-400">
          <a
            href={portfolioData.links.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1 group"
          >
            <span className="transition-colors duration-300 group-hover:text-[var(--theme-color)]">GITHUB</span> <ArrowUpRight size={12} className="transition-colors duration-300 group-hover:text-[var(--theme-color)]" />
          </a>
          <a
            href={portfolioData.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1 group"
          >
            <span className="transition-colors duration-300 group-hover:text-[var(--theme-color)]">LINKEDIN</span> <ArrowUpRight size={12} className="transition-colors duration-300 group-hover:text-[var(--theme-color)]" />
          </a>
          <a
            href={`mailto:${portfolioData.profile.email}`}
            className="hover:text-white transition-colors group"
          >
            <span className="transition-colors duration-300 group-hover:text-[var(--theme-color)]">EMAIL</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-neutral-600 gap-4">
        <div>
          © {new Date().getFullYear()} Sudarson Balakrishnan. All rights reserved.
        </div>
        <div className="text-neutral-500">
          {portfolioData.profile.coordinates} · B.Tech AI &amp; Data Science (VSB College of Engineering)
        </div>
      </div>
    </footer>
  )
}
