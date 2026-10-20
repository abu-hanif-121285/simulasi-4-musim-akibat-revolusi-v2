import { useId } from "react";
import { ArrowDownToLine, CloudRain, Sun, Waves } from "lucide-react";
import { Globe } from "./Globe";
import { cn } from "../utils/cn";

export function TiltReferenceDiagram({
  showAngle = true,
  showReference = true,
  upright = false,
  className,
}: {
  showAngle?: boolean;
  showReference?: boolean;
  upright?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cx = 300;
  const cy = 195;
  const r = 72;
  const tilt = upright ? 0 : 23.5;
  const rad = (tilt * Math.PI) / 180;
  const axisLen = 132;
  const nx = cx + Math.sin(rad) * axisLen;
  const ny = cy - Math.cos(rad) * axisLen;
  const sx = cx - Math.sin(rad) * axisLen;
  const sy = cy + Math.cos(rad) * axisLen;

  return (
    <svg
      viewBox="0 0 600 370"
      className={cn("w-full select-none", className)}
      role="img"
      aria-label={`Diagram kemiringan sumbu Bumi ${upright ? "0 derajat (tegak)" : "23,5 derajat dari garis tegak lurus bidang orbit"}.`}
    >
      <defs>
        <radialGradient id={`${uid}-ocean`} cx="32%" cy="28%" r="82%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="36%" stopColor="#38bdf8" />
          <stop offset="72%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#082f49" />
        </radialGradient>
        <linearGradient id={`${uid}-plane`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.01" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <radialGradient id={`${uid}-night`} cx="26%" cy="32%" r="85%">
          <stop offset="0%" stopColor="#020617" stopOpacity="0.68" />
          <stop offset="60%" stopColor="#020617" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.02" />
        </radialGradient>
      </defs>

      {/* Bidang orbit sebagai acuan */}
      <ellipse cx={cx} cy="300" rx="230" ry="48" fill={`url(#${uid}-plane)`} stroke="#38bdf8" strokeOpacity="0.28" strokeDasharray="5 6" />
      <ellipse cx={cx} cy="300" rx="143" ry="29" fill="none" stroke="#22d3ee" strokeOpacity="0.12" />
      <text x={cx} y="356" textAnchor="middle" fontSize="11" fill="#7dd3fc" fontWeight="600">
        BIDANG ORBIT (ILUSTRASI)
      </text>

      {/* Garis tegak lurus */}
      {showReference && (
        <>
          <line
            x1={cx}
            y1="40"
            x2={cx}
            y2="316"
            stroke="#e2e8f0"
            strokeWidth="1.2"
            strokeDasharray="6 6"
            opacity="0.45"
          />
          <rect x={cx - 79} y="20" width="158" height="20" rx="6" fill="#08152c" stroke="rgba(226,232,240,0.16)" />
          <text x={cx} y="34" textAnchor="middle" fontSize="9.5" fill="#cbd5e1" fontWeight="600">
            GARIS TEGAK LURUS BIDANG ORBIT
          </text>
        </>
      )}

      {/* Bumi */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}-ocean)`} />
      <g clipPath={`url(#${uid}-clip)`}>
        <path
          d="M252 160 C268 146 294 143 310 153 C320 160 315 173 303 178 L287 191 C272 195 258 187 252 176 Z"
          fill="#34d399"
          opacity="0.9"
        />
        <path
          d="M320 184 C335 177 351 185 353 199 C355 214 344 230 330 234 C322 220 319 201 320 184 Z"
          fill="#10b981"
          opacity="0.92"
        />
        <path
          d="M300 143 C315 134 338 139 346 150 C350 158 338 164 327 162 L311 158 Z"
          fill="#6ee7b7"
          opacity="0.8"
        />
        <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}-night)`} />
        <ellipse cx={cx - 22} cy={cy - 31} rx="24" ry="17" fill="#fff" opacity="0.1" />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#a5f3fc" strokeOpacity="0.4" />

      {/* Khatulistiwa */}
      <line
        x1={cx - Math.cos(rad) * r}
        y1={cy - Math.sin(rad) * r}
        x2={cx + Math.cos(rad) * r}
        y2={cy + Math.sin(rad) * r}
        stroke="#fef3c7"
        strokeWidth="1.1"
        strokeDasharray="4 4"
        opacity="0.7"
      />

      {/* Sumbu */}
      <line x1={nx} y1={ny} x2={sx} y2={sy} stroke="#f8fafc" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx={nx} cy={ny} r="5" fill="#fbbf24" />
      <circle cx={sx} cy={sy} r="4" fill="#22d3ee" />
      <text x={nx + 10} y={ny + 4} fontSize="10" fontWeight="700" fill="#fde68a">U</text>
      <text x={sx + 10} y={sy + 4} fontSize="10" fontWeight="700" fill="#a5f3fc">S</text>

      {/* Sudut kemiringan */}
      {showAngle && (
        <>
          {!upright && (
            <path
              d={`M ${cx} ${cy - 108} A 108 108 0 0 1 ${
                cx + Math.sin(rad) * 108
              } ${cy - Math.cos(rad) * 108}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.7"
            />
          )}
          <g transform={`translate(${cx + 44} ${cy - 132})`}>
            <rect
              width="78"
              height="25"
              rx="7"
              fill="#0b1732"
              stroke="#fbbf24"
              strokeOpacity="0.4"
            />
            <text x="39" y="17" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fde68a">
              {upright ? "0° (tegak)" : "23,5°"}
            </text>
          </g>
          {!upright && (
            <text x={cx - 26} y={cy + 28} fontSize="9" fill="#fcd34d" fontWeight="600">
              ≈66,5° ke bidang orbit
            </text>
          )}
        </>
      )}

      {!showReference && (
        <text x={cx} y="50" textAnchor="middle" fontSize="10" fill="#94a3b8">
          Garis acuan disembunyikan
        </text>
      )}
    </svg>
  );
}

