import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createVenomEngine } from '../lib/venomEngine';

interface VenomButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  /** Only shown in the no-WebGL fallback; the WebGL button draws its label as chrome lettering. */
  icon?: React.ReactNode;
  ariaLabel?: string;
  /** Native button type; use "submit" inside forms. Ignored when `href` is set. */
  type?: 'button' | 'submit';
}

type Engine = ReturnType<typeof createVenomEngine>;

const textOf = (node: React.ReactNode): string =>
  React.Children.toArray(node)
    .map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : ''))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * The Venom liquid button (https://exteestudio.github.io/venom-button/), scoped to a single button.
 * A WebGL2 canvas with transparent padding sits behind the real <a>/<button>, so tendrils can reach
 * out past the pill without affecting layout. Falls back to a plain styled pill without WebGL2.
 */
export const VenomButton: React.FC<VenomButtonProps> = ({
  children,
  onClick,
  href,
  variant = 'primary',
  className = '',
  icon,
  ariaLabel,
  type = 'button',
}) => {
  const hitRef = useRef<HTMLElement | null>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const engineRef = useRef<Engine>(null);
  const label = useMemo(() => textOf(children), [children]);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [mode, setMode] = useState<'pending' | 'webgl' | 'fallback'>('pending');

  // create the engine once; label and variant changes are pushed in below
  useEffect(() => {
    const host = hostRef.current;
    const hit = hitRef.current;
    if (!host || !hit) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const engine = createVenomEngine(host, hit, {
      variant,
      reducedMotion: reduced,
      onLayout: (w: number, h: number) => setSize({ w: Math.round(w), h: Math.round(h) }),
      onFail: () => setMode('fallback'),
    });
    if (!engine) {
      setMode('fallback');
      return;
    }
    engineRef.current = engine;
    setMode('webgl');
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engineRef.current?.setVariant(variant);
  }, [variant, mode]);

  useEffect(() => {
    if (mode === 'webgl') engineRef.current?.setLabel(label || ariaLabel || '');
  }, [label, ariaLabel, mode]);

  const webgl = mode === 'webgl';
  const fallbackW = Math.max(180, label.length * 11 + 64);
  const style: React.CSSProperties = webgl && size
    ? { width: size.w, height: size.h }
    : { minWidth: fallbackW, height: 48 };

  const shared = {
    ref: hitRef as React.Ref<never>,
    'aria-label': ariaLabel,
    'data-cursor': 'venom',
    onClick,
    style,
    className: `relative inline-flex items-center justify-center rounded-full select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1238] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${
      webgl ? '' : (variant === 'secondary' ? 'glass glass-hover' : 'glass-red')
    } ${className}`,
  };

  const inner = (
    <>
      {/* zero-size anchor at the button's centre; the engine puts its canvas here */}
      <span ref={hostRef} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0" />
      {/* real text stays in the DOM for screen readers, search and the no-WebGL fallback */}
      <span
        className={
          webgl
            ? 'pointer-events-none absolute h-px w-px overflow-hidden whitespace-nowrap opacity-0'
            : 'relative z-10 flex items-center gap-2.5 px-8 text-xs font-bold uppercase tracking-wider text-white md:text-sm'
        }
      >
        {children}
        {!webgl && icon && <span className="text-[#FF1238]">{icon}</span>}
      </span>
    </>
  );

  return href ? (
    <a href={href} {...shared}>{inner}</a>
  ) : (
    <button type={type} {...shared}>{inner}</button>
  );
};
