export type OrbitKey = "maret" | "juni" | "september" | "desember";

export type OrbitPosition = {
  key: OrbitKey;
  month: string;
  date: string;
  angle: number;
  kind: "Ekuinoks" | "Solstis";
  northSeason: Season;
  southSeason: Season;
  northDay: string;
  southDay: string;
  headline: string;
  detail: string;
};

export type Season = "Semi" | "Panas" | "Gugur" | "Dingin";

export const SEASON_STYLE: Record<
  Season,
  { text: string; bg: string; border: string; dot: string; emoji: string }
> = {
  Semi: {
    text: "text-emerald-300",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/25",
    dot: "bg-emerald-400",
    emoji: "🌱",
  },
  Panas: {
    text: "text-amber-300",
    bg: "bg-amber-400/10",
    border: "border-amber-400/25",
    dot: "bg-amber-400",
    emoji: "☀️",
  },
  Gugur: {
    text: "text-orange-300",
    bg: "bg-orange-400/10",
    border: "border-orange-400/25",
    dot: "bg-orange-400",
    emoji: "🍂",
  },
  Dingin: {
    text: "text-sky-300",
    bg: "bg-sky-400/10",
    border: "border-sky-400/25",
    dot: "bg-sky-400",
    emoji: "❄️",
  },
};

export const ORBIT_POSITIONS: OrbitPosition[] = [
  {
    key: "maret",
    month: "Maret",
    date: "sekitar 20 Maret",
    angle: 90,
    kind: "Ekuinoks",
    northSeason: "Semi",
    southSeason: "Gugur",
    northDay: "Hampir sama dengan malam",
    southDay: "Hampir sama dengan malam",
    headline: "Ekuinoks Maret",
    detail:
      "Tidak ada belahan yang condong paling dekat ke Matahari. Di banyak wilayah, lama siang dan malam hampir seimbang. Belahan Utara menuju musim semi, belahan Selatan menuju musim gugur.",
  },
  {
    key: "juni",
    month: "Juni",
    date: "sekitar 21 Juni",
    angle: 180,
    kind: "Solstis",
    northSeason: "Panas",
    southSeason: "Dingin",
    northDay: "Siang terpanjang dalam setahun",
    southDay: "Siang terpendek dalam setahun",
    headline: "Solstis Juni",
    detail:
      "Kutub Utara condong ke arah Matahari. Sinar Matahari mengenai belahan Utara lebih langsung dan siangnya lebih panjang. Belahan Selatan justru menjauh dari arah Matahari.",
  },
  {
    key: "september",
    month: "September",
    date: "sekitar 22 September",
    angle: 270,
    kind: "Ekuinoks",
    northSeason: "Gugur",
    southSeason: "Semi",
    northDay: "Hampir sama dengan malam",
    southDay: "Hampir sama dengan malam",
    headline: "Ekuinoks September",
    detail:
      "Kemiringan sumbu kembali tidak membuat salah satu belahan paling condong ke Matahari. Belahan Utara beralih menuju musim gugur, sedangkan belahan Selatan menuju musim semi.",
  },
  {
    key: "desember",
    month: "Desember",
    date: "sekitar 21 Desember",
    angle: 0,
    kind: "Solstis",
    northSeason: "Dingin",
    southSeason: "Panas",
    northDay: "Siang terpendek dalam setahun",
    southDay: "Siang terpanjang dalam setahun",
    headline: "Solstis Desember",
    detail:
      "Kutub Selatan condong ke arah Matahari. Belahan Selatan menerima sinar yang lebih langsung dan siang yang lebih panjang. Belahan Utara menjauh dari arah Matahari.",
  },
];

export const SEASON_ORDER: Season[] = ["Semi", "Panas", "Gugur", "Dingin"];

export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/** Kemiringan tetap; hanya posisi Bumi pada orbit yang berubah. */
export function solarDeclination(angle: number, tilt: number): number {
  return tilt * Math.cos(((normalizeAngle(angle) - 180) * Math.PI) / 180);
}

export function seasonForHemisphere(angle: number, north = true): Season {
  const a = normalizeAngle(angle);
  const northSeasons: { max: number; season: Season }[] = [
    { max: 90, season: "Dingin" },
    { max: 180, season: "Semi" },
    { max: 270, season: "Panas" },
    { max: 360, season: "Gugur" },
  ];
  const northern = northSeasons.find((item) => a < item.max)?.season ?? "Dingin";
  if (north) return northern;
  const opposite: Record<Season, Season> = {
    Semi: "Gugur",
    Panas: "Dingin",
    Gugur: "Semi",
    Dingin: "Panas",
  };
  return opposite[northern];
}

export function positionForAngle(angle: number): OrbitPosition {
  const a = normalizeAngle(angle);
  const nearest = [...ORBIT_POSITIONS].sort(
    (p, q) => angularDistance(a, p.angle) - angularDistance(a, q.angle),
  )[0];
  return nearest;
}

export function angularDistance(a: number, b: number): number {
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return Math.min(diff, 360 - diff);
}

/**
 * Perkiraan sederhana lama siang (jam) memakai model lingkaran.
 * Bukan tabel astronomi presisi; refraksi atmosfer dan ukuran piringan
 * Matahari tidak diperhitungkan.
 */
export function approximateDayLength(latitude: number, declination: number): number {
  const latRad = (latitude * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  const x = -Math.tan(latRad) * Math.tan(decRad);
  if (x <= -1) return 24;
  if (x >= 1) return 0;
  return (24 / Math.PI) * Math.acos(x);
}

export function noonElevation(latitude: number, declination: number): number {
  return 90 - Math.abs(latitude - declination);
}

export function dayRelation(hours: number): "Siang lebih panjang" | "Siang lebih pendek" | "Hampir seimbang" {
  if (hours > 12.35) return "Siang lebih panjang";
  if (hours < 11.65) return "Siang lebih pendek";
  return "Hampir seimbang";
}

export function formatHours(hours: number): string {
  if (hours >= 23.99) return "≈ 24 jam (siang terus)";
  if (hours <= 0.01) return "≈ 0 jam (malam terus)";
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `≈ ${h} j ${minutes.toString().padStart(2, "0")} mnt`;
}

/** Sudut orbit 90° = Maret, 180° = Juni, 270° = September, 360° = Desember. */
export function angleToMonthLabel(angle: number): string {
  const a = normalizeAngle(angle);
  if (a >= 67.5 && a < 112.5) return "sekitar Maret";
  if (a >= 112.5 && a < 157.5) return "Maret–Juni";
  if (a >= 157.5 && a < 202.5) return "sekitar Juni";
  if (a >= 202.5 && a < 247.5) return "Juni–September";
  if (a >= 247.5 && a < 292.5) return "sekitar September";
  if (a >= 292.5 && a < 337.5) return "September–Desember";
  if (a >= 337.5 || a < 22.5) return "sekitar Desember";
  return "Desember–Maret";
}
