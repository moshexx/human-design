export interface ChartRequest {
  name: string;
  email: string;
  dob: string;   // YYYY-MM-DD
  time: string;  // HH:MM
  city: string;
  goal?: 'career' | 'love' | 'growth' | 'all';
  experience?: 'beginner' | 'heard' | 'studying';
}

export interface PlanetaryActivation {
  planet: string;
  gate: number;
  line: number;
  longitude: number;
}

export interface ChartResponse {
  name: string;
  type: string;
  profile: string;
  strategy: string;
  authority: string;
  defined_centers: string[];
  undefined_centers: string[];
  active_channels: number[][];
  personality_planets: PlanetaryActivation[];
  design_planets: PlanetaryActivation[];
  active_gates: number[];
}
