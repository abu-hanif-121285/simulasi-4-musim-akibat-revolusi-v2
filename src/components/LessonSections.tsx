import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Compass,
  Eye,
  EyeOff,
  Info,
  Lightbulb,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Snowflake,
  Sparkles,
  Sun,
  ThermometerSun,
  TriangleAlert,
  X,
} from "lucide-react";
import { Button, Pill } from "./ui";
import { Globe } from "./Globe";
import { Orrery } from "./Orrery";
import {
  BeamComparison,
  MiniInfoIconRow,
  SeasonModeButtons,
  SeasonScene,
  TropicalMap,
  TiltReferenceDiagram,
} from "./Diagrams";
import {
  ORBIT_POSITIONS,
  SEASON_STYLE,
  angleToMonthLabel,
  type OrbitKey,
} from "../data/astronomy";
import { useApp } from "../lib/store";
import { cn } from "../utils/cn";

type Concept = {
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
};

const CONCEPTS: Concept[] = [
  {
    prompt: "Garis khayal yang melewati Kutub Utara–Selatan dan menjadi poros rotasi Bumi disebut ...",
    options: ["Sumbu Bumi", "Garis khatulistiwa", "Bidang orbit", "Garis muson"],
    correct: 0,
    explanation:
      "Sumbu Bumi adalah garis khayal dari Kutub Utara ke Kutub Selatan. Bumi berputar mengelilingi sumbu ini.",
  },
  {
    prompt: "Sudut kemiringan sumbu Bumi sebesar 23,5° diukur dari ...",
    options: [
      "permukaan bidang orbit",
      "garis tegak lurus terhadap bidang orbit",
      "arah sinar Matahari",
      "garis khatulistiwa Bumi",
    ],
    correct: 1,
    explanation:
      "Acuan yang tepat adalah garis tegak lurus terhadap bidang orbit. Terhadap bidang orbit, padanannya sekitar 66,5°.",
  },
  {
    prompt: "Selama satu kali revolusi, arah kemiringan sumbu Bumi ...",
    options: [
      "berputar mengikuti lintasan orbit",
      "tetap relatif sama terhadap latar bintang",
      "berubah menjadi tegak setiap bulan",
      "selalu mengarah tepat ke Matahari",
    ],
    correct: 1,
    explanation:
      "Dalam model sederhana, arah kemiringan sumbu tetap relatif sama. Yang berubah adalah posisi Bumi pada orbit.",
  },
  {
    prompt: "Jika sinar Matahari datang lebih miring ke suatu permukaan, energi yang sama akan ...",
    options: [
      "terkonsentrasi pada area lebih kecil",
      "tersebar pada area lebih luas",
      "hilang sepenuhnya di atmosfer",
      "berubah menjadi energi listrik",
    ],
    correct: 1,
    explanation:
      "Sinar miring mengenai area yang lebih luas sehingga energi per satuan luas lebih kecil. Inilah salah satu sebab wilayah itu tidak sehangat wilayah dengan sinar lebih tegak.",
  },
  {
    prompt: "Pada sekitar posisi Juni, belahan Bumi Utara umumnya ...",
    options: [
      "menjauh dari Matahari dan mengalami dingin",
      "condong ke Matahari dan mengalami panas di wilayah beriklim sedang",
      "tegak lurus terhadap Matahari",
      "mengalami ekuinoks dengan siang 12 jam",
    ],
    correct: 1,
    explanation:
      "Sekitar Juni, Kutub Utara condong ke Matahari. Sinar lebih langsung, siang lebih panjang, dan wilayah beriklim sedang belahan Utara mengalami panas.",
  },
  {
    prompt: "Pada perkiraan ekuinoks September, belahan Bumi Utara dan Selatan memasuki ...",
    options: [
      "Utara semi, Selatan gugur",
      "Utara gugur, Selatan semi",
      "Utara panas, Selatan dingin",
      "keduanya dingin",
    ],
    correct: 1,
    explanation:
      "Ekuinoks September mengantar belahan Utara menuju gugur dan belahan Selatan menuju semi.",
  },
  {
    prompt: "Pola musim utama di Indonesia umumnya adalah ...",
    options: [
      "dingin dan panas",
      "hujan dan kemarau",
      "semi dan gugur",
      "salju dan kemarau",
    ],
    correct: 1,
    explanation:
      "Indonesia beriklim tropis. Dua musim utamanya adalah hujan dan kemarau, dipengaruhi angin muson, pola hujan, dan sirkulasi atmosfer.",
  },
  {
    prompt: "Pernyataan yang paling tepat tentang penyebab utama musim adalah ...",
    options: [
      "jarak Bumi–Matahari yang berubah drastis",
      "kombinasi kemiringan sumbu Bumi dan revolusi Bumi",
      "gerhana Matahari setiap bulan",
      "kecepatan rotasi Bumi yang berubah",
    ],
    correct: 1,
    explanation:
      "Kemiringan sumbu yang relatif tetap, bersama revolusi Bumi, mengubah sudut penyinaran dan lama siang. Jarak bukan penyebab utama.",
  },
];

