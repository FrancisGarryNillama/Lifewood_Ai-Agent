import React, { useState } from 'react';
import { LandingFooter } from '../features/landing';
import { LoginModal } from '../features/auth/components/AuthModal';
import { RegisterModal } from '../features/auth/components/AuthModal';
import { LogIn, UserPlus, Shield } from 'lucide-react';

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-lifewood-paper via-lifewood-seaSalt to-lifewood-paper">
      {/* Subtle animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-lifewood-castletonGreen/10 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-lifewood-saffaron/15 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      {/* Main centered content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          {/* Logo + Title */}
          <div className="text-center mb-10">
            <img
              src="/lifewood-logo.png"
              alt="Lifewood"
              className="h-16 w-auto mx-auto mb-6 drop-shadow-md"
            />
            <h1 className="text-2xl font-bold text-lifewood-darkSerpent tracking-tight">
              Employee Document Portal
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Internal use only — Lifewood AI
            </p>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-4">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="w-full flex items-center justify-center gap-3 bg-lifewood-castletonGreen hover:bg-lifewood-darkSerpent text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              Log In
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 border-t border-gray-100" />
              <span className="text-xs text-gray-400 whitespace-nowrap">need access?</span>
              <div className="flex-1 border-t border-gray-100" />
            </div>

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="w-full flex items-center justify-center gap-3 bg-lifewood-seaSalt hover:bg-lifewood-saffaron/30 text-lifewood-darkSerpent font-semibold py-3 px-6 rounded-xl border border-lifewood-castletonGreen/20 transition-all duration-200"
            >
              <UserPlus className="w-5 h-5" />
              Request Account
            </button>
          </div>

          {/* Security note */}
          <p className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3" />
            Authorized personnel only
          </p>
        </div>
      </main>

      <LandingFooter />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}
