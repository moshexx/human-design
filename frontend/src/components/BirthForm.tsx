import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ChartRequest } from '../types/chart';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use format YYYY-MM-DD'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Use format HH:MM'),
  city: z.string().min(2, 'Please enter your birth city'),
  goal: z.enum(['career', 'love', 'growth', 'all']).optional(),
  experience: z.enum(['beginner', 'heard', 'studying']).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: ChartRequest) => void;
  isLoading?: boolean;
}

const goalOptions = [
  { value: 'career', label: '💼 Career & Purpose' },
  { value: 'love', label: '💞 Relationships' },
  { value: 'growth', label: '🌱 Personal Growth' },
  { value: 'all', label: '✨ All Areas' },
] as const;

const experienceOptions = [
  { value: 'beginner', label: 'Total beginner' },
  { value: 'heard', label: 'Heard of it' },
  { value: 'studying', label: 'Studying it' },
] as const;

export function BirthForm({ onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', color: '#c4b5fd' }}>
          ✦ Free Reading
        </div>

        <h1 className="gradient-text text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4">
          Discover Your<br />Human Design
        </h1>

        <p className="text-lg" style={{ color: '#9CA3AF' }}>
          Unlock the cosmic blueprint you were born with
        </p>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {[['⚡', 'Instant'], ['🔒', 'Private'], ['✨', 'Free']].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-1.5 text-sm" style={{ color: '#9CA3AF' }}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Glass Form Card */}
      <div className="glass-card w-full max-w-lg p-8">
        <p className="field-label text-center mb-8" style={{ fontSize: '13px', letterSpacing: '0.12em' }}>
          Enter Your Birth Details
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="field-label">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </span>
              <input className="cosmic-input" placeholder="Your full name" {...register('name')} />
            </div>
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="field-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <input className="cosmic-input" type="email" placeholder="your@email.com" {...register('email')} />
            </div>
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          {/* Date + Time row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Birth Date</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </span>
                <input className="cosmic-input" placeholder="YYYY-MM-DD" {...register('dob')} />
              </div>
              {errors.dob && <p className="field-error">{errors.dob.message}</p>}
            </div>

            <div>
              <label className="field-label">Birth Time</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <input className="cosmic-input" placeholder="HH:MM" {...register('time')} />
              </div>
              {errors.time && <p className="field-error">{errors.time.message}</p>}
              <p className="field-helper">As precise as possible</p>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="field-label">Birth City</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </span>
              <input className="cosmic-input" placeholder="e.g. Tel Aviv, New York" {...register('city')} />
            </div>
            {errors.city && <p className="field-error">{errors.city.message}</p>}
            <p className="field-helper">City where you were born</p>
          </div>

          {/* Goal - pill toggles */}
          <div>
            <label className="field-label">What area of life seeks clarity?</label>
            <Controller
              name="goal"
              control={control}
              render={({ field }) => (
                <div className="pill-group">
                  {goalOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`pill-btn ${field.value === opt.value ? 'selected' : ''}`}
                      onClick={() => field.onChange(field.value === opt.value ? undefined : opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Experience - toggle group */}
          <div>
            <label className="field-label">Your Human Design experience?</label>
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <div className="toggle-group">
                  {experienceOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`toggle-btn ${field.value === opt.value ? 'selected' : ''}`}
                      onClick={() => field.onChange(field.value === opt.value ? undefined : opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-glow w-full py-4 text-base mt-2 flex items-center justify-center gap-2"
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Calculating...
              </>
            ) : (
              <>Reveal My Human Design →</>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-xs" style={{ color: 'rgba(156,163,175,0.6)' }}>
          🔒 100% private · No spam ever · Instant results
        </p>
      </div>
    </div>
  );
}
