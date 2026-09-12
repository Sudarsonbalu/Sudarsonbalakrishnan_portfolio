'use client'

import React, { useEffect, useRef, useState } from 'react'

// ============================================================================
// AUTHENTIC RECOGNIZABLE TECHNOLOGY LOGOS (SVG Vector Paths)
// Grayscale by default, transitions to current theme color on hover
// ============================================================================

function TechLogo({ id, className = 'w-5 h-5' }: { id: string; className?: string }) {
  switch (id) {
    // 01 Python
    case 'python':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.006 2.752h5.81v.825H3.88S0 5.769 0 11.908c0 6.14 3.4 5.922 3.4 5.922h2.03v-2.853s-.11-3.4 3.344-3.4h5.753v-.85H8.72s-3.32.063-3.32-3.266c0-3.33 2.91-3.23 2.91-3.23h7.24s2.85.03 2.85 2.82v2.22h-1.68V7.55s0-1.64-1.66-1.64h-3.13zm-2.07 1.63a.89.89 0 1 1 0 1.78.89.89 0 0 1 0-1.78zM12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.006-2.752h-5.81v-.825h8.136S24 18.231 24 12.092c0-6.14-3.4-5.922-3.4-5.922h-2.03v2.853s.11 3.4-3.344 3.4H9.473v.85h5.807s3.32-.063 3.32 3.266c0 3.33-2.91 3.23-2.91 3.23H8.45s-2.85-.03-2.85-2.82v-2.22h1.68v2.721s0 1.64 1.66 1.64h3.13zm2.07-1.63a.89.89 0 1 1 0-1.78.89.89 0 0 1 0 1.78z" />
        </svg>
      )

    // Scikit-learn
    case 'scikit-learn':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <circle cx="7" cy="7" r="3.5" fill="currentColor" fillOpacity="0.2" />
          <circle cx="17" cy="17" r="3.5" fill="currentColor" fillOpacity="0.2" />
          <circle cx="17" cy="7" r="2.5" />
          <path d="M9.5 9.5l5 5M9.5 7h5M17 9.5v5" strokeLinecap="round" />
        </svg>
      )

    // OpenCV
    case 'opencv':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <circle cx="12" cy="7" r="4" strokeLinecap="round" />
          <circle cx="6.5" cy="16.5" r="4" strokeLinecap="round" />
          <circle cx="17.5" cy="16.5" r="4" strokeLinecap="round" />
          <circle cx="12" cy="7" r="1.5" fill="currentColor" />
          <circle cx="6.5" cy="16.5" r="1.5" fill="currentColor" />
          <circle cx="17.5" cy="16.5" r="1.5" fill="currentColor" />
        </svg>
      )

    // Gemini API
    case 'gemini':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
        </svg>
      )

    // OpenAI API
    case 'openai':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M22.28 9.37a5.998 5.998 0 0 0-.51-4.88 6.07 6.07 0 0 0-6.52-2.86 6.05 6.05 0 0 0-4.68-2.12c-3.1 0-5.69 2.33-6.04 5.39a6.002 6.002 0 0 0-4.01 2.92 6.05 6.05 0 0 0 .74 7.11 6.03 6.03 0 0 0 .51 4.88 6.07 6.07 0 0 0 6.52 2.86 6.07 6.07 0 0 0 4.68 2.13c3.1 0 5.69-2.33 6.04-5.39a6.002 6.002 0 0 0 4.01-2.92 6.05 6.05 0 0 0-.74-7.12zm-8.87 12.44a4.34 4.34 0 0 1-2.87-1.07l.14-.08 4.77-2.76a.88.88 0 0 0 .44-.76v-6.73l2.02 1.17a.08.08 0 0 1 .04.06v5.59a4.37 4.37 0 0 1-4.54 4.58zm-7.79-4.08a4.34 4.34 0 0 1-.53-3.03l.14.09 4.77 2.76c.27.16.44.44.44.75v3.37L8.4 20.5a4.36 4.36 0 0 1-2.78-2.77zm-1.8-8.9a4.35 4.35 0 0 1 2.34-1.96v5.7a.89.89 0 0 0 .44.76l4.77 2.76-2.02 1.17a.08.08 0 0 1-.08 0l-4.84-2.8a4.37 4.37 0 0 1-.61-5.63zm13.1 2.92l-4.77-2.76a.89.89 0 0 0-.88 0L6.44 10.3l-2.02-1.17a.09.09 0 0 1-.04-.07 4.37 4.37 0 0 1 7.41-2.65l.12.07v5.52l2.02-1.17a.86.86 0 0 0 .44-.76zm2.46 6.64a4.34 4.34 0 0 1-.53 3.03l-.14-.09-4.77-2.76a.88.88 0 0 0-.44-.75V7.47l2.02-1.17a.08.08 0 0 1 .08 0l4.84 2.8a4.37 4.37 0 0 1 .61 5.63l-.04.06zm-6.76-1.52l-2.76-1.6 2.76-1.6 2.76 1.6-2.76 1.6z" />
        </svg>
      )

    // OpenRouter
    case 'openrouter':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <circle cx="4" cy="12" r="2" />
          <circle cx="20" cy="12" r="2" />
          <circle cx="12" cy="4" r="2" />
          <circle cx="12" cy="20" r="2" />
          <path d="M6 12h3m6 0h3M12 6v3m0 6v3" strokeLinecap="round" />
        </svg>
      )

    // 02 React
    case 'react':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
        </svg>
      )

    // Next.js
    case 'nextjs':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.666 17.518l-6.84-8.878v8.878H9.333V6.482h1.667l6.833 8.87v-8.87h1.493v11.036h-1.66z" />
        </svg>
      )

    // FastAPI
    case 'fastapi':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.92 4.41h4.16l-4.7 6.72h3.48L6.46 19.59l2.76-7.17H6.55l4.53-8.01z" />
        </svg>
      )

    // HTML5
    case 'html5':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M1.5 0h21l-1.91 21.463L11.977 24l-8.564-2.537L1.5 0zm17.09 5.82H5.41l.36 4.09h11.23l-.43 4.88-4.57 1.24-4.57-1.24-.29-3.27H4.3l.53 6.01 7.17 1.99 7.17-1.99.98-10.71H7.8l-.2-2.27h11.19l.2-2.73z" />
        </svg>
      )

    // CSS3
    case 'css3':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M1.5 0h21l-1.91 21.463L11.977 24l-8.564-2.537L1.5 0zm16.92 5.82H5.58l.3 3.41h10.65l-.33 3.68-4.2 1.15-4.2-1.15-.22-2.5H4.8l.43 4.88 6.77 1.88 6.77-1.88.85-9.49H7.6l-.16-1.85h11.18l.2-2.73z" />
        </svg>
      )

    // JavaScript
    case 'javascript':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.017-.892-1.742-2.184-2.267l-.702-.288c-.538-.222-.81-.43-.81-.78 0-.397.31-.678.847-.678.537 0 .866.24.996.678l1.492-.619c-.31-.83-.996-1.408-2.488-1.408-1.733 0-2.613.985-2.613 2.185 0 1.05.69 1.677 1.954 2.176l.666.275c.618.257.944.526.944.912 0 .438-.397.74-1.077.74-.753 0-1.196-.407-1.39-1.002l-1.542.59c.27 1.08 1.11 1.764 2.932 1.764 1.88 0 2.76-.944 2.76-2.278h.001zm-7.618-5.32h-1.758v6.793c0 1.026-.454 1.488-1.353 1.488-.33 0-.698-.073-.89-.16l-.28 1.34c.28.12.75.19 1.25.19 1.89 0 2.98-1.01 2.98-2.85v-6.8h.05z" />
        </svg>
      )

    // REST APIs
    case 'rest-api':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="3" />
          <path d="M6 12h4m4-3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )

    // 03 Java
    case 'java':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M8.85 16.84s-.8-1.08 1.44-1.41c2.72-.4 4.09.43 5.4 1.11 1.62.83 2.79.46 2.79.46s-.94.75-2.58.75c-2.48 0-4.63-.91-7.05-.91zm-1.05 2.53s-1.08-.82 1.01-1.32c2.7-.65 5.56.09 7.64.95.88.37 1.57.44 1.57.44s-.91.56-2.12.56c-2.19 0-4.88-.63-8.1-.63zm6.6-8.9c.79.88.42 1.94-.48 2.92-1.09 1.18-1.63 1.99-.4 3.01-2.18-.74-2.84-2.07-1.92-3.15 1.14-1.35 1.87-1.89 2.8-2.78zm3.17 10.36c-1.78.36-4.22.47-6.9.47-3.69 0-6.72-.85-6.72-1.9 0-.82 1.88-1.53 4.67-1.78-.66.39-.77.83-.24 1.15 1.48.91 4.79.86 6.84.44.82-.17 1.46-.38 1.89-.62.53.86-.33 1.93-.54 2.24zm3.33-4.52s.95-1.94-1.28-3.05c-.88-.44-2.09-.59-3.23-.62.56-.63 1.25-1.59 1.17-2.61-.09-1.2-1.12-2.16-2.22-2.65 0 0 .57.48.33 1.14-.28.79-1.14 1.23-1.8 1.85-1.15 1.08-1.38 2.45-.63 3.73-1.69.17-3.08.79-3.56 1.83-.58 1.25.17 2.37 1.57 2.76-1.59.39-2.9 1.28-2.9 2.41 0 1.92 3.82 3.04 8.7 3.04 3.65 0 7.37-.62 7.74-2.58.33-1.76-1.52-2.67-3.89-2.96 1.12-.41 1.99-1.29 2-2.29z" />
        </svg>
      )

    // TypeScript
    case 'typescript':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.017-.892-1.742-2.184-2.267l-.702-.288c-.538-.222-.81-.43-.81-.78 0-.397.31-.678.847-.678.537 0 .866.24.996.678l1.492-.619c-.31-.83-.996-1.408-2.488-1.408-1.733 0-2.613.985-2.613 2.185 0 1.05.69 1.677 1.954 2.176l.666.275c.618.257.944.526.944.912 0 .438-.397.74-1.077.74-.753 0-1.196-.407-1.39-1.002l-1.542.59c.27 1.08 1.11 1.764 2.932 1.764 1.88 0 2.76-.944 2.76-2.278h.001zm-9.5-5.32H6.94v1.54h2.24v6.8h1.64v-6.8h2.24v-1.54h-.53z" />
        </svg>
      )

    // PHP
    case 'php':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-7.6 15.6l1.2-6.4h2.6c1.4 0 2.2.8 2 2-.3 1.5-1.5 2.2-2.9 2.2h-1.4l-.5 2.2H4.4zm6.6 0l1.2-6.4h1.6l-.3 1.8h.1c.6-1.3 1.8-2 3-2 1.5 0 2.1.9 1.9 2.3l-.8 4.3h-1.6l.8-4.2c.1-.7-.2-1.1-.9-1.1-.9 0-1.6.8-1.8 1.8l-.7 3.5H11zm-5.3-4.8h1c.8 0 1.4-.4 1.6-1.1.1-.6-.2-1-.9-1h-1.1l-.6 2.1z" />
        </svg>
      )

    // SQL
    case 'sql':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 5v7c0 1.66-4.03 3-9 3s-9-1.34-9-3V5" />
          <path d="M21 12v7c0 1.66-4.03 3-9 3s-9-1.34-9-3v-7" />
          <path d="M8 12h8" strokeLinecap="round" strokeDasharray="2 3" />
        </svg>
      )

    // 04 PostgreSQL
    case 'postgresql':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12.01 0C5.37 0 0 5.37 0 12.01c0 5.09 3.17 9.44 7.68 11.16-.1-.78-.18-1.98.04-2.83.2-.82 1.34-5.69 1.34-5.69s-.34-.69-.34-1.7c0-1.6 1.02-2.79 2.28-2.79 1.07 0 1.59.81 1.59 1.78 0 1.08-.69 2.7-1.04 4.2-.3 1.27.63 2.3 1.88 2.3 2.26 0 3.99-2.39 3.99-5.83 0-3.05-2.19-5.18-5.32-5.18-3.63 0-5.76 2.72-5.76 5.53 0 1.1.42 2.27.95 2.91.1.13.12.24.09.37-.1.4-.32 1.31-.36 1.49-.06.24-.19.29-.44.17-1.66-.77-2.69-3.2-2.69-5.15 0-4.19 3.05-8.04 8.79-8.04 4.62 0 8.2 3.29 8.2 7.68 0 4.58-2.89 8.28-6.9 8.28-1.35 0-2.61-.7-3.05-1.53l-.83 3.17c-.3 1.15-1.12 2.6-1.67 3.49C9.8 23.82 10.89 24 12.01 24c6.63 0 12.01-5.37 12.01-12.01C24.02 5.37 18.64 0 12.01 0z" />
        </svg>
      )

    // MySQL
    case 'mysql':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <path d="M3 17c3-5 7-8 13-7 3 .5 5 2.5 5 4s-2 3-5 3c-5 0-8-4-10-4" strokeLinecap="round" />
          <path d="M14 7c1-2 3-3 5-3-1 2-1 4-2 6" strokeLinecap="round" />
          <circle cx="8" cy="15" r="1.5" fill="currentColor" />
          <path d="M3 17v4m4-3v3m4-3v3" strokeLinecap="round" />
        </svg>
      )

    // 05 ServiceNow
    case 'servicenow':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm0 3.3a8.7 8.7 0 1 1-8.7 8.7A8.7 8.7 0 0 1 12 3.3zm0 3.4a5.3 5.3 0 1 0 5.3 5.3A5.3 5.3 0 0 0 12 6.7z" />
        </svg>
      )

    // Git
    case 'git':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M23.546 10.93L13.067.452a1.503 1.503 0 0 0-2.126 0L8.835 2.56l3.056 3.056a1.782 1.782 0 0 1 2.253 2.264l3.064 3.063a1.776 1.776 0 0 1 2.164 2.22l3.414 3.414a.488.488 0 0 0 .69 0l.07-.07a1.503 1.503 0 0 0 0-2.126l-2.07-2.07zM9.49 14.51a1.784 1.784 0 0 1-2.264-2.253L4.17 9.193a1.782 1.782 0 0 1-2.22-2.164L.452 8.526a1.503 1.503 0 0 0 0 2.126l10.48 10.48a1.503 1.503 0 0 0 2.126 0l2.106-2.107-3.056-3.056a1.78 1.78 0 0 1-2.618-1.46z" />
        </svg>
      )

    // GitHub
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      )

    // Vercel
    case 'vercel':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 1L24 22H0L12 1Z" />
        </svg>
      )

    // Netlify
    case 'netlify':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M17.065 8.91l-4.27 4.27 2.13 6.4 6.4-6.4-4.26-4.27zM6.935 8.91l-4.27 4.27 6.4 6.4 2.13-6.4-4.26-4.27zM12 1.5L7.73 5.77h8.54L12 1.5zm0 16.03l-2.13 2.13 2.13 2.84 2.13-2.84-2.13-2.13z" />
        </svg>
      )

    // 06 Pandas
    case 'pandas':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <rect x="2" y="3" width="5" height="18" rx="1.5" />
          <rect x="9.5" y="7" width="5" height="14" rx="1.5" />
          <rect x="17" y="11" width="5" height="10" rx="1.5" />
        </svg>
      )

    // NumPy
    case 'numpy':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 8v8l8-8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )

    // Matplotlib
    case 'matplotlib':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <path d="M3 3v18h18" strokeLinecap="round" />
          <path d="M7 16l4-8 4 5 5-9" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="16" r="1.5" fill="currentColor" />
          <circle cx="11" cy="8" r="1.5" fill="currentColor" />
          <circle cx="15" cy="13" r="1.5" fill="currentColor" />
          <circle cx="20" cy="4" r="1.5" fill="currentColor" />
        </svg>
      )

    // Power BI
    case 'powerbi':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <rect x="3" y="13" width="4" height="8" rx="1" />
          <rect x="10" y="8" width="4" height="13" rx="1" />
          <rect x="17" y="3" width="4" height="18" rx="1" />
        </svg>
      )

    // Predictive Analytics / RUL
    case 'analytics':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <path d="M3 20h18M4 15s3-7 7-7 4 5 9 1" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 9h4v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )

    // 07 VS Code
    case 'vscode':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M23.15 2.587L18.21.21a1.49 1.49 0 0 0-1.7.32l-9.84 8.94L3.1 6.85a.99.99 0 0 0-1.29.13L.26 8.53a.99.99 0 0 0 0 1.41L4.85 14 .26 18.06a.99.99 0 0 0 0 1.41l1.55 1.55c.38.38.98.43 1.29.13l3.57-2.62 9.84 8.94c.48.44 1.18.56 1.7.32l4.94-2.38c.55-.26.9-.82.9-1.43V4.02c0-.61-.35-1.17-.9-1.43zM18 17.65l-6.9-5.65L18 6.35v11.3z" />
        </svg>
      )

    // Jupyter Notebook
    case 'jupyter':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 3.2c-4.4 0-8.2 2-9.6 4.9 1.4 1 3.2 1.6 5.1 1.6 4.3 0 7.8-2.6 8.9-6.2-.8-.2-1.6-.3-2.4-.3h-2zm-2.4 17.6c-4.3 0-7.8-2.6-8.9-6.2.8-.2 1.6-.3 2.4-.3h2c4.4 0 8.2 2 9.6 4.9-1.4 1-3.2 1.6-5.1 1.6zm10.8-7.8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-16.8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
        </svg>
      )

    // Cursor AI
    case 'cursor':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <path d="M4 4l16 7.5-7.5 2.5-2.5 7.5L4 4z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )

    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
      )
  }
}

