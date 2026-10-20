import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Compass,
  FlaskConical,
  Info,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  Sun,
  TriangleAlert,
} from "lucide-react";
import { Button, Card, PageHeader, Pill, ProgressBar, SectionTitle } from "../components/ui";
import { Orrery } from "../components/Orrery";
import { Globe } from "../components/Globe";
import { BeamComparison } from "../components/Diagrams";
import {
  approximateDayLength,
  formatHours,
  noonElevation,
  solarDeclination,
  type OrbitKey,
} from "../data/astronomy";
import { useApp } from "../lib/store";
import { cn } from "../utils/cn";

const PRESETS = [
  {
    tilt: 0,
    label: "0°",
    title: "Tanpa kemiringan",
    description: "Sumbu tegak lurus terhadap bidang orbit.",
    tone: "border-slate-300/25",
  },
  {
    tilt: 23.5,
    label: "23,5°",
    title: "Kondisi Bumi",
    description: "Acuan dari garis tegak lurus bidang orbit.",
    tone: "border-cyan-300/35",
  },
  {
    tilt: 30,
    label: "30°",
    title: "Kemiringan lebih besar",
    description: "Perbedaan musiman di lintang menengah meningkat.",
    tone: "border-amber-300/30",
  },
];

const EXPERIMENT_POSITIONS: { key: OrbitKey; label: string; angle: number }[] = [
  { key: "juni", label: "Juni", angle: 180 },
  { key: "desember", label: "Desember", angle: 0 },
  { key: "maret", label: "Maret", angle: 90 },
];

