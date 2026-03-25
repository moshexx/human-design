import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  'מאתר את קואורדינטות הלידה שלך...',
  'מחשב מיקומי כוכבי הלכת...',
  'ממפה את ה-Bodygraph שלך...',
  'חושף את העיצוב שלך...',
];

export function LoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const t = setTimeout(() => setCurrentStep((s) => s + 1), 800);
      return () => clearTimeout(t);
    }
  }, [currentStep]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-sm font-semibold tracking-widest uppercase"
        style={{ color: 'rgba(139,92,246,0.8)' }}
      >
        ✦ עיצוב אנושי
      </motion.div>

      {/* Sacred geometry SVG */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative mb-12"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
            {/* Outer circle */}
            <circle cx="80" cy="80" r="72" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
            {/* Inner hexagon */}
            <polygon
              points="80,16 132,48 132,112 80,144 28,112 28,48"
              stroke="rgba(139,92,246,0.5)"
              strokeWidth="1"
              fill="none"
            />
            {/* Star of David lines */}
            <line x1="80" y1="16" x2="80" y2="144" stroke="rgba(6,182,212,0.3)" strokeWidth="0.8" />
            <line x1="28" y1="48" x2="132" y2="112" stroke="rgba(6,182,212,0.3)" strokeWidth="0.8" />
            <line x1="132" y1="48" x2="28" y2="112" stroke="rgba(6,182,212,0.3)" strokeWidth="0.8" />
            {/* Inner triangle up */}
            <polygon
              points="80,28 128,108 32,108"
              stroke="rgba(139,92,246,0.6)"
              strokeWidth="1"
              fill="rgba(139,92,246,0.04)"
            />
            {/* Inner triangle down */}
            <polygon
              points="80,132 32,52 128,52"
              stroke="rgba(236,72,153,0.5)"
              strokeWidth="1"
              fill="rgba(236,72,153,0.03)"
            />
            {/* Center circle */}
            <circle cx="80" cy="80" r="8" fill="rgba(139,92,246,0.3)" stroke="rgba(139,92,246,0.8)" strokeWidth="1" />
            {/* Glow dot */}
            <circle cx="80" cy="80" r="4" fill="#8B5CF6" />
          </svg>
        </motion.div>

        {/* Pulsing glow rings */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Steps */}
      <div className="flex flex-col gap-3 w-full max-w-xs mb-10">
        {steps.map((step, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isActive || isDone ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {isDone ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    width="16" height="16" fill="none" viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" fill="rgba(139,92,246,0.2)" />
                    <path d="M8 12l3 3 5-5" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                ) : isActive ? (
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: '#8B5CF6' }}
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(139,92,246,0.2)' }} />
                )}
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: isActive ? '#F8F7FF' : isDone ? 'rgba(139,92,246,0.8)' : 'rgba(156,163,175,0.4)' }}
              >
                {step}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.15)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Caption */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="mt-6 text-xs text-center"
          style={{ color: 'rgba(156,163,175,0.5)' }}
        >
          זה לוקח רק רגע
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
