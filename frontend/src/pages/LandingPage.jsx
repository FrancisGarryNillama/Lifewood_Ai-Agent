import React, { useState } from 'react';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import { Shield, FileText, Zap, CheckCircle, ArrowRight } from 'lucide-react';

/* ─── Decorative SVG ring pattern ─────────────────────────────────────────── */
function RingPattern() {
  return (
    <svg
      className="absolute bottom-0 right-0 w-72 h-72 opacity-10 pointer-events-none"
      viewBox="0 0 288 288"
      fill="none"
    >
      {[144, 108, 72, 36].map((r, i) => (
        <circle
          key={i}
          cx="288"
          cy="288"
          r={r}
          stroke="#FFB347"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

/* ─── Decorative leaf/dot grid (top-left) ─────────────────────────────────── */
function DotGrid() {
  return (
    <svg
      className="absolute top-8 left-8 w-24 h-24 opacity-10 pointer-events-none"
      viewBox="0 0 96 96"
    >
      {Array.from({ length: 5 }).flatMap((_, row) =>
        Array.from({ length: 5 }).map((__, col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * 20 + 8}
            cy={row * 20 + 8}
            r="2.5"
            fill="#FFB347"
          />
        ))
      )}
    </svg>
  );
}

/* ─── Feature bullet ──────────────────────────────────────────────────────── */
function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-9 h-9 rounded-lg bg-lifewood-saffaron/15 flex items-center justify-center mt-0.5">
        <Icon className="w-4 h-4 text-lifewood-saffaron" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-white/55 mt-0.5 leading-relaxed">{desc}</p>
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
                   lg:w-[44%] xl:w-[42%] flex-shrink-0
                   min-h-[260px] lg:min-h-screen
                   px-8 py-10 lg:px-12 lg:py-14"
        style={{ background: 'linear-gradient(160deg, #133020 0%, #034E34 55%, #133020 100%)' }}
      >
        {/* decorative elements */}
        <DotGrid />
        <RingPattern />
        {/* thin gold top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lifewood-saffaron via-lifewood-earthYellow to-lifewood-goldenBrown" />

        {/* Logo + brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10 lg:mb-14">
            <img
              src="/assets/images/lifewood-logo.png"
              alt="Lifewood"
              className="h-10 w-auto drop-shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="text-white font-bold text-xl tracking-tight">Lifewood AI</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
            Employee<br />
            <span className="text-lifewood-saffaron">Document</span><br />
            Portal
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-10">
            AI-powered receipt scanning and document management for Lifewood employees.
          </p>

          {/* Feature bullets */}
          <div className="space-y-5">
            <Feature
              icon={Zap}
              title="Instant OCR Extraction"
              desc="Upload receipts and let the AI extract all expense details automatically."
            />
            <Feature
              icon={FileText}
              title="Centralized Records"
              desc="All expense documents organized and searchable in one place."
            />
            <Feature
              icon={Shield}
              title="Secure & Authorized"
              desc="Role-based access ensures data is visible only to authorized personnel."
            />
          </div>
        </div>

        {/* Footer note */}
        <div className="relative z-10 mt-10 lg:mt-0">
          <div className="flex items-center gap-2 text-white/35 text-xs">
            <CheckCircle className="w-3.5 h-3.5 text-lifewood-saffaron/60" />
            Internal use only &mdash; Lifewood AI &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (auth forms) ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0 bg-white">
        <div className="w-full max-w-md animate-fade-up">

          {/* Welcome heading */}
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-lifewood-darkSerpent">
              {activeForm === 'login' ? 'Welcome back 👋' : 'Request Access'}
            </h2>
            <p className="mt-1.5 text-sm text-lifewood-charcoal">
              {activeForm === 'login'
                ? 'Sign in to your Lifewood employee account.'
                : 'Submit your details — an admin will review and approve.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="inline-flex rounded-xl bg-lifewood-paper p-1 mb-8 border border-lifewood-platinum/60 w-full">
            <button
              onClick={() => setActiveForm('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeForm === 'login'
                  ? 'bg-lifewood-castletonGreen text-white shadow-sm'
                  : 'text-lifewood-charcoal hover:text-lifewood-darkSerpent'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveForm('register')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeForm === 'register'
                  ? 'bg-lifewood-castletonGreen text-white shadow-sm'
                  : 'text-lifewood-charcoal hover:text-lifewood-darkSerpent'
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
          <div className="mt-8 text-center text-sm text-lifewood-asphalt">
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
          <p className="mt-4 text-center text-xs text-lifewood-silver flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3" />
            Authorized Lifewood personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