export function Experiment() {
  const { playFx, navigate } = useApp();
  const [tilt, setTilt] = useState(23.5);
  const [activePosition, setActivePosition] = useState<OrbitKey>("juni");
  const [beamMode, setBeamMode] = useState<"tegak" | "miring">("tegak");
  const angle = EXPERIMENT_POSITIONS.find((position) => position.key === activePosition)?.angle ?? 180;
  const nearZero = tilt < 1;

  const juneDecl = solarDeclination(180, tilt);
  const decemberDecl = solarDeclination(0, tilt);
  const juneNorthHours = approximateDayLength(40, juneDecl);
  const juneSouthHours = approximateDayLength(-35, juneDecl);
  const ratio = nearZero ? 0 : tilt / 23.5;
  const comparisonData = PRESETS.map((preset) => {
    const june = solarDeclination(180, preset.tilt);
    const december = solarDeclination(0, preset.tilt);
    return {
      ...preset,
      juneNorth: approximateDayLength(40, june),
      decemberNorth: approximateDayLength(40, december),
      juneNorthElevation: noonElevation(40, june),
      juneSouthElevation: noonElevation(-35, june),
      swing: Math.abs(
        approximateDayLength(40, june) - approximateDayLength(40, december),
      ),
    };
  });

  const summary = useMemo(() => {
    if (nearZero) {
      return {
        title: "Sumbu tegak: perbedaan musiman sangat kecil",
        body:
          "Jika sumbu tegak, Matahari berada di atas khatulistiwa sepanjang tahun. Kedua belahan menerima sudut penyinaran yang relatif serupa. Pola empat musim seperti yang kita kenal sekarang tidak akan sama. Namun, lintang geografis tetap membuat wilayah kutub lebih dingin daripada khatulistiwa.",
      };
    }
    if (tilt > 26) {
      return {
        title: "Kemiringan besar: perbedaan musiman lebih kuat",
        body:
          "Dengan kemiringan 30°, perubahan sudut penyinaran dan lama siang antarmusim lebih besar, terutama di lintang menengah dan tinggi. Ini tidak berarti seluruh Bumi menjadi lebih panas; lintang, atmosfer, dan kondisi lokal tetap berperan. Model ini tidak untuk memprediksi iklim.",
      };
    }
    return {
      title: "Kondisi pembanding: kemiringan Bumi",
      body:
        "Kemiringan 23,5° dari garis tegak lurus memungkinkan belahan Utara dan Selatan bergantian menerima sinar lebih langsung. Empat musim yang kita pelajari adalah pola di wilayah beriklim sedang, bukan pola seluruh Bumi.",
    };
  }, [nearZero, tilt]);

  const selectPreset = (value: number) => {
    setTilt(value);
    playFx("click");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Eksperimen · eksplorasi variabel"
        title="Bagaimana jika sumbu Bumi tidak miring?"
        description="Ubah satu variabel — kemiringan sumbu — lalu bandingkan penyinaran, lama siang, dan pola musim. Lintang geografis tetap menjadi variabel penting."
        icon={FlaskConical}
        actions={
          <Button variant="secondary" size="sm" onClick={() => { setTilt(23.5); setActivePosition("juni"); playFx("click"); }}>
            <RotateCcw size={14} /> Reset eksperimen
          </Button>
        }
      />

      <Card className="mb-4 overflow-hidden">
        <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill dot="bg-violet-400">Variabel uji</Pill>
              <Pill className="border-white/10 px-2 py-0.5 text-[8px]">Bandingkan tiga kemiringan</Pill>
            </div>
            <h2 className="mt-2 font-display text-xl font-bold text-white sm:text-2xl">
              Pilih kemiringan sumbu Bumi
            </h2>
            <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-slate-400 sm:text-xs">
              Preset mengubah model Bumi secara nyata. Perhatikan garis sumbu, label musim, dan tabel
              perbandingan di bawah.
            </p>
          </div>
          <div className="flex items-center gap-3 self-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
            <Globe size={62} tilt={tilt} showAxis showEquator lightAngle={0} />
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Model kemiringan</p>
              <p className="font-display text-2xl font-bold text-cyan-200">{tilt.toFixed(1).replace(".", ",")}°</p>
            </div>
          </div>
        </div>

        <div className="grid gap-2 p-3 pt-0 sm:grid-cols-3 sm:p-4 sm:pt-0">
          {PRESETS.map((preset) => {
            const active = Math.abs(tilt - preset.tilt) < 0.01;
            return (
              <button
                key={preset.tilt}
                type="button"
                onClick={() => selectPreset(preset.tilt)}
                aria-pressed={active}
                className={cn(
                  "group rounded-xl border bg-white/[0.025] p-3 text-left transition-all",
                  active ? `${preset.tone} bg-cyan-400/[0.08] shadow-[inset_0_0_24px_rgba(34,211,238,0.07)]` : "border-white/[0.08] hover:border-white/20",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className={cn("font-display text-lg font-bold", active ? "text-cyan-100" : "text-slate-200")}>{preset.label}</p>
                  <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border text-[9px]", active ? "border-cyan-300/50 bg-cyan-400/20 text-cyan-200" : "border-white/10 text-slate-600")}>
                    {active ? <Check size={11} /> : "+"}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-slate-300">{preset.title}</p>
                <p className="mt-0.5 text-[9px] leading-relaxed text-slate-500">{preset.description}</p>
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/[0.07] p-4 sm:px-5">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="custom-tilt" className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-300">
              <SlidersHorizontal size={13} className="text-violet-300" /> Eksplorasi bebas 0°–30°
            </label>
            <span className="rounded-md border border-violet-300/20 bg-violet-400/[0.08] px-2 py-0.5 text-[10px] font-bold text-violet-200">
              {tilt.toFixed(1).replace(".", ",")}°
            </span>
          </div>
          <input
            id="custom-tilt"
            type="range"
            min="0"
            max="30"
            step="0.5"
            value={tilt}
            onChange={(event) => setTilt(Number(event.target.value))}
            aria-label="Kemiringan sumbu dalam eksperimen"
          />
          <div className="mt-1 flex justify-between text-[8px] text-slate-600">
            <span>0° tegak</span>
            <span>15°</span>
            <span>23,5° Bumi</span>
            <span>30°</span>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] px-3 py-2.5 sm:px-4">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-cyan-300" />
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">Model orbit</p>
              <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[8px] text-slate-500">Bukan skala</span>
            </div>
            <div className="flex rounded-lg border border-white/10 bg-white/[0.04] p-0.5">
              {EXPERIMENT_POSITIONS.map((position) => (
                <button
                  key={position.key}
                  type="button"
                  onClick={() => setActivePosition(position.key)}
                  aria-pressed={activePosition === position.key}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[9px] font-bold transition-colors",
                    activePosition === position.key ? "bg-cyan-400/15 text-cyan-100" : "text-slate-500 hover:text-slate-300",
                  )}
                >
                  {position.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-[radial-gradient(ellipse_at_50%_45%,rgba(30,58,138,0.2),rgba(3,8,23,0.55))] px-1 py-1">
            <Orrery
              angle={angle}
              tilt={tilt}
              view="3d"
              showAngle
              showAxis
              showRays
              showOrbit
              showSeasons
            />
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-300/75">Interpretasi otomatis</p>
            <h3 className="mt-1.5 font-display text-base font-bold text-white">{summary.title}</h3>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{summary.body}</p>
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-[9px] text-slate-500">
                <span>Perbedaan musiman relatif</span>
                <span className="font-semibold text-slate-300">{nearZero ? "sangat kecil" : ratio > 1.1 ? "lebih kuat" : "sedang"}</span>
              </div>
              <ProgressBar
                value={nearZero ? 3 : Math.min(100, tilt * 3.3)}
                barClassName={nearZero ? "from-slate-500 to-slate-400" : tilt > 26 ? "from-amber-300 to-orange-400" : "from-cyan-300 to-sky-400"}
              />
              <p className="mt-1.5 text-[9px] leading-relaxed text-slate-600">Skala kualitatif untuk perbandingan, bukan besaran suhu.</p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Sun size={14} className="text-amber-300" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Dua belahan pada Juni</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-amber-300/20 bg-amber-400/[0.045] p-2.5">
                <p className="text-[8px] uppercase tracking-wider text-slate-500">Utara 40°</p>
                <p className="mt-1 text-xs font-bold text-amber-200">{nearZero ? "Sinar serupa" : "Sinar lebih tegak"}</p>
                <p className="mt-0.5 text-[9px] text-slate-400">{formatHours(juneNorthHours)}</p>
              </div>
              <div className="rounded-xl border border-sky-300/20 bg-sky-400/[0.045] p-2.5">
                <p className="text-[8px] uppercase tracking-wider text-slate-500">Selatan 35°</p>
                <p className="mt-1 text-xs font-bold text-sky-200">{nearZero ? "Sinar serupa" : "Sinar lebih miring"}</p>
                <p className="mt-0.5 text-[9px] text-slate-400">{formatHours(juneSouthHours)}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] p-2 text-[9px] leading-relaxed text-slate-500">
              <Info size={11} className="mt-0.5 shrink-0 text-cyan-300/70" />
              Pergantian musim tidak sama dengan suhu pasti. Atmosfer, lautan, dan kondisi lokal tetap berpengaruh.
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] px-4 py-3">
          <SectionTitle
            eyebrow="Perbandingan otomatis"
            title="Apa yang berubah saat kemiringan berubah?"
            description="Nilai di bawah mengikuti pilihan kemiringan dan tanggal posisi orbit."
          />
          <Pill className="px-2 py-0.5 text-[8px]"><Compass size={9} /> {activePosition === "juni" ? "Juni" : activePosition === "desember" ? "Desember" : "Maret"}</Pill>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-[11px]">
            <thead>
              <tr className="bg-white/[0.04] text-[9px] uppercase tracking-wider text-slate-400">
                <th className="px-4 py-2.5 font-semibold">Indikator</th>
                <th className="px-4 py-2.5 font-semibold">0°</th>
                <th className="px-4 py-2.5 font-semibold text-cyan-200">23,5°</th>
                <th className="px-4 py-2.5 font-semibold">30°</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "Sudut acuan",
                  values: ["Sumbu tegak (0°)", "23,5° dari garis tegak lurus", "30° dari garis tegak lurus"],
                },
                {
                  label: "Arah kemiringan selama revolusi",
                  values: ["Tetap", "Tetap relatif sama", "Tetap relatif sama"],
                },
                {
                  label: "Hari siang 40°U · Juni",
                  values: comparisonData.map((item) => `${item.juneNorth.toFixed(1).replace(".", ",")} jam`),
                },
                {
                  label: "Hari siang 40°U · Desember",
                  values: comparisonData.map((item) => `${item.decemberNorth.toFixed(1).replace(".", ",")} jam`),
                },
                {
                  label: "Elevasi sinar Juni di 40°U",
                  values: comparisonData.map((item) => `≈ ${item.juneNorthElevation.toFixed(0)}°`),
                },
                {
                  label: "Elevasi sinar Juni di 35°S",
                  values: comparisonData.map((item) => `≈ ${item.juneSouthElevation.toFixed(0)}°`),
                },
                {
                  label: "Pola empat musim saat ini",
                  values: ["Berbeda dari sekarang", "Pola yang dikenali", "Perbedaan musiman lebih kuat"],
                },
              ].map((row, index) => (
                <tr key={row.label} className={cn("border-t border-white/[0.06]", index % 2 === 0 ? "bg-white/[0.012]" : "bg-transparent")}>
                  <td className="px-4 py-2.5 text-slate-300">{row.label}</td>
                  {row.values.map((value, i) => (
                    <td
                      key={i}
                      className={cn(
                        "px-4 py-2.5",
                        i === 0 ? "text-slate-400" : i === 1 ? "font-semibold text-cyan-200/90" : "text-slate-300",
                        Math.abs(tilt - PRESETS[i].tilt) < 0.01 && "bg-cyan-400/[0.055] font-semibold",
                      )}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/[0.07] p-3 text-[9px] leading-relaxed text-slate-500 sm:px-4">
          Catatan: tabel adalah model geometri penyinaran sederhana. Angka jam dan elevasi bukan ramalan cuaca atau suhu.
          Lintang geografis tetap memengaruhi penyinaran tahunan.
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <Card className="p-4 sm:p-5">
          <SectionTitle
            eyebrow="Lintang tetap penting"
            title="Pengaruh kemiringan bergantung pada lokasi"
            description={`Perkiraan lama siang pada Juni dan Desember dengan kemiringan ${tilt.toFixed(1).replace(".", ",")}°.`}
          />
          <div className="space-y-2">
            {[20, 40, 60].map((latitude) => {
              const june = approximateDayLength(latitude, juneDecl);
              const december = approximateDayLength(latitude, decemberDecl);
              return (
                <div key={latitude} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold text-slate-200">Lintang {latitude}° Utara</p>
                    <div className="flex gap-3 text-[9px]">
                      <span className="text-amber-200">Juni {formatHours(june)}</span>
                      <span className="text-sky-200">Desember {formatHours(december)}</span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-300 to-cyan-300"
                      style={{ width: `${Math.min(100, (Math.abs(june - 12) / 12) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[9px] text-slate-500">
                    Selisih dari 12 jam pada Juni: {Math.abs(june - 12).toFixed(1).replace(".", ",")} jam (perkiraan).
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex gap-2 rounded-xl border border-amber-300/20 bg-amber-400/[0.05] p-2.5 text-[10px] leading-relaxed text-amber-100/80">
            <TriangleAlert size={13} className="mt-0.5 shrink-0 text-amber-300" />
            Peningkatan kemiringan memperbesar perbedaan musiman, tetapi tidak membuat seluruh Bumi memiliki suhu atau
            musim yang sama.
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <SectionTitle
            eyebrow="Perbandingan sinar"
            title="Tegak atau miring?"
            description="Pilih ilustrasi untuk membandingkan area yang menerima energi."
          />
          <BeamComparison mode={beamMode} onChange={setBeamMode} />
          <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-[10px] leading-relaxed text-slate-400">
            Ketika sudut sinar berubah, area yang menerima energi berubah. Di lintang tinggi, sinar Matahari bisa sangat
            miring atau bahkan tidak muncul selama sebagian tahun. Itu sebabnya musim di sana berbeda dari wilayah tropis.
          </div>
          <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => navigate("lab")}>
            Buka laboratorium lengkap <ArrowRight size={13} />
          </Button>
        </Card>
      </div>
    </div>
  );
}
