import { useState } from 'react';

interface PromptViewProps {
  prompt: string;
}

export function PromptView({ prompt }: PromptViewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D0B1A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', direction: 'rtl' }}>
      <div style={{ maxWidth: '680px', width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ color: 'rgba(139,92,246,0.8)', fontSize: '13px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>
            ✦ עיצוב אנושי
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            הפרומפט שלך מוכן
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
            העתק את הפרומפט והדבק אותו ב-ChatGPT
            <br />
            <span style={{ color: 'rgba(139,92,246,0.7)', fontSize: '13px' }}>
              הפרומפט כולל את כל נתוני המפה שלך ויפיק קריאה מלאה בעברית
            </span>
          </p>
        </div>

        {/* Prompt box */}
        <div style={{ background: 'rgba(26,23,48,0.9)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '16px', padding: '4px', marginBottom: '16px' }}>
          <textarea
            readOnly
            value={prompt}
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            style={{
              width: '100%',
              minHeight: '280px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#D1D5DB',
              fontSize: '13px',
              fontFamily: 'monospace',
              lineHeight: 1.7,
              padding: '20px',
              resize: 'vertical',
              boxSizing: 'border-box',
              direction: 'ltr',
              textAlign: 'left',
            }}
          />
        </div>

        {/* Copy button */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button
            onClick={handleCopy}
            style={{
              background: copied
                ? 'linear-gradient(135deg,#10B981,#059669)'
                : 'linear-gradient(135deg,#8B5CF6,#EC4899)',
              color: '#fff',
              border: 'none',
              padding: '14px 40px',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.5px',
            }}
          >
            {copied ? '✓ הועתק לקליפבורד!' : 'העתק פרומפט'}
          </button>
        </div>

        {/* Instructions */}
        <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
          <div style={{ color: 'rgba(139,92,246,0.8)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            איך להשתמש
          </div>
          <ol style={{ color: '#9CA3AF', fontSize: '14px', margin: 0, paddingRight: '20px', lineHeight: 2 }}>
            <li>לחץ על "העתק פרומפט" כאן למעלה</li>
            <li>פתח את ChatGPT (chat.openai.com)</li>
            <li>הדבק את הפרומפט בשיחה חדשה</li>
            <li>קבל קריאה מלאה ומפורטת בעברית</li>
          </ol>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center' }}>
          <a
            href="/"
            style={{ color: 'rgba(139,92,246,0.6)', fontSize: '13px', textDecoration: 'none' }}
          >
            ← חזור לאתר
          </a>
        </div>

      </div>
    </div>
  );
}
