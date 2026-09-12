import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, CheckCircle } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      alert("Please fill in all required fields.");
      return;
    }
    
    setStatus('sending');
    // Simulate sending message API
    setTimeout(() => {
      setStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactDetails = [
    {
      icon: <Mail className="w-5 h-5 text-accentCyan" />,
      label: "Email Me",
      value: "sudarsonbalu@gmail.com",
      link: "mailto:sudarsonbalu@gmail.com",
    },
    {
      icon: <MapPin className="w-5 h-5 text-accentPurple" />,
      label: "Location",
      value: "Tamil Nadu, India (Available for Relocation)",
      link: null,
    },
    {
      icon: <Linkedin className="w-5 h-5 text-accentBlue" />,
      label: "LinkedIn Professional Profile",
      value: "Connect on LinkedIn",
      link: "https://linkedin.com",
    },
    {
      icon: <Github className="w-5 h-5 text-teal-400" />,
      label: "GitHub Repositories",
      value: "Explore Code",
      link: "https://github.com",
    },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-black/20">
      {/* Background glow effects */}
      <div className="absolute top-[20%] right-[5%] w-[350px] h-[350px] rounded-full glow-bg-cyan -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[20%] left-[5%] w-[350px] h-[350px] rounded-full glow-bg-purple -z-10 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-xs uppercase tracking-widest text-accentCyan font-bold mb-2">
              Get in Touch
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white">
              Connect With Me
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-accentCyan to-accentPurple mx-auto mt-4 rounded-full" />
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <ScrollReveal direction="left" delay={0.2}>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-inter">
                  Have an internship offer, placement opportunity, research proposal, or just want to chat about AI & Data Science? Drop me a message! I'm always open to discussing technical innovations.
                </p>
              </ScrollReveal>

              <div className="space-y-4">
                {contactDetails.map((detail, index) => (
                  <ScrollReveal
                    key={detail.label}
                    direction="left"
                    delay={0.1 * index + 0.3}
                  >
                    <div className="glass-card p-5 rounded-2xl flex items-center space-x-4 border dark:border-white/10 border-black/5 hover:-translate-y-0.5 transition-all duration-300">
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0 text-slate-700 dark:text-white">
                        {detail.icon}
                      </div>
                      <div className="overflow-hidden">
                        <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {detail.label}
                        </span>
                        {detail.link ? (
                          <a
                            href={detail.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-slate-900 dark:text-white hover:text-accentCyan transition-colors truncate block"
                          >
                            {detail.value}
                          </a>
                        ) : (
                          <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
                            {detail.value}
                          </span>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" delay={0.3} className="h-full">
              <div className="glass-panel p-8 rounded-3xl border dark:border-white/10 border-black/5 h-full relative overflow-hidden flex flex-col justify-center">
                
                {status === 'success' ? (
                  <div className="text-center py-12 space-y-4 animate-scaleUp">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center border border-green-500/20 shadow-lg shadow-green-500/10">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                      Thank you for reaching out. I have received your message and will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-6 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-accentCyan to-accentPurple hover:shadow-neon-cyan transition-all duration-300"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Your Name <span className="text-accentCyan">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formState.name}
                          onChange={handleInputChange}
                          disabled={status === 'sending'}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-white/5 border dark:border-white/10 border-black/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-accentCyan focus:ring-1 focus:ring-accentCyan transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Your Email <span className="text-accentCyan">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formState.email}
                          onChange={handleInputChange}
                          disabled={status === 'sending'}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-white/5 border dark:border-white/10 border-black/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-accentCyan focus:ring-1 focus:ring-accentCyan transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleInputChange}
                        disabled={status === 'sending'}
                        placeholder="Opportunity / Inquiry"
                        className="w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-white/5 border dark:border-white/10 border-black/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-accentCyan focus:ring-1 focus:ring-accentCyan transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Your Message <span className="text-accentCyan">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows="4"
                        value={formState.message}
                        onChange={handleInputChange}
                        disabled={status === 'sending'}
                        placeholder="Write your message here..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-white/5 border dark:border-white/10 border-black/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-accentCyan focus:ring-1 focus:ring-accentCyan transition-all duration-300 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="group flex items-center justify-center space-x-2 w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-accentCyan to-accentPurple hover:shadow-neon-cyan active:scale-98 disabled:opacity-50 transition-all duration-300"
                    >
                      {status === 'sending' ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
