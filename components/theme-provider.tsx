'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

export interface ThemePreset {
  id: string
  name: string
  color: string
  rgb: string
  hueRotate: string
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'red', name: 'Crimson Red', color: '#ff1e38', rgb: '255, 30, 56', hueRotate: '0deg' },
  { id: 'blue', name: 'Royal Blue', color: '#3b82f6', rgb: '59, 130, 246', hueRotate: '220deg' },
  { id: 'purple', name: 'Neon Purple', color: '#a855f7', rgb: '168, 85, 247', hueRotate: '275deg' },
  { id: 'green', name: 'Emerald Green', color: '#10b981', rgb: '16, 185, 129', hueRotate: '120deg' },
  { id: 'orange', name: 'Amber Orange', color: '#f97316', rgb: '249, 115, 22', hueRotate: '35deg' },
  { id: 'cyan', name: 'Electric Cyan', color: '#06b6d4', rgb: '6, 182, 212', hueRotate: '185deg' },
]

export function applyGlobalTheme(preset: ThemePreset) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.style.setProperty('--theme-color', preset.color)
  root.style.setProperty('--theme-color-rgb', preset.rgb)
  root.style.setProperty('--theme-hue-rotate', preset.hueRotate)
  root.style.setProperty('--accent', preset.color)
  root.style.setProperty('--accent-color', preset.color)
  root.style.setProperty('--theme-glow', `rgba(${preset.rgb}, 0.35)`)
  root.style.setProperty('--theme-dim', `rgba(${preset.rgb}, 0.14)`)
  root.style.setProperty('--border-accent', `rgba(${preset.rgb}, 0.45)`)

  try {
    localStorage.setItem('sb_global_theme_preset', JSON.stringify(preset))
  } catch {}

  window.dispatchEvent(new CustomEvent('sb-theme-change', { detail: preset }))
}

interface ThemeContextType {
  currentTheme: ThemePreset
  setTheme: (preset: ThemePreset) => void
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEME_PRESETS[0],
  setTheme: () => {},
})

export function GlobalThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(THEME_PRESETS[0])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sb_global_theme_preset')
      if (saved) {
        const parsed = JSON.parse(saved) as ThemePreset
        const matched = THEME_PRESETS.find((p) => p.id === parsed.id) || parsed
        setCurrentTheme(matched)
        applyGlobalTheme(matched)
      } else {
        applyGlobalTheme(THEME_PRESETS[0])
      }
    } catch {
      applyGlobalTheme(THEME_PRESETS[0])
    }

    const handleThemeEvent = (e: Event) => {
      const custom = e as CustomEvent<ThemePreset>
      if (custom.detail) {
        setCurrentTheme(custom.detail)
      }
    }
    window.addEventListener('sb-theme-change', handleThemeEvent)
    return () => window.removeEventListener('sb-theme-change', handleThemeEvent)
  }, [])

  const setTheme = (preset: ThemePreset) => {
    setCurrentTheme(preset)
    applyGlobalTheme(preset)
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useGlobalTheme() {
  return useContext(ThemeContext)
}

/**
 * Global Theme Selector HUD Widget
 */
export function GlobalThemeSelector({ className = '' }: { className?: string }) {
  const { currentTheme, setTheme } = useGlobalTheme()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={`relative flex items-center ${className}`}>
      {/* Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white font-mono text-[10px] tracking-widest uppercase transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.06] cursor-pointer"
        title={`Theme Color: ${currentTheme.name}`}
        aria-label="Select Theme Color"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shadow-sm transition-all duration-500"
          style={{
            backgroundColor: currentTheme.color,
            boxShadow: `0 0 10px ${currentTheme.color}`,
          }}
        />
        <span className="hidden sm:inline">THEME</span>
      </button>

      {/* Popover Swatches */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 p-2 rounded-xl border border-white/15 bg-[#0a0c10]/95 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] z-50 flex items-center gap-1.5 animate-in fade-in duration-200">
          {THEME_PRESETS.map((preset) => {
            const isSelected = preset.id === currentTheme.id
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setTheme(preset)
                  setIsOpen(false)
                }}
                className="group relative w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-120 focus:outline-none cursor-pointer"
                title={`${preset.name} (${preset.color})`}
                aria-label={`Switch to ${preset.name}`}
              >
                <span
                  className={`w-4 h-4 rounded-full transition-transform duration-300 ${
                    isSelected ? 'scale-125 ring-2 ring-white/90 ring-offset-2 ring-offset-black' : 'group-hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: preset.color,
                    boxShadow: isSelected ? `0 0 12px ${preset.color}` : undefined,
                  }}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