// ============================================================================
// SUBTLE CATEGORY TECHNICAL GRAPHICS (Minimalist SVG Wireframes)
// No 3D, no floating particles, purely editorial outline aesthetics
// ============================================================================

function CategoryTechnicalGraphic({ categoryId }: { categoryId: string }) {
  switch (categoryId) {
    // 01 AI & ML: Minimal neural node connection diagram
    case 'ai-ml':
      return (
        <svg
          viewBox="0 0 120 40"
          className="w-28 h-9 text-neutral-600 group-hover:text-[var(--theme-color)] transition-colors duration-500 opacity-60 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          {/* Input Nodes */}
          <circle cx="12" cy="10" r="3.5" fill="currentColor" fillOpacity="0.15" />
          <circle cx="12" cy="30" r="3.5" fill="currentColor" fillOpacity="0.15" />
          {/* Hidden Core */}
          <circle cx="60" cy="20" r="4.5" fill="currentColor" fillOpacity="0.25" />
          {/* Output Nodes */}
          <circle cx="108" cy="10" r="3.5" fill="currentColor" fillOpacity="0.15" />
          <circle cx="108" cy="30" r="3.5" fill="currentColor" fillOpacity="0.15" />
          {/* Connections */}
          <line x1="15.5" y1="10" x2="55.5" y2="20" strokeDasharray="2 2" />
          <line x1="15.5" y1="30" x2="55.5" y2="20" strokeDasharray="2 2" />
          <line x1="64.5" y1="20" x2="104.5" y2="10" strokeDasharray="2 2" />
          <line x1="64.5" y1="20" x2="104.5" y2="30" strokeDasharray="2 2" />
        </svg>
      )

    // 02 WEB: Minimal browser window wireframe
    case 'web-dev':
      return (
        <svg
          viewBox="0 0 120 40"
          className="w-28 h-9 text-neutral-600 group-hover:text-[var(--theme-color)] transition-colors duration-500 opacity-60 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <rect x="10" y="5" width="100" height="30" rx="3" />
          <line x1="10" y1="14" x2="110" y2="14" />
          <circle cx="18" cy="9.5" r="1.5" fill="currentColor" />
          <circle cx="24" cy="9.5" r="1.5" fill="currentColor" />
          <circle cx="30" cy="9.5" r="1.5" fill="currentColor" />
          <rect x="42" y="7.5" width="56" height="4" rx="1" strokeDasharray="1 1" />
          <line x1="20" y1="22" x2="55" y2="22" />
          <line x1="20" y1="27" x2="45" y2="27" />
        </svg>
      )

    // 03 PROGRAMMING: Minimal terminal syntax outline
    case 'languages':
      return (
        <svg
          viewBox="0 0 120 40"
          className="w-28 h-9 text-neutral-600 group-hover:text-[var(--theme-color)] transition-colors duration-500 opacity-60 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M18 12l8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="32" y1="28" x2="52" y2="28" strokeLinecap="round" strokeWidth="2" />
          <path d="M78 12l-6 16m26-16l6 8-6 8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2" />
        </svg>
      )

    // 04 DATABASES: Minimal stacked database cylinders
    case 'databases':
      return (
        <svg
          viewBox="0 0 120 40"
          className="w-28 h-9 text-neutral-600 group-hover:text-[var(--theme-color)] transition-colors duration-500 opacity-60 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <ellipse cx="60" cy="10" rx="35" ry="5" />
          <path d="M25 10v10c0 2.76 15.67 5 35 5s35-2.24 35-5V10" />
          <path d="M25 20v10c0 2.76 15.67 5 35 5s35-2.24 35-5V20" />
          <line x1="45" y1="20" x2="75" y2="20" strokeDasharray="2 2" />
        </svg>
      )

    // 05 CLOUD & DEVOPS: Minimal network node infrastructure
    case 'cloud-devops':
      return (
        <svg
          viewBox="0 0 120 40"
          className="w-28 h-9 text-neutral-600 group-hover:text-[var(--theme-color)] transition-colors duration-500 opacity-60 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <rect x="15" y="8" width="22" height="12" rx="2" />
          <rect x="83" y="8" width="22" height="12" rx="2" />
          <rect x="49" y="22" width="22" height="12" rx="2" />
          <path d="M26 20v6h23m22 0h23V20" strokeLinecap="round" strokeDasharray="2 2" />
          <circle cx="26" cy="14" r="1.5" fill="currentColor" />
          <circle cx="94" cy="14" r="1.5" fill="currentColor" />
          <circle cx="60" cy="28" r="1.5" fill="currentColor" />
        </svg>
      )

    // 06 DATA & ANALYTICS: Minimal telemetry grid / trend vector
    case 'data-analytics':
      return (
        <svg
          viewBox="0 0 120 40"
          className="w-28 h-9 text-neutral-600 group-hover:text-[var(--theme-color)] transition-colors duration-500 opacity-60 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <line x1="15" y1="32" x2="105" y2="32" strokeLinecap="round" />
          <line x1="15" y1="8" x2="15" y2="32" strokeLinecap="round" />
          <path d="M20 28l22-12 20 6 24-14 14 5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="42" cy="16" r="2" fill="currentColor" />
          <circle cx="62" cy="22" r="2" fill="currentColor" />
          <circle cx="86" cy="8" r="2" fill="currentColor" />
        </svg>
      )

    // 07 TOOLS & PLATFORMS: Minimal chip / platform register module
    case 'tools-platforms':
      return (
        <svg
          viewBox="0 0 120 40"
          className="w-28 h-9 text-neutral-600 group-hover:text-[var(--theme-color)] transition-colors duration-500 opacity-60 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <rect x="42" y="8" width="36" height="24" rx="2" />
          <rect x="50" y="14" width="20" height="12" rx="1" fill="currentColor" fillOpacity="0.1" />
          <line x1="34" y1="14" x2="42" y2="14" />
          <line x1="34" y1="20" x2="42" y2="20" />
          <line x1="34" y1="26" x2="42" y2="26" />
          <line x1="78" y1="14" x2="86" y2="14" />
          <line x1="78" y1="20" x2="86" y2="20" />
          <line x1="78" y1="26" x2="86" y2="26" />
        </svg>
      )

    default:
      return null
  }
}