function ConceptCheck({ index }: { index: number }) {
  const concept = CONCEPTS[index - 1];
  const { playFx, markMateri } = useApp();
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === concept.correct;

  const choose = (option: number) => {
    if (selected !== null) return;
    setSelected(option);
    if (option === concept.correct) {
      playFx("correct");
      markMateri(index);
    } else {
      playFx("wrong");
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-cyan-300/[0.14] bg-cyan-400/[0.035] p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
          <Lightbulb size={13} />
        </span>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300/90">Cek pemahaman</p>
      </div>
      <p className="text-sm font-semibold leading-relaxed text-slate-100">{concept.prompt}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {concept.options.map((option, optionIndex) => {
          const isChosen = selected === optionIndex;
          const isCorrect = optionIndex === concept.correct;
          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(optionIndex)}
              disabled={selected !== null}
              className={cn(
                "flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all",
                selected === null
                  ? "border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/30 hover:bg-white/[0.06]"
                  : isCorrect
                    ? "answer-correct text-emerald-200"
                    : isChosen
                      ? "answer-wrong text-rose-200"
                      : "border-white/[0.06] bg-white/[0.015] text-slate-500",
              )}
            >
              <span className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px]",
                selected !== null && isCorrect
                  ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-300"
                  : "border-white/15 text-slate-500",
              )}>
                {selected !== null && isCorrect ? <Check size={11} /> : String.fromCharCode(65 + optionIndex)}
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div
          className={cn(
            "mt-3 flex gap-2.5 rounded-xl border p-3",
            correct
              ? "border-emerald-300/20 bg-emerald-400/[0.06]"
              : "border-amber-300/20 bg-amber-400/[0.06]",
          )}
          role="status"
        >
          {correct ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300" />
          ) : (
            <Info size={16} className="mt-0.5 shrink-0 text-amber-300" />
          )}
          <div>
            <p className={cn("text-xs font-bold", correct ? "text-emerald-200" : "text-amber-200")}>
              {correct ? "Tepat." : "Belum tepat. Perhatikan penjelasannya, ya."}
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">{concept.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function LessonNote({ children, tone = "cyan" }: { children: React.ReactNode; tone?: "cyan" | "amber" | "emerald" }) {
  const tones = {
    cyan: "border-cyan-300/20 bg-cyan-400/[0.05] text-cyan-100",
    amber: "border-amber-300/20 bg-amber-400/[0.05] text-amber-100",
    emerald: "border-emerald-300/20 bg-emerald-400/[0.05] text-emerald-100",
  };
  return (
    <div className={cn("mt-5 flex gap-2.5 rounded-xl border p-3.5 text-[11px] leading-relaxed", tones[tone])}>
      <Info size={15} className="mt-0.5 shrink-0 opacity-80" />
      <div>{children}</div>
    </div>
  );
}

