import { motion } from 'framer-motion';

interface Props {
  definedCenters: string[];
  activeChannels: number[][];
}

// Center definitions with shape info
const CENTERS: {
  name: string;
  shape: 'triangle-up' | 'triangle-down' | 'square' | 'diamond' | 'triangle-small';
  x: number;
  y: number;
  size: number;
}[] = [
  { name: 'Head', shape: 'triangle-up', x: 200, y: 18, size: 44 },
  { name: 'Ajna', shape: 'triangle-down', x: 200, y: 85, size: 40 },
  { name: 'Throat', shape: 'square', x: 176, y: 148, size: 48 },
  { name: 'G Center', shape: 'diamond', x: 200, y: 250, size: 48 },
  { name: 'Heart', shape: 'triangle-small', x: 272, y: 216, size: 36 },
  { name: 'Sacral', shape: 'square', x: 168, y: 318, size: 64 },
  { name: 'Solar Plexus', shape: 'triangle-down', x: 282, y: 322, size: 44 },
  { name: 'Spleen', shape: 'triangle-up', x: 118, y: 322, size: 44 },
  { name: 'Root', shape: 'square', x: 168, y: 420, size: 64 },
];

// Channel connections: [centerA index, centerB index]
const CHANNEL_CONNECTIONS: [number, number][] = [
  [0, 1],   // Head - Ajna
  [1, 2],   // Ajna - Throat
  [2, 3],   // Throat - G Center
  [2, 4],   // Throat - Heart
  [3, 4],   // G Center - Heart
  [3, 5],   // G Center - Sacral
  [5, 6],   // Sacral - Solar Plexus
  [5, 7],   // Sacral - Spleen
  [5, 8],   // Sacral - Root
  [6, 8],   // Solar Plexus - Root
  [7, 8],   // Spleen - Root
];

// Gate-to-center mapping for channel display
const GATE_TO_CENTER: Record<number, string> = {
  64: 'Head', 61: 'Head', 63: 'Head',
  47: 'Ajna', 24: 'Ajna', 4: 'Ajna', 17: 'Ajna', 43: 'Ajna', 11: 'Ajna',
  62: 'Throat', 23: 'Throat', 56: 'Throat', 35: 'Throat', 12: 'Throat',
  45: 'Throat', 33: 'Throat', 8: 'Throat', 31: 'Throat', 20: 'Throat', 16: 'Throat',
  10: 'G Center', 25: 'G Center', 46: 'G Center', 15: 'G Center', 2: 'G Center', 1: 'G Center', 13: 'G Center', 7: 'G Center',
  21: 'Heart', 40: 'Heart', 26: 'Heart', 51: 'Heart',
  5: 'Sacral', 14: 'Sacral', 29: 'Sacral', 59: 'Sacral', 9: 'Sacral', 3: 'Sacral', 42: 'Sacral', 27: 'Sacral', 34: 'Sacral',
  6: 'Solar Plexus', 37: 'Solar Plexus', 49: 'Solar Plexus', 55: 'Solar Plexus', 30: 'Solar Plexus', 36: 'Solar Plexus', 22: 'Solar Plexus',
  48: 'Spleen', 57: 'Spleen', 32: 'Spleen', 28: 'Spleen', 50: 'Spleen', 44: 'Spleen', 18: 'Spleen',
  53: 'Root', 60: 'Root', 52: 'Root', 19: 'Root', 39: 'Root', 41: 'Root', 58: 'Root', 38: 'Root', 54: 'Root',
};

function getCenterPoint(center: typeof CENTERS[0]): { cx: number; cy: number } {
  switch (center.shape) {
    case 'triangle-up': return { cx: center.x, cy: center.y + center.size * 0.4 };
    case 'triangle-down': return { cx: center.x, cy: center.y + center.size * 0.3 };
    case 'square': return { cx: center.x + center.size / 2, cy: center.y + center.size / 2 };
    case 'diamond': return { cx: center.x, cy: center.y };
    case 'triangle-small': return { cx: center.x, cy: center.y + center.size * 0.3 };
  }
}

