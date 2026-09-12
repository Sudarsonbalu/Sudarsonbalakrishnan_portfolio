import type { Metadata, Viewport } from 'next'
import { Syne, JetBrains_Mono, Manrope } from 'next/font/google'
import Navigation from '../components/navigation'
import SquareScopeCursor from '../components/square-scope-cursor'
import Footer from '../components/footer'
import PageTransition from '../components/page-transition'
import WebsiteIntro from '../components/website-intro'
import { GlobalThemeProvider } from '../components/theme-provider'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'SUDARSON BALAKRISHNAN — AI & Data Science Engineer',
  description:
    'Portfolio of Sudarson Balakrishnan, Artificial Intelligence & Data Science Engineer. Machine learning architectures, predictive maintenance, computer vision, and full-stack systems.',
  keywords: [
    'Sudarson Balakrishnan',
    'AI Engineer',
    'Data Science',
    'FastAPI',
    'Machine Learning',
    'Next.js',
    'Computer Vision',
    'Predictive Maintenance',
  ],
  authors: [{ name: 'Sudarson Balakrishnan' }],
  creator: 'Sudarson Balakrishnan',
  openGraph: {
    title: 'SUDARSON BALAKRISHNAN — AI & Data Science Engineer',
    description: 'Engineering intelligent applications, machine learning architectures, and full-stack systems.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Sudarson Balakrishnan Portfolio',
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  verification: {
    google: 'google14a3ff345c9b5db9',
    other: {
      'google-site-verification': ['google14a3ff345c9b5db9', 'google14a3ff345c9b5db9.html'],
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#07080a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${mono.variable} ${manrope.variable}`}
    >
      <head>
        <meta name="google-site-verification" content="google14a3ff345c9b5db9" />
        <meta name="google-site-verification" content="google14a3ff345c9b5db9.html" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var s = localStorage.getItem('sb_global_theme_preset');
                if (s) {
                  var p = JSON.parse(s);
                  var r = document.documentElement;
                  if (p.color) {
                    r.style.setProperty('--theme-color', p.color);
                    r.style.setProperty('--accent', p.color);
                    r.style.setProperty('--accent-color', p.color);
                  }
                  if (p.rgb) {
                    r.style.setProperty('--theme-color-rgb', p.rgb);
                    r.style.setProperty('--theme-glow', 'rgba(' + p.rgb + ', 0.35)');
                    r.style.setProperty('--theme-dim', 'rgba(' + p.rgb + ', 0.12)');
                    r.style.setProperty('--border-accent', 'rgba(' + p.rgb + ', 0.45)');
                  }
                  if (p.hueRotate) {
                    r.style.setProperty('--theme-hue-rotate', p.hueRotate);
                  }
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className="bg-[#07080a] text-[#f5f5f7] min-h-screen relative selection:bg-[var(--theme-color,#ff1e38)] selection:text-black antialiased">
        <GlobalThemeProvider>
          {/* Cinematic Website Opening Intro (Session-based) */}
          <WebsiteIntro />

          {/* Premium Square Scope Target Cursor — all pages */}
          <SquareScopeCursor />

          {/* Persistent HUD Navigation */}
          <Navigation />

          {/* Page Content with Transition */}
          <main className="min-h-screen relative z-10 w-full">
            <PageTransition>{children}</PageTransition>
          </main>

          {/* Cinematic Shared Footer */}
          <Footer />
        </GlobalThemeProvider>
      </body>
    </html>
  )
}
