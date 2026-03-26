import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ChartResponse } from '../types/chart';
import { sendChartEmail } from '../lib/api';
import { BodyGraph } from './BodyGraph';

interface Props {
  chart: ChartResponse;
  email: string;
  onReset: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  'Generator': '#F59E0B',
  'Manifesting Generator': '#F97316',
  'Projector': '#06B6D4',
  'Manifestor': '#EC4899',
  'Reflector': '#94A3B8',
};

const TYPE_NAMES: Record<string, string> = {
  'Generator': 'גנרטור',
  'Manifesting Generator': 'גנרטור מניפסטציה',
  'Projector': 'פרוג\'קטור',
  'Manifestor': 'מניפסטור',
  'Reflector': 'רפלקטור',
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  'Generator': 'כוח החיים של האנושות. אתה בנוי לשלוט במה שאתה אוהב.',
  'Manifesting Generator': 'מנוע אנרגיה ומהירות. אתה כאן כדי לעשות הכל.',
  'Projector': 'המדריך הטבעי. אתה כאן כדי לנהל ולכוון את האנרגיה של אחרים.',
  'Manifestor': 'היוזם. אתה כאן כדי להשפיע על אחרים ולהתחיל דברים חדשים.',
  'Reflector': 'המראה. אתה כאן כדי לשקף את בריאות הקהילה שלך.',
};

const STRATEGY: Record<string, string> = {
  'Generator': '↩ המתן להיענות',
  'Manifesting Generator': '↩ הגיב, ואז ידע',
  'Projector': '✋ המתן להזמנה',
  'Manifestor': '⚡ ידע, ואז יזום',
  'Reflector': '🌙 המתן מחזור ירח',
};

function InfoCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="glass-card p-4" style={{ borderRadius: 12 }}>
      <div className="field-label mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span className="font-semibold text-sm" style={{ color: '#F8F7FF' }}>{value}</span>
      </div>
    </div>
  );
}

export function ResultCard({ chart, email, onReset }: Props) {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleRequestFullReading() {
    if (emailStatus !== 'idle') return;
    setEmailStatus('sending');
    try {
      await sendChartEmail(email, chart.name, chart);
      setEmailStatus('sent');
    } catch {
      setEmailStatus('error');
    }
  }

  const typeColor = TYPE_COLORS[chart.type] ?? '#8B5CF6';
  const typeName = TYPE_NAMES[chart.type] ?? chart.type;
  const typeDesc = TYPE_DESCRIPTIONS[chart.type] ?? '';
  const strategyLabel = STRATEGY[chart.type] ?? chart.strategy;

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="field-label mb-3">✦ הקריאה שלך מוכנה</p>
          <h1 className="gradient-text text-4xl md:text-5xl font-bold mb-2">
            העיצוב האנושי של {chart.name}
          </h1>
          <p style={{ color: '#9CA3AF' }}>התוכנית הקוסמית שלך, נחשפת</p>
        </motion.div>

        {/* Type Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 mb-8 text-center relative overflow-hidden"
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(ellipse at center, ${typeColor} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
          <div className="relative">
            <div
              className="text-6xl md:text-7xl font-bold tracking-tight mb-2"
              style={{ fontFamily: 'Sora, sans-serif', color: typeColor }}
            >
              {typeName}
            </div>
            <div className="text-2xl font-semibold mb-3" style={{ color: 'rgba(248,247,255,0.7)' }}>
              פרופיל {chart.profile}
            </div>
            <p className="text-base max-w-md mx-auto" style={{ color: '#9CA3AF' }}>
              {typeDesc}
            </p>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: BodyGraph */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <BodyGraph
              definedCenters={chart.defined_centers}
              activeChannels={chart.active_channels}
            />
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col gap-4"
          >
            {/* Strategy + Authority */}
            <div className="grid grid-cols-1 gap-3">
              <InfoCard label="אסטרטגיה" value={strategyLabel} icon="🧭" />
              <InfoCard label="סמכות" value={chart.authority} icon="⚡" />
            </div>

            {/* Defined Centers */}
            <div className="glass-card p-5">
              <div className="field-label mb-3">מרכזים מוגדרים</div>
              <div className="flex flex-wrap gap-2">
                {chart.defined_centers.length > 0 ? (
                  chart.defined_centers.map((c) => (
                    <span key={c} className="center-pill-defined">{c}</span>
                  ))
                ) : (
                  <span className="text-sm" style={{ color: '#9CA3AF' }}>אין</span>
                )}
              </div>
            </div>

            {/* Undefined Centers */}
            <div className="glass-card p-5">
              <div className="field-label mb-3">מרכזים פתוחים</div>
              <div className="flex flex-wrap gap-2">
                {chart.undefined_centers.length > 0 ? (
                  chart.undefined_centers.map((c) => (
                    <span key={c} className="center-pill-undefined">{c}</span>
                  ))
                ) : (
                  <span className="text-sm" style={{ color: '#9CA3AF' }}>אין</span>
                )}
              </div>
            </div>

            {/* Active Channels */}
            {chart.active_channels.length > 0 && (
              <div className="glass-card p-5">
                <div className="field-label mb-3">ערוצים פעילים</div>
                <div className="flex flex-col gap-2">
                  {chart.active_channels.slice(0, 6).map(([g1, g2]) => (
                    <div key={`${g1}-${g2}`} className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                      <span
                        className="font-mono font-semibold"
                        style={{ color: '#c4b5fd', fontSize: 13 }}
                      >
                        {g1}–{g2}
                      </span>
                      <span style={{ color: 'rgba(139,92,246,0.4)' }}>·</span>
                      <span>ערוץ</span>
                    </div>
                  ))}
                  {chart.active_channels.length > 6 && (
                    <p className="text-xs" style={{ color: 'rgba(156,163,175,0.5)' }}>
                      +{chart.active_channels.length - 6} נוספים
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8 mt-8 text-center"
        >
          <p className="field-label mb-2">✦ רוצה להעמיק?</p>
          <h3 className="text-2xl font-bold mb-2 gradient-text" style={{ fontFamily: 'Heebo, Sora, sans-serif' }}>
            פתח את הקריאה המלאה שלך
          </h3>
          <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
            ניתוח שערים מפורט, צלב התגלמות, הפעלות כוכביות והנחיה אישית
          </p>
          <button
            className="btn-glow px-10 py-4 text-base"
            onClick={handleRequestFullReading}
            disabled={emailStatus === 'sending' || emailStatus === 'sent'}
            style={{ opacity: emailStatus === 'sending' ? 0.7 : 1 }}
          >
            {emailStatus === 'sending' && 'שולח...'}
            {emailStatus === 'sent' && '✓ המייל נשלח אליך!'}
            {emailStatus === 'error' && '⚠ שגיאה - נסה שוב'}
            {emailStatus === 'idle' && 'קבל את הקריאה המלאה שלך ←'}
          </button>
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(139,92,246,0.15)' }}>
            <button
              onClick={onReset}
              className="text-sm"
              style={{ color: 'rgba(156,163,175,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              → התחל קריאה חדשה
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
