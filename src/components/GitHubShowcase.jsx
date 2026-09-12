import React, { useState } from 'react';
import { GitPullRequest, GitFork, Star, GitCommit, Users, BookOpen, ExternalLink } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

const GitHubShowcase = () => {
  // Generate mock contribution grid data: 52 weeks * 7 days
  // Colors represent contribution activity levels (0 to 4)
  const generateContributions = () => {
    const data = [];
    const seed = [0, 0, 1, 0, 2, 0, 1, 3, 0, 4, 1, 2, 0, 1, 0, 2, 3, 0, 1, 0, 2, 0, 1, 4, 0, 3];
    for (let i = 0; i < 52 * 7; i++) {
      // Create a pseudo-random activity map
      const level = seed[(i + 4) % seed.length];
      data.push(level);
    }
    return data;
  };

  const contributions = generateContributions();

  // Get color based on activity level & dark mode
  const getCellColorClass = (level) => {
    const darkColors = {
      0: 'bg-zinc-800 dark:bg-zinc-800',
      1: 'bg-emerald-900/60 dark:bg-emerald-950/70',
      2: 'bg-emerald-700/80 dark:bg-emerald-800/80',
      3: 'bg-emerald-500/90 dark:bg-emerald-600/90',
      4: 'bg-emerald-400 dark:bg-emerald-400 shadow-neon-cyan',
    };
    return darkColors[level] || darkColors[0];
  };

  const repos = [
    {
      name: "medi-ai",
      desc: "Smart Hospital Management System with patient/doctor portals and analytical health tracking dashboards.",
      lang: "Python",
      langColor: "#3572A5",
      stars: 32,
      forks: 8,
      url: "https://github.com",
    },
    {
      name: "ibpfm",
      desc: "Intelligence Based Pollution Free Mission. Eco-learning, reward tracking, and Google Maps API pollution heatmaps.",
      lang: "JavaScript",
      langColor: "#f1e05a",
      stars: 28,
      forks: 11,
      url: "https://github.com",
    },
    {
      name: "hand-gesture-gaming",
      desc: "Real-time gesture recognition controller mapping 21 landmark coordinate frames to active system input actions.",
      lang: "Python",
      langColor: "#3572A5",
      stars: 21,
      forks: 4,
      url: "https://github.com",
    }
  ];

  return (
    <section id="github" className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-black/20">
      {/* Background glow points */}
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full glow-bg-cyan -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full glow-bg-purple -z-10 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-xs uppercase tracking-widest text-accentCyan font-bold mb-2">
              Telemetry
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white">
              GitHub Coding Pulse
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-accentCyan to-accentPurple mx-auto mt-4 rounded-full" />
          </ScrollReveal>
        </div>

        {/* Dashboard Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Profile Card & Language Stats */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* profile card */}
            <ScrollReveal direction="left" delay={0.2} className="flex-1">
              <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 border-black/5 h-full flex flex-col justify-between">
                <div className="flex items-center space-x-4">
                  {/* Digital circular avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-accentCyan to-accentPurple flex items-center justify-center text-white font-extrabold font-outfit text-lg shadow-neon-cyan shrink-0">
                    SB
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white leading-tight">
                      Sudarson Balakrishnan
                    </h3>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accentCyan flex items-center gap-1 hover:underline mt-0.5"
                    >
                      <span>@sudarson-balakrishnan</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 my-6 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border dark:border-white/5">
                    <span className="block font-bold text-slate-900 dark:text-white text-base">26</span>
                    <span className="text-[10px] text-slate-500">Repositories</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border dark:border-white/5">
                    <span className="block font-bold text-slate-900 dark:text-white text-base">1.4k</span>
                    <span className="text-[10px] text-slate-500">Commits</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border dark:border-white/5">
                    <span className="block font-bold text-slate-900 dark:text-white text-base">81</span>
                    <span className="text-[10px] text-slate-500">Stars</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Users className="w-4 h-4 text-accentCyan" />
                  <span>142 followers · 98 following</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Language stats card */}
            <ScrollReveal direction="left" delay={0.3} className="flex-1">
              <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 border-black/5 h-full flex flex-col justify-between">
                <h4 className="text-sm font-bold font-outfit text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                  Languages Distribution
                </h4>

                <div className="space-y-4">
                  {[
                    { name: "Python", percent: 65, color: "bg-accentCyan" },
                    { name: "JavaScript", percent: 20, color: "bg-accentPurple" },
                    { name: "Java", percent: 10, color: "bg-accentBlue" },
                    { name: "SQL & Other", percent: 5, color: "bg-teal-400" },
                  ].map((lang) => (
                    <div key={lang.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800 dark:text-slate-200">{lang.name}</span>
                        <span className="text-slate-500 dark:text-slate-400">{lang.percent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${lang.color} rounded-full`} style={{ width: `${lang.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Contribution grid & Repository Cards */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Contribution Grid */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 border-black/5">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2 text-slate-800 dark:text-white font-bold">
                    <GitCommit className="w-5 h-5 text-accentCyan" />
                    <span className="text-sm font-outfit uppercase tracking-wider">Activity History</span>
                  </div>
                  <span className="text-xs text-slate-500">1,424 commits in the last year</span>
                </div>

                {/* Grid container with responsive scrolling wrapper */}
                <div className="overflow-x-auto w-full pb-2">
                  <div className="flex gap-[3px] min-w-[720px] justify-between">
                    {/* Render 52 columns */}
                    {Array.from({ length: 52 }).map((_, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-[3px]">
                        {Array.from({ length: 7 }).map((_, rowIdx) => {
                          const index = colIdx * 7 + rowIdx;
                          const level = contributions[index] || 0;
                          return (
                            <div
                              key={rowIdx}
                              className={`w-[10px] h-[10px] rounded-[2px] transition-all duration-300 hover:scale-125 cursor-pointer ${getCellColorClass(
                                level
                              )}`}
                              title={`Activity level: ${level} (Commit index: ${index})`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-4 px-1">
                  <span>Jun 2025</span>
                  <span>Dec 2025</span>
                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-800" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-950/70" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-800/80" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-600/90" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-400" />
                    <span>More</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Showcase Repos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {repos.map((repo, idx) => (
                <ScrollReveal
                  key={repo.name}
                  direction="up"
                  delay={0.1 * idx + 0.3}
                >
                  <div className="glass-card p-5 rounded-2xl h-full flex flex-col justify-between border dark:border-white/10 border-black/5">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-1.5 text-accentCyan">
                          <BookOpen className="w-4 h-4" />
                          <h5 className="text-sm font-bold font-mono hover:underline cursor-pointer">
                            {repo.name}
                          </h5>
                        </div>
                        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal mb-4">
                        {repo.desc}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.langColor }} />
                        <span>{repo.lang}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 text-yellow-500" />
                          {repo.stars}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <GitFork className="w-3.5 h-3.5 text-slate-400" />
                          {repo.forks}
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubShowcase;