function RayPanel({
  direct,
  active,
  onClick,
}: {
  direct: boolean;
  active: boolean;
  onClick?: () => void;
}) {
  const W = 280;
  const H = 175;
  const groundY = 132;
  const lines = Array.from({ length: 5 }, (_, i) => i);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-2 text-left transition-all",
        active
          ? "border-amber-300/45 bg-amber-300/[0.07] shadow-[inset_0_0_24px_rgba(251,191,36,0.08)]"
          : "border-white/10 bg-white/[0.025] hover:border-white/20",
      )}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={direct ? "Sinar tegak mengenai area kecil" : "Sinar miring mengenai area lebih luas"}>
        <defs>
          <linearGradient id={direct ? "beam-direct" : "beam-oblique"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.18" />
          </linearGradient>
          <radialGradient id={direct ? "hot-direct" : "hot-oblique"}>
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="55%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="#061024" rx="12" />
        {Array.from({ length: 5 }).map((_, i) => (
          <circle key={i} cx={12 + i * 9} cy={18 + i * 7} r="18" fill="#fbbf24" opacity="0.05" />
        ))}
        <circle cx="25" cy="24" r="13" fill="#fbbf24" opacity="0.9" />
        {lines.map((i) => {
          if (direct) {
            const x = 78 + i * 24;
            return (
              <g key={i}>
                <line x1={x} y1="18" x2={x} y2={groundY - 3} stroke="#fcd34d" strokeWidth="1.8" />
                <path d={`M ${x - 3} ${groundY - 11} L ${x} ${groundY - 3} L ${x + 3} ${groundY - 11} Z`} fill="#fcd34d" />
              </g>
            );
          }
          const startX = 50 + i * 24;
          const endX = startX + 92;
          return (
            <g key={i}>
              <line x1={startX} y1="18" x2={endX} y2={groundY - 4} stroke="#fcd34d" strokeWidth="1.8" />
              <path d={`M ${endX - 9} ${groundY - 10} L ${endX} ${groundY - 4} L ${endX - 7} ${groundY - 2} Z`} fill="#fcd34d" />
            </g>
          );
        })}
        <line x1="20" y1={groundY} x2={W - 16} y2={groundY} stroke="#38bdf8" strokeWidth="2" />
        <rect x="20" y={groundY} width={W - 36} height="18" rx="4" fill="#0e7490" opacity="0.28" />
        {direct ? (
          <ellipse cx="126" cy={groundY + 2} rx="55" ry="4" fill={`url(#hot-direct)`} opacity="0.95" />
        ) : (
          <ellipse cx="172" cy={groundY + 2} rx="94" ry="4" fill={`url(#hot-oblique)`} opacity="0.7" />
        )}
        <text x="24" y="163" fontSize="11" fontWeight="700" fill={direct ? "#fde68a" : "#94a3b8"}>
          {direct ? "Sinar lebih tegak → area kecil" : "Sinar lebih miring → area lebih luas"}
        </text>
        <text x={W - 18} y="163" textAnchor="end" fontSize="9" fill="#64748b">
          {direct ? "Energi lebih terkonsentrasi" : "Energi lebih tersebar"}
        </text>
      </svg>
    </button>
  );
}