function LessonOne() {
  const [showAxis, setShowAxis] = useState(true);
  const [spinning, setSpinning] = useState(true);
  return (
    <div className="grid gap-6 xl:grid-cols-[1.03fr_0.97fr]">
      <div>
        <p className="lesson-lead">
          Bumi berputar pada sebuah garis khayal yang disebut <strong>sumbu Bumi</strong>. Sumbu ini
          tidak terlihat secara langsung, tetapi membantu kita menjelaskan rotasi dan kemiringan Bumi.
        </p>
        <p className="lesson-body">
          Bayangkan sebuah garis yang menembus bola Bumi dari Kutub Utara ke Kutub Selatan. Bumi
          berputar mengelilingi garis itu. Satu putaran rotasi memerlukan sekitar <strong>24 jam</strong>{" "}
          dan menghasilkan pergantian siang dan malam.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Kutub Utara</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Ujung sumbu di bagian utara Bumi.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Kutub Selatan</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Ujung sumbu di bagian selatan Bumi.</p>
          </div>
        </div>
        <LessonNote>
          Sumbu Bumi bukan benda padat yang bisa dilihat. Ia adalah model matematis untuk menjelaskan
          rotasi. Arah rotasi Bumi, dilihat dari atas Kutub Utara, berlawanan dengan arah jarum jam.
        </LessonNote>
      </div>
      <div>
        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_50%_45%,rgba(14,116,144,0.22),rgba(3,8,23,0.9))] p-3">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className="relative animate-float-slow">
            <Globe size={285} tilt={23.5} showAxis={showAxis} showLabels showEquator={false} spinning={spinning} lightAngle={-42} />
          </div>
          <div className="absolute left-3 top-3 rounded-lg border border-white/10 bg-night-950/70 px-2 py-1.5 backdrop-blur">
            <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Model Bumi</p>
            <p className="text-[9px] font-semibold text-cyan-200">{spinning ? "Bumi berotasi" : "Rotasi dijeda"}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowAxis((value) => !value)}>
            {showAxis ? <EyeOff size={14} /> : <Eye size={14} />}
            {showAxis ? "Sembunyikan sumbu" : "Tampilkan sumbu"}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setSpinning((value) => !value)}>
            {spinning ? <Pause size={14} /> : <Play size={14} />}
            {spinning ? "Jeda rotasi" : "Putar Bumi"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function LessonTwo() {
  const [showAngle, setShowAngle] = useState(true);
  const [showReference, setShowReference] = useState(true);
  const [upright, setUpright] = useState(false);
  const [spinning, setSpinning] = useState(false);

  return (
    <div>
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="lesson-lead">
            Sumbu Bumi miring sekitar <strong>23,5°</strong> dari garis yang tegak lurus terhadap
            bidang orbitnya. Kemiringan ini penting untuk menjelaskan pergantian musim.
          </p>
          <p className="lesson-body">
            Nilai yang sama sering ditulis sebagai sekitar <strong>66,5° terhadap bidang orbit</strong>.
            Kedua angka saling melengkapi: 23,5° + 66,5° = 90°. Jadi, jangan menggambarkan 23,5°
            sebagai sudut antara sumbu Bumi dan bidang orbit.
          </p>
          <div className="mt-4 rounded-xl border border-violet-300/20 bg-violet-400/[0.06] p-3.5">
            <div className="flex items-center gap-2 text-violet-200">
              <Sparkles size={14} />
              <p className="text-[11px] font-bold">Kunci konsep</p>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
              Arah kemiringan sumbu Bumi <strong>tetap relatif sama</strong> selama Bumi mengelilingi
              Matahari. Sumbu tidak ikut berputar mengikuti orbit.
            </p>
          </div>
          <div className="mt-4 grid gap-2">
            <Button
              variant={showAngle ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowAngle((value) => !value)}
              className="justify-start"
            >
              <Compass size={14} className="text-amber-300" />
              {showAngle ? "Sembunyikan Sudut 23,5°" : "Tampilkan Sudut 23,5°"}
            </Button>
            <Button
              variant={showReference ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowReference((value) => !value)}
              className="justify-start"
            >
              <Maximize2 size={14} className="text-cyan-300" />
              {showReference ? "Sembunyikan Garis Tegak Lurus" : "Tampilkan Garis Tegak Lurus"}
            </Button>
            <Button
              variant={upright ? "gold" : "secondary"}
              size="sm"
              onClick={() => setUpright((value) => !value)}
              className="justify-start"
            >
              <RotateCcw size={14} />
              {upright ? "Kembalikan ke 23,5°" : "Bandingkan dengan Posisi Tegak"}
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#041024]/80 p-1">
          <TiltReferenceDiagram showAngle={showAngle} showReference={showReference} upright={upright} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center justify-center rounded-xl bg-[#06132a] px-2 py-1">
          <Globe size={88} tilt={upright ? 0 : 23.5} spinning={spinning} lightAngle={-25} showAxis />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-200">Putar Bumi</p>
          <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">
            Rotasi memperlihatkan perputaran Bumi pada sumbunya. Perhatikan bahwa sumbu tetap miring
            terhadap garis tegak lurus.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setSpinning((value) => !value)}>
          {spinning ? <Pause size={14} /> : <Play size={14} />}
          {spinning ? "Jeda" : "Putar Bumi"}
        </Button>
      </div>
    </div>
  );
}

function LessonThree() {
  const [angle, setAngle] = useState(90);
  const [playing, setPlaying] = useState(false);
  const current = useMemo(() => angleToMonthLabel(angle), [angle]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setAngle((value) => (value + 2) % 360);
    }, 120);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <div>
      <p className="lesson-lead">
        <strong>Revolusi Bumi</strong> adalah gerakan Bumi mengelilingi Matahari. Satu kali revolusi
        memerlukan waktu sekitar <strong>365¼ hari</strong>.
      </p>
      <p className="lesson-body">
        Selama Bumi berevolusi, kemiringan sumbunya tidak berubah menjadi tegak dan tidak berputar
        mengikuti orbit. Arah kemiringan sumbu tetap relatif sama. Itulah sebabnya setiap posisi Bumi
        pada orbit memperlihatkan bagian yang berbeda menghadap Matahari.
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#041024]/70 p-2">
        <Orrery
          angle={angle}
          tilt={23.5}
          view="3d"
          showAngle={false}
          showAxis
          showRays
          showSeasons
          showOrbit
        />
        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/[0.07] px-2 pb-1 pt-2 sm:flex-row">
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            Posisi: <strong className="text-slate-200">{current}</strong>
            <span className="text-slate-600">·</span>
            Revolusi ≈ 365¼ hari
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant={playing ? "secondary" : "primary"} onClick={() => setPlaying((value) => !value)}>
              {playing ? <Pause size={14} /> : <Play size={14} />}
              {playing ? "Jeda" : "Putar Revolusi"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setPlaying(false); setAngle(90); }}>
              <RotateCcw size={14} /> Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Sun, title: "Matahari di pusat", text: "Matahari menjadi pusat model orbit Bumi." },
          { icon: Compass, title: "Arah tetap", text: "Kemiringan sumbu tetap sejajar dirinya sendiri." },
          { icon: ArrowUp, title: "Arah revolusi", text: "Bumi bergerak mengelilingi Matahari, bukan sebaliknya." },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
              <Icon size={15} className="text-cyan-300" />
              <p className="mt-2 text-[11px] font-bold text-slate-200">{item.title}</p>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LessonFour() {
  const [mode, setMode] = useState<"tegak" | "miring">("tegak");

  return (
    <div>
      <p className="lesson-lead">
        Musim terjadi karena <strong>kombinasi kemiringan sumbu Bumi dan revolusi Bumi</strong>, bukan
        karena perubahan jarak Bumi–Matahari. Kemiringan membuat sudut datang sinar dan lama siang
        berubah sepanjang tahun.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-4">
          <div className="flex items-center gap-2 text-amber-200">
            <ThermometerSun size={16} />
            <p className="text-xs font-bold">Saat belahan condong ke Matahari</p>
          </div>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-300">
            <li className="flex gap-2"><Check size={12} className="mt-0.5 shrink-0 text-amber-300" /> Sinar datang lebih langsung.</li>
            <li className="flex gap-2"><Check size={12} className="mt-0.5 shrink-0 text-amber-300" /> Lama siang cenderung lebih panjang.</li>
            <li className="flex gap-2"><Check size={12} className="mt-0.5 shrink-0 text-amber-300" /> Energi Matahari per satuan luas cenderung lebih besar.</li>
            <li className="flex gap-2"><Check size={12} className="mt-0.5 shrink-0 text-amber-300" /> Wilayah lintang sedang mengalami musim panas.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-sky-300/20 bg-sky-300/[0.05] p-4">
          <div className="flex items-center gap-2 text-sky-200">
            <Snowflake size={16} />
            <p className="text-xs font-bold">Saat belahan menjauh dari Matahari</p>
          </div>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-300">
            <li className="flex gap-2"><Check size={12} className="mt-0.5 shrink-0 text-sky-300" /> Sinar datang lebih miring.</li>
            <li className="flex gap-2"><Check size={12} className="mt-0.5 shrink-0 text-sky-300" /> Lama siang cenderung lebih pendek.</li>
            <li className="flex gap-2"><Check size={12} className="mt-0.5 shrink-0 text-sky-300" /> Energi per satuan luas cenderung lebih kecil.</li>
            <li className="flex gap-2"><Check size={12} className="mt-0.5 shrink-0 text-sky-300" /> Wilayah lintang sedang mengalami musim dingin.</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-cyan-300/80">
            Bandingkan arah sinar
          </p>
          <Pill className="px-2 py-0.5 text-[8px]">Klik kartu</Pill>
        </div>
        <BeamComparison mode={mode} onChange={setMode} />
      </div>

      <LessonNote tone="amber">
        Kemiringan sumbu <strong>tidak</strong> menyebabkan seluruh Bumi mengalami empat musim. Pola
        musim bergantung pada letak geografis dan kondisi iklim. Indonesia, misalnya, umumnya memiliki
        musim hujan dan kemarau.
      </LessonNote>
    </div>
  );
}

