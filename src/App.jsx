import React, { useState, useEffect } from 'react';
import ParticleBackground from './components/ui/ParticleBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import GitHubShowcase from './components/GitHubShowcase';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Cpu, Terminal } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage or defaults to dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      setDarkMode(true);
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }

    // Simulate tech loader boot phase
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 w-full h-full bg-darkBg flex flex-col items-center justify-center z-50 font-mono text-xs text-slate-400">
        <div className="flex flex-col items-center space-y-6 max-w-sm w-full px-6">
          
          {/* Glowing Processor Core */}
          <div className="relative">
            <div className="absolute inset-0 bg-accentCyan/20 blur-xl rounded-full animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-black border border-accentCyan/30 flex items-center justify-center text-accentCyan animate-float-medium">
              <Cpu className="w-8 h-8 animate-spin-slow text-accentCyan" style={{ animationDuration: '8s' }} />
            </div>
          </div>

          <div className="space-y-2 text-center w-full">
            <div className="text-sm font-bold text-white flex items-center justify-center gap-1.5 font-outfit">
              <span>Sudarson.AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accentCyan animate-ping" />
            </div>
            
            {/* Terminal Boot Trace Lines */}
            <div className="text-[10px] text-slate-500 font-mono space-y-1 text-left bg-black/40 p-4 rounded-xl border border-white/5 w-full">
              <p className="text-accentCyan flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                <span>$ init portfolio_engine...</span>
              </p>
              <p className="animate-pulse delay-75">Loading neural network weights... OK</p>
              <p className="animate-pulse delay-150">Compiling glassmorphic assets... OK</p>
              <p className="text-accentPurple font-bold">System online. Welcome.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-accentCyan/30 selection:text-white transition-colors duration-300">
      {/* Interactive AI particles network background */}
      <ParticleBackground />

      {/* Navigation */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Pages Sections */}
      <main className="max-w-7xl mx-auto px-0 md:px-0">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <GitHubShowcase />
        <Certifications />
        <Contact />
      </main>

      {/* Footer & Back to Top */}
      <Footer />
    </div>
  );
}

export default App;
