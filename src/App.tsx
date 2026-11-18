import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Achievements } from './components/Achievements';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { GlitchLoader } from './components/GlitchLoader';
import { ParticleField } from './components/ParticleField';
import { SparkCursor } from './components/SparkCursor';
import { PORTFOLIO_PROJECTS, SITE } from './data/portfolioData';
import type { Project } from './data/portfolioData';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function App() {
  useEffect(() => {
    document.title = SITE.pageTitle;
  }, []);

  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreloaderComplete = () => {
    setLoading(false);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigate = (direction: 1 | -1) => {
    if (!selectedProject) return;
    const idx = PORTFOLIO_PROJECTS.findIndex((p) => p.id === selectedProject.id);
    if (idx === -1) return;
    const nextIdx = (idx + direction + PORTFOLIO_PROJECTS.length) % PORTFOLIO_PROJECTS.length;
    setSelectedProject(PORTFOLIO_PROJECTS[nextIdx]);
  };

  const handleInquire = () => {
    setIsModalOpen(false);
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative isolate min-h-screen text-gray-100 flex flex-col font-sans selection:bg-[#a31515] selection:text-white bg-[#07070a]">
      {/* 3D WebGL Starfield with forward scroll travel and click shockwaves */}
      <ParticleField />

      {/* Ambient colour behind the glass: red glow orbs */}
      <div className="ambient" aria-hidden="true">
        <i className="o1" />
        <i className="o3" />
      </div>

      {/* Interactive 2D spark & lightning cursor */}
      <SparkCursor />

      {/* Progressive glitch countdown loader */}
      {loading && <GlitchLoader onComplete={handlePreloaderComplete} />}

      {/* Dynamic Navbar with blur on scroll */}
      <Navbar />

      {/* Main Portfolio Sections */}
      <main className="relative z-10 w-full flex-1">
        <Hero />
        <Stats />
        <Projects onSelectProject={handleSelectProject} />
        <About />
        <Achievements />
        <Skills />
        <Contact />
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Video Modal Player */}
      <VideoModal
        project={isModalOpen ? selectedProject : null}
        onClose={handleCloseModal}
        onNavigate={handleNavigate}
        onInquire={handleInquire}
      />
    </div>
  );
}

export default App;
