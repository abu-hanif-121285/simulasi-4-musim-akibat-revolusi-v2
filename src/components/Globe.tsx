import { useId } from "react";
import { cn } from "../utils/cn";

const LAND_PATHS = [
  // Amerika Utara
  "M52 73 C63 58 87 52 105 60 C116 65 115 78 106 84 L95 98 C85 104 71 101 63 91 C55 85 50 79 52 73 Z",
  // Amerika Tengah & Selatan
  "M92 103 C104 100 116 108 118 119 C121 132 123 146 114 163 C109 174 101 182 96 172 C89 157 91 139 87 126 C85 116 86 107 92 103 Z",
  // Greenland
  "M132 52 C143 48 154 53 155 63 C154 73 143 78 134 73 C128 67 127 57 132 52 Z",
  // Eropa
  "M129 87 C140 81 156 82 162 91 C165 98 156 104 146 104 L134 100 Z",
  // Afrika
  "M143 103 C158 97 174 103 179 116 C183 133 177 151 166 164 C156 172 149 164 146 150 C141 133 138 117 143 103 Z",
  // Asia
  "M158 66 C177 52 200 55 213 67 C222 76 218 89 205 94 L190 105 C178 107 169 99 163 91 L151 83 Z",
  // Asia tenggara & kepulauan
  "M183 105 C192 102 199 108 196 116 C192 121 186 120 183 114 Z M201 124 C207 122 211 126 210 131 C207 134 202 133 201 129 Z",
  // Australia
  "M169 152 C183 144 202 148 208 161 C211 173 197 181 183 178 C173 175 165 163 169 152 Z",
  // Antartika
  "M84 195 C112 186 155 188 182 197 C164 206 104 207 84 195 Z",
  // Pulau tambahan
  "M72 152 C77 150 81 154 80 159 C77 162 71 161 70 157 Z M216 101 C220 99 223 103 222 107 C219 109 215 108 215 105 Z",
];

