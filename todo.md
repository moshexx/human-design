# Frontend TODO - Human Design Lead Magnet

## Phase 2: Frontend (React + Vite + TypeScript)

### 2.1 Scaffold
- [ ] `npm create vite@latest frontend -- --template react-ts`
- [ ] Install deps: `tailwindcss @tailwindcss/vite framer-motion react-hook-form @hookform/resolvers zod axios`
- [ ] Init shadcn/ui: `npx shadcn@latest init` (dark theme, slate)
- [ ] Add shadcn components: `button input card label`

### 2.2 Theme & Layout
- [ ] Dark mode default: Slate 900 bg, white text, subtle glowing borders
- [ ] Centered single-column layout (max-w-lg form, max-w-4xl results)
- [ ] Premium typography: large headings, generous spacing

### 2.3 BirthForm Component (`src/components/BirthForm.tsx`)
- [ ] Fields: Name, Email, Birth Date, Birth Time, City
- [ ] Zod schema validation (email format, date YYYY-MM-DD, time HH:MM)
- [ ] react-hook-form integration
- [ ] shadcn/ui Card + Button wrapper
- [ ] On submit → POST `/api/v1/generate-chart` → loading state

### 2.4 LoadingAnimation Component (`src/components/LoadingAnimation.tsx`)
- [ ] framer-motion AnimatePresence
- [ ] 3-second staggered text sequence:
  1. "Analyzing planetary alignments..." (0-1s)
  2. "Calculating your bodygraph..." (1-2s)
  3. "Revealing your design..." (2-3s)
- [ ] Rotating/pulsing geometric shape in background
- [ ] Fade transitions between steps

### 2.5 ResultCard Component (`src/components/ResultCard.tsx`)
- [ ] Large Type display (accent color per type)
- [ ] Profile in elegant typography
- [ ] Strategy & Authority as secondary info
- [ ] Defined/undefined centers list
- [ ] Active channels display

### 2.6 BodyGraph SVG Component (`src/components/BodyGraph.tsx`)
- [ ] Custom SVG (~400x600 viewBox)
- [ ] 9 centers as geometric shapes:
  - Head (top triangle), Ajna (inverted triangle)
  - Throat (square), G Center (diamond)
  - Heart (small triangle, right), Sacral (square, center-lower)
  - Solar Plexus (triangle, right-lower), Spleen (triangle, left-lower)
  - Root (square, bottom)
- [ ] Channels as SVG paths between centers
- [ ] Defined centers = filled accent color, undefined = outline only
- [ ] Active channels = solid colored, inactive = hidden/faint
- [ ] framer-motion fade-in animation

### 2.7 App Flow (`src/App.tsx`)
- [ ] State machine: `"form"` → `"loading"` (3s) → `"result"`
- [ ] useState for view state + chart data
- [ ] AnimatePresence for smooth transitions
- [ ] Vite proxy config for `/api` → `localhost:8000`

### 2.8 TypeScript Types (`src/types/chart.ts`)
- [ ] `ChartRequest` interface matching backend schema
- [ ] `ChartResponse` interface with all fields
- [ ] `PlanetaryActivation` interface

### 2.9 API Client (`src/lib/api.ts`)
- [ ] axios POST to `/api/v1/generate-chart`
- [ ] Error handling with user-friendly messages

## API Contract (Backend is DONE)

**POST** `http://localhost:8000/api/v1/generate-chart`

Request:
```json
{ "name": "string", "email": "email", "dob": "YYYY-MM-DD", "time": "HH:MM", "city": "string" }
```

Response:
```json
{
  "name": "string",
  "type": "Generator|Manifesting Generator|Projector|Manifestor|Reflector",
  "profile": "X/Y",
  "strategy": "string",
  "authority": "string",
  "defined_centers": ["string"],
  "undefined_centers": ["string"],
  "active_channels": [[int, int]],
  "personality_planets": [{"planet": "string", "gate": int, "line": int, "longitude": float}],
  "design_planets": [{"planet": "string", "gate": int, "line": int, "longitude": float}],
  "active_gates": [int]
}
```
