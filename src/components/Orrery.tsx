import { useId } from "react";
import { ORBIT_POSITIONS, type Season, positionForAngle } from "../data/astronomy";
import { cn } from "../utils/cn";

export type OrreryView = "3d" | "top" | "side";

const SEASON_HEX: Record<Season, string> = {
  Semi: "#6ee7b7",
  Panas: "#fcd34d",
  Gugur: "#fdba74",
  Dingin: "#7dd3fc",
};

const VIEW_SETTINGS: Record<OrreryView, { rx: number; ry: number; earthR: number }> = {
  "3d": { rx: 305, ry: 170, earthR: 38 },
  top: { rx: 205, ry: 205, earthR: 33 },
  side: { rx: 320, ry: 85, earthR: 40 },
};

export function Orrery({
  angle,
  tilt = 23.5,
  view = "3d",
  showAxis = true,
  showRays = true,
  showAngle = true,
  showOrbit = true,
  showSeasons = true,
  earthSpinning = false,
  className,
}: {
  angle: number;
  tilt?: number;
  view?: OrreryView;
  showAxis?: boolean;
  showRays?: boolean;
  showAngle?: boolean;
  showOrbit?: boolean;
  showSeasons?: boolean;
  earthSpinning?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cx = 450;
  const cy = 300;
  const settings = VIEW_SETTINGS[view];
  const rad = (angle * Math.PI) / 180;
  const ex = cx + settings.rx * Math.cos(rad);
  const ey = cy - settings.ry * Math.sin(rad);
  const earthR = settings.earthR;
  const axisRad = (tilt * Math.PI) / 180;
  const axisLen = earthR + 22;
  const northX = ex + Math.sin(axisRad) * axisLen;
  const northY = ey - Math.cos(axisRad) * axisLen;
  const southX = ex - Math.sin(axisRad) * axisLen;
  const southY = ey + Math.cos(axisRad) * axisLen;
  const sunDir = Math.atan2(cy - ey, cx - ex);
  const lx = Math.cos(sunDir);
  const ly = Math.sin(sunDir);
  const distance = Math.hypot(cx - ex, cy - ey);
  const ux = (cx - ex) / (distance || 1);
  const uy = (cy - ey) / (distance || 1);
  const px = -uy;
  const py = ux;
  const activePosition = positionForAngle(angle);
  const activeKey = activePosition.key;
  const tiltShowsSeasons = tilt >= 1;
  const declination = tilt * Math.cos(((angle - 180) * Math.PI) / 180);
  const northHighlighted = tiltShowsSeasons && declination > 0.5;
  const southHighlighted = tiltShowsSeasons && declination < -0.5;
  const tiltLabel = tilt.toFixed(1).replace(".", ",");
  const arcRadius = earthR + 24;

  const labelWidth = 168;
  const labelHeight = 38;
  const labelPlacement = (() => {
    let left = ex - labelWidth / 2;
    let top = ey + earthR + 18;
    if (activeKey === "maret") {
      top = ey - earthR - labelHeight - 16;
    }
    if (view === "side") {
      top = activeKey === "maret" ? ey - earthR - labelHeight - 12 : ey + earthR + 14;
    }
    left = Math.max(8, Math.min(900 - labelWidth - 8, left));
    top = Math.max(8, Math.min(600 - labelHeight - 8, top));
    return { left, top };
  })();

  return (
    <svg
      viewBox="0 0 900 600"
      className={cn("h-auto w-full select-none", className)}
      role="img"
      aria-label={`Ilustrasi orbit Bumi, kemiringan sumbu ${tiltLabel} derajat, dan posisi musim. Ukuran dan jarak tidak berskala.`}
    >
      <defs>
        <radialGradient id={`${uid}-sun`} cx="38%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#fffde7" />
          <stop offset="26%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="84%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <radialGradient id={`${uid}-sun-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.45" />
          <stop offset="52%" stopColor="#fbbf24" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-earth`} cx="33%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="66%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#082f49" />
        </radialGradient>
        <linearGradient id={`${uid}-land`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="55%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <radialGradient
          id={`${uid}-night`}
          cx={`${50 - lx * 43}%`}
          cy={`${50 - ly * 43}%`}
          r="76%"
          fx={`${50 - lx * 45}%`}
          fy={`${50 - ly * 45}%`}
        >
          <stop offset="0%" stopColor="#020617" stopOpacity="0.9" />
          <stop offset="44%" stopColor="#020617" stopOpacity="0.48" />
          <stop offset="76%" stopColor="#020617" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={`${uid}-shine`}
          cx={`${50 + lx * 34}%`}
          cy={`${50 + ly * 34}%`}
          r="52%"
        >
          <stop offset="0%" stopColor="#fff8dc" stopOpacity="0.34" />
          <stop offset="52%" stopColor="#fde68a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-earth-clip`}>
          <circle cx={ex} cy={ey} r={earthR} />
        </clipPath>
        <filter id={`${uid}-sun-bloom`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <g id={`${uid}-orrery-map`} transform="translate(-15 -10)">
          <path
            d="M52 73 C63 58 87 52 105 60 C116 65 115 78 106 84 L95 98 C85 104 71 101 63 91 C55 85 50 79 52 73 Z"
            fill={`url(#${uid}-land)`}
          />
          <path
            d="M92 103 C104 100 116 108 118 119 C121 132 123 146 114 163 C109 174 101 182 96 172 C89 157 91 139 87 126 C85 116 86 107 92 103 Z"
            fill={`url(#${uid}-land)`}
          />
          <path
            d="M143 103 C158 97 174 103 179 116 C183 133 177 151 166 164 C156 172 149 164 146 150 C141 133 138 117 143 103 Z"
            fill={`url(#${uid}-land)`}
          />
          <path
            d="M158 66 C177 52 200 55 213 67 C222 76 218 89 205 94 L190 105 C178 107 169 99 163 91 L151 83 Z"
            fill={`url(#${uid}-land)`}
          />
          <path
            d="M169 152 C183 144 202 148 208 161 C211 173 197 181 183 178 C173 175 165 163 169 152 Z"
            fill={`url(#${uid}-land)`}
          />
          <path
            d="M132 52 C143 48 154 53 155 63 C154 73 143 78 134 73 C128 67 127 57 132 52 Z"
            fill={`url(#${uid}-land)`}
            opacity="0.8"
          />
          <path
            d="M104 190 C119 186 143 188 150 193 C131 198 115 198 104 190 Z"
            fill="#e2e8f0"
            opacity="0.55"
          />
        </g>
        <marker
          id={`${uid}-arrow`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
        </marker>
      </defs>

      {/* Bidang orbit */}
      {showOrbit && (
        <>
          <ellipse
            cx={cx}
            cy={cy}
            rx={settings.rx + 18}
            ry={settings.ry + 18}
            fill="rgba(8, 47, 73, 0.12)"
          />
          <ellipse
            cx={cx}
            cy={cy}
            rx={settings.rx}
            ry={settings.ry}
            fill="none"
            stroke="#38bdf8"
            strokeOpacity="0.3"
            strokeWidth="1.4"
            strokeDasharray="3 7"
            className="orbit-dash"
          />
          <ellipse
            cx={cx}
            cy={cy}
            rx={settings.rx - 20}
            ry={settings.ry - 20}
            fill="none"
            stroke="#22d3ee"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        </>
      )}

      {/* Panah arah revolusi */}
      {showOrbit &&
        (() => {
          const arrowAngle = (225 * Math.PI) / 180;
          const ax = cx + settings.rx * Math.cos(arrowAngle);
          const ay = cy - settings.ry * Math.sin(arrowAngle);
          const rotation =
            (Math.atan2(-settings.ry * Math.cos(arrowAngle), -settings.rx * Math.sin(arrowAngle)) *
              180) /
            Math.PI;
          return (
            <g transform={`translate(${ax} ${ay}) rotate(${rotation})`} opacity="0.9">
              <path d="M -8 -5 L 8 0 L -8 5 Z" fill="#67e8f9" />
            </g>
          );
        })()}

      {/* Matahari */}
      <circle cx={cx} cy={cy} r="122" fill={`url(#${uid}-sun-glow)`} />
      <circle cx={cx} cy={cy} r="50" fill="none" stroke="#fbbf24" strokeOpacity="0.22" />
      <circle
        cx={cx}
        cy={cy}
        r="41"
        fill={`url(#${uid}-sun)`}
        filter={`url(#${uid}-sun-bloom)`}
      />
      <circle cx={cx - 10} cy={cy - 11} r="24" fill="#fff7d6" opacity="0.15" />
      <text
        x={cx}
        y={cy + 67}
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        fill="#fde68a"
        letterSpacing="1.4"
      >
        MATAHARI
      </text>
      {showOrbit &&
        ORBIT_POSITIONS.map((position) => {
          const pRad = (position.angle * Math.PI) / 180;
          const mx = cx + settings.rx * Math.cos(pRad);
          const my = cy - settings.ry * Math.sin(pRad);
          const isActive = activeKey === position.key;
          return (
            <g key={position.key}>
              <circle
                cx={mx}
                cy={my}
                r={isActive ? 6 : 4}
                fill={isActive ? "#f8fafc" : "#0e7490"}
                stroke={isActive ? "#fbbf24" : "#67e8f9"}
                strokeWidth={isActive ? 2 : 1.2}
                opacity={isActive ? 1 : 0.7}
              />
              {isActive && (
                <circle cx={mx} cy={my} r="12" fill="none" stroke="#fbbf24" strokeOpacity="0.4" />
              )}
            </g>
          );
        })}

      {/* Sinar Matahari menuju Bumi */}
      {showRays && (
        <>
          <line
            x1={cx + ux * 47}
            y1={cy + uy * 47}
            x2={ex - ux * (earthR + 8)}
            y2={ey - uy * (earthR + 8)}
            stroke="#fcd34d"
            strokeOpacity="0.24"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          {[-2, -1, 0, 1, 2].map((i) => {
            const offset = i * (earthR * 0.42);
            const startX = ex - ux * (earthR + 72) + px * offset;
            const startY = ey - uy * (earthR + 72) + py * offset;
            const endX = ex - ux * (earthR + 4) + px * offset;
            const endY = ey - uy * (earthR + 4) + py * offset;
            return (
              <line
                key={i}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="#fcd34d"
                strokeWidth={i === 0 ? 1.6 : 1.1}
                strokeOpacity={i === 0 ? 0.92 : 0.6}
                markerEnd={`url(#${uid}-arrow)`}
              />
            );
          })}
        </>
      )}

      {/* Bumi */}
      <circle cx={ex} cy={ey} r={earthR + 12} fill="#22d3ee" opacity="0.055" />
      <circle cx={ex} cy={ey} r={earthR + 4} fill="#0f172a" opacity="0.55" />
      <circle cx={ex} cy={ey} r={earthR} fill={`url(#${uid}-earth)`} />
      <g clipPath={`url(#${uid}-earth-clip)`}>
        <g transform={`translate(${ex} ${ey}) scale(${earthR / 82}) translate(-130 -130)`}>
          <g className={earthSpinning ? "animate-globe" : undefined}>
            <use href={`#${uid}-orrery-map`} />
            <use href={`#${uid}-orrery-map`} x="260" />
          </g>
          <path
            d="M52 73 C63 58 87 52 105 60 C116 65 115 78 106 84 L95 98 C85 104 71 101 63 91 C55 85 50 79 52 73 Z"
            fill="#34d399"
            opacity="0.72"
          />
          <path
            d="M143 103 C158 97 174 103 179 116 C183 133 177 151 166 164 C156 172 149 164 146 150 C141 133 138 117 143 103 Z"
            fill="#34d399"
            opacity="0.66"
          />
        </g>
        <circle cx={ex} cy={ey} r={earthR} fill={`url(#${uid}-night)`} />
        <circle cx={ex} cy={ey} r={earthR} fill={`url(#${uid}-shine)`} />
      </g>
      <circle
        cx={ex}
        cy={ey}
        r={earthR}
        fill="none"
        stroke="#a5f3fc"
        strokeOpacity="0.35"
        strokeWidth="0.9"
      />

      {/* Garis khatulistiwa pada globe */}
      <line
        x1={ex - Math.cos(axisRad) * earthR * 0.9}
        y1={ey - Math.sin(axisRad) * earthR * 0.9}
        x2={ex + Math.cos(axisRad) * earthR * 0.9}
        y2={ey + Math.sin(axisRad) * earthR * 0.9}
        stroke="#fef3c7"
        strokeWidth="0.8"
        strokeDasharray="2.5 2.5"
        opacity="0.52"
      />

      {/* Garis sumbu Bumi — arah tetap, tidak mengikuti orbit */}
      {showAxis && (
        <>
          <line
            x1={northX}
            y1={northY}
            x2={southX}
            y2={southY}
            stroke="#f8fafc"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.94"
          />
          <line
            x1={northX}
            y1={northY}
            x2={southX}
            y2={southY}
            stroke="#67e8f9"
            strokeWidth="0.9"
            strokeDasharray="1 4"
            opacity="0.8"
          />
          <circle cx={northX} cy={northY} r={northHighlighted ? 7.5 : 4.5} fill="#fbbf24" />
          <circle cx={southX} cy={southY} r={southHighlighted ? 7 : 3.8} fill="#22d3ee" />
          <circle cx={northX} cy={northY} r="8.5" fill="none" stroke="#fbbf24" strokeOpacity="0.36" />
          {northHighlighted && (
            <circle cx={northX} cy={northY} r="14" fill="none" stroke="#fbbf24" strokeOpacity="0.42" strokeWidth="1.4" />
          )}
          {southHighlighted && (
            <circle cx={southX} cy={southY} r="13" fill="none" stroke="#22d3ee" strokeOpacity="0.42" strokeWidth="1.4" />
          )}
          <text
            x={northX + (southX < northX ? 8 : 10)}
            y={northY + 4}
            fontSize="13"
            fontWeight="800"
            fill="#fde68a"
          >
            U
          </text>
          <text
            x={southX + (southX < northX ? -9 : 10)}
            y={southY + 4}
            fontSize="13"
            fontWeight="800"
            fill="#a5f3fc"
            textAnchor={southX < northX ? "end" : "start"}
          >
            S
          </text>
        </>
      )}

      {/* Indikator sudut */}
      {showAngle && tilt > 0.4 && (
        <>
          <line
            x1={ex}
            y1={ey}
            x2={ex}
            y2={ey - arcRadius - 20}
            stroke="#e2e8f0"
            strokeWidth="0.9"
            strokeDasharray="4 4"
            opacity="0.38"
          />
          <path
            d={`M ${ex} ${ey - arcRadius} A ${arcRadius} ${arcRadius} 0 0 1 ${
              ex + Math.sin(axisRad) * arcRadius
            } ${ey - Math.cos(axisRad) * arcRadius}`}
            fill="none"
            stroke="#fcd34d"
            strokeWidth="1.4"
          />
          <g
            transform={`translate(${ex + Math.sin(axisRad / 2) * (arcRadius + 22) - 21} ${
              ey - Math.cos(axisRad / 2) * (arcRadius + 22) - 9
            })`}
          >
            <rect
              width="44"
              height="18"
              rx="6"
              fill="#0b1732"
              stroke="#fcd34d"
              strokeOpacity="0.36"
            />
            <text x="22" y="12.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fde68a">
              {tiltLabel}°
            </text>
          </g>
        </>
      )}

      {/* Label posisi orbit */}
      {showOrbit && showSeasons && (
        <g>
          {ORBIT_POSITIONS.filter((position) => position.key !== activeKey).map((position) => {
            const pRad = (position.angle * Math.PI) / 180;
            const mx = cx + settings.rx * Math.cos(pRad);
            const my = cy - settings.ry * Math.sin(pRad);
            const text = position.month.toUpperCase();
            const width = 22 + text.length * 7.6;
            let left = mx - width / 2;
            let top = my + earthR + 10;
            if (position.key === "maret") {
              top = my - earthR - 28;
            } else if (position.key === "juni") {
              left = mx - earthR - width - 10;
              top = my - 12;
            } else if (position.key === "desember") {
              left = mx + earthR + 10;
              top = my - 12;
            }
            left = Math.max(8, Math.min(900 - width - 8, left));
            top = Math.max(8, Math.min(600 - 30, top));
            return (
              <g key={position.key} opacity="0.9">
                <rect
                  x={left}
                  y={top}
                  width={width}
                  height="24"
                  rx="7"
                  fill="#071227"
                  fillOpacity="0.88"
                  stroke="rgba(103,232,249,0.22)"
                  strokeWidth="0.8"
                />
                <text
                  x={left + width / 2}
                  y={top + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#bae6fd"
                  letterSpacing="0.5"
                >
                  {text}
                </text>
              </g>
            );
          })}
          <g
            transform={`translate(${labelPlacement.left} ${labelPlacement.top})`}
            style={{ transition: "transform 300ms ease" }}
          >
            <rect
              width={labelWidth}
              height={labelHeight}
              rx="9"
              fill="#0b1b3b"
              fillOpacity="0.94"
              stroke="#fbbf24"
              strokeOpacity="0.62"
              strokeWidth="1.1"
            />
            <text x={labelWidth / 2} y="16" textAnchor="middle" fontSize="12" fontWeight="700" fill="#e2e8f0">
              {activePosition.month} · {activePosition.kind}
            </text>
            <text x={labelWidth / 2} y="30" textAnchor="middle" fontSize="10" fill="#94a3b8">
              {tiltShowsSeasons ? (
                <>
                  <tspan fill={SEASON_HEX[activePosition.northSeason]}>
                    U {activePosition.northSeason}
                  </tspan>
                  <tspan fill="#64748b"> · </tspan>
                  <tspan fill={SEASON_HEX[activePosition.southSeason]}>
                    S {activePosition.southSeason}
                  </tspan>
                </>
              ) : (
                <tspan fill="#94a3b8">Penyinaran antarbelahan ~serupa</tspan>
              )}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}

export function OrreryLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-500">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-solar-400" /> Kutub Utara (U)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Kutub Selatan (S)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-px w-4 bg-slate-400" /> Garis sumbu tetap miring
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-px w-4 border-t border-dashed border-amber-300/60" /> Khatulistiwa
      </span>
      <span className="ml-auto hidden sm:inline">Ilustrasi · jarak dan ukuran tidak berskala</span>
    </div>
  );
}