// ============================================================================
// VERIFIED DATA DEFINITION: EXCLUSIVELY SOURCED FROM RESUME
// ============================================================================

interface TechItem {
  id: string
  name: string
  role: string
}

interface TechCategory {
  id: string
  number: string
  title: string
  description: string
  items: TechItem[]
}

const TECH_CATEGORIES: TechCategory[] = [
  {
    id: 'ai-ml',
    number: '01',
    title: 'AI & MACHINE LEARNING',
    description: 'Predictive algorithms, computer vision pipelines, and production multimodal LLM intelligence.',
    items: [
      { id: 'python', name: 'Python', role: 'Primary AI/ML Engineering' },
      { id: 'scikit-learn', name: 'Scikit-learn', role: 'Predictive Modeling & Regressors' },
      { id: 'opencv', name: 'OpenCV', role: 'Computer Vision & Optical Filtering' },
      { id: 'gemini', name: 'Gemini API', role: 'Multimodal LLM Reasoning' },
      { id: 'openai', name: 'OpenAI API', role: 'Generative Intelligence' },
      { id: 'openrouter', name: 'OpenRouter', role: 'Unified AI Model Gateway' },
    ],
  },
  {
    id: 'web-dev',
    number: '02',
    title: 'WEB DEVELOPMENT',
    description: 'Stateless async microservices, reactive component architectures, and responsive clients.',
    items: [
      { id: 'react', name: 'React', role: 'Reactive Component Systems' },
      { id: 'nextjs', name: 'Next.js', role: 'Full-Stack React Framework' },
      { id: 'fastapi', name: 'FastAPI', role: 'High-Performance Async Backend' },
      { id: 'html5', name: 'HTML5', role: 'Semantic DOM Architecture' },
      { id: 'css3', name: 'CSS3', role: 'Tailwind & Responsive Grid' },
      { id: 'javascript', name: 'JavaScript', role: 'Dynamic Client Interactivity' },
      { id: 'rest-api', name: 'REST APIs', role: 'Stateless Endpoints & JWT' },
    ],
  },
  {
    id: 'languages',
    number: '03',
    title: 'PROGRAMMING LANGUAGES',
    description: 'System programming, strongly typed application logic, and relational query syntaxes.',
    items: [
      { id: 'python', name: 'Python', role: 'Core Scientific & Backend Logic' },
      { id: 'java', name: 'Java', role: 'Object-Oriented Architecture' },
      { id: 'javascript', name: 'JavaScript', role: 'Web Platform Scripting' },
      { id: 'typescript', name: 'TypeScript', role: 'Strict Type-Safe Engineering' },
      { id: 'php', name: 'PHP', role: 'Server-Side Web Processing' },
      { id: 'sql', name: 'SQL', role: 'Relational Data Querying' },
    ],
  },
  {
    id: 'databases',
    number: '04',
    title: 'DATABASES',
    description: 'Structured relational storage engines, schema design, and tuned index pipelines.',
    items: [
      { id: 'postgresql', name: 'PostgreSQL', role: 'Object-Relational Storage' },
      { id: 'mysql', name: 'MySQL', role: 'Transactional Relational Engine' },
      { id: 'sql', name: 'Relational Schemas', role: 'Query Optimization & Indexing' },
    ],
  },
  {
    id: 'cloud-devops',
    number: '05',
    title: 'CLOUD & DEVOPS',
    description: 'Enterprise workflow systems, distributed source management, and production cloud edge.',
    items: [
      { id: 'servicenow', name: 'ServiceNow', role: 'Enterprise Cloud Workflows (AICTE)' },
      { id: 'git', name: 'Git', role: 'Distributed Version Control' },
      { id: 'github', name: 'GitHub', role: 'Remote Repositories & CI Actions' },
      { id: 'vercel', name: 'Vercel', role: 'Production Edge Deployments' },
      { id: 'netlify', name: 'Netlify', role: 'Serverless Cloud Hosting' },
    ],
  },
  {
    id: 'data-analytics',
    number: '06',
    title: 'DATA & ANALYTICS',
    description: 'Sensor time-series wrangling, array computing, degradation analytics, and telemetry charts.',
    items: [
      { id: 'pandas', name: 'Pandas', role: 'DataFrame Manipulation & ETL' },
      { id: 'numpy', name: 'NumPy', role: 'High-Performance Matrix Computing' },
      { id: 'matplotlib', name: 'Matplotlib', role: 'Scientific Statistical Plotting' },
      { id: 'powerbi', name: 'Power BI', role: 'Business Intelligence Dashboards' },
      { id: 'analytics', name: 'Predictive Analytics', role: 'RUL Forecasting & Degradation' },
    ],
  },
  {
    id: 'tools-platforms',
    number: '07',
    title: 'TOOLS & PLATFORMS',
    description: 'Developer environments, interactive research notebooks, and verified enterprise suites.',
    items: [
      { id: 'vscode', name: 'VS Code', role: 'Primary Development Environment' },
      { id: 'jupyter', name: 'Jupyter Notebook', role: 'Interactive ML Experimentation' },
      { id: 'github', name: 'GitHub Collaboration', role: 'Code Review & Source Auditing' },
      { id: 'cursor', name: 'Cursor AI', role: 'AI-Accelerated Engineering' },
      { id: 'servicenow', name: 'ServiceNow ITSM', role: 'Platform Table & Flow Engine' },
    ],
  },
]

