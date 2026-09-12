import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Activity, Leaf, Gamepad2, Gauge, CheckCircle2 } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

const Projects = () => {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'AI/ML', 'Computer Vision', 'Full-Stack'];

  const projectsData = [
    {
      id: 1,
      title: "MediAI",
      subtitle: "Smart Hospital Management System",
      description: "An AI-powered healthcare ecosystem providing integrated portals for patients, doctors, and administrators with analytical data dashboards.",
      bullets: [
        "Patient, Doctor, and Admin Dashboards",
        "AI-assisted clinical appointment booking",
        "Analytics dashboard mapping medical indicators",
        "Emergency dispatch telemetry integration"
      ],
      categories: ["All", "Full-Stack"],
      tags: ["React", "FastAPI", "MySQL", "Tailwind CSS", "Data Analytics"],
      github: "https://github.com",
      demo: "https://github.com",
      icon: <Activity className="w-5 h-5 text-red-400" />,
      // Micro UI Preview Mockup
      mockup: (
        <div className="w-full h-32 bg-slate-900/60 rounded-xl border border-white/5 p-3 flex flex-col justify-between font-mono text-[9px] text-slate-400">
          <div className="flex justify-between items-center border-b border-white/5 pb-1">
            <span className="text-red-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              MediAI Portal
            </span>
            <span>Dr. Sudarson (Online)</span>
          </div>
          <div className="grid grid-cols-3 gap-2 my-2">
            <div className="bg-white/5 rounded p-1 text-center">
              <span className="block text-[8px] text-slate-500">Heart Rate</span>
              <span className="text-xs font-bold text-white">78 bpm</span>
            </div>
            <div className="bg-white/5 rounded p-1 text-center">
              <span className="block text-[8px] text-slate-500">Oxygen</span>
              <span className="text-xs font-bold text-green-400">98%</span>
            </div>
            <div className="bg-white/5 rounded p-1 text-center">
              <span className="block text-[8px] text-slate-500">Temp</span>
              <span className="text-xs font-bold text-yellow-300">98.6 °F</span>
            </div>
          </div>
          <div className="flex justify-between text-[8px] text-slate-500">
            <span>Diagnostics: Complete</span>
            <span className="text-accentCyan">Schedule Appt →</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "IBPFM",
      subtitle: "Intelligence Based Pollution Free Mission",
      description: "An AI-guided environmental dashboard designed to track municipal pollution levels, render heatmaps, and reward ecological citizen behaviors.",
      bullets: [
        "Interactive AI Chatbot for community reporting",
        "Geospatial pollution heatmaps",
        "Eco-learning modules & resource platforms",
        "Sparkathon 2024 - Second Prize Awardee"
      ],
      categories: ["All", "AI/ML", "Full-Stack"],
      tags: ["Python AI", "Google Maps API", "Flask", "MySQL", "ChartJS"],
      github: "https://github.com",
      demo: "https://github.com",
      icon: <Leaf className="w-5 h-5 text-emerald-400" />,
      // Micro UI Preview Mockup
      mockup: (
        <div className="w-full h-32 bg-slate-900/60 rounded-xl border border-white/5 p-3 flex flex-col justify-between font-mono text-[9px] text-slate-400">
          <div className="flex justify-between items-center border-b border-white/5 pb-1">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              🌱 IBPFM Dashboard
            </span>
            <span className="text-amber-400">🏆 Sparkathon 2nd</span>
          </div>
          <div className="flex gap-2 items-center my-1.5">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 font-bold">AQI 42</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-1 bg-emerald-500 rounded-full w-full" />
              <div className="h-1 bg-white/5 rounded-full w-full" />
              <span className="text-[8px] text-slate-400">Chatbot: "Air quality is Healthy"</span>
            </div>
          </div>
          <div className="flex justify-between text-[8px] text-slate-500">
            <span>Grid Zone: B-12</span>
            <span className="text-accentPurple">Claim Reward (+20pt)</span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Hand Gesture Gaming",
      subtitle: "Touchless Gesture Controller",
      description: "An interactive computer vision project allowing users to play system video games using hand gesture recognition and camera frames.",
      bullets: [
        "Powered by OpenCV and MediaPipe",
        "Real-time hand landmark tracking (21 points)",
        "Zero-latency keyboard/mouse event mapping",
        "Completely touchless gaming experience"
      ],
      categories: ["All", "Computer Vision", "AI/ML"],
      tags: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI"],
      github: "https://github.com",
      demo: "https://github.com",
      icon: <Gamepad2 className="w-5 h-5 text-accentCyan" />,
      // Micro UI Preview Mockup
      mockup: (
        <div className="w-full h-32 bg-slate-900/60 rounded-xl border border-white/5 p-3 flex flex-col justify-between font-mono text-[9px] text-slate-400 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accentCyan/10 to-transparent pointer-events-none" />
          <div className="flex justify-between items-center border-b border-white/5 pb-1">
            <span className="text-accentCyan font-bold">📷 Gesture Capture</span>
            <span>FPS: 60</span>
          </div>
          <div className="flex justify-center items-center h-14 border border-dashed border-white/10 rounded-lg my-1 bg-black/40">
            {/* Visual representation of hand landmarks */}
            <svg className="w-12 h-12 text-accentCyan" viewBox="0 0 100 100">
              <path d="M50,90 L50,60 L35,50 M50,60 L65,55" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="50" cy="90" r="3" fill="#a855f7" />
              <circle cx="50" cy="60" r="3" fill="currentColor" />
              <circle cx="35" cy="50" r="2.5" fill="currentColor" />
              <circle cx="65" cy="55" r="2.5" fill="currentColor" />
              <circle cx="48" cy="30" r="2.5" fill="currentColor" />
              <path d="M50,60 L48,30" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="text-[7px] text-slate-500 absolute ml-16 bg-black/80 px-1 py-0.5 rounded border border-white/10">SWIPE UP detected</span>
          </div>
          <div className="flex justify-between text-[8px] text-slate-500">
            <span>Status: TRACKING</span>
            <span className="text-accentPurple">Action: JUMP</span>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Turbofan Engine RUL",
      subtitle: "Remaining Useful Life Prediction",
      description: "An ML predictive maintenance system analyzing turbofan engine degradation parameters to forecast operational lifetimes.",
      bullets: [
        "Trained on NASA's CMAPSS Engine Dataset",
        "Regressive Random Forest machine learning models",
        "Engine breakdown preventive metrics",
        "Interactive engineering telemetry dashboard"
      ],
      categories: ["All", "AI/ML"],
      tags: ["Python", "Random Forest", "Data Science", "NASA CMAPSS", "Matplotlib"],
      github: "https://github.com",
      demo: "https://github.com",
      icon: <Gauge className="w-5 h-5 text-accentPurple" />,
      // Micro UI Preview Mockup
      mockup: (
        <div className="w-full h-32 bg-slate-900/60 rounded-xl border border-white/5 p-3 flex flex-col justify-between font-mono text-[9px] text-slate-400">
          <div className="flex justify-between items-center border-b border-white/5 pb-1">
            <span className="text-accentPurple font-bold">⚙️ Telemetry Unit</span>
            <span className="text-red-400">RUL Alert</span>
          </div>
          <div className="my-1.5 space-y-1.5">
            <div className="flex justify-between text-[8px]">
              <span>Engine #12 Engine Health</span>
              <span className="text-amber-400">12 Cycles Left</span>
            </div>
            {/* Health track */}
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 w-[20%]" />
            </div>
            <div className="flex justify-between text-[7px] text-slate-500">
              <span>Temp: 642.1 K</span>
              <span>Pressure: 21.61 psia</span>
            </div>
          </div>
          <div className="flex justify-between text-[8px] text-slate-500">
            <span>Model Accuracy: 94.2%</span>
            <span className="text-accentCyan">View Dataset →</span>
          </div>
        </div>
      )
    }
  ];

  const filteredProjects = filter === 'All' 
    ? projectsData 
    : projectsData.filter(p => p.categories.includes(filter));

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-black/20">
      {/* Glow blobs */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full glow-bg-cyan -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[15%] right-[5%] w-[350px] h-[350px] rounded-full glow-bg-purple -z-10 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-xs uppercase tracking-widest text-accentCyan font-bold mb-2">
              Portfolio
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white">
              Featured Case Studies
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-accentCyan to-accentPurple mx-auto mt-4 rounded-full" />
          </ScrollReveal>
        </div>

        {/* Categories Tab Filters */}
        <ScrollReveal direction="up" delay={0.2} className="flex justify-center mb-16">
          <div className="flex p-1.5 rounded-full glass-panel border dark:border-white/10 border-black/5 max-w-md w-full justify-between gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs sm:text-sm px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                  filter === cat
                    ? 'bg-gradient-to-r from-accentCyan to-accentPurple text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Projects Grid Container with motion transitions */}
        <motion.div 
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <div className="glass-card p-6 sm:p-8 rounded-3xl border dark:border-white/10 border-black/5 h-full flex flex-col justify-between group">
                  <div>
                    {/* Visual Vector Micro UI Mockup */}
                    <div className="mb-6 w-full relative">
                      {project.mockup}
                    </div>

                    {/* Card Title & Icon */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                          {project.icon}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold font-outfit text-slate-900 dark:text-white group-hover:text-accentCyan transition-colors duration-300">
                          {project.title}
                        </h3>
                      </div>
                      <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border dark:border-white/5 text-slate-600 dark:text-slate-400">
                        {project.categories[1] || project.categories[0]}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 font-outfit mb-4">
                      {project.subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Checklists */}
                    <ul className="space-y-2 mb-6 font-inter text-xs text-slate-700 dark:text-slate-300">
                      {project.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accentCyan shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    {/* Project Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2.5 py-1 rounded bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border dark:border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 border-t dark:border-white/5 border-black/5 pt-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-accentCyan transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-accentCyan transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Preview</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
