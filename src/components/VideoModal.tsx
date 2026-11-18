import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import type { Project } from '../data/portfolioData';

interface VideoModalProps {
  project: Project | null;
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
  onInquire: (project: Project) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ project, onClose, onNavigate, onInquire }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = project !== null;

  // Lock scroll, trap focus, handle keys, and return focus to the card that opened the modal
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], video[controls], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-2xl"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25 }}
            className="glass glass-strong relative z-10 flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border-[#ff334b]/35 shadow-2xl shadow-red-950/50"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="glass-chip-red shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white">{project.category}</span>
                <h3 className="truncate text-base font-bold text-white">{project.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate(-1)}
                  aria-label="Previous project"
                  className="glass-chip rounded-full p-2 text-gray-100 hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(1)}
                  aria-label="Next project"
                  className="glass-chip rounded-full p-2 text-gray-100 hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close project"
                  className="glass-chip rounded-full p-2 text-gray-200 hover:bg-red-600/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative flex aspect-video w-full items-center justify-center bg-black">
              {project.embedUrl ? (
                <iframe
                  key={project.id}
                  // YouTube links: append autoplay=1&mute=0 — Drive preview URLs pass through unchanged
                  src={
                    project.embedUrl.includes('youtube.com/embed')
                      ? `${project.embedUrl}?autoplay=1&rel=0&modestbranding=1`
                      : project.embedUrl
                  }
                  title={project.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : project.videoUrl ? (
                <video
                  key={project.id}
                  src={project.videoUrl}
                  poster={project.poster}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                />
              ) : project.poster ? (
                <img
                  key={project.id}
                  src={project.poster}
                  alt={`${project.title} preview`}
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              ) : (
                <p className="px-6 text-center text-sm text-gray-300">
                  Preview unavailable.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-5 border-t border-white/10 bg-white/[0.04] p-5 sm:p-6 overflow-y-auto max-h-[45vh]">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{project.title}</h3>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-400 mt-1">{project.subtitle}</p>
                <p className="text-sm leading-relaxed text-gray-200 mt-3">{project.description}</p>

                {project.features && project.features.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-red-400 mb-2">Key Features</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-xs text-gray-300">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.tags && project.tags.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Technologies Used</h4>
                    <ul className="flex flex-wrap gap-1.5">
                      {project.tags.map((t) => (
                        <li key={t} className="glass-chip rounded-full px-3 py-1 text-xs font-semibold text-gray-200 border border-white/10">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-2.5">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-chip group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold text-white bg-black/60 hover:bg-red-950/60 hover:border-red-500/70 border border-white/15 transition-all duration-300 shadow-lg shadow-black/40 hover:shadow-red-950/40"
                    >
                      <Github className="h-4 w-4 text-red-400 group-hover:text-white transition-colors" />
                      <span>GitHub Repository</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-chip-red group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 shadow-lg shadow-red-950/50 hover:scale-[1.03]"
                    >
                      <ExternalLink className="h-4 w-4 text-white" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>

                <a
                  href="#contact"
                  onClick={() => onInquire(project)}
                  className="glass rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white border border-white/10 hover:border-white/30 transition-all ml-auto"
                >
                  Discuss Project
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
