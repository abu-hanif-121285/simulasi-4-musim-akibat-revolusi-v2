import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Box,
  CalendarDays,
  ChevronRight,
  Circle,
  Clock3,
  Compass,
  Eye,
  EyeOff,
  FlaskConical,
  Gauge,
  Info,
  Minus,
  Orbit,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Sun,
  TriangleAlert,
} from "lucide-react";
import {
  Button,
  Card,
  PageHeader,
  Pill,
  SegmentedControl,
  SectionTitle,
} from "../components/ui";
import { Orrery, OrreryLegend, type OrreryView } from "../components/Orrery";
import { DayLengthChart, InclinationMeter } from "../components/Charts";
import {
  ORBIT_POSITIONS,
  SEASON_STYLE,
  angularDistance,
  angleToMonthLabel,
  approximateDayLength,
  dayRelation,
  formatHours,
  noonElevation,
  normalizeAngle,
  positionForAngle,
  seasonForHemisphere,
  solarDeclination,
} from "../data/astronomy";
import { useApp } from "../lib/store";
import { cn } from "../utils/cn";

type ToggleKey = "axis" | "rays" | "angle" | "orbit" | "seasons" | "rotation";

export function Lab() {
  const { settings, playFx, navigate } = useApp();
  const [angle, setAngle] = useState(180);
  const [tilt, setTilt] = useState(23.5);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(settings.animationSpeed || 1);
  const [view, setView] = useState<OrreryView>("3d");
  const [showAxis, setShowAxis] = useState(true);
  const [showRays, setShowRays] = useState(true);
  const [showAngleIndicator, setShowAngleIndicator] = useState(true);
  const [showOrbit, setShowOrbit] = useState(true);
  const [showSeasons, setShowSeasons] = useState(true);
  const [earthSpinning, setEarthSpinning] = useState(true);
  const [northLat, setNorthLat] = useState(40);
  const [southLat, setSouthLat] = useState(35);

  const position = positionForAngle(angle);
  const declination = solarDeclination(angle, tilt);
  const northSeason = seasonForHemisphere(angle, true);
  const southSeason = seasonForHemisphere(angle, false);
  const northStyle = SEASON_STYLE[northSeason];
  const southStyle = SEASON_STYLE[southSeason];
  const northHours = approximateDayLength(northLat, declination);
  const southHours = approximateDayLength(-southLat, declination);
  const northElevation = noonElevation(northLat, declination);
  const southElevation = noonElevation(-southLat, declination);
  const nearZeroTilt = tilt < 1;
  const nearlyEquinox = Math.abs(declination) < 0.6;

  const tiltToward = nearZeroTilt
    ? "Tidak ada kemiringan"
    : nearlyEquinox
      ? "Hampir seimbang"
      : declination > 0
        ? "Belahan Utara condong ke Matahari"
        : "Belahan Selatan condong ke Matahari";

  const toggles: { key: ToggleKey; label: string; active: boolean; set: (value: boolean) => void }[] = [
    { key: "axis", label: "Sumbu Bumi", active: showAxis, set: setShowAxis },
    { key: "rays", label: "Sinar Matahari", active: showRays, set: setShowRays },
    { key: "angle", label: "Sudut", active: showAngleIndicator, set: setShowAngleIndicator },
    { key: "orbit", label: "Garis orbit", active: showOrbit, set: setShowOrbit },
    { key: "seasons", label: "Label musim", active: showSeasons, set: setShowSeasons },
    { key: "rotation", label: "Rotasi Bumi", active: earthSpinning, set: setEarthSpinning },
  ];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setAngle((value) => normalizeAngle(value + 1.1 * speed));
    }, 120);
    return () => window.clearInterval(timer);
  }, [playing, speed]);

  const reset = () => {
    setPlaying(false);
    setAngle(180);
    setTilt(23.5);
    setSpeed(1);
    setView("3d");
    setShowAxis(true);
    setShowRays(true);
    setShowAngleIndicator(true);
    setShowOrbit(true);
    setShowSeasons(true);
    setEarthSpinning(true);
    setNorthLat(40);
    setSouthLat(35);
    playFx("click");
  };

  const selectPosition = (orbitAngle: number) => {
    setPlaying(false);
    setAngle(orbitAngle);
    setShowRays(true);
    setShowSeasons(true);
    playFx("click");
  };

  const nextPosition = () => {
    const currentIndex = ORBIT_POSITIONS.findIndex((item) => item.key === position.key);
    const next = ORBIT_POSITIONS[(currentIndex + 1) % ORBIT_POSITIONS.length];
    selectPosition(next.angle);
  };

  const tiltSummary = useMemo(() => {
    if (nearZeroTilt) return "Sumbu hampir tegak. Perbedaan penyinaran antarbelahan sepanjang tahun sangat kecil.";
    if (tilt < 15) return "Kemiringan kecil. Perbedaan musiman lebih lemah daripada kondisi Bumi saat ini.";
    if (tilt > 26) return "Kemiringan besar. Perbedaan musim di lintang menengah dan tinggi cenderung lebih kuat.";
    return "Kemiringan mendekati kondisi nyata Bumi. Pola inilah yang biasa kita kenal.";
  }, [tilt, nearZeroTilt]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Laboratorium · simulasi interaktif"
        title="Kendalikan orbit dan kemiringan Bumi"
        description="Putar revolusi, ubah kemiringan sumbu, dan bandingkan penyinaran. Semua perubahan di sini memengaruhi visual serta perhitungan musim."
        icon={Orbit}
        actions={
          <>
            <Pill className="border-emerald-300/20 bg-emerald-400/[0.07] text-emerald-200" dot="bg-emerald-400">
              Simulasi aktif
            </Pill>
            <Button variant="secondary" size="sm" onClick={reset}>
              <RotateCcw size={14} /> Reset
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_326px]">
        <Card glow className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] px-3 py-2.5 sm:px-4">
            <div className="flex items-center gap-2.5">
              <span className={cn("relative flex h-2 w-2")}>
                {playing && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-50" />}
                <span className={cn("relative inline-flex h-2 w-2 rounded-full", playing ? "bg-cyan-300" : "bg-slate-500")} />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
                {playing ? "Revolusi berjalan" : "Revolusi dijeda"}
              </span>
              <span className="hidden text-[9px] text-slate-500 sm:inline">· {angleToMonthLabel(angle)}</span>
            </div>
            <SegmentedControl
              value={view}
              onChange={setView}
              options={[
                { value: "top", label: "Atas", icon: Circle },
                { value: "side", label: "Samping", icon: Minus },
                { value: "3d", label: "3D", icon: Box },
              ]}
              className="w-[224px]"
            />
          </div>

          <div className="relative bg-[radial-gradient(ellipse_at_50%_45%,rgba(8,47,73,0.3),rgba(3,8,23,0.6))]">
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.16]" />
            <div className="relative px-1 py-1 sm:px-2">
              <Orrery
                angle={angle}
                tilt={tilt}
                view={view}
                showAxis={showAxis}
                showRays={showRays}
                showAngle={showAngleIndicator}
                showOrbit={showOrbit}
                showSeasons={showSeasons}
                earthSpinning={earthSpinning}
              />
            </div>
            <div className="pointer-events-none absolute left-2 top-2 rounded-lg border border-amber-300/20 bg-night-950/75 px-2 py-1.5 backdrop-blur sm:left-3 sm:top-3">
              <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-amber-300/75">Kemiringan sumbu</p>
              <p className="font-display text-sm font-bold text-amber-200">
                {tilt.toFixed(1).replace(".", ",")}° <span className="text-[8px] font-medium text-slate-500">dari tegak lurus</span>
              </p>
            </div>
            {!showRays && (
              <div className="absolute bottom-2 left-2 rounded-md border border-amber-300/20 bg-night-950/70 px-2 py-1 text-[8px] text-amber-200/80">
                Sinar disembunyikan
              </div>
            )}
          </div>
          <div className="border-t border-white/[0.07] px-3 py-2 sm:px-4">
            <OrreryLegend />
          </div>
        </Card>

        <Card className="relative overflow-hidden p-4">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/[0.08] blur-3xl" />
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-cyan-300/75">Panel informasi</p>
              <h2 className="mt-1 font-display text-xl font-bold text-white">
                {position.month} <span className="text-sm font-medium text-slate-500">· {position.kind}</span>
              </h2>
              <p className="mt-0.5 text-[10px] text-slate-500">{position.date} · posisi orbit {Math.round(normalizeAngle(angle))}°</p>
            </div>
            <Pill className="shrink-0 px-2 py-0.5 text-[8px]">Musim</Pill>
          </div>

          {nearZeroTilt && (
            <div className="mt-3 flex gap-2 rounded-xl border border-amber-300/25 bg-amber-400/[0.07] p-2.5 text-[10px] leading-relaxed text-amber-100/90">
              <TriangleAlert size={13} className="mt-0.5 shrink-0 text-amber-300" />
              Kemiringan hampir 0°. Perbedaan musiman antarbelahan sangat kecil; label musim di bawah mengikuti posisi
              orbit, bukan iklim nyata pada sumbu tegak.
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className={cn("rounded-xl border p-2.5", nearZeroTilt ? "border-white/10 bg-white/[0.03]" : northStyle.border, nearZeroTilt ? "" : northStyle.bg)}>
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Belahan Utara</p>
              <p className={cn("mt-1 font-display text-[13px] font-bold", nearZeroTilt ? "text-slate-200" : northStyle.text)}>
                {nearZeroTilt ? "Penyinaran serupa" : `${northStyle.emoji} ${northSeason}`}
              </p>
              <p className="mt-0.5 text-[9px] text-slate-400">{dayRelation(northHours)}</p>
            </div>
            <div className={cn("rounded-xl border p-2.5", nearZeroTilt ? "border-white/10 bg-white/[0.03]" : southStyle.border, nearZeroTilt ? "" : southStyle.bg)}>
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Belahan Selatan</p>
              <p className={cn("mt-1 font-display text-[13px] font-bold", nearZeroTilt ? "text-slate-200" : southStyle.text)}>
                {nearZeroTilt ? "Penyinaran serupa" : `${southStyle.emoji} ${southSeason}`}
              </p>
              <p className="mt-0.5 text-[9px] text-slate-400">{dayRelation(southHours)}</p>
            </div>
          </div>

          <div className="mt-3 divide-y divide-white/[0.07] rounded-xl border border-white/[0.08] bg-white/[0.025] px-3">
            <div className="flex items-center justify-between gap-3 py-2">
              <span className="text-[10px] text-slate-500">Belahan condong</span>
              <span className="text-right text-[10px] font-semibold text-slate-200">{tiltToward}</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-2">
              <span className="text-[10px] text-slate-500">Kemiringan sumbu</span>
              <span className="text-[10px] font-semibold text-amber-200">{tilt.toFixed(1).replace(".", ",")}°</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-2">
              <span className="text-[10px] text-slate-500">Posisi orbit</span>
              <span className="text-[10px] font-semibold text-cyan-200">{position.month} · {Math.round(normalizeAngle(angle))}°</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-2">
              <span className="text-[10px] text-slate-500">Siang {northLat}°U</span>
              <span className="text-[10px] font-semibold text-amber-200/90">{formatHours(northHours)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-2">
              <span className="text-[10px] text-slate-500">Siang {southLat}°S</span>
              <span className="text-[10px] font-semibold text-cyan-200/90">{formatHours(southHours)}</span>
            </div>
          </div>

          <p className="mt-2.5 text-[9px] leading-relaxed text-slate-500">
            Perhitungan menggunakan model sederhana. Nilai jam adalah perkiraan, bukan tabel astronomi presisi.
          </p>

          <div className="mt-3 grid gap-2">
            <Button size="sm" onClick={nextPosition}>
              Lihat Posisi Berikutnya <ChevronRight size={14} />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => selectPosition(180)}>
              <Compass size={14} /> Kembali ke Juni
            </Button>
          </div>
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-2.5">
          <SlidersHorizontal size={14} className="text-cyan-300" />
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">Kontrol simulasi</p>
          <span className="ml-auto text-[9px] text-slate-600">Semua kontrol aktif</span>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label htmlFor="speed-range" className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-300">
                <Gauge size={13} className="text-cyan-300" /> Kecepatan revolusi
              </label>
              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-bold text-cyan-200">
                {speed.toFixed(2)}×
              </span>
            </div>
            <input
              id="speed-range"
              type="range"
              min="0.25"
              max="2"
              step="0.25"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              aria-label="Kecepatan revolusi"
            />
            <div className="mt-0.5 flex justify-between text-[8px] text-slate-600">
              <span>Lambat</span><span>Normal</span><span>Cepat</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant={playing ? "secondary" : "primary"} onClick={() => setPlaying((value) => !value)}>
                {playing ? <Pause size={14} /> : <Play size={14} />}
                {playing ? "Jeda" : "Putar"}
              </Button>
              <Button size="sm" variant="secondary" onClick={reset}>
                <RotateCcw size={14} /> Reset
              </Button>
              <Button size="sm" variant="ghost" onClick={nextPosition}>
                Posisi berikutnya <ArrowRight size={13} />
              </Button>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label htmlFor="tilt-range" className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-300">
                <Sun size={13} className="text-amber-300" /> Kemiringan sumbu
              </label>
              <span className="rounded-md border border-amber-300/20 bg-amber-300/[0.07] px-2 py-0.5 text-[10px] font-bold text-amber-200">
                {tilt.toFixed(1).replace(".", ",")}° dari tegak lurus
              </span>
            </div>
            <input
              id="tilt-range"
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={tilt}
              onChange={(event) => setTilt(Number(event.target.value))}
              aria-label="Kemiringan sumbu Bumi"
              aria-valuetext={`${tilt.toFixed(1)} derajat dari garis tegak lurus bidang orbit`}
            />
            <div className="mt-0.5 flex justify-between text-[8px] text-slate-600">
              <span>0°</span><span>23,5° (Bumi)</span><span>30°</span>
            </div>
            <div className="mt-2.5 flex items-start justify-between gap-3">
              <p className="text-[10px] leading-relaxed text-slate-500">{tiltSummary}</p>
              {Math.abs(tilt - 23.5) > 0.01 && (
                <button
                  type="button"
                  onClick={() => setTilt(23.5)}
                  className="shrink-0 rounded-lg border border-white/10 px-2 py-1 text-[9px] font-semibold text-cyan-200 hover:bg-white/[0.05]"
                >
                  Kembalikan 23,5°
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-2 border-t border-white/[0.07] p-3 sm:grid-cols-2 lg:grid-cols-3 lg:p-4">
          {toggles.map((toggle) => (
            <button
              key={toggle.key}
              type="button"
              onClick={() => toggle.set(!toggle.active)}
              aria-pressed={toggle.active}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all",
                toggle.active
                  ? "border-cyan-300/25 bg-cyan-400/[0.07] text-slate-200"
                  : "border-white/[0.08] bg-white/[0.02] text-slate-500 hover:border-white/15",
              )}
            >
              {toggle.active ? <Eye size={14} className="text-cyan-300" /> : <EyeOff size={14} />}
              <span className="text-[10px] font-semibold">{toggle.label}</span>
              <span className={cn("ml-auto h-1.5 w-1.5 rounded-full", toggle.active ? "bg-emerald-400" : "bg-slate-600")} />
            </button>
          ))}
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2">
            <span className="text-[9px] font-semibold text-slate-500">Tampilan:</span>
            <div className="ml-auto flex gap-1">
              {(["top", "side", "3d"] as OrreryView[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setView(item)}
                  aria-pressed={view === item}
                  className={cn(
                    "rounded-md px-2 py-1 text-[9px] font-bold uppercase transition-colors",
                    view === item ? "bg-cyan-400/15 text-cyan-200" : "text-slate-500 hover:text-slate-300",
                  )}
                >
                  {item === "3d" ? "3D" : item === "top" ? "Atas" : "Samping"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.07] p-3 sm:p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">Empat posisi penting</p>
            <p className="text-[9px] text-slate-600">Tanggal perkiraan · belahan Utara</p>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {ORBIT_POSITIONS.map((item) => {
              const active =
                angularDistance(normalizeAngle(angle), item.angle) < 1.2;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => selectPosition(item.angle)}
                  aria-pressed={active}
                  className={cn(
                    "group rounded-xl border p-2.5 text-left transition-all",
                    active
                      ? "border-cyan-300/40 bg-cyan-400/[0.09] shadow-[inset_0_0_22px_rgba(34,211,238,0.06)]"
                      : "border-white/[0.08] bg-white/[0.022] hover:border-white/20 hover:bg-white/[0.04]",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className={cn("text-xs font-bold", active ? "text-cyan-100" : "text-slate-200")}>{item.month}</p>
                    <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-amber-300" : "bg-slate-700")} />
                  </div>
                  <p className="mt-0.5 text-[8px] text-slate-500">{item.kind} · {item.date}</p>
                  <div className="mt-1.5 flex gap-2 text-[9px]">
                    {nearZeroTilt ? (
                      <span className="text-slate-400">U &amp; S: penyinaran hampir serupa</span>
                    ) : (
                      <>
                        <span className={SEASON_STYLE[item.northSeason].text}>U: {item.northSeason}</span>
                        <span className={SEASON_STYLE[item.southSeason].text}>S: {item.southSeason}</span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-4 sm:p-5">
          <SectionTitle
            eyebrow="Lama siang & malam"
            title="Perkiraan sepanjang tahun"
            description="Dua titik pengamatan pada lintang berbeda. Geser lintang untuk membandingkan."
            action={<Pill className="px-2 py-0.5 text-[8px]"><CalendarDays size={9} /> {position.month}</Pill>}
          />
          <div className="mb-3 grid grid-cols-2 gap-3">
            <label className="rounded-xl border border-amber-300/15 bg-amber-400/[0.035] px-2.5 py-2">
              <div className="flex items-center justify-between text-[9px]">
                <span className="font-semibold text-amber-200">Titik Utara</span>
                <span className="font-bold text-slate-300">{northLat}°U</span>
              </div>
              <input
                type="range"
                min="10"
                max="65"
                step="5"
                value={northLat}
                onChange={(event) => setNorthLat(Number(event.target.value))}
                aria-label="Lintang titik pengamatan Utara"
              />
            </label>
            <label className="rounded-xl border border-cyan-300/15 bg-cyan-400/[0.035] px-2.5 py-2">
              <div className="flex items-center justify-between text-[9px]">
                <span className="font-semibold text-cyan-200">Titik Selatan</span>
                <span className="font-bold text-slate-300">{southLat}°S</span>
              </div>
              <input
                type="range"
                min="10"
                max="65"
                step="5"
                value={southLat}
                onChange={(event) => setSouthLat(Number(event.target.value))}
                aria-label="Lintang titik pengamatan Selatan"
              />
            </label>
          </div>
          <DayLengthChart angle={angle} tilt={tilt} northLat={northLat} southLat={-southLat} />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-2.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-amber-300/80">Belahan Utara</p>
              <p className="mt-1 text-[11px] font-semibold text-slate-200">{formatHours(northHours)}</p>
              <p className="text-[9px] text-slate-500">{dayRelation(northHours)}</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-2.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-cyan-300/80">Belahan Selatan</p>
              <p className="mt-1 text-[11px] font-semibold text-slate-200">{formatHours(southHours)}</p>
              <p className="text-[9px] text-slate-500">{dayRelation(southHours)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <SectionTitle
            eyebrow="Simulasi penyinaran"
            title="Sudut sinar & energi"
            description="Intensitas Matahari dalam model tetap; yang berubah adalah sudut penyinaran dan lama siang."
            action={<Pill className="px-2 py-0.5 text-[8px]"><Clock3 size={9} /> {angleToMonthLabel(angle)}</Pill>}
          />
          <div className="space-y-3">
            <div className="rounded-xl border border-amber-300/15 bg-amber-400/[0.035] p-3">
              <InclinationMeter elevation={northElevation} label={`${northLat}° Utara`} />
            </div>
            <div className="rounded-xl border border-cyan-300/15 bg-cyan-400/[0.035] p-3">
              <InclinationMeter elevation={southElevation} label={`${southLat}° Selatan`} />
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-[10px] leading-relaxed text-slate-400">
            <span className="font-bold text-slate-200">Perhatikan: </span>
            {nearZeroTilt
              ? "Tanpa kemiringan, elevasi Matahari di kedua titik hampir sama sepanjang tahun."
              : northElevation > southElevation
                ? "Sinar di titik Utara lebih tegak daripada titik Selatan. Ini membantu menjelaskan mengapa Utara lebih panas pada posisi ini."
                : northElevation < southElevation
                  ? "Sinar di titik Selatan lebih tegak daripada titik Utara. Belahan Selatan menerima penyinaran lebih langsung pada posisi ini."
                  : "Sudut penyinaran di kedua titik relatif seimbang pada posisi ekuinoks ini."}
          </div>
          <div className="mt-3 flex gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5 text-[9px] leading-relaxed text-slate-500">
            <Info size={12} className="mt-0.5 shrink-0 text-cyan-300/70" />
            Area terang pada globe adalah sisi siang; area gelap adalah sisi malam. Sinar yang tampak sejajar adalah
            ilustrasi, bukan berkas cahaya berskala nyata.
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-cyan-300/80">Kunci 1</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Kemiringan sumbu tetap relatif sama saat Bumi berevolusi.</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-amber-300/80">Kunci 2</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Sudut sinar dan lama siang berubah secara musiman.</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-300/80">Kunci 3</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Jarak Bumi–Matahari bukan penyebab utama pergantian musim.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-2xl border border-violet-300/15 bg-violet-400/[0.04] px-4 py-3.5 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-300">
            <FlaskConical size={16} />
          </span>
          <div>
            <p className="text-xs font-bold text-slate-100">Bagaimana jika sumbu Bumi tidak miring?</p>
            <p className="mt-0.5 text-[10px] text-slate-400">Bandingkan 0°, 23,5°, dan 30° dalam eksperimen.</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate("experiment")}>
          <FlaskConical size={14} /> Buka eksperimen
        </Button>
      </div>
    </div>
  );
}
