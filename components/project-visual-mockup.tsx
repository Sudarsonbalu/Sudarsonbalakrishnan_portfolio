'use client'

import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  Flame,
  Globe,
  Lock,
  Play,
  RefreshCw,
  Server,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'

export default function ProjectVisualMockup({ slug }: { slug: string }) {
  const [activeTab, setActiveTab] = useState<'console' | 'telemetry' | 'schema'>('console')

  if (slug === 'medi-nexus') {
    return (
      <div className="rounded-xl bg-[#090a0e] border border-white/10 overflow-hidden font-mono text-xs">
        {/* Terminal Title Bar */}
        <div className="px-4 py-3 bg-[#111218] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff1e38]/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-white/20 inline-block" />
            <span className="w-3 h-3 rounded-full bg-white/20 inline-block" />
            <span className="ml-2 text-neutral-300 font-bold text-[11px]">
              MEDI-NEXUS // CLINICAL AI TRIAGE &amp; FASTAPI DISPATCHER
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-neutral-400">
            <span className="flex items-center gap-1 text-[#ff1e38]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-pulse" />
              LIVE TELEMETRY
            </span>
            <span>API LATENCY: 14ms</span>
          </div>
        </div>

        {/* Inner Content */}
        <div className="p-6 space-y-6">
          {/* Top Status Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">AUTH STATUS</div>
              <div className="text-[#ff1e38] font-bold mt-1 flex items-center gap-1.5">
                <Lock size={12} /> JWT VERIFIED
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">INFERENCE MODEL</div>
              <div className="text-white font-bold mt-1 flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#ff1e38]" /> GEMINI 1.5 PRO
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">DATABASE STORE</div>
              <div className="text-white font-bold mt-1 flex items-center gap-1.5">
                <Database size={12} className="text-[#ff1e38]" /> MYSQL 8.0 RELATIONAL
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">QUEUE STATUS</div>
              <div className="text-[#ff1e38] font-bold mt-1 flex items-center gap-1.5">
                <Activity size={12} /> 04 IN TRIAGE
              </div>
            </div>
          </div>

          {/* Simulated Inference Stream */}
          <div className="p-4 rounded-lg bg-black/80 border border-white/10 space-y-2">
            <div className="text-[10px] text-neutral-500 flex items-center justify-between pb-2 border-b border-white/5">
              <span>POST /api/v1/clinical/triage-analysis</span>
              <span className="text-[#ff1e38]">HTTP 200 OK · 14.2ms</span>
            </div>
            <div className="text-neutral-400 text-[11px] leading-relaxed">
              <span className="text-[#ff1e38]">&gt; Input Symptom Payload:</span> {`{"patient_id": "PT-9421", "chief_complaint": "Persistent cephalalgia, photophobia, mild nausea", "duration": "48h"}`}
            </div>
            <div className="text-neutral-200 text-[11px] leading-relaxed pt-2 border-t border-white/5">
              <span className="text-[#ff1e38]">&gt; Gemini AI Diagnostic Output:</span> &quot;Triage severity: Semi-Urgent (Level 3). Differential highlights migraine with aura vs tension cluster. Recommending immediate resting in darkened room, vital signs stabilization, and physician consult scheduling.&quot;
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (slug === 'codeguardian') {
    return (
      <div className="rounded-xl bg-[#090a0e] border border-white/10 overflow-hidden font-mono text-xs">
        {/* Terminal Title Bar */}
        <div className="px-4 py-3 bg-[#111218] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff1e38]/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-white/20 inline-block" />
            <span className="w-3 h-3 rounded-full bg-white/20 inline-block" />
            <span className="ml-2 text-neutral-300 font-bold text-[11px]">
              CODEGUARDIAN // AST VULNERABILITY DETECTOR &amp; OPENAI REMEDIATOR
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-neutral-400">
            <span className="flex items-center gap-1 text-[#ff1e38]">
              <Shield size={12} /> SCAN COMPLETE
            </span>
            <span>POSTGRESQL INDEXED</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">REPO TELEMETRY</div>
              <div className="text-white font-bold mt-1 flex items-center gap-1.5">
                GITHUB REST API v3
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">FILES INDEXED</div>
              <div className="text-white font-bold mt-1">128 MODULES</div>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">VULNERABILITIES</div>
              <div className="text-[#ff1e38] font-bold mt-1 flex items-center gap-1.5">
                <AlertTriangle size={12} /> 01 CRITICAL CWE
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">AI REMEDIATION</div>
              <div className="text-[#ff1e38] font-bold mt-1 flex items-center gap-1.5">
                <CheckCircle2 size={12} /> PATCH READY
              </div>
            </div>
          </div>

          {/* Automated Remediation Diff View */}
          <div className="p-4 rounded-lg bg-black/90 border border-white/10 font-mono text-[11px] space-y-2">
            <div className="text-neutral-500 flex items-center justify-between pb-2 border-b border-white/5">
              <span>PATCH DIFF: src/services/auth_repository.py</span>
              <span className="text-[#ff1e38]">CWE-89 SQL INJECTION FIX</span>
            </div>
            <div className="bg-red-950/40 text-red-300 px-3 py-1.5 rounded border border-red-900/40">
              - query = f&quot;SELECT * FROM accounts WHERE email = &apos;{`{email}`}&apos;&quot;
            </div>
            <div className="bg-emerald-950/40 text-emerald-300 px-3 py-1.5 rounded border border-emerald-900/40">
              + query = &quot;SELECT * FROM accounts WHERE email = %s&quot;
              <br />
              + cursor.execute(query, (email,))
            </div>
            <div className="text-neutral-400 text-[10px] pt-1">
              &gt; OpenAI API generated remediation in 1.4s · Safe parameterized query implemented.
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (slug === 'turbofan-rul') {
    return (
      <div className="rounded-xl bg-[#090a0e] border border-white/10 overflow-hidden font-mono text-xs">
        {/* Title Bar */}
        <div className="px-4 py-3 bg-[#111218] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff1e38]/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-white/20 inline-block" />
            <span className="w-3 h-3 rounded-full bg-white/20 inline-block" />
            <span className="ml-2 text-neutral-300 font-bold text-[11px]">
              TURBOFAN RUL // NASA C-MAPSS PREDICTIVE MAINTENANCE TELEMETRY
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-neutral-400">
            <span className="flex items-center gap-1 text-[#ff1e38]">
              <Flame size={12} /> ENGINE UNIT #04
            </span>
            <span>21 SENSORS ONLINE</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">TOTAL CYCLES RUN</div>
              <div className="text-white font-bold mt-1">206 FLIGHT CYCLES</div>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">PREDICTED RUL</div>
              <div className="text-[#ff1e38] font-bold mt-1 flex items-center gap-1.5">
                <Zap size={12} /> 46 CYCLES REMAINING
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">REGRESSION R² SCORE</div>
              <div className="text-white font-bold mt-1">0.942 ACCURACY</div>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">HEALTH INDICATOR</div>
              <div className="text-[#ff1e38] font-bold mt-1">DEGRADATION DETECTED</div>
            </div>
          </div>

          {/* Sensor Telemetry Stream */}
          <div className="p-4 rounded-lg bg-black/90 border border-white/10 font-mono text-[11px] space-y-3">
            <div className="text-neutral-500 flex items-center justify-between pb-2 border-b border-white/5">
              <span>REAL-TIME SENSOR STREAM (C-MAPSS SUBSET FD001)</span>
              <span className="text-[#ff1e38]">HEALTH STATUS: MONITORING</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
              <div className="p-2 rounded bg-white/5 border border-white/5">
                <span className="text-neutral-500">T24 (LPC Temp):</span> <span className="text-white">642.8 °R</span>
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/5">
                <span className="text-neutral-500">T30 (HPC Temp):</span> <span className="text-white">1589.4 °R</span>
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/5">
                <span className="text-neutral-500">P30 (HPC Pres):</span> <span className="text-white">553.2 psia</span>
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/5">
                <span className="text-neutral-500">Nf (Fan Speed):</span> <span className="text-white">2388.1 rpm</span>
              </div>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-3">
              <div className="bg-[#ff1e38] h-full rounded-full" style={{ width: '78%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>Cycle 0 (Baseline Healthy)</span>
              <span className="text-[#ff1e38] font-bold">Current Cycle: 206 (78% Depleted)</span>
              <span>Failure Threshold (252)</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (slug === 'thekamalai-transports') {
    return (
      <div className="rounded-xl bg-[#090a0e] border border-white/10 overflow-hidden font-mono text-xs">
        {/* Browser Title Bar */}
        <div className="px-4 py-3 bg-[#111218] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff1e38]/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-white/20 inline-block" />
            <span className="w-3 h-3 rounded-full bg-white/20 inline-block" />
            <span className="ml-4 px-3 py-1 bg-black/40 border border-white/10 rounded text-neutral-400 text-[10px] flex items-center gap-2">
              <Globe size={10} />
              thekkamalai-transports.vercel.app
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-neutral-400">
            <span className="flex items-center gap-1 text-[#ff1e38]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" /> LIVE WEBSITE
            </span>
            <span>HTML5 · CSS3 · JS</span>
          </div>
        </div>

        {/* Simulated Website Layout */}
        <div className="p-5 space-y-4">
          {/* Nav bar mockup */}
          <div className="flex items-center justify-between px-4 py-2 border border-white/8 bg-black/40 rounded">
            <span className="text-white font-bold text-[11px] tracking-widest uppercase">THEKKAMALAI TRANSPORTS</span>
            <div className="flex items-center gap-4 text-[10px] text-neutral-400">
              {['HOME','SERVICES','FLEET','CONTACT'].map(n => (
                <span key={n} className="hover:text-white transition-colors">{n}</span>
              ))}
            </div>
          </div>

          {/* Page sections status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">Frontend</div>
              <div className="text-white font-bold mt-1 text-[11px]">HTML5 + CSS3</div>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">Interactivity</div>
              <div className="text-[#ff1e38] font-bold mt-1 text-[11px]">JavaScript</div>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">Backend</div>
              <div className="text-white font-bold mt-1 text-[11px]">PHP</div>
            </div>
            <div className="p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[10px] text-neutral-500 uppercase">Database</div>
              <div className="text-[#ff1e38] font-bold mt-1 text-[11px]">MySQL</div>
            </div>
          </div>

          {/* Enquiry form mockup */}
          <div className="p-4 rounded-lg bg-black/80 border border-white/10 space-y-2">
            <div className="text-neutral-500 flex items-center justify-between pb-2 border-b border-white/5">
              <span>ENQUIRY FORM — PHP FORM PROCESSOR</span>
              <span className="text-[#ff1e38]">HTTP 200 OK · MYSQL STORED</span>
            </div>
            <div className="text-neutral-400 text-[11px] leading-relaxed">
              <span className="text-[#ff1e38]">&gt; POST /enquiry.php</span>{' '}
              {'{ name: "Client Name", route: "Trichy → Chennai", contact: "+91 XXXXXXXXXX" }'}
            </div>
            <div className="text-neutral-200 text-[11px] pt-1 border-t border-white/5">
              <span className="text-[#ff1e38]">&gt; Response:</span>{' '}
              Enquiry stored to MySQL. Confirmation email dispatched. Transport team notified.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ibpfm-mission (default)
  return (
    <div className="rounded-xl bg-[#090a0e] border border-white/10 overflow-hidden font-mono text-xs">
      {/* Title Bar */}
      <div className="px-4 py-3 bg-[#111218] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff1e38]/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-white/20 inline-block" />
          <span className="w-3 h-3 rounded-full bg-white/20 inline-block" />
          <span className="ml-2 text-neutral-300 font-bold text-[11px]">
            IBPFM // ENVIRONMENTAL POLLUTION HEATMAP &amp; GEMINI WASTE ADVISOR
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-neutral-400">
          <span className="flex items-center gap-1 text-[#ff1e38]">
            <Globe size={12} /> SPATIAL HEATMAP ACTIVE
          </span>
          <span>PHP + MYSQL BACKEND</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-black/50 border border-white/5">
            <div className="text-[10px] text-neutral-500 uppercase">MONITORING ZONE</div>
            <div className="text-white font-bold mt-1">TIRUCHIRAPPALLI</div>
          </div>
          <div className="p-3 rounded-lg bg-black/50 border border-white/5">
            <div className="text-[10px] text-neutral-500 uppercase">AIR QUALITY (AQI)</div>
            <div className="text-[#ff1e38] font-bold mt-1 flex items-center gap-1.5">
              AQI 72 (MODERATE)
            </div>
          </div>
          <div className="p-3 rounded-lg bg-black/50 border border-white/5">
            <div className="text-[10px] text-neutral-500 uppercase">COMMUNITY REPORTS</div>
            <div className="text-white font-bold mt-1">142 HOTSPOTS</div>
          </div>
          <div className="p-3 rounded-lg bg-black/50 border border-white/5">
            <div className="text-[10px] text-neutral-500 uppercase">REWARDS LOGGED</div>
            <div className="text-[#ff1e38] font-bold mt-1">+3,400 CREDITS</div>
          </div>
        </div>

        {/* Gemini Waste Classification Feed */}
        <div className="p-4 rounded-lg bg-black/90 border border-white/10 font-mono text-[11px] space-y-2">
          <div className="text-neutral-500 flex items-center justify-between pb-2 border-b border-white/5">
            <span>GEMINI AI WASTE RECOGNITION PIPELINE</span>
            <span className="text-[#ff1e38]">ACCURACY: 98.6%</span>
          </div>
          <div className="text-neutral-400 text-[11px] leading-relaxed">
            <span className="text-[#ff1e38]">&gt; Image Sensor Classification:</span> &quot;Item detected: Polyethylene Terephthalate (PET 1) Beverage Container. Destination: Yellow Bin (Recyclable Dry Plastic). Degradation period without processing: ~450 years.&quot;
          </div>
          <div className="text-neutral-200 text-[11px] pt-1">
            <span className="text-[#ff1e38]">&gt; Civic Transaction:</span> User rewarded with 50 eco-points recorded to MySQL transactional log. Heatmap updated with hotspot reduction.
          </div>
        </div>
      </div>
    </div>
  )
}
