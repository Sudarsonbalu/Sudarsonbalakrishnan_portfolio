import React from 'react';
import { Code, Cpu, Library, Globe, Database, Wrench } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming",
      icon: <Code className="w-5 h-5 text-accentCyan" />,
      skills: [
        { name: "Python", level: 92 },
        { name: "Java", level: 80 },
        { name: "JavaScript", level: 85 },
        { name: "PHP", level: 70 },
      ],
      glow: "rgba(0, 240, 255, 0.1)",
    },
    {
      title: "AI & Data Science",
      icon: <Cpu className="w-5 h-5 text-accentPurple" />,
      skills: [
        { name: "Machine Learning", level: 90 },
        { name: "Computer Vision", level: 88 },
        { name: "Data Analytics", level: 85 },
        { name: "Predictive Modeling", level: 85 },
      ],
      glow: "rgba(168, 85, 247, 0.1)",
    },
    {
      title: "Libraries",
      icon: <Library className="w-5 h-5 text-accentBlue" />,
      skills: [
        { name: "Pandas", level: 90 },
        { name: "NumPy", level: 88 },
        { name: "Scikit-Learn", level: 85 },
        { name: "OpenCV", level: 82 },
        { name: "MediaPipe", level: 80 },
      ],
      glow: "rgba(59, 130, 246, 0.1)",
    },
    {
      title: "Web Development",
      icon: <Globe className="w-5 h-5 text-teal-400" />,
      skills: [
        { name: "HTML & CSS", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "FastAPI", level: 80 },
        { name: "React (Vite)", level: 80 },
      ],
      glow: "rgba(45, 212, 191, 0.1)",
    },
    {
      title: "Database",
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      skills: [
        { name: "MySQL", level: 85 },
        { name: "SQL Querying", level: 88 },
      ],
      glow: "rgba(52, 211, 153, 0.1)",
    },
    {
      title: "Tools & OS",
      icon: <Wrench className="w-5 h-5 text-amber-400" />,
      skills: [
        { name: "Git & GitHub", level: 88 },
        { name: "VS Code", level: 90 },
        { name: "Jupyter Notebook", level: 85 },
        { name: "Power BI", level: 75 },
      ],
      glow: "rgba(251, 191, 36, 0.1)",
    },
  ];

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[20%] left-[5%] w-[350px] h-[350px] rounded-full glow-bg-purple -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] rounded-full glow-bg-cyan -z-10 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-xs uppercase tracking-widest text-accentCyan font-bold mb-2">
              Capabilities
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white">
              Technical Skill Matrix
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-accentCyan to-accentPurple mx-auto mt-4 rounded-full" />
          </ScrollReveal>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, catIndex) => (
            <ScrollReveal
              key={category.title}
              direction="up"
              delay={0.1 * catIndex}
            >
              <div
                className="glass-card p-6 rounded-2xl h-full flex flex-col border dark:border-white/10 border-black/5"
                style={{
                  boxShadow: `0 8px 32px 0 ${category.glow}`,
                }}
              >
                {/* Category Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                {/* Skills Inside Category */}
                <div className="space-y-4 flex-grow">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800 dark:text-slate-200">
                          {skill.name}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {skill.level}%
                        </span>
                      </div>
                      
                      {/* Skill Level Progress Bar */}
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accentCyan to-accentPurple transition-all duration-1000 ease-out"
                          style={{
                            width: `${skill.level}%`,
                            // Stagger transition slightly for a cool loader effect
                            transitionDelay: `${skillIndex * 100}ms`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
