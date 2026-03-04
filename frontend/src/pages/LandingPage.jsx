import React, { useState } from 'react';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import {
  Shield, ArrowRight, Receipt,
  TrendingUp, CheckCircle2, Clock
} from 'lucide-react';

/* --- Landing Page ---------------------------------------------------------- */
export default function LandingPage() {
  const [activeForm, setActiveForm] = useState('login');
  const switchToLogin = () => setActiveForm('login');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden font-sans bg-white">

      {/* == LEFT PANEL - Form == */}
      <div
        className="relative flex flex-col justify-between
                   lg:w-[50%] flex-shrink-0 min-h-screen
                   bg-white px-8 py-8 sm:px-14 lg:px-20 xl:px-28"
      >
        {/* Logo pinned top-left */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 animate-fade-up">
          <img
            src="/lifewood-logo.png"
            alt="Lifewood"
            className="h-12 w-auto"
            draggable={false}
          />
        </div>

        {/* Center - Form area */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[600px] mx-auto animate-fade-up" style={{ animationDelay: '80ms' }}>

            <h1 className="text-4xl sm:text-5xl font-bold text-lifewood-darkSerpent tracking-tight leading-[1.1] mb-3">
              {activeForm === 'login' ? 'Welcome Back' : 'Request Access'}
            </h1>
            <p className="text-base text-lifewood-asphalt mb-9 leading-relaxed">
              {activeForm === 'login'
                ? 'Sign in to your employee account to continue.'
                : 'Submit your details — an admin will review and approve.'}
            </p>

            {/* Tab switcher */}
            <div className="flex rounded-xl bg-lifewood-seaSalt p-1 mb-8 gap-1 border border-lifewood-platinum/60">
              {['login', 'register'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveForm(tab)}
                  className={`flex-1 py-3.5 text-[15px] font-semibold rounded-lg transition-all duration-200
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
            <div className="bg-lifewood-seaSalt border border-lifewood-platinum/50 rounded-2xl p-7 sm:p-9 shadow-lifewood-sm">
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
            <div className="mt-7 text-center text-[15px] text-lifewood-asphalt">
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

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-lifewood-asphalt/50 tracking-wide">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure employee access</span>
          </div>
          <span>&copy; {new Date().getFullYear()} Lifewood</span>
        </div>
      </div>

      {/* == RIGHT PANEL - Visual hero == */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-lifewood-darkSerpent">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80")',
            filter: 'brightness(0.45)',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between w-full h-full p-10 xl:p-14">

          {/* Top badge */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10
                            rounded-full px-4 py-2 text-white/90 text-[12px] font-medium tracking-wide">
              <Receipt className="w-4 h-4 text-lifewood-saffaron" />
              ExpenseAI Intelligence Assistant
            </div>
          </div>

          {/* Hero text */}
          <div className="max-w-lg animate-fade-up" style={{ animationDelay: '150ms' }}>
            <h2 className="text-white text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-4">
              ExpenseAI <br />Intelligence<br />
              <span className="text-lifewood-saffaron">Assistant</span>
            </h2>
            <p className="text-white/60 text-[15px] leading-relaxed max-w-md">
              AI-powered receipt scanning, automated categorization, and real-time
              tracking all in one clean workspace.
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
            {[
              { icon: CheckCircle2, text: 'Auto Categorize' },
              { icon: Clock, text: 'Real-Time Tracking' },
              { icon: TrendingUp, text: 'Smart Reports' },
            ].map(({ icon: Ic, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10
                           rounded-xl px-4 py-2.5 text-white/80 text-[12px] font-medium
                           hover:bg-white/15 transition-colors duration-200 cursor-default"
              >
                <Ic className="w-4 h-4 text-lifewood-saffaron" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}