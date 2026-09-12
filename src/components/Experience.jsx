import React from 'react';
import { Briefcase, Award, Trophy, BookOpen, FileText, Globe, Calendar } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

const Experience = () => {
  const experiences = [
    {
      role: "Front-End Development Intern",
      company: "Tech Volt Software Pvt Ltd",
      duration: "Internship",
      details: [
        "Built responsive, premium front-end components and landing pages using HTML, CSS, and vanilla JS.",
        "Collaborated with dev teams to streamline layouts and optimize asset loading configurations.",
        "Created interactive dashboards and tested page functionality across multiple viewports."
      ],
      tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design"]
    },
    {
      role: "ITSM & Automation Intern",
      company: "ServiceNow Virtual Internship",
      duration: "Virtual Internship",
      details: [
        "Mastered workflow automation protocols, configuration management database (CMDB), and service portals.",
        "Designed scripts and ticket escalation chains to optimize enterprise ITSM processes.",
        "Studied ServiceNow platform administration, asset management, and client incident tables."
      ],
      tags: ["ServiceNow", "Workflow Automation", "ITSM", "Incident Management"]
    }
  ];

  const achievements = [
    {
      title: "Sparkathon 2024 – Second Prize",
      type: "Competition",
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      description: "Awarded 2nd prize out of national collegiate entries for the IBPFM (Intelligence Based Pollution Free Mission) environmental chatbot and mapping platform.",
    },
    {
      title: "Patent: Smart Dustbin System",
      type: "Intellectual Property",
      icon: <FileText className="w-5 h-5 text-accentCyan" />,
      description: "Published a patent detailing an automated dustbin sorting and collection system leveraging modern microcontrollers and sensor integration layers.",
    },
    {
      title: "Research Paper: AI in Cybersecurity",
      type: "Publication",
      icon: <BookOpen className="w-5 h-5 text-accentPurple" />,
      description: "Co-authored and published research exploring neural anomaly detection for network scanning prevention and threat mitigation.",
    },
    {
      title: "Journal: Cyber Crimes & Security Tools",
      type: "Publication",
      icon: <Globe className="w-5 h-5 text-teal-400" />,
      description: "Published survey summarizing threat vectors, digital forensics, and protection frameworks in modern computer security networks.",
    }
  ];

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      {/* Background glow points */}
      <div className="absolute top-[30%] left-[5%] w-[350px] h-[350px] rounded-full glow-bg-cyan -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] rounded-full glow-bg-purple -z-10 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-xs uppercase tracking-widest text-accentCyan font-bold mb-2">
              Milestones
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white">
              Experience & Achievements
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-accentCyan to-accentPurple mx-auto mt-4 rounded-full" />
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Work Experience */}
          <div className="lg:col-span-6 space-y-8">
            <ScrollReveal direction="up" delay={0.2} className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 rounded-xl bg-accentCyan/10 text-accentCyan">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">
                Work Experience
              </h3>
            </ScrollReveal>

            <div className="relative pl-6 border-l-2 border-slate-200 dark:border-white/10 space-y-12">
              {experiences.map((exp, idx) => (
                <ScrollReveal
                  key={exp.role}
                  direction="up"
                  delay={0.1 * idx + 0.3}
                  className="relative space-y-3"
                >
                  {/* Timeline dot */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-accentCyan border-4 border-slate-50 dark:border-darkBg shadow-neon-cyan" />

                  <div>
                    <span className="inline-flex items-center space-x-1 text-xs text-accentCyan font-bold uppercase tracking-wider mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.duration}</span>
                    </span>
                    <h4 className="text-lg font-bold font-outfit text-slate-900 dark:text-white">
                      {exp.role}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                      {exp.company}
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 list-disc list-inside leading-relaxed">
                    {exp.details.map((detail, index) => (
                      <li key={index} className="pl-1">
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border dark:border-white/5 text-slate-700 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Right Column: Achievements & Intellectual Property */}
          <div className="lg:col-span-6 space-y-8">
            <ScrollReveal direction="up" delay={0.2} className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 rounded-xl bg-accentPurple/10 text-accentPurple">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">
                Key Accomplishments
              </h3>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {achievements.map((ach, idx) => (
                <ScrollReveal
                  key={ach.title}
                  direction="up"
                  delay={0.1 * idx + 0.3}
                >
                  <div className="glass-card p-6 rounded-2xl h-full flex flex-col justify-between border dark:border-white/10 border-black/5 hover:-translate-y-1 transition-all duration-300">
                    <div>
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 w-fit mb-4">
                        {ach.icon}
                      </div>
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500 mb-1 block">
                        {ach.type}
                      </span>
                      <h4 className="text-base font-bold font-outfit text-slate-900 dark:text-white mb-2 leading-snug">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {ach.description}
                      </p>
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

export default Experience;
