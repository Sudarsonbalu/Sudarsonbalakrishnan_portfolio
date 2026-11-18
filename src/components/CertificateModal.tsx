import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink, Calendar, Building2, ZoomIn, ZoomOut } from 'lucide-react';
import type { CertificateItem } from '../data/portfolioData';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
  onNavigate?: (direction: 1 | -1) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
  onNavigate,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const isOpen = certificate !== null;

  useEffect(() => {
    setIsZoomed(false);
  }, [certificate]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNavigate) onNavigate(1);
      if (e.key === 'ArrowLeft' && onNavigate) onNavigate(-1);
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose, onNavigate]);

  const isPdf = certificate?.image.endsWith('.pdf') || certificate?.pdfUrl;

  return (
    <AnimatePresence>
      {certificate && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-2xl"
          />

          {/* Modal Container */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={certificate.title}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25 }}
            className="glass glass-strong relative z-10 flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border-[#ff334b]/40 shadow-2xl shadow-red-950/60 bg-[#0d090d]/95"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="glass-chip-red shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white">
                  {certificate.category}
                </span>
                <h3 className="truncate text-base font-bold text-white">{certificate.title}</h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!isPdf && (
                  <button
                    type="button"
                    onClick={() => setIsZoomed((prev) => !prev)}
                    aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                    title={isZoomed ? "Zoom out" : "Zoom in"}
                    className="glass-chip rounded-full p-2 text-gray-200 hover:text-white hover:border-red-500/50"
                  >
                    {isZoomed ? <ZoomOut className="h-5 w-5 text-red-400" /> : <ZoomIn className="h-5 w-5 text-red-400" />}
                  </button>
                )}
                {onNavigate && (
                  <>
                    <button
                      type="button"
                      onClick={() => onNavigate(-1)}
                      aria-label="Previous certificate"
                      className="glass-chip rounded-full p-2 text-gray-200 hover:text-white hover:border-red-500/50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate(1)}
                      aria-label="Next certificate"
                      className="glass-chip rounded-full p-2 text-gray-200 hover:text-white hover:border-red-500/50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close certificate preview"
                  className="glass-chip rounded-full p-2 text-gray-200 hover:bg-red-600/60 hover:text-white hover:border-red-500/50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Certificate Preview Body */}
            <div className="relative flex max-h-[62vh] min-h-[300px] w-full items-center justify-center bg-black/90 p-3 sm:p-6 overflow-auto">
              {isPdf ? (
                <iframe
                  src={certificate.pdfUrl || certificate.image}
                  title={certificate.title}
                  className="w-full h-[55vh] rounded-xl border border-white/10"
                />
              ) : (
                <img
                  src={certificate.image}
                  alt={`${certificate.title} certificate`}
                  onClick={() => setIsZoomed((prev) => !prev)}
                  title="Click to toggle zoom"
                  className={`max-h-[58vh] max-w-full rounded-xl object-contain shadow-2xl border border-white/10 transition-transform duration-300 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                />
              )}
            </div>

            {/* Details Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 bg-white/[0.04] p-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#ff334b]">
                  <Building2 className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{certificate.issuer}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                  {certificate.date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span>{certificate.date}</span>
                    </span>
                  )}
                  {certificate.credentialId && (
                    <span className="font-mono text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                      ID: {certificate.credentialId}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                <a
                  href={certificate.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-chip group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-white bg-black/60 hover:bg-red-950/60 hover:border-red-500/70 border border-white/15 transition-all duration-300 shadow-lg shadow-black/40 hover:shadow-red-950/40"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-red-400 group-hover:text-white transition-colors" />
                  <span>Open Full Original</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
