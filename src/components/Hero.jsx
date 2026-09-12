import React from 'react';
import { ArrowRight, Terminal, Github, Linkedin, Cpu, Sparkles } from 'lucide-react';
import Typewriter from './ui/Typewriter';
import ScrollReveal from './ui/ScrollReveal';

const Hero = () => {
  const words = ["AI Developer", "Data Scientist", "Innovator", "Problem Solver"];

  const handleScrollTo = (id) => {
    const element = document.querySelector(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full glow-bg-cyan -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full glow-bg-purple -z-10 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Heading, Titles, CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass-panel border border-accentCyan/20 text-accentCyan text-xs font-semibold tracking-wider uppercase mb-2">
              <Sparkles className="w-4 h-4 animate-spin-slow text-accentCyan" />
              <span>Available for Placements & Internships</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-outfit tracking-tight leading-none text-slate-900 dark:text-white">
              Hi, I'm <br />
              <span className="text-gradient-cyan-purple mt-2 block">
                Sudarson Balakrishnan
              </span>
            </h1>
          </ScrollReveal>

          {/* Titles & Typewriter */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="space-y-2 mt-4">
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start text-xs sm:text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-white/5 border dark:border-white/5">
                  Artificial Intelligence & Data Science Engineer
                </span>
                <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-white/5 border dark:border-white/5">
                  Machine Learning Enthusiast
                </span>
                <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-white/5 border dark:border-white/5">
                  Full Stack Developer
                </span>
              </div>

              <div className="text-lg sm:text-xl md:text-2xl font-mono text-accentCyan flex items-center justify-center lg:justify-start space-x-2 pt-2">
                <Terminal className="w-5 h-5 text-accentCyan animate-pulse" />
                <span>const role = </span>
                <Typewriter
                  words={words}
                  typingSpeed={80}
                  deletingSpeed={45}
                  delayBetweenWords={2000}
                  className="font-bold underline decoration-accentCyan decoration-2"
                />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-inter">
              "Building Intelligent Solutions for Real-World Impact." Passionate about translating complex algorithms into sleek, high-performing systems.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal direction="up" delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button
                onClick={() => handleScrollTo('#projects')}
                className="group flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-accentCyan to-accentPurple hover:shadow-neon-cyan active:scale-95 transition-all duration-300"
              >
                <span>View Projects</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleScrollTo('#contact')}
                className="px-6 py-3 rounded-xl font-semibold text-slate-800 dark:text-white glass-panel border dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300"
              >
                Contact Me
              </button>
            </div>
          </ScrollReveal>

          {/* Social Icons Links */}
          <ScrollReveal direction="up" delay={0.6}>
            <div className="flex gap-4 justify-center lg:justify-start pt-6 text-slate-500 dark:text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full glass-panel border dark:border-white/5 hover:text-accentCyan hover:border-accentCyan/40 hover:-translate-y-1 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full glass-panel border dark:border-white/5 hover:text-accentCyan hover:border-accentCyan/40 hover:-translate-y-1 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Code Mockup & Model Visualizer */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <ScrollReveal direction="none" delay={0.4} className="w-full max-w-lg">
            {/* Apple/OpenAI styled Code Editor Mockup */}
            <div className="w-full glass-panel rounded-2xl border dark:border-white/10 border-black/5 shadow-2xl overflow-hidden animate-float-slow">
              {/* Window Controls & Title */}
              <div className="px-4 py-3 bg-slate-900/50 dark:bg-black/40 border-b dark:border-white/5 border-black/5 flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  model_architecture.py
                </span>
                <Cpu className="w-4 h-4 text-accentCyan animate-pulse" />
              </div>

              {/* Code Content */}
              <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto bg-slate-950/80 text-slate-300">
                <span className="text-purple-400">import</span> tensorflow <span className="text-purple-400">as</span> tf<br />
                <span className="text-purple-400">from</span> sklearn.model_selection <span className="text-purple-400">import</span> train_split<br />
                <br />
                <span className="text-blue-400">class</span> <span className="text-yellow-300">PredictiveModel</span>(tf.keras.Model):<br />
                &nbsp;&nbsp;<span className="text-blue-400">def</span> <span className="text-green-300">__init__</span>(self):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;super().__init__()<br />
                &nbsp;&nbsp;&nbsp;&nbsp;self.dense1 = tf.keras.layers.<span className="text-cyan-300">Dense</span>(<span className="text-orange-400">128</span>, <span className="text-green-400">activation</span>=<span className="text-yellow-400">'relu'</span>)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;self.dense2 = tf.keras.layers.<span className="text-cyan-300">Dense</span>(<span className="text-orange-400">64</span>, <span className="text-green-400">activation</span>=<span className="text-yellow-400">'relu'</span>)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;self.out = tf.keras.layers.<span className="text-cyan-300">Dense</span>(<span className="text-orange-400">1</span>, <span className="text-green-400">activation</span>=<span className="text-yellow-400">'sigmoid'</span>)<br />
                <br />
                &nbsp;&nbsp;<span className="text-blue-400">def</span> <span className="text-green-300">call</span>(self, inputs):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;x = self.<span className="text-cyan-300">dense1</span>(inputs)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;x = self.<span className="text-cyan-300">dense2</span>(x)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> self.<span className="text-cyan-300">out</span>(x)<br />
                <br />
                <span className="text-slate-500"># Compiling neural intelligence</span><br />
                model = <span className="text-yellow-300">PredictiveModel</span>()<br />
                model.<span className="text-green-300">compile</span>(<br />
                &nbsp;&nbsp;optimizer=<span className="text-yellow-400">'adam'</span>,<br />
                &nbsp;&nbsp;loss=<span className="text-yellow-400">'binary_crossentropy'</span><br />
                )<br />
                <span className="text-green-400">print</span>(<span className="text-yellow-400">"Intelligence system online."</span>)
              </div>

              {/* Status footer inside code preview */}
              <div className="px-4 py-2 bg-slate-900/50 dark:bg-black/30 border-t dark:border-white/5 border-black/5 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>UTF-8</span>
                <span className="text-green-400 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1 animate-ping" />
                  Epochs running: 100/100
                </span>
                <span>Python 3.10</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