export function BeamComparison({
  mode,
  onChange,
  className,
}: {
  mode: "tegak" | "miring";
  onChange?: (mode: "tegak" | "miring") => void;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      <RayPanel direct active={mode === "tegak"} onClick={() => onChange?.("tegak")} />
      <RayPanel direct={false} active={mode === "miring"} onClick={() => onChange?.("miring")} />
    </div>
  );
}

export function TropicalMap({ mode }: { mode: "hujan" | "kemarau" }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      viewBox="0 0 700 340"
      className="w-full rounded-2xl"
      role="img"
      aria-label={`Peta sederhana zona tropis dan Indonesia saat musim ${mode}.`}
    >
      <defs>
        <linearGradient id={`${uid}-ocean`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#082f49" />
          <stop offset="100%" stopColor="#06162e" />
        </linearGradient>
        <linearGradient id={`${uid}-tropic`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.03" />
          <stop offset="50%" stopColor="#34d399" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.03" />
        </linearGradient>
        <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill={mode === "hujan" ? "#67e8f9" : "#fcd34d"} />
        </marker>
        <clipPath id={`${uid}-mapclip`}>
          <rect width="700" height="340" rx="18" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-mapclip)`}>
        <rect width="700" height="340" fill={`url(#${uid}-ocean)`} />
        <g opacity="0.22" stroke="#38bdf8" strokeWidth="0.6">
          {[1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M0 ${i * 62} H700`} fill="none" strokeDasharray="2 8" />
          ))}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <path key={i} d={`M${i * 110} 0 V340`} fill="none" strokeDasharray="2 8" />
          ))}
        </g>
        {/* Zona tropis */}
        <rect x="0" y="102" width="700" height="137" fill={`url(#${uid}-tropic)`} />
        <line x1="0" y1="102" x2="700" y2="102" stroke="#34d399" strokeOpacity="0.3" strokeDasharray="5 6" />
        <line x1="0" y1="239" x2="700" y2="239" stroke="#34d399" strokeOpacity="0.3" strokeDasharray="5 6" />
        <line x1="0" y1="170" x2="700" y2="170" stroke="#fbbf24" strokeOpacity="0.65" strokeDasharray="8 5" />
        <text x="14" y="158" fontSize="10" fontWeight="700" fill="#fcd34d">KHATULISTIWA</text>
        <text x="14" y="118" fontSize="8" fill="#6ee7b7" letterSpacing="1">ZONA TROPIS</text>

        {/* Benua (bentuk sederhana) */}
        <g fill="#0f766e" fillOpacity="0.72" stroke="#34d399" strokeOpacity="0.28" strokeWidth="1">
          <path d="M80 78 C118 60 166 72 184 108 C196 134 165 154 140 182 C120 205 123 239 96 248 C74 254 57 224 64 194 C71 163 52 126 80 78 Z" />
          <path d="M216 202 C240 190 276 202 280 232 C284 264 261 293 240 284 C220 275 207 249 210 228 Z" />
          <path d="M330 52 C372 34 436 47 472 80 C495 101 481 130 443 136 C414 141 395 163 367 154 C343 147 339 118 316 100 C300 88 310 60 330 52 Z" />
          <path d="M349 147 C365 143 378 158 373 176 C367 197 355 214 340 209 C327 204 326 183 332 168 Z" />
          <path d="M510 222 C536 209 577 218 585 242 C593 267 566 283 539 278 C514 273 496 249 510 222 Z" />
          <path d="M611 88 C632 97 639 119 628 133 C616 148 598 142 592 126 C585 108 595 91 611 88 Z" opacity="0.6" />
          <path d="M234 97 C259 86 284 95 291 116 C296 134 277 149 257 148 C238 144 222 126 224 113 Z" opacity="0.7" />
          <path d="M428 244 C442 238 455 247 452 258 C447 269 432 268 426 258 Z" opacity="0.75" />
        </g>

        {/* Indonesia */}
        <g>
          <path d="M438 164 Q456 158 473 164" fill="none" stroke="#fbbf24" strokeWidth="5" strokeOpacity="0.28" />
          <ellipse cx="446" cy="166" rx="17" ry="4.5" fill="#fcd34d" fillOpacity="0.8" transform="rotate(-8 446 166)" />
          <ellipse cx="473" cy="172" rx="16" ry="4" fill="#fcd34d" fillOpacity="0.8" transform="rotate(12 473 172)" />
          <ellipse cx="499" cy="163" rx="19" ry="5" fill="#fcd34d" fillOpacity="0.8" transform="rotate(-4 499 163)" />
          <ellipse cx="525" cy="172" rx="16" ry="4.5" fill="#fcd34d" fillOpacity="0.8" transform="rotate(13 525 172)" />
          <ellipse cx="553" cy="166" rx="22" ry="5.5" fill="#fcd34d" fillOpacity="0.8" transform="rotate(-3 553 166)" />
          <circle cx="495" cy="177" r="13" fill="none" stroke="#67e8f9" strokeWidth="1.2" strokeDasharray="3 3" />
          <text x="499" y="148" textAnchor="middle" fontSize="10" fontWeight="800" fill="#f8fafc" letterSpacing="1.2">INDONESIA</text>
        </g>

        {mode === "hujan" ? (
          <g>
            <path d="M342 72 C378 92 412 122 446 166" fill="none" stroke="#67e8f9" strokeWidth="2" strokeDasharray="4 5" markerEnd={`url(#${uid}-arrow)`} />
            <path d="M370 54 C406 82 438 119 484 166" fill="none" stroke="#67e8f9" strokeWidth="1.5" strokeOpacity="0.6" markerEnd={`url(#${uid}-arrow)`} />
            <text x="352" y="66" fontSize="10" fontWeight="700" fill="#a5f3fc">Angin muson barat</text>
            <g transform="translate(490 200)">
              <ellipse cx="0" cy="0" rx="30" ry="11" fill="#94a3b8" opacity="0.82" />
              <ellipse cx="-16" cy="-4" rx="14" ry="9" fill="#cbd5e1" opacity="0.7" />
              <ellipse cx="12" cy="-5" rx="16" ry="10" fill="#cbd5e1" opacity="0.65" />
              {[-18, -4, 10, 22].map((x, i) => (
                <line key={i} x1={x} y1="10" x2={x - 4} y2={24 + i * 2} stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              ))}
            </g>
            <g transform="translate(540 118)">
              <ellipse cx="0" cy="0" rx="24" ry="9" fill="#94a3b8" opacity="0.68" />
              <ellipse cx="-11" cy="-3" rx="12" ry="7" fill="#cbd5e1" opacity="0.6" />
              {[-12, -2, 8].map((x, i) => (
                <line key={i} x1={x} y1="8" x2={x - 3} y2={20 + i * 2} stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
              ))}
            </g>
          </g>
        ) : (
          <g>
            <path d="M585 265 C562 241 517 207 484 184" fill="none" stroke="#fcd34d" strokeWidth="2" strokeDasharray="4 5" markerEnd={`url(#${uid}-arrow)`} />
            <path d="M628 282 C590 248 531 206 505 183" fill="none" stroke="#fcd34d" strokeWidth="1.5" strokeOpacity="0.55" markerEnd={`url(#${uid}-arrow)`} />
            <text x="538" y="303" fontSize="10" fontWeight="700" fill="#fde68a" textAnchor="middle">Angin muson timur</text>
            <g transform="translate(500 112)">
              <circle cx="0" cy="0" r="13" fill="#fbbf24" />
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1={Math.cos((i * Math.PI) / 4) * 17}
                  y1={Math.sin((i * Math.PI) / 4) * 17}
                  x2={Math.cos((i * Math.PI) / 4) * 23}
                  y2={Math.sin((i * Math.PI) / 4) * 23}
                  stroke="#fcd34d"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              ))}
            </g>
            <text x="500" y="76" textAnchor="middle" fontSize="9" fontWeight="600" fill="#fde68a">Curah hujan relatif berkurang</text>
          </g>
        )}
        <rect x="0" y="300" width="700" height="40" fill="#030817" opacity="0.55" />
        <text x="16" y="324" fontSize="9" fill="#94a3b8">
          Peta dan arah angin disederhanakan untuk pembelajaran. Pola hujan lokal dapat berbeda.
        </text>
      </g>
      <rect width="700" height="340" rx="18" fill="none" stroke="rgba(148,163,184,0.18)" />
    </svg>
  );
}

export function SeasonScene({ hemisphere }: { hemisphere: "utara" | "selatan" }) {
  const isNorth = hemisphere === "utara";
  return (
    <div className="relative h-[205px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_center,#0a1733,#030817)]">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-amber-300/30" />
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fffde7,#fbbf24_45%,#b45309)] shadow-[0_0_60px_12px_rgba(251,191,36,0.3)]",
          isNorth ? "right-3 h-20 w-20 sm:right-6" : "left-3 h-20 w-20 sm:left-6",
        )}
      >
        <span className="absolute inset-0 animate-pulse-soft rounded-full bg-amber-300/20 blur-xl" />
      </div>
      <div className={cn("absolute top-1/2 -translate-y-1/2", isNorth ? "left-4 sm:left-8" : "right-4 sm:right-8")}>
        <Globe
          size={150}
          tilt={23.5}
          showAxis
          showEquator
          lightAngle={isNorth ? 0 : 180}
          name="Bumi dengan sumbu miring dan penyinaran Matahari"
        />
      </div>
      <div
        className={cn(
          "absolute top-3 rounded-full border border-white/10 bg-night-900/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-300 backdrop-blur",
          isNorth ? "left-3" : "right-3",
        )}
      >
        {isNorth ? "Utara condong ke Matahari" : "Selatan condong ke Matahari"}
      </div>
      <div className="absolute inset-x-0 bottom-2 flex justify-center">
        <span className="rounded-full bg-night-900/80 px-2.5 py-1 text-[9px] font-semibold text-cyan-200 backdrop-blur">
          Sinar datang lebih tegak · siang lebih panjang
        </span>
      </div>
    </div>
  );
}

export function SeasonModeButtons({
  mode,
  onChange,
}: {
  mode: "hujan" | "kemarau";
  onChange: (mode: "hujan" | "kemarau") => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange("hujan")}
        aria-pressed={mode === "hujan"}
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all",
          mode === "hujan"
            ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-100"
            : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200",
        )}
      >
        <CloudRain size={15} /> Musim hujan
      </button>
      <button
        type="button"
        onClick={() => onChange("kemarau")}
        aria-pressed={mode === "kemarau"}
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all",
          mode === "kemarau"
            ? "border-amber-300/40 bg-amber-400/10 text-amber-100"
            : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200",
        )}
      >
        <Sun size={15} /> Musim kemarau
      </button>
    </div>
  );
}

export function MiniInfoIconRow() {
  return (
    <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1">
        <Waves size={11} className="text-cyan-300" /> Angin muson
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1">
        <CloudRain size={11} className="text-cyan-300" /> Curah hujan
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1">
        <ArrowDownToLine size={11} className="text-amber-300" /> Sirkulasi atmosfer
      </span>
    </div>
  );
}