function LessonFive() {
  const [active, setActive] = useState<OrbitKey>("juni");
  const selected = ORBIT_POSITIONS.find((position) => position.key === active) ?? ORBIT_POSITIONS[0];
  const northStyle = SEASON_STYLE[selected.northSeason];
  const southStyle = SEASON_STYLE[selected.southSeason];

  return (
    <div>
      <p className="lesson-lead">
        Empat posisi utama Bumi membantu kita memahami ekuinoks dan solstis. Tanggal berikut adalah
        perkiraan untuk wilayah beriklim sedang di belahan Bumi Utara dan dapat bergeser sedikit tiap tahun.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ORBIT_POSITIONS.map((position) => (
          <button
            key={position.key}
            type="button"
            onClick={() => setActive(position.key)}
            aria-pressed={active === position.key}
            className={cn(
              "rounded-xl border px-2.5 py-2 text-left transition-all",
              active === position.key
                ? "border-cyan-300/40 bg-cyan-400/10 shadow-[inset_0_0_20px_rgba(34,211,238,0.06)]"
                : "border-white/10 bg-white/[0.025] hover:border-white/20",
            )}
          >
            <p className={cn("text-[11px] font-bold", active === position.key ? "text-cyan-100" : "text-slate-300")}>
              {position.month}
            </p>
            <p className="mt-0.5 text-[9px] text-slate-500">{position.date}</p>
            <p className="mt-1 text-[9px] font-semibold text-amber-200/80">{position.kind}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#041024]/75 p-1">
          <Orrery
            angle={selected.angle}
            tilt={23.5}
            view="3d"
            showAngle={false}
            showSeasons
            showRays
            showAxis
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300/80">{selected.kind}</p>
                <h4 className="mt-1 font-display text-lg font-bold text-white">{selected.month}</h4>
              </div>
              <Pill className="px-2 py-0.5 text-[8px]">{selected.date}</Pill>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{selected.detail}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className={cn("rounded-xl border p-2.5", northStyle.border, northStyle.bg)}>
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Belahan Utara</p>
                <p className={cn("mt-1 text-sm font-bold", northStyle.text)}>{northStyle.emoji} {selected.northSeason}</p>
              </div>
              <div className={cn("rounded-xl border p-2.5", southStyle.border, southStyle.bg)}>
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Belahan Selatan</p>
                <p className={cn("mt-1 text-sm font-bold", southStyle.text)}>{southStyle.emoji} {selected.southSeason}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Lama siang relatif</p>
            <div className="mt-2 space-y-2 text-[11px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Utara</span>
                <span className="text-right font-semibold text-amber-200">{selected.northDay}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Selatan</span>
                <span className="text-right font-semibold text-cyan-200">{selected.southDay}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-3 text-[10px] leading-relaxed text-slate-400">
        Ketika Bumi berpindah posisi, arah sumbu tetap miring ke arah yang sama. Perhatikan belahan mana
        yang sedang mendapat sinar lebih langsung — bukan mana yang lebih dekat ke Matahari.
      </div>
    </div>
  );
}

function LessonSix() {
  const [focus, setFocus] = useState<"utara" | "selatan">("utara");
  const table = [
    { condition: "Utara condong ke Matahari", north: "Panas", south: "Dingin", tone: "amber" as const },
    { condition: "Selatan condong ke Matahari", north: "Dingin", south: "Panas", tone: "cyan" as const },
    { condition: "Sekitar ekuinoks Maret", north: "Semi", south: "Gugur", tone: "emerald" as const },
    { condition: "Sekitar ekuinoks September", north: "Gugur", south: "Semi", tone: "violet" as const },
  ];
  return (
    <div>
      <p className="lesson-lead">
        Kedua belahan Bumi <strong>tidak dapat condong paling dekat ke Matahari pada waktu yang sama</strong>.
        Ketika satu belahan lebih condong ke Matahari, belahan lain menjauh. Sinar di belahan lain
        datang lebih miring dan siangnya cenderung lebih pendek.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className={cn("rounded-2xl border p-3 transition-all", focus === "utara" ? "border-amber-300/30 bg-amber-400/[0.04]" : "border-white/10 bg-white/[0.02] opacity-70")}>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-100">Belahan Utara condong ke Matahari</p>
            <Pill className="border-amber-300/20 px-2 py-0.5 text-[8px] text-amber-200">Musim panas</Pill>
          </div>
          <SeasonScene hemisphere="utara" />
        </div>
        <div className={cn("rounded-2xl border p-3 transition-all", focus === "selatan" ? "border-sky-300/30 bg-sky-400/[0.04]" : "border-white/10 bg-white/[0.02] opacity-70")}>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-100">Belahan Selatan menjauh dari Matahari</p>
            <Pill className="border-sky-300/20 px-2 py-0.5 text-[8px] text-sky-200">Musim dingin</Pill>
          </div>
          <SeasonScene hemisphere="selatan" />
        </div>
      </div>
      <div className="mt-3 flex justify-center">
        <Button variant="secondary" size="sm" onClick={() => setFocus((value) => (value === "utara" ? "selatan" : "utara"))}>
          <ArrowDown size={14} /> Balik Belahan
        </Button>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse text-left text-[11px]">
            <thead>
              <tr className="bg-white/[0.055] text-[9px] uppercase tracking-wider text-slate-400">
                <th className="px-3 py-2.5 font-semibold">Posisi relatif terhadap Matahari</th>
                <th className="px-3 py-2.5 font-semibold text-amber-200">Belahan Utara</th>
                <th className="px-3 py-2.5 font-semibold text-cyan-200">Belahan Selatan</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, index) => (
                <tr
                  key={row.condition}
                  onClick={() => setFocus(index < 2 ? (index === 0 ? "utara" : "selatan") : "utara")}
                  className={cn(
                    "cursor-pointer border-t border-white/[0.06] transition-colors hover:bg-white/[0.04]",
                    (index === 0 && focus === "utara") || (index === 1 && focus === "selatan")
                      ? "bg-cyan-400/[0.055]"
                      : "bg-transparent",
                  )}
                >
                  <td className="px-3 py-2.5 text-slate-300">{row.condition}</td>
                  <td className="px-3 py-2.5 font-semibold text-amber-200/90">{row.north}</td>
                  <td className="px-3 py-2.5 font-semibold text-cyan-200/90">{row.south}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <LessonNote tone="emerald">
        Musim di dua belahan Bumi berlawanan hanya dalam <em>konteks empat musim di wilayah beriklim
        sedang</em>. Di kawasan tropis, perubahan yang lebih menonjol adalah pola curah hujan.
      </LessonNote>
    </div>
  );
}

function LessonSeven() {
  const [mode, setMode] = useState<"hujan" | "kemarau">("hujan");
  return (
    <div>
      <p className="lesson-lead">
        Indonesia berada di sekitar garis khatulistiwa dan beriklim tropis. Indonesia umumnya memiliki
        dua musim utama: <strong>musim hujan</strong> dan <strong>musim kemarau</strong>.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <TropicalMap mode={mode} />
          <div className="mt-3">
            <SeasonModeButtons mode={mode} onChange={setMode} />
          </div>
        </div>
        <div className="space-y-3">
          <div className={cn("rounded-2xl border p-4", mode === "hujan" ? "border-cyan-300/25 bg-cyan-400/[0.06]" : "border-amber-300/25 bg-amber-400/[0.06]")}>
            <div className="flex items-center gap-2">
              {mode === "hujan" ? <CloudRain size={17} className="text-cyan-300" /> : <Sun size={17} className="text-amber-300" />}
              <h4 className="font-display text-sm font-bold text-white">
                {mode === "hujan" ? "Musim hujan" : "Musim kemarau"}
              </h4>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
              {mode === "hujan"
                ? "Pada musim hujan, aliran udara muson dari arah barat membawa banyak uap air. Curah hujan umumnya meningkat di berbagai wilayah Indonesia."
                : "Pada musim kemarau, angin muson timur membuat udaranya cenderung lebih kering. Curah hujan umumnya berkurang, meskipun tidak berarti sama sekali tidak pernah hujan."}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300/80">Faktor pola musim</p>
            <ul className="mt-2.5 space-y-2 text-[11px] leading-relaxed text-slate-300">
              <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" /> Angin muson</li>
              <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" /> Distribusi curah hujan</li>
              <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" /> Pola sirkulasi atmosfer</li>
              <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" /> Kondisi lokal dan topografi wilayah</li>
            </ul>
          </div>
          <MiniInfoIconRow />
        </div>
      </div>
      <div className="mt-4 flex gap-2.5 rounded-xl border border-amber-300/20 bg-amber-400/[0.05] p-3.5">
        <TriangleAlert size={16} className="mt-0.5 shrink-0 text-amber-300" />
        <p className="text-[11px] leading-relaxed text-amber-100/90">
          Jangan menyimpulkan bahwa Indonesia memiliki empat musim seperti wilayah lintang sedang.
          Karena dekat khatulistiwa, sudut penyinaran Matahari tidak berubah sebesar di lintang tinggi.
          Namun pola hujan dan kemarau Indonesia tetap sangat dipengaruhi kondisi atmosfer.
        </p>
      </div>
    </div>
  );
}

const MYTHS = [
  {
    statement: "Musim panas terjadi karena Bumi paling dekat dengan Matahari.",
    answer: "mitos" as const,
    explanation:
      "Bumi justru berada paling dekat dengan Matahari sekitar awal Januari. Musim panas terutama disebabkan oleh kemiringan sumbu, sudut penyinaran, dan lama siang. Perubahan jarak bukan penyebab utama.",
  },
  {
    statement: "Sumbu Bumi miring sekitar 23,5° dari garis tegak lurus terhadap bidang orbit.",
    answer: "fakta" as const,
    explanation:
      "Benar. Sudut 23,5° diukur dari garis tegak lurus terhadap bidang orbit. Terhadap bidang orbit, padanannya sekitar 66,5°.",
  },
  {
    statement: "Saat belahan Utara mengalami musim panas, belahan Selatan umumnya mengalami musim dingin.",
    answer: "fakta" as const,
    explanation:
      "Benar dalam konteks empat musim lintang sedang. Ketika satu belahan condong ke Matahari, belahan lain menjauh.",
  },
  {
    statement: "Indonesia umumnya memiliki musim hujan dan kemarau.",
    answer: "fakta" as const,
    explanation:
      "Benar. Indonesia beriklim tropis dengan dua musim utama. Polanya dipengaruhi angin muson, pola curah hujan, dan sirkulasi atmosfer.",
  },
  {
    statement: "Kemiringan sumbu Bumi tidak berubah arah secara signifikan selama satu kali revolusi dalam model sederhana.",
    answer: "fakta" as const,
    explanation:
      "Benar untuk model pembelajaran tahunan sederhana. Arah sumbu tetap relatif sama; yang berubah adalah posisi Bumi pada orbit.",
  },
  {
    statement: "Saat Bumi berevolusi, kedua belahan selalu menerima energi Matahari yang sama.",
    answer: "mitos" as const,
    explanation:
      "Mitos. Karena kemiringan sumbu, penyinaran tidak simetris sepanjang tahun. Satu belahan dapat menerima sinar lebih tegak dan siang lebih panjang daripada belahan lainnya.",
  },
];

function LessonEight() {
  const { playFx } = useApp();
  const [answers, setAnswers] = useState<Record<number, "mitos" | "fakta">>({});
  const answeredCount = Object.keys(answers).length;
  const correctCount = MYTHS.reduce(
    (total, myth, index) => total + (answers[index] === myth.answer ? 1 : 0),
    0,
  );

  const choose = (index: number, answer: "mitos" | "fakta") => {
    if (answers[index]) return;
    const nextAnswers = { ...answers, [index]: answer };
    setAnswers(nextAnswers);
    if (MYTHS[index].answer === answer) playFx("correct");
    else playFx("wrong");
  };

  return (
    <div>
      <p className="lesson-lead">
        Gagasan yang sering terdengar belum tentu benar. Pilih <strong>Mitos</strong> atau{" "}
        <strong>Fakta</strong> untuk setiap pernyataan, lalu baca penjelasan ilmiahnya.
      </p>
      <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
        <p className="text-[11px] text-slate-400">
          Dijawab <strong className="text-slate-200">{answeredCount}/6</strong>
          {answeredCount > 0 && (
            <span className="ml-2 text-emerald-300">· Benar {correctCount}</span>
          )}
        </p>
        <button
          type="button"
          onClick={() => setAnswers({})}
          className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 transition-colors hover:text-cyan-200"
        >
          <RotateCcw size={12} /> Ulangi kartu
        </button>
      </div>
      <div className="mt-3 grid gap-2.5">
        {MYTHS.map((myth, index) => {
          const chosen = answers[index];
          const isCorrect = chosen === myth.answer;
          return (
            <div
              key={myth.statement}
              className={cn(
                "rounded-2xl border p-3.5 transition-all",
                chosen
                  ? isCorrect
                    ? "border-emerald-300/25 bg-emerald-400/[0.045]"
                    : "border-rose-300/20 bg-rose-400/[0.04]"
                  : "border-white/10 bg-white/[0.025]",
              )}
            >
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[10px] font-bold text-slate-400">
                  {index + 1}
                </span>
                <p className="flex-1 text-xs font-semibold leading-relaxed text-slate-200">{myth.statement}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 pl-9">
                {(["mitos", "fakta"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={Boolean(chosen)}
                    onClick={() => choose(index, option)}
                    aria-pressed={chosen === option}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all",
                      chosen === option
                        ? chosen === myth.answer
                          ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-200"
                          : "border-rose-300/40 bg-rose-300/15 text-rose-200"
                        : chosen
                          ? "border-white/[0.07] text-slate-600"
                          : "border-white/10 text-slate-400 hover:border-cyan-300/30 hover:text-cyan-200",
                    )}
                  >
                    {option}
                  </button>
                ))}
                {chosen && (
                  <span className={cn("ml-auto inline-flex items-center gap-1 text-[10px] font-semibold", isCorrect ? "text-emerald-300" : "text-rose-300")}>
                    {isCorrect ? <CheckCircle2 size={12} /> : <X size={12} />}
                    {isCorrect ? "Tepat" : `Kunci: ${myth.answer === "fakta" ? "Fakta" : "Mitos"}`}
                  </span>
                )}
              </div>
              {chosen && (
                <p className="mt-2.5 rounded-lg border border-white/[0.07] bg-night-950/40 px-3 py-2 text-[10px] leading-relaxed text-slate-400">
                  {myth.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {answeredCount === 6 && (
        <div className="mt-3 rounded-xl border border-emerald-300/20 bg-emerald-400/[0.06] p-3">
          <p className="text-xs font-bold text-emerald-200">
            Selesai! Kamu menjawab benar {correctCount} dari 6 pernyataan.
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            Ingat pola utamanya: kemiringan sumbu + revolusi → sudut penyinaran dan lama siang →
            perbedaan musim. Jarak Bumi–Matahari bukan penyebab utama.
          </p>
        </div>
      )}
    </div>
  );
}

export function LessonContent({ id }: { id: number }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Pill dot="bg-cyan-400">Materi {id} dari 8</Pill>
        {id === 2 && <Pill className="border-amber-300/20 text-amber-200">23,5°</Pill>}
        {id === 3 && <Pill className="border-amber-300/20 text-amber-200">365¼ hari</Pill>}
        {id === 7 && <Pill className="border-emerald-300/20 text-emerald-200">Tropis</Pill>}
      </div>
      {id === 1 && <LessonOne />}
      {id === 2 && <LessonTwo />}
      {id === 3 && <LessonThree />}
      {id === 4 && <LessonFour />}
      {id === 5 && <LessonFive />}
      {id === 6 && <LessonSix />}
      {id === 7 && <LessonSeven />}
      {id === 8 && <LessonEight />}
      {id !== 8 && <ConceptCheck index={id} />}
      {id === 8 && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[10px] text-slate-500">
          <Sparkles size={13} className="text-cyan-300" />
          Kunci ilmiah: musim adalah akibat geometri penyinaran dan lama siang, bukan terutama jarak.
        </div>
      )}
      <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-slate-600">
        <Info size={12} className="mt-0.5 shrink-0" />
        Catatan akurasi: ilustrasi tidak berskala astronomis. Tanggal ekuinoks/solstis adalah perkiraan
        dan dapat bergeser sekitar satu hari antartahun.
      </p>
    </div>
  );
}

export function LessonContinue({
  id,
  onPrev,
  onNext,
  isLast,
  isRead,
  onMarkRead,
}: {
  id: number;
  onPrev: () => void;
  onNext: () => void;
  isLast: boolean;
  isRead: boolean;
  onMarkRead: () => void;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.08] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onMarkRead}
        className={cn(
          "inline-flex items-center gap-2 self-start rounded-lg px-1 py-1 text-[11px] font-semibold transition-colors",
          isRead ? "text-emerald-300" : "text-slate-400 hover:text-cyan-200",
        )}
      >
        {isRead ? <CheckCircle2 size={14} /> : <span className="h-3.5 w-3.5 rounded-full border border-current" />}
        {isRead ? "Sudah ditandai selesai" : "Tandai materi ini selesai"}
      </button>
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <Button variant="ghost" size="sm" onClick={onPrev} disabled={id === 1}>
          Sebelumnya
        </Button>
        <Button size="sm" onClick={onNext}>
          {isLast ? "Lihat kesimpulan" : "Materi berikutnya"}
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
