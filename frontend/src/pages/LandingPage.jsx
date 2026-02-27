import React, { useState } from 'react';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import { Shield, FileText, Zap, CheckCircle, ArrowRight, Users, Clock, Cpu } from 'lucide-react';

/* ─── Mesh grid background ─────────────────────────────────────────────────── */
function MeshGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="mesh" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFB347" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mesh)" />
    </svg>
  );
}

/* ─── Radial glow blobs ─────────────────────────────────────────────────────── */
function GlowBlobs() {
  return (
    <>
      {/* bottom-right warm glow */}
      <div
        className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,179,71,0.12) 0%, transparent 70%)',
        }}
      />
      {/* top-left cool glow */}
      <div
        className="absolute top-[-60px] left-[-60px] w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(3,78,52,0.5) 0%, transparent 70%)',
        }}
      />
    </>
  );
}

/* ─── Decorative ring arc (bottom-right) ───────────────────────────────────── */
function RingArc() {
  return (
    <svg
      className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.13] pointer-events-none"
      viewBox="0 0 256 256"
      fill="none"
    >
      {[120, 90, 60, 30].map((r, i) => (
        <circle key={i} cx="256" cy="256" r={r} stroke="#FFB347" strokeWidth="1.2" />
      ))}
    </svg>
  );
}

/* ─── Dot cluster (top-right) ──────────────────────────────────────────────── */
function DotCluster() {
  return (
    <svg
      className="absolute top-6 right-6 w-28 h-28 opacity-[0.12] pointer-events-none"
      viewBox="0 0 112 112"
    >
      {Array.from({ length: 6 }).flatMap((_, row) =>
        Array.from({ length: 6 }).map((__, col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * 20 + 6}
            cy={row * 20 + 6}
            r="2"
            fill="#FFB347"
          />
        ))
      )}
    </svg>
  );
}

/* ─── Stat badge ────────────────────────────────────────────────────────────── */
function StatBadge({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 sm:px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm hover:bg-white/[0.12] hover:border-white/25 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-200 cursor-default">
      <Icon className="w-4 h-4 text-lifewood-saffaron mb-0.5" />
      <span className="text-base sm:text-lg font-extrabold text-white leading-none">{value}</span>
      <span className="text-[10px] sm:text-[11px] text-white/60 uppercase tracking-wide font-medium">{label}</span>
    </div>
  );
}