function CenterShape({
  center,
  isDefined,
  delay,
}: {
  center: typeof CENTERS[0];
  isDefined: boolean;
  delay: number;
}) {
  const fill = isDefined ? 'rgba(139,92,246,0.85)' : 'rgba(13,11,26,0.4)';
  const stroke = isDefined ? '#8B5CF6' : '#4B4570';
  const strokeWidth = isDefined ? 1.5 : 1;
  const filterRef = isDefined ? 'url(#centerGlow)' : undefined;
  const { x, y, size, shape } = center;

  const ShapeEl = () => {
    switch (shape) {
      case 'triangle-up': {
        const cx = x, cy = y;
        const h = size * 0.9;
        const w = size;
        return (
          <polygon
            points={`${cx},${cy} ${cx - w / 2},${cy + h} ${cx + w / 2},${cy + h}`}
            fill={fill} stroke={stroke} strokeWidth={strokeWidth} filter={filterRef}
          />
        );
      }
      case 'triangle-down': {
        const cx = x, cy = y;
        const h = size * 0.9;
        const w = size;
        return (
          <polygon
            points={`${cx},${cy + h} ${cx - w / 2},${cy} ${cx + w / 2},${cy}`}
            fill={fill} stroke={stroke} strokeWidth={strokeWidth} filter={filterRef}
          />
        );
      }
      case 'square':
        return (
          <rect
            x={x} y={y} width={size} height={size}
            rx="4" fill={fill} stroke={stroke} strokeWidth={strokeWidth} filter={filterRef}
          />
        );
      case 'diamond': {
        const cx = x, cy = y;
        const hw = size * 0.65;
        const hh = size * 0.5;
        return (
          <polygon
            points={`${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`}
            fill={fill} stroke={stroke} strokeWidth={strokeWidth} filter={filterRef}
          />
        );
      }
      case 'triangle-small': {
        const cx = x, cy = y;
        const h = size * 0.8;
        const w = size * 0.9;
        return (
          <polygon
            points={`${cx},${cy} ${cx - w / 2},${cy + h} ${cx + w / 2},${cy + h}`}
            fill={fill} stroke={stroke} strokeWidth={strokeWidth} filter={filterRef}
          />
        );
      }
    }
  };

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      style={{ transformOrigin: `${getCenterPoint(center).cx}px ${getCenterPoint(center).cy}px` }}
    >
      <ShapeEl />
    </motion.g>
  );
}

function getActiveConnectionIndices(activeChannels: number[][]): Set<string> {
  const active = new Set<string>();
  for (const [g1, g2] of activeChannels) {
    const c1 = GATE_TO_CENTER[g1];
    const c2 = GATE_TO_CENTER[g2];
    if (c1 && c2 && c1 !== c2) {
      const i1 = CENTERS.findIndex((c) => c.name === c1);
      const i2 = CENTERS.findIndex((c) => c.name === c2);
      if (i1 !== -1 && i2 !== -1) {
        const key = [Math.min(i1, i2), Math.max(i1, i2)].join('-');
        active.add(key);
      }
    }
  }
  return active;
}

export function BodyGraph({ definedCenters, activeChannels }: Props) {
  const activeConnectionKeys = getActiveConnectionIndices(activeChannels);

  return (
    <div className="glass-card p-6 flex items-center justify-center">
      <svg
        viewBox="0 0 400 510"
        width="100%"
        style={{ maxWidth: 340, display: 'block' }}
      >
        <defs>
          <filter id="centerGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Channel lines */}
        {CHANNEL_CONNECTIONS.map(([ai, bi]) => {
          const a = CENTERS[ai];
          const b = CENTERS[bi];
          const pa = getCenterPoint(a);
          const pb = getCenterPoint(b);
          const key = [Math.min(ai, bi), Math.max(ai, bi)].join('-');
          const active = activeConnectionKeys.has(key);

          return (
            <motion.line
              key={key}
              x1={pa.cx} y1={pa.cy}
              x2={pb.cx} y2={pb.cy}
              stroke={active ? '#8B5CF6' : 'rgba(75,69,112,0.3)'}
              strokeWidth={active ? 2.5 : 0.8}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
          );
        })}

        {/* Centers */}
        {CENTERS.map((center, i) => (
          <CenterShape
            key={center.name}
            center={center}
            isDefined={definedCenters.map((c) => c.toLowerCase()).includes(center.name.toLowerCase())}
            delay={i * 0.06 + 0.1}
          />
        ))}

        {/* Center labels */}
        {CENTERS.map((center) => {
          const pt = getCenterPoint(center);
          const isDefined = definedCenters.map((c) => c.toLowerCase()).includes(center.name.toLowerCase());
          return (
            <motion.text
              key={`label-${center.name}`}
              x={pt.cx}
              y={pt.cy + 4}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7"
              fontFamily="Manrope, sans-serif"
              fontWeight="600"
              fill={isDefined ? 'white' : 'rgba(156,163,175,0.6)'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {center.name === 'G Center' ? 'G' : center.name === 'Solar Plexus' ? 'SP' : center.name === 'Heart' ? '♥' : center.name.slice(0, 4)}
            </motion.text>
          );
        })}
      </svg>
    </div>
  );
}
