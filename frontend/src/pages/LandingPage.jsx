import React, { useState, useEffect } from 'react';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import {
  Shield, ArrowRight, Receipt, TrendingUp,
  PieChart, CheckCircle2, Clock, DollarSign
} from 'lucide-react';

/* ─── Floating stat card (right panel) ────────────────────────────────────── */
function FloatingCard({ icon: Icon, label, value, accent, className = '', delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`absolute bg-white rounded-2xl shadow-lifewood px-5 py-4 flex items-center gap-3
                  select-none pointer-events-none transition-all duration-700
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  ${className}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[11px] text-lifewood-asphalt tracking-wide uppercase font-medium">{label}</p>
        <p className="text-[15px] font-bold text-lifewood-darkSerpent">{value}</p>
      </div>
    </div>
  );
}

/* ─── Landing Page ────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [activeForm, setActiveForm] = useState('login');
  const switchToLogin = () => setActiveForm('login');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-white">

      {/* ══ LEFT PANEL — Form ═══════════════════════════════════════════ */}
      <div
        className="flex flex-col
                   w-full lg:w-[50%] lg:flex-shrink-0
                   lg:min-h-screen
                   bg-white
                   px-5 py-6
                   sm:px-10 sm:py-8
                   lg:px-14 lg:py-10
                   xl:px-20 2xl:px-28"
      >
        {/* Top — Logo */}
        <div className="mb-6 sm:mb-8 animate-fade-up">
          <img
            src="/lifewood-logo.png"
            alt="Lifewood"
            className="h-9 sm:h-11 w-auto"
            draggable={false}
          />
        </div>

        {/* Center — Form area */}
        <div className="flex-1 flex items-start sm:items-center">
          <div
            className="w-full max-w-full sm:max-w-[480px] md:max-w-[520px] lg:max-w-[560px] mx-auto animate-fade-up"
            style={{ animationDelay: '80ms' }}
          >
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-lifewood-darkSerpent tracking-tight leading-[1.1] mb-2 sm:mb-3">
              {activeForm === 'login' ? 'Welcome Back' : 'Request Access'}
            </h1>
            <p className="text-sm sm:text-base text-lifewood-asphalt mb-6 sm:mb-8 leading-relaxed">
              {activeForm === 'login'
                ? 'Sign in to your employee account to continue.'
                : 'Submit your details — an admin will review and approve.'}
            </p>

            {/* Tab switcher */}
            <div className="flex rounded-xl bg-lifewood-seaSalt p-1 mb-5 sm:mb-7 gap-1 border border-lifewood-platinum/60">
              {['login', 'register'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveForm(tab)}
                  className={`flex-1 py-2.5 sm:py-3.5 text-sm sm:text-[15px] font-semibold rounded-lg transition-all duration-200
                    active:scale-[0.97]
                    ${activeForm === tab
                      ? 'bg-lifewood-castletonGreen text-white shadow-sm'
                      : 'text-lifewood-asphalt hover:text-lifewood-darkSerpent hover:bg-white'
                    }`}
                >
                  {tab === 'login' ? 'Sign In' : 'Request Account'}
                </button>
              ))}
            </div>

            {/* Form card */}
            <div className="bg-lifewood-seaSalt border border-lifewood-platinum/50 rounded-2xl p-5 sm:p-7 lg:p-9 shadow-lifewood-sm">
              <div key={activeForm} className="animate-fade-up">
                {activeForm === 'login' ? (
                  <LoginForm onClose={switchToLogin} />
                ) : (
                  <RegisterForm
                    onClose={switchToLogin}
                    onSuccess={switchToLogin}
                  />
                )}
              </div>
            </div>

            {/* Toggle link */}
            <div className="mt-5 sm:mt-7 text-center text-sm sm:text-[15px] text-lifewood-asphalt">
              {activeForm === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setActiveForm('register')}
                    className="font-semibold text-lifewood-castletonGreen hover:text-lifewood-harvest
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
                    className="font-semibold text-lifewood-castletonGreen hover:text-lifewood-harvest
                               transition-colors inline-flex items-center gap-1 group"
                  >
                    Sign in
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom — Footer */}
        <div className="mt-6 sm:mt-8 flex items-center justify-between text-[11px] text-lifewood-asphalt/50 tracking-wide">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure employee access</span>
          </div>
          <span>&copy; {new Date().getFullYear()} Lifewood</span>
        </div>
      </div>

      {/* ══ RIGHT PANEL — Visual hero (always visible on all screens) ══ */}
      <div
        className="flex flex-1 relative overflow-hidden bg-lifewood-darkSerpent
                   min-h-[320px] sm:min-h-[360px] md:min-h-[380px]
                   lg:min-h-screen"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80")',
            filter: 'brightness(0.45)',
          }}
        />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between w-full h-full
                        p-5 sm:p-6 md:p-8 lg:p-10 xl:p-14">

          {/* Top badge */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm border border-white/10
                            rounded-full px-3 py-1.5 lg:px-4 lg:py-2
                            text-white/90 text-[10px] sm:text-[11px] lg:text-[12px] font-medium tracking-wide">
              <Receipt className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-lifewood-saffaron flex-shrink-0" />
              <span>SMART EXPENSE MANAGEMENT, SIMPLIFIED.</span>
            </div>
          </div>

          {/* Center hero text — mobile & tablet (compact) */}
          <div className="block lg:hidden animate-fade-up my-3 sm:my-4" style={{ animationDelay: '150ms' }}>
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight mb-1.5 sm:mb-2">
              ExpenseAI{' '}
              <span className="text-lifewood-saffaron">Intelligence Assistant</span>
            </h2>
            <p className="text-white/80 text-[12px] sm:text-[13px] leading-relaxed max-w-sm">
              AI-powered receipt scanning, automated categorization, and real-time tracking.
            </p>
          </div>

          {/* Center hero text — desktop (full) */}
          <div className="hidden lg:block max-w-lg animate-fade-up" style={{ animationDelay: '150ms' }}>
            <h2 className="text-white text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-4">
              ExpenseAI <br />Intelligence<br />
              <span className="text-lifewood-saffaron">Assistant</span>
            </h2>
            <p className="text-white/90 text-[15px] leading-relaxed max-w-md">
              AI-powered receipt scanning, automated categorization, and real-time
              tracking — all in one clean workspace.
            </p>
          </div>

          {/* Bottom features row */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
            {[
              { icon: CheckCircle2, text: 'Auto Categorize' },
              { icon: Clock, text: 'Real-Time Tracking' },
              { icon: TrendingUp, text: 'Smart Reports' },
            ].map(({ icon: Ic, text }) => (
              <div
                key={text}
                className="flex items-center gap-1 sm:gap-1.5 lg:gap-2
                           bg-white/10 backdrop-blur-sm border border-white/10
                           rounded-lg sm:rounded-xl
                           px-2.5 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5
                           text-white/80 text-[10px] sm:text-[11px] lg:text-[12px] font-medium
                           hover:bg-white/15 transition-colors duration-200 cursor-default"
              >
                <Ic className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-lifewood-saffaron flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



