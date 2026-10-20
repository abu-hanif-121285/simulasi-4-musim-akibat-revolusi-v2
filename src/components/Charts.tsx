import { useId } from "react";
import { approximateDayLength, formatHours, normalizeAngle, solarDeclination } from "../data/astronomy";
import { cn } from "../utils/cn";

const W = 640;
const H = 260;
const PAD = { top: 20, right: 18, bottom: 36, left: 38 };

function dayLengthPath(
  tilt: number,
  latitude: number,
  startAngle: number,
): string {
  const points: { x: number; y: number }[] = [];
  const steps = 180;
  for (let i = 0; i <= steps; i += 1) {
    const angle = normalizeAngle(startAngle + (i / steps) * 360);
    const declination = solarDeclination(angle, tilt);
    const hours = approximateDayLength(latitude, declination);
    const x = PAD.left + (i / steps) * (W - PAD.left - PAD.right);
    const y = PAD.top + (1 - hours / 24) * (H - PAD.top - PAD.bottom);
    points.push({ x, y });
  }
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
}

export function DayLengthChart({
  angle,
  tilt = 23.5,
  northLat = 40,
  southLat = -35,
  className,
}: {
  angle: number;
  tilt?: number;
  northLat?: number;
  southLat?: number;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const declination = solarDeclination(angle, tilt);
  const currentFraction = (normalizeAngle(angle - 90) / 360 + 1) % 1;
  const currentX = PAD.left + currentFraction * (W - PAD.left - PAD.right);
  const northHours = approximateDayLength(northLat, declination);
  const southHours = approximateDayLength(southLat, declination);
  const yForHours = (hours: number) =>
    PAD.top + (1 - hours / 24) * (H - PAD.top - PAD.bottom);
  const northPath = dayLengthPath(tilt, northLat, 90);
  const southPath = dayLengthPath(tilt, southLat, 90);
  const monthMarks = [
    { label: "Mar", fraction: 0 },
    { label: "Jun", fraction: 0.25 },
    { label: "Sep", fraction: 0.5 },
    { label: "Des", fraction: 0.75 },
    { label: "Mar", fraction: 1 },
  ];

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Grafik perkiraan lama siang di lintang ${northLat} derajat Utara dan ${Math.abs(southLat)} derajat Selatan selama satu tahun.`}
      >
        <defs>
          <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-north`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id={`${uid}-south`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        <rect x={PAD.left} y={PAD.top} width={W - PAD.left - PAD.right} height={H - PAD.top - PAD.bottom} fill="#041024" rx="8" />
        {[0, 6, 12, 18, 24].map((hours) => {
          const y = yForHours(hours);
          return (
            <g key={hours}>
              <line
                x1={PAD.left}
                y1={y}
                x2={W - PAD.right}
                y2={y}
                stroke={hours === 12 ? "#fbbf24" : "rgba(148,163,184,0.13)"}
                strokeWidth={hours === 12 ? 1.2 : 1}
                strokeDasharray={hours === 12 ? "5 5" : "2 6"}
                opacity={hours === 12 ? 0.55 : 1}
              />
              <text x={PAD.left - 8} y={y + 3.5} textAnchor="end" fontSize="9" fill="#64748b">
                {hours}j
              </text>
            </g>
          );
        })}

        <path
          d={`${southPath} L ${W - PAD.right} ${H - PAD.bottom} L ${PAD.left} ${H - PAD.bottom} Z`}
          fill={`url(#${uid}-area)`}
        />
        <path d={northPath} fill="none" stroke={`url(#${uid}-north)`} strokeWidth="2.2" strokeLinecap="round" />
        <path
          d={southPath}
          fill="none"
          stroke={`url(#${uid}-south)`}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="6 4"
        />

        {monthMarks.map((mark, i) => {
          const x = PAD.left + mark.fraction * (W - PAD.left - PAD.right);
          return (
            <g key={`${mark.label}-${i}`}>
              <line
                x1={x}
                y1={H - PAD.bottom}
                x2={x}
                y2={H - PAD.bottom + 5}
                stroke="rgba(148,163,184,0.4)"
              />
              <text x={x} y={H - PAD.bottom + 19} textAnchor="middle" fontSize="9" fill="#64748b">
                {mark.label}
              </text>
            </g>
          );
        })}

        <line
          x1={currentX}
          y1={PAD.top}
          x2={currentX}
          y2={H - PAD.bottom}
          stroke="#a5f3fc"
          strokeOpacity="0.5"
          strokeWidth="1.2"
          strokeDasharray="3 4"
        />
        <circle cx={currentX} cy={yForHours(northHours)} r="4.5" fill="#fcd34d" stroke="#08152c" strokeWidth="2" />
        <circle cx={currentX} cy={yForHours(southHours)} r="4.5" fill="#67e8f9" stroke="#08152c" strokeWidth="2" />
        <rect x={currentX - 24} y={PAD.top - 5} width="48" height="16" rx="5" fill="#07152f" stroke="rgba(103,232,249,0.3)" />
        <text x={currentX} y={PAD.top + 7} textAnchor="middle" fontSize="8" fontWeight="700" fill="#a5f3fc">
          posisi kini
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-5 rounded-full bg-amber-300" />
          {northLat}° U → {formatHours(northHours)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-5 rounded-full bg-cyan-300" />
          {Math.abs(southLat)}° S → {formatHours(southHours)}
        </span>
      </div>
    </div>
  );
}

export function InclinationMeter({
  elevation,
  label,
}: {
  elevation: number;
  label: string;
}) {
  const clamped = Math.max(0, Math.min(90, elevation));
  const segments = 18;
  const active = Math.round((clamped / 90) * segments);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px]">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-amber-200">
          {clamped <= 0 ? "Matahari tidak tampak" : `elevasi ≈ ${clamped.toFixed(0)}°`}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 flex-1 rounded-sm transition-colors",
              i < active
                ? i > 13
                  ? "bg-amber-300"
                  : i > 8
                    ? "bg-amber-400/80"
                    : "bg-amber-500/50"
                : "bg-white/[0.06]",
            )}
          />
        ))}
      </div>
      <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
        Makin tinggi elevasi Matahari, makin tegak sinar di lokasi itu. Nilai ini perkiraan model sederhana.
      </p>
    </div>
  );
}
