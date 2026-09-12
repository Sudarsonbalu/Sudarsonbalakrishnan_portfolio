import React from 'react';
import { Award, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

const Certifications = () => {
  const certifications = [
    {
      title: "Python (Basic) Certification",
      issuer: "HackerRank",
      date: "Verified",
      skills: ["Algorithms", "Data Types", "Control Flow"],
      credentialUrl: "https://hackerrank.com"
    },
    {
      title: "Python Programming",
      issuer: "Guvi Geek Network",
      date: "Verified",
      skills: ["Core Programming", "File I/O", "Data Structures"],
      credentialUrl: "https://guvi.in"
    },
    {
      title: "ServiceNow Virtual Internship",
      issuer: "ServiceNow / AICTE",
      date: "Verified",
      skills: ["Workflow Automations", "ITSM Platform", "Tables Configuration"],
      credentialUrl: "https://servicenow.com"
    },
    {
      title: "HTML & CSS Complete Course",
      issuer: "Udemy",
      date: "Verified",
      skills: ["Semantic Markup", "CSS Grid/Flexbox", "Responsive Styling"],
      credentialUrl: "https://udemy.com"
    },
    {
      title: "Python for Data Science",
      issuer: "Infosys Springboard",
      date: "Verified",
      skills: ["Pandas & NumPy", "Data Cleaning", "Data Visualizations"],
      credentialUrl: "https://infosys.com"
    }
  ];

  return (
    <section id="certifications" className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-black/20">
      {/* Background glow effects */}
      <div className="absolute top-[20%] left-[5%] w-[350px] h-[350px] rounded-full glow-bg-purple -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] rounded-full glow-bg-cyan -z-10 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-xs uppercase tracking-widest text-accentCyan font-bold mb-2">
              Credentials
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white">
              Certifications & Badges
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-accentCyan to-accentPurple mx-auto mt-4 rounded-full" />
          </ScrollReveal>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <ScrollReveal
              key={cert.title}
              direction="up"
              delay={0.1 * index}
            >
              <div className="glass-card p-6 rounded-2xl h-full flex flex-col justify-between border dark:border-white/10 border-black/5 hover:-translate-y-1 transition-all duration-300">
                <div>
                  {/* Header: Badge & Status */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-accentCyan/10 text-accentCyan">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{cert.date}</span>
                    </span>
                  </div>

                  {/* Title & Issuer */}
                  <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white leading-snug mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4">
                    Issued by: {cert.issuer}
                  </p>

                  {/* Skills Tagged */}
                  <div className="flex flex-wrap gap-1 mb-6">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border dark:border-white/5 text-slate-600 dark:text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verification Action */}
                <div className="border-t dark:border-white/5 border-black/5 pt-4 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-slate-500 font-medium">Verify ID: AUTH-SEC-{index + 101}</span>
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Redirecting to verification page for: ${cert.title} issued by ${cert.issuer}`);
                    }}
                    className="text-accentCyan flex items-center gap-1 font-bold hover:underline"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