export function Globe({
  size = 220,
  tilt = 23.5,
  showAxis = true,
  showLabels = false,
  showEquator = false,
  spinning = false,
  lightAngle = 0,
  className,
  name = "Bola Bumi dengan sumbu miring",
}: {
  size?: number;
  tilt?: number;
  showAxis?: boolean;
  showLabels?: boolean;
  showEquator?: boolean;
  spinning?: boolean;
  lightAngle?: number;
  className?: string;
  name?: string;
}) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const cx = 130;
  const cy = 130;
  const r = 82;
  const rad = (tilt * Math.PI) / 180;
  const axisLen = 116;
  const nx = cx + Math.sin(rad) * axisLen;
  const ny = cy - Math.cos(rad) * axisLen;
  const sx = cx - Math.sin(rad) * axisLen;
  const sy = cy + Math.cos(rad) * axisLen;
  const lightRad = (lightAngle * Math.PI) / 180;
  const lx = Math.cos(lightRad);
  const ly = Math.sin(lightRad);

  return (
    <svg
      viewBox="0 0 260 260"
      width={size}
      height={size}
      className={cn("select-none overflow-visible", className)}
      role="img"
      aria-label={`${name}. Kemiringan sumbu sekitar ${tilt.toFixed(1).replace(".", ",")} derajat.`}
    >
      <defs>
        <radialGradient id={`${uid}-ocean`} cx="32%" cy="26%" r="82%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="26%" stopColor="#38bdf8" />
          <stop offset="58%" stopColor="#0e7490" />
          <stop offset="86%" stopColor="#075985" />
          <stop offset="100%" stopColor="#082f49" />
        </radialGradient>
        <linearGradient id={`${uid}-land`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="48%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <radialGradient
          id={`${uid}-night`}
          cx={`${50 - lx * 38}%`}
          cy={`${50 - ly * 38}%`}
          r="76%"
          fx={`${50 - lx * 40}%`}
          fy={`${50 - ly * 40}%`}
        >
          <stop offset="0%" stopColor="#020617" stopOpacity="0.94" />
          <stop offset="44%" stopColor="#020617" stopOpacity="0.66" />
          <stop offset="72%" stopColor="#020617" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={`${uid}-shine`}
          cx={`${50 + lx * 36}%`}
          cy={`${50 + ly * 36}%`}
          r="54%"
        >
          <stop offset="0%" stopColor="#fff7d6" stopOpacity="0.36" />
          <stop offset="45%" stopColor="#fde68a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <g id={`${uid}-map`}>
          {LAND_PATHS.map((d, index) => (
            <path
              key={index}
              d={d}
              fill={`url(#${uid}-land)`}
              opacity={index === 8 ? 0.76 : 0.96}
              stroke="#065f46"
              strokeOpacity="0.28"
              strokeWidth="0.7"
            />
          ))}
          <path
            d="M108 61 C118 58 125 62 128 67 C119 69 113 68 108 61 Z"
            fill="#f8fafc"
            opacity="0.42"
          />
          <path
            d="M104 190 C119 186 143 188 150 193 C131 198 115 198 104 190 Z"
            fill="#f8fafc"
            opacity="0.48"
          />
        </g>
        <filter id={`${uid}-glow`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx={cx} cy={cy} r={r + 7} fill="#22d3ee" opacity="0.06" />

      {showAxis && (
        <line
          x1={nx}
          y1={ny}
          x2={sx}
          y2={sy}
          stroke="#e2e8f0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 5"
          opacity="0.5"
        />
      )}

      <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}-ocean)`} stroke="#67e8f9" strokeOpacity="0.38" />
      <g clipPath={`url(#${uid}-clip)`}>
        <g
          style={spinning ? { animation: "globe-drift 30s linear infinite" } : undefined}
        >
          <use href={`#${uid}-map`} />
          <use href={`#${uid}-map`} x="260" />
        </g>
        <ellipse cx={cx} cy={cy} rx={r} ry={r} fill={`url(#${uid}-night)`} />
        <ellipse cx={cx} cy={cy} rx={r} ry={r} fill={`url(#${uid}-shine)`} />
        <ellipse
          cx={cx - 20}
          cy={cy - 28}
          rx="38"
          ry="24"
          fill="#ffffff"
          opacity="0.055"
          transform="rotate(-25 110 102)"
        />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#a5f3fc" strokeOpacity="0.32" strokeWidth="0.9" />

      {showEquator && (
        <line
          x1={cx - Math.cos(rad) * r * 0.98}
          y1={cy - Math.sin(rad) * r * 0.98}
          x2={cx + Math.cos(rad) * r * 0.98}
          y2={cy + Math.sin(rad) * r * 0.98}
          stroke="#fef3c7"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.7"
        />
      )}

      {showAxis && (
        <>
          <line
            x1={nx}
            y1={ny}
            x2={sx}
            y2={sy}
            stroke="#f8fafc"
            strokeWidth="1.7"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx={nx} cy={ny} r="4.2" fill="#fbbf24" filter={`url(#${uid}-glow)`} />
          <circle cx={sx} cy={sy} r="3.2" fill="#22d3ee" />
          <circle cx={cx} cy={cy} r="1.8" fill="#f8fafc" opacity="0.9" />
          {showLabels && (
            <>
              <text
                x={Math.min(238, nx + 7)}
                y={ny + 2}
                textAnchor={nx + 55 > 260 ? "end" : "start"}
                fontSize="8"
                fontWeight="700"
                fill="#fde68a"
              >
                Kutub Utara
              </text>
              <text
                x={Math.max(22, sx - 7)}
                y={sy + 2}
                textAnchor="end"
                fontSize="8"
                fontWeight="700"
                fill="#a5f3fc"
              >
                Kutub Selatan
              </text>
            </>
          )}
        </>
      )}
    </svg>
  );
}