/* ─── Feature card ──────────────────────────────────────────────────────────── */
function Feature({ icon: Icon, title, desc, accent }) {
  return (
    <div className="group flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.10] hover:border-lifewood-saffaron/30 hover:translate-x-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 cursor-default">
      <div
        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300"
        style={{ background: accent || 'rgba(255,179,71,0.15)' }}
      >
        <Icon className="w-4 h-4 text-lifewood-saffaron" />
      </div>
      <div className="min-w-0">
        <p className="text-base lg:text-lg font-semibold text-white/95 group-hover:text-white transition-colors">{title}</p>
        <p className="text-sm lg:text-base text-white/70 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* ─── Landing Page ────────────────────────────────────────────────────────── */
export default function LandingPage() {
  // 'login' | 'register'
  const [activeForm, setActiveForm] = useState('login');

  const switchToLogin = () => setActiveForm('login');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-lifewood-paper overflow-hidden">

      {/* ── LEFT PANEL (branding) ────────────────────────────────────────── */}
      <div
        className="relative flex flex-col justify-between overflow-hidden
                   lg:w-[46%] xl:w-[44%] flex-shrink-0
                   min-h-[320px] lg:min-h-screen
                   px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14"
        style={{ background: 'linear-gradient(155deg, #0d2318 0%, #034E34 45%, #0a2b1c 100%)' }}
      >
        {/* Layered decorative elements */}
        <MeshGrid />
        <GlowBlobs />
        <RingArc />
        <DotCluster />

        {/* Gold top bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-lifewood-saffaron to-transparent opacity-80" />

        {/* ── Top: Logo + Headline ─────────────────────────────────────── */}
        <div className="relative z-10">

          {/* Logo row */}
          <div className="flex items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
            <div className="relative animate-float">
              <img
                src="/white logo.png"
                alt="Lifewood"
                className="h-10 w-auto drop-shadow-lg"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {/* online indicator — pulses to show live status */}
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#034E34] shadow animate-pulse" />
            </div>
           
          </div>

          {/* Headline */}
          <div className="mb-6 flex flex-col items-center text-center animate-fade-up" style={{ animationDelay: '80ms' }}>
            <h1 className="text-3xl lg:text-[2.5rem] font-extrabold text-white leading-[1.15] tracking-tight mx-auto">
              LIFEWOOD EXPENSE<br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #FFB347 0%, #FFCF77 60%, #E09020 100%)' }}
              >PORTAL</span>
            </h1>
            <p className="mt-3 text-white/70 text-[14px] leading-relaxed max-w-[640px] text-justify mx-auto">
              AI-powered receipt scanning and document management for Lifewood employees.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-up" style={{ animationDelay: '160ms' }}>
            <StatBadge icon={Users}  value="500+"  label="Employees" />
            <StatBadge icon={Cpu}    value="AI"     label="OCR Engine" />
            <StatBadge icon={Clock}  value="24/7"   label="Available" />
          </div>

          {/* Feature cards — hidden on mobile to keep left panel compact */}
          <div className="hidden md:block space-y-2.5 animate-fade-up" style={{ animationDelay: '240ms' }}>
            <Feature
              icon={Zap}
              title="Instant OCR Extraction"
              desc="Upload receipts and let the AI extract all expense details automatically."
              accent="rgba(255,179,71,0.18)"
            />
            <Feature
              icon={FileText}
              title="Centralized Records"
              desc="All expense documents organized and searchable in one place."
              accent="rgba(3,120,80,0.22)"
            />
            <Feature
              icon={Shield}
              title="Secure & Authorized"
              desc="Role-based access ensures data is visible only to authorized personnel."
              accent="rgba(255,179,71,0.14)"
            />
          </div>
        </div>

        {/* ── Bottom: Footer note ──────────────────────────────────────── */}
        <div className="relative z-10 mt-10 lg:mt-0">
          {/* divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white/90 text-[16px]">
              <CheckCircle className="w-5 h-5 text-lifewood-saffaron/70 shrink-0" />
              <span className="font-medium">Internal use only &mdash; Lifewood AI</span>
            </div>
            <span className="text-[16px] text-white/70 font-medium">&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (auth forms) ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 lg:px-12 lg:py-20 relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #c8e8d4 0%, #f0e8cc 30%, #ddeedd 60%, #b8d8c8 100%)' }}>
        {/* colourful orbs behind the glass — give the blur something vivid to refract */}
        <div className="absolute top-[10%] left-[8%] w-72 h-72 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(3,78,52,0.22) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[8%] right-[6%] w-80 h-80 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(255,179,71,0.20) 0%, transparent 70%)' }} />
        <div className="absolute top-[45%] right-[18%] w-48 h-48 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(100,200,140,0.18) 0%, transparent 70%)' }} />

        <div className="w-full max-w-xl lg:max-w-2xl animate-fade-up rounded-3xl p-8 sm:p-10 relative overflow-hidden text-lifewood-darkSerpent"
             style={{
               background: 'rgba(255,255,255,0.38)',
               backdropFilter: 'blur(40px) saturate(200%) brightness(1.08)',
               WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.08)',
               border: '1.5px solid rgba(255,255,255,0.85)',
               boxShadow: [
                 '0 32px 80px rgba(19,48,32,0.18)',
                 '0 8px 24px rgba(19,48,32,0.10)',
                 '0 2px 0 rgba(255,255,255,1) inset',
                 '0 -1px 0 rgba(19,48,32,0.08) inset',
                 '2px 0 0 rgba(255,255,255,0.6) inset',
                 '-2px 0 0 rgba(255,255,255,0.6) inset',
               ].join(', '),
             }}
        >
          {/* thick glossy top-edge highlight bar */}
          <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-3xl pointer-events-none"
               style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 15%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 60%, rgba(255,255,255,0.5) 85%, transparent 100%)' }} />

          {/* diagonal sheen sweep — the main gloss layer */}
          <div className="absolute pointer-events-none"
               style={{
                 top: '-40%', left: '-30%',
                 width: '70%', height: '160%',
                 background: 'linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.18) 55%, rgba(255,255,255,0) 100%)',
                 transform: 'rotate(-10deg)',
               }} />

          {/* radial inner glow from top-left corner */}
          <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none"
               style={{ background: 'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.35) 0%, transparent 65%)' }} />

          {/* Welcome heading */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-lifewood-darkSerpent">
              {activeForm === 'login' ? 'Welcome' : 'Request Access'}
            </h2>
            <p className="mt-1.5 text-base text-lifewood-charcoal">
              {activeForm === 'login'
                ? 'Sign in to your Lifewood employee account.'
                : 'Submit your details — an admin will review and approve.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="inline-flex rounded-xl bg-lifewood-paper p-1 mb-8 border border-lifewood-platinum w-full">
            <button
              onClick={() => setActiveForm('login')}
              className={`flex-1 py-3 text-base font-semibold rounded-lg transition-all duration-200 active:scale-[0.97] ${
                activeForm === 'login'
                    ? 'bg-lifewood-castletonGreen text-white shadow-sm'
                    : 'text-lifewood-darkSerpent hover:text-lifewood-darkSerpent hover:bg-white/80'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveForm('register')}
              className={`flex-1 py-3 text-base font-semibold rounded-lg transition-all duration-200 active:scale-[0.97] ${
                  activeForm === 'register'
                    ? 'bg-lifewood-castletonGreen text-white shadow-sm'
                    : 'text-lifewood-darkSerpent hover:text-lifewood-darkSerpent hover:bg-white/80'
              }`}
            >
              Request Account
            </button>
          </div>

          {/* Form area — functional components, untouched logic */}
          <div key={activeForm} className="animate-fade-up">
            {activeForm === 'login' ? (
              <LoginForm onClose={switchToLogin} />
            ) : (
              <RegisterForm
                onClose={switchToLogin}
                onSuccess={() => {
                  switchToLogin();
                }}
              />
            )}
          </div>

          {/* Footer toggle helper */}
          <div className="mt-8 text-center text-base text-lifewood-darkSerpent">
            {activeForm === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setActiveForm('register')}
                  className="font-semibold text-lifewood-castletonGreen hover:text-lifewood-saffaron
                             transition-colors inline-flex items-center gap-1 group"
                >
                  Request one
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setActiveForm('login')}
                  className="font-semibold text-lifewood-castletonGreen hover:text-lifewood-saffaron
                             transition-colors inline-flex items-center gap-1 group"
                >
                  Sign in
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Security note */}
          <p className="mt-4 text-center text-sm text-lifewood-darkSerpent flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4" />
            Authorized Lifewood personnel only
          </p>
        </div>
      </div>
    </div>
  );
}



