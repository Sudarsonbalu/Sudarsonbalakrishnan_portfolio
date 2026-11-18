import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VenomButton } from './VenomButton';
import { SITE, WHATSAPP_URL } from '../data/portfolioData';
import { Mail, Phone, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

gsap.registerPlugin(ScrollTrigger);

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type SubmissionStatus = 'idle' | 'sending' | 'success' | 'error';

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance timeline
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .fromTo(cardRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      newErrors.subject = 'Please enter a subject (at least 3 characters).';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a message with at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error as user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus('error');
      setErrorMessage(
        'EmailJS environment variables are missing. Please add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.'
      );
      return;
    }

    setIsSubmitting(true);
    setStatus('sending');
    setErrorMessage(null);

    try {
      const templateParams = {
        from_name: formData.name.trim(),
        from_email: formData.email.trim(),
        user_email: formData.email.trim(),
        reply_to: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        to_name: SITE.name,
        to_email: SITE.email,
      };

      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);

      if (response.status === 200 || response.text === 'OK') {
        setStatus('success');
        // Clear the form after successful submission
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      } else {
        throw new Error(response.text || 'EmailJS rejected message delivery.');
      }
    } catch (err: unknown) {
      console.error('EmailJS submission error:', err);
      const text =
        err instanceof Error
          ? err.message
          : 'Failed to deliver message. Please check your network or email credentials.';
      setErrorMessage(text);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full text-gray-100 py-28 px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col items-center justify-center overflow-hidden border-t border-white/5"
    >
      {/* Section Title */}
      <div ref={titleRef} className="flex flex-col items-center text-center mb-14 z-10">
        <span className="text-[#a31515] font-bold uppercase text-sm md:text-base tracking-[0.2em] mb-2 flex items-center gap-1.5">
          <img src="/assets/icon.svg" alt="" aria-hidden="true" className="w-6 h-6 object-contain" />
          Get In Touch
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight uppercase text-white">
          CONTACT.
        </h2>
        <div className="w-20 h-1.5 bg-[#a31515] mt-3 rounded-full" />
      </div>

      {/* Card Form & Social Links */}
      <div className="relative w-full max-w-4xl z-10">
        {/* WhatsApp Quick Action */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat with ${SITE.name} on WhatsApp`}
          className="whatsapp-card glass glass-hover mb-4 flex items-center gap-4 rounded-3xl px-6 py-5 md:px-8 relative z-10"
        >
          <span className="whatsapp-icon grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">WhatsApp</span>
            <span className="text-base sm:text-lg md:text-xl font-extrabold text-gray-100">{SITE.phone}</span>
          </span>
          <span className="whatsapp-cta ml-auto hidden shrink-0 text-xs font-bold uppercase tracking-wider sm:block">Chat now &rarr;</span>
        </a>

        {/* Direct Phone Call */}
        <a
          href={`tel:+${SITE.phone}`}
          className="glass glass-hover mb-8 flex items-center gap-4 rounded-3xl px-6 py-5 md:px-8 relative z-10"
        >
          <span className="glass-chip grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-red-500">
            <Phone className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Call</span>
            <span className="text-base sm:text-lg md:text-xl font-extrabold text-gray-100">{SITE.phone}</span>
          </span>
        </a>

        <div className="red-halo" style={{ inset: '-14% -10%' }} aria-hidden="true" />

        {/* Glass Card Form */}
        <div
          ref={cardRef}
          className="glass glass-panel-card w-full p-6 sm:p-10 md:p-14 rounded-3xl relative z-10"
        >
          {status === 'success' ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-950/70 border border-emerald-500/60 flex items-center justify-center mb-6 shadow-[0_0_35px_rgba(16,185,129,0.4)] animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-3">
                Message Dispatched!
              </h3>
              <p className="text-base sm:text-lg text-gray-300 font-medium max-w-lg mb-8 leading-relaxed">
                Thank you for reaching out! Your message has been transmitted directly to my Gmail inbox at{' '}
                <span className="text-white font-bold">{SITE.email}</span>. I will review it and get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="px-8 py-3 rounded-full glass-red text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-transform hover:scale-105 active:scale-95"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 sm:gap-7">
              {/* Direct Email Header Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full glass-chip flex items-center justify-center text-red-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">Direct Inquiries</span>
                    <a href={`mailto:${SITE.email}`} className="text-sm md:text-base font-bold text-white hover:text-red-400 transition-colors">
                      {SITE.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Open To New Projects</span>
                </div>
              </div>

              {/* Error Banner */}
              {status === 'error' && errorMessage && (
                <div className="p-4 rounded-2xl bg-red-950/60 border border-red-600/60 flex items-start gap-3 shadow-[0_0_20px_rgba(220,38,38,0.25)]">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-red-200 leading-relaxed">
                    <p className="font-bold text-white mb-0.5">Delivery Issue</p>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-gray-400">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Sudarson"
                    className={`w-full px-5 sm:px-6 py-4 sm:py-5 glass-input rounded-2xl sm:rounded-3xl text-base sm:text-lg md:text-xl font-medium text-gray-100 placeholder:text-gray-500 focus:outline-none transition-all ${
                      errors.name ? 'border-red-500 ring-1 ring-red-500' : ''
                    } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                  {errors.name && <span className="text-xs text-red-400 font-medium px-2">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-gray-400">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className={`w-full px-5 sm:px-6 py-4 sm:py-5 glass-input rounded-2xl sm:rounded-3xl text-base sm:text-lg md:text-xl font-medium text-gray-100 placeholder:text-gray-500 focus:outline-none transition-all ${
                      errors.email ? 'border-red-500 ring-1 ring-red-500' : ''
                    } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                  {errors.email && <span className="text-xs text-red-400 font-medium px-2">{errors.email}</span>}
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-gray-400">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="e.g. AI Project Inquiry / Job Opportunity"
                  className={`w-full px-5 sm:px-6 py-4 sm:py-5 glass-input rounded-2xl sm:rounded-3xl text-base sm:text-lg md:text-xl font-medium text-gray-100 placeholder:text-gray-500 focus:outline-none transition-all ${
                    errors.subject ? 'border-red-500 ring-1 ring-red-500' : ''
                  } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                {errors.subject && <span className="text-xs text-red-400 font-medium px-2">{errors.subject}</span>}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-gray-400">
                  Message &amp; Project Scope <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  disabled={isSubmitting}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell me about your idea, timeline, and what you need built..."
                  className={`w-full px-5 sm:px-6 py-4 sm:py-5 glass-input rounded-2xl sm:rounded-3xl text-base sm:text-lg md:text-xl font-medium text-gray-100 placeholder:text-gray-500 focus:outline-none transition-all resize-none ${
                    errors.message ? 'border-red-500 ring-1 ring-red-500' : ''
                  } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                {errors.message && <span className="text-xs text-red-400 font-medium px-2">{errors.message}</span>}
              </div>

              {/* Submit Button */}
              {isSubmitting ? (
                <div className="self-center mt-2">
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full select-none cursor-not-allowed bg-red-950/80 border border-red-600/60 text-white font-bold uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_25px_rgba(220,38,38,0.5)]"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                    <span>Dispatching Message...</span>
                  </button>
                </div>
              ) : (
                <VenomButton type="submit" variant="primary" className="self-center mt-2">
                  Send Message
                </VenomButton>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
