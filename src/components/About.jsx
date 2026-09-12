import React from 'react';
import { GraduationCap, Award, BookOpen, Calendar, Brain, Eye, BarChart3, Globe } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

const About = () => {
  const focusAreas = [
    {
      icon: <Brain className="w-6 h-6 text-accentCyan" />,
      title: "Machine Learning",
      description: "Developing robust models using Scikit-Learn and custom network architectures.",
      glowColor: "rgba(0, 240, 255, 0.15)",
    },
    {
      icon: <Eye className="w-6 h-6 text-accentPurple" />,
      title: "Computer Vision",
      description: "Implementing real-time frame processing with OpenCV, MediaPipe, and CNNs.",
      glowColor: "rgba(168, 85, 247, 0.15)",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-accentBlue" />,
      title: "Data Analytics",
      description: "Extracting actionable insights using Pandas, NumPy, and visualizing via Power BI.",
      glowColor: "rgba(59, 130, 246, 0.15)",
    },
    {
      icon: <Globe className="w-6 h-6 text-teal-400" />,
      title: "Web Development",
      description: "Building fast APIs with FastAPI and crafting responsive interfaces with React + CSS.",
      glowColor: "rgba(45, 212, 191, 0.15)",
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-black/20">
      {/* Visual background glows */}
      <div className="absolute top-[30%] right-[5%] w-[300px] h-[300px] rounded-full glow-bg-cyan -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[20%] left-[5%] w-[350px] h-[350px] rounded-full glow-bg-purple -z-10 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-xs uppercase tracking-widest text-accentCyan font-bold mb-2">
              Background
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white">
              Who I Am & What I Do
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-accentCyan to-accentPurple mx-auto mt-4 rounded-full" />
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Bio & Core Domains Grid */}
          <div className="lg:col-span-7 space-y-8">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="glass-panel p-8 rounded-2xl border dark:border-white/10 border-black/5">
                <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-inter">
                  I am an aspiring <strong className="text-accentCyan font-medium">Artificial Intelligence & Data Science Engineer</strong> passionate about building intelligent systems that bridge complex mathematical algorithms and modern software engineering. My expertise lies in designing end-to-end Machine Learning, Computer Vision pipelines, and deploying them as lightweight full-stack solutions.
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed font-inter">
                  Driven by real-world impact, I love tackling challenges that require combining raw data analytics with reactive interfaces. I focus on creating clean, production-ready code that is optimized, readable, and highly scalable.
                </p>
              </div>
            </ScrollReveal>

            {/* Core Domain Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {focusAreas.map((area, index) => (
                <ScrollReveal
                  key={area.title}
                  direction="up"
                  delay={0.1 * index + 0.3}
                >
                  <div
                    className="glass-card p-6 rounded-2xl h-full flex flex-col justify-between"
                    style={{
                      boxShadow: `0 8px 30px -10px ${area.glowColor}`,
                    }}
                  >
                    <div>
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 w-fit mb-4">
                        {area.icon}
                      </div>
                      <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white mb-2">
                        {area.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Right Column: Education Timeline Panel */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="up" delay={0.3}>
              <div className="glass-panel p-8 rounded-2xl border dark:border-white/10 border-black/5 relative overflow-hidden">
                {/* Visual badge inside card */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accentCyan/10 to-transparent pointer-events-none" />

                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-accentCyan/10 text-accentCyan">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white">
                    Education
                  </h3>
                </div>

                {/* Educational milestone details */}
                <div className="space-y-6">
                  <div className="relative pl-6 border-l-2 border-accentCyan/30 space-y-4">
                    {/* Glowing timeline dot */}
                    <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-accentCyan shadow-neon-cyan animate-pulse" />

                    <div>
                      <span className="inline-flex items-center space-x-1.5 text-xs text-accentCyan font-bold uppercase tracking-wider mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>2023 - 2027</span>
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
                        B.Tech Artificial Intelligence and Data Science
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        VSB College of Engineering Technical Campus
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2">
                      <div className="p-3.5 rounded-xl bg-slate-100/50 dark:bg-white/5 border dark:border-white/5">
                        <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
                          <Award className="w-3.5 h-3.5 text-accentPurple" />
                          <span>Performance</span>
                        </div>
                        <span className="text-lg font-extrabold text-slate-900 dark:text-white font-outfit">
                          CGPA: 8.48
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-100/50 dark:bg-white/5 border dark:border-white/5">
                        <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
                          <BookOpen className="w-3.5 h-3.5 text-accentCyan" />
                          <span>Graduation</span>
                        </div>
                        <span className="text-lg font-extrabold text-slate-900 dark:text-white font-outfit">
                          Year: 2027
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Core Coursework
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {["Machine Learning", "Deep Learning", "Data Structures", "Database Management (SQL)", "Computer Vision", "Statistical Modeling"].map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border dark:border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
