import React, { useState } from 'react';
import {
  LandingHeader,
  LandingFooter,
  WelcomeSection,
  InfoSection,
  FeaturesGrid,
} from '../features/landing';
import { DemoModal, DemoResults, useDemoOcr } from '../features/demo';
import { BackgroundLayout } from '../components/layout';
import { Sparkles, Upload } from 'lucide-react';

export default function LandingPage() {
  const [showResults, setShowResults] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const { processImages, loading, error, results, reset } = useDemoOcr();

  const handleProcess = async (images) => {
    const result = await processImages(images);
    if (result) {
      setShowDemoModal(false);
      setShowResults(true);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    reset();
  };

  const handleRetry = async (images) => {
    reset();
    await handleProcess(images);
  };

  return (
    <BackgroundLayout blur={false}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="fixed inset-0 -z-10">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-lifewood-paper via-lifewood-seaSalt/50 to-lifewood-paper"></div>

          {/* Animated mesh gradient overlay */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 -left-40 w-96 h-96 bg-lifewood-earthYellow/60 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 -right-40 w-96 h-96 bg-lifewood-saffaron/60 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-40 left-20 w-96 h-96 bg-lifewood-castletonGreen/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-0 right-20 w-96 h-96 bg-lifewood-darkSerpent/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000"></div>
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <LandingHeader />

          {/* Main content with responsive padding */}
          <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Hero Section with Dashboard Access Button */}
            <section className="pt-2 sm:pt-3 md:pt-4 lg:pt-6 pb-6 sm:pb-8">
              <WelcomeSection />

              {/* Login Button - Centered */}
              <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 flex justify-center">
                <button
                  onClick={() => window.scrollTo(0, 0)} // Optional: could hook to Login modal if state was lifted
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-lifewood-saffaron hover:bg-lifewood-earthYellow text-lifewood-darkSerpent font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  {/* Animated glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-lifewood-white/20 to-lifewood-white/0 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>

                  {/* Button content */}
                  <div className="relative flex items-center gap-2 sm:gap-3">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                    <span className="text-base sm:text-lg md:text-xl">Access Application</span>
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </button>
              </div>
            </section>

            {/* Divider with decorative elements - More space */}
            <div className="relative py-10 sm:py-14 md:py-16">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-lifewood-castletonGreen/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-r from-lifewood-paper via-lifewood-seaSalt to-lifewood-paper px-6 text-[1rem] text-lifewood-darkSerpent font-semibold uppercase tracking-wider">
                  ✨ Discover Our Features ✨
                </span>
              </div>
            </div>

            {/* Info Section with more top and bottom padding */}
            <section className="pt-4 sm:pt-6 pb-16 sm:pb-20 md:pb-24">
              <InfoSection />
            </section>

            {/* Features Section with more padding */}
            <section className="pt-4 sm:pt-6 pb-16 sm:pb-20 md:pb-24 lg:pb-28">
              <FeaturesGrid />
            </section>
          </main>

          <LandingFooter />
        </div>

        {/* Demo Modal */}
        <DemoModal
          isOpen={showDemoModal}
          onClose={() => setShowDemoModal(false)}
          onProcess={handleProcess}
        />

        {/* Results Modal */}
        <DemoResults
          isOpen={showResults}
          onClose={handleCloseResults}
          results={results}
          loading={loading}
          error={error}
          onRetry={() => handleRetry(results)}
        />
      </div>
    </BackgroundLayout>
  );
}