// ============================================================================
// COMPONENT: TECH ECOSYSTEM (Editorial Categorized Layout)
// ============================================================================

export default function TechEcosystem() {
  const [inView, setInView] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Check reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)

    // Viewport Intersection Observer
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )

    observer.observe(el)

    return () => {
      mq.removeEventListener('change', handler)
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="tech-ecosystem"
      aria-label="Categorized Technology Ecosystem"
      className="py-28 sm:py-36 px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto border-t border-white/10"
    >
      {/* ── Section Header ────────────────────────────────────────── */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between mb-20 sm:mb-28 gap-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: inView || reducedMotion ? 1 : 0,
          transform: inView || reducedMotion ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <div>
          <div
            className="font-mono text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2"
            style={{ color: 'var(--theme-color, #ff1e38)' }}
          >
            <span
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{ backgroundColor: 'var(--theme-color, #ff1e38)' }}
            />
            <span>02 // TECHNICAL ARSENAL</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white leading-none">
            WHAT <br />
            TECHNOLOGIES <br />
            <span className="text-neutral-400 font-light">
              I WORK WITH
              <span
                className="transition-colors duration-500 font-normal"
                style={{ color: 'var(--theme-color, #ff1e38)' }}
              >
                .
              </span>
            </span>
          </h2>
        </div>

        <div className="max-w-md">
          <p className="font-mono text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Languages, frameworks, database engines, and AI platforms deployed across practical production software, machine learning research, and cloud infrastructure.
          </p>
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10 font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
            <span>STRICT RESUME DATA</span>
            <span>·</span>
            <span>7 VERIFIED CATEGORIES</span>
          </div>
        </div>
      </div>

      {/* ── Categorized Technology System (Editorial Stack) ──────── */}
      <div className="space-y-16 sm:space-y-24">
        {TECH_CATEGORIES.map((category, catIdx) => {
          const isCategoryVisible = inView || reducedMotion
          const catDelay = reducedMotion ? 0 : catIdx * 90

          return (
            <article
              key={category.id}
              className="group/cat relative"
              style={{
                opacity: isCategoryVisible ? 1 : 0,
                transform: isCategoryVisible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${catDelay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${catDelay}ms`,
              }}
            >
              {/* Desktop: Asymmetrical 2-Column Editorial Grid (Left: Header + Wireframe, Right: Items) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* ── LEFT COLUMN: Category Telemetry & Title ── */}
                <div className="lg:col-span-4 flex flex-col justify-between self-stretch">
                  <div>
                    {/* Category Index Number */}
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span
                        className="font-mono text-xs font-bold tracking-[0.25em] transition-colors duration-300"
                        style={{ color: 'var(--theme-color, #ff1e38)' }}
                      >
                        CATEGORY {category.number}
                      </span>
                      {/* Active Indicator Dot */}
                      <span
                        className="w-1.5 h-1.5 rounded-full transition-all duration-300 opacity-60 group-hover/cat:opacity-100 group-hover/cat:scale-125"
                        style={{ backgroundColor: 'var(--theme-color, #ff1e38)' }}
                      />
                    </div>

                    {/* Category Title */}
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase group-hover/cat:text-neutral-100 transition-colors">
                      {category.title}
                    </h3>

                    {/* Category Context Description */}
                    <p className="font-mono text-xs text-neutral-400 mt-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Tiny Technical Wireframe Graphic (Subtle SVG detail) */}
                  <div className="mt-6 pt-4 border-t border-white/5 hidden sm:flex items-center justify-between">
                    <CategoryTechnicalGraphic categoryId={category.id} />
                    <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest">
                      {category.items.length} MODULES
                    </span>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: Editorial Technology Items ── */}
                <div className="lg:col-span-8 flex flex-col justify-start">
                  
                  {/* Category Top Divider Line (Draws left -> right on entrance) */}
                  <div className="relative w-full h-[1px] bg-white/10 mb-5 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
                      style={{
                        width: isCategoryVisible ? '100%' : '0%',
                        backgroundColor: 'var(--border-accent, rgba(255, 30, 56, 0.4))',
                        transitionDelay: `${catDelay + 100}ms`,
                      }}
                    />
                  </div>

                  {/* Technology Collection Rows (2-col grid for wide viewports, 1-col on mobile) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {category.items.map((tech, itemIdx) => {
                      const itemDelay = reducedMotion ? 0 : catDelay + 150 + itemIdx * 40
                      const itemIndexFormatted = String(itemIdx + 1).padStart(2, '0')

                      return (
                        <div
                          key={tech.id + tech.name}
                          style={{
                            opacity: isCategoryVisible ? 1 : 0,
                            transform: isCategoryVisible ? 'translateX(0)' : 'translateX(12px)',
                            transition: `opacity 0.45s cubic-bezier(0.16,1,0.3,1) ${itemDelay}ms, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${itemDelay}ms, border-color 0.25s ease, background-color 0.25s ease`,
                          }}
                          className="group/item relative flex items-center gap-4 px-4 py-3.5 rounded-lg border border-white/10 bg-[#0c0c0e] hover:bg-[#111217] hover:border-[var(--theme-color)] transition-all duration-200 cursor-default select-none overflow-hidden"
                        >
                          {/* Left Index Number */}
                          <span
                            className="font-mono text-[11px] font-bold text-neutral-500 group-hover/item:text-[var(--theme-color)] transition-colors duration-200 shrink-0 w-5"
                          >
                            {itemIndexFormatted}
                          </span>

                          {/* Technology Real Recognizable SVG Logo */}
                          <div className="w-8 h-8 rounded bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 text-neutral-300 group-hover/item:text-[var(--theme-color)] group-hover/item:border-[var(--theme-color)] transition-all duration-200 group-hover/item:scale-110">
                            <TechLogo id={tech.id} className="w-4 h-4 transition-transform duration-200" />
                          </div>

                          {/* Technology Name & Subtitle Role */}
                          <div className="min-w-0 flex-1 transition-transform duration-200 ease-out group-hover/item:translate-x-1.5">
                            <h4 className="font-display text-sm font-bold text-white group-hover/item:text-[var(--theme-color)] transition-colors duration-200 truncate leading-snug">
                              {tech.name}
                            </h4>
                            <p className="font-mono text-[10.5px] text-neutral-400 truncate tracking-wide">
                              {tech.role}
                            </p>
                          </div>

                          {/* Subtle Active Sheen Light on Hover */}
                          <div
                            className="pointer-events-none absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                            style={{
                              background: 'radial-gradient(circle at 90% 50%, var(--theme-dim, rgba(255,30,56,0.08)) 0%, transparent 70%)',
                            }}
                          />

                          {/* Bottom Hairline Highlight */}
                          <div
                            className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1.5px] w-0 group-hover/item:w-full transition-all duration-300 ease-out"
                            style={{ backgroundColor: 'var(--theme-color, #ff1e38)' }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
