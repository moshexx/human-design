import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BirthForm } from './components/BirthForm';
import { LoadingAnimation } from './components/LoadingAnimation';
import { PromptView } from './components/PromptView';
import { ResultCard } from './components/ResultCard';
import { generateChart } from './lib/api';
import type { ChartRequest, ChartResponse } from './types/chart';

type View = 'form' | 'loading' | 'result' | 'prompt';

const fadeVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function App() {
  const [view, setView] = useState<View>('form');
  const [chart, setChart] = useState<ChartResponse | null>(null);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [promptText, setPromptText] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('prompt');
    if (encoded) {
      try {
        const decoded = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
        setPromptText(decoded);
        setView('prompt');
      } catch {
        // invalid encoding — stay on form
      }
    }
  }, []);

  async function handleSubmit(data: ChartRequest) {
    setError(null);
    setEmail(data.email);
    setView('loading');
    try {
      const result = await generateChart(data);
      // Let the loading animation play for at least 3 seconds
      await new Promise((res) => setTimeout(res, 3200));
      setChart(result);
      setView('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'משהו השתבש. נסה שוב.');
      setView('form');
    }
  }

  function handleReset() {
    setChart(null);
    setEmail('');
    setError(null);
    setView('form');
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        {view === 'form' && (
          <motion.div key="form" variants={fadeVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
            {error && (
              <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(248,68,68,0.15)', border: '1px solid rgba(248,68,68,0.4)', color: '#fca5a5' }}>
                ⚠ {error}
              </div>
            )}
            <BirthForm onSubmit={handleSubmit} />
          </motion.div>
        )}

        {view === 'loading' && (
          <motion.div key="loading" variants={fadeVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
            <LoadingAnimation />
          </motion.div>
        )}

        {view === 'result' && chart && (
          <motion.div key="result" variants={fadeVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
            <ResultCard chart={chart} email={email} onReset={handleReset} />
          </motion.div>
        )}

        {view === 'prompt' && (
          <motion.div key="prompt" variants={fadeVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
            <PromptView prompt={promptText} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
