import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  Info,
  Lightbulb,
  Orbit,
  Play,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useApp, type PageId } from "../lib/store";
import { Button, Card, Pill, ProgressBar, ProgressRing } from "../components/ui";
import { Orrery } from "../components/Orrery";
import { ORBIT_POSITIONS } from "../data/astronomy";
import { cn } from "../utils/cn";

type MenuItem = {
  page: PageId;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: string;
  iconBg: string;
  featured?: boolean;
  tag?: string;
};

const MENU: MenuItem[] = [
  {
    page: "materi",
    title: "Materi",
    subtitle: "8 bagian singkat dengan ilustrasi dan pertanyaan interaktif.",
    icon: BookOpen,
    tone: "from-cyan-500/15 via-transparent to-transparent",
    iconBg: "from-cyan-400/20 to-sky-500/10 text-cyan-300 border-cyan-300/20",
  },
  {
    page: "lab",
    title: "Laboratorium Simulasi",
    subtitle: "Putar orbit, ubah kemiringan, dan amati musim secara langsung.",
    icon: Orbit,
    tone: "from-amber-400/[0.13] via-cyan-500/[0.04] to-transparent",
    iconBg: "from-amber-300/20 to-orange-400/10 text-amber-300 border-amber-300/25",
    featured: true,
    tag: "Fitur utama",
  },
  {
    page: "experiment",
    title: "Eksperimen Tanpa Kemiringan",
    subtitle: "Bandingkan sumbu 0°, 23,5°, dan 30° dalam satu meja percobaan.",
    icon: FlaskConical,
    tone: "from-violet-500/15 via-transparent to-transparent",
    iconBg: "from-violet-400/20 to-indigo-500/10 text-violet-300 border-violet-300/20",
  },
  {
    page: "latihan",
    title: "Latihan",
    subtitle: "12 soal beragam dengan umpan balik ilmiah setiap jawaban.",
    icon: Target,
    tone: "from-emerald-500/15 via-transparent to-transparent",
    iconBg: "from-emerald-400/20 to-teal-500/10 text-emerald-300 border-emerald-300/20",
  },
  {
    page: "game",
    title: "Buru Musim",
    subtitle: "Mini game posisi orbit. Temukan musim sebelum petunjuk habis.",
    icon: Gamepad2,
    tone: "from-orange-500/15 via-transparent to-transparent",
    iconBg: "from-orange-400/20 to-amber-500/10 text-orange-300 border-orange-300/20",
    tag: "Bonus",
  },
  {
    page: "kuis",
    title: "Kuis Tantangan",
    subtitle: "15 soal, timer opsional, dan rekap topik yang perlu dipelajari lagi.",
    icon: Trophy,
    tone: "from-amber-400/15 via-transparent to-transparent",
    iconBg: "from-amber-300/20 to-yellow-500/10 text-amber-300 border-amber-300/20",
  },
  {
    page: "kesimpulan",
    title: "Kesimpulan",
    subtitle: "Enam benang merah, diagram akhir, dan refleksi keteraturan alam.",
    icon: Sparkles,
    tone: "from-sky-500/15 via-transparent to-transparent",
    iconBg: "from-sky-400/20 to-cyan-500/10 text-sky-300 border-sky-300/20",
  },
  {
    page: "tentang",
    title: "Tentang Aplikasi",
    subtitle: "Tujuan, cara pakai, catatan akurasi, dan kredit pembuat.",
    icon: Info,
    tone: "from-slate-400/10 via-transparent to-transparent",
    iconBg: "from-slate-400/15 to-slate-500/10 text-slate-300 border-slate-300/20",
  },
];

const quickSteps = [
  { label: "Kenali sumbu", page: "materi" as PageId, doneKey: "sumbu" },
  { label: "Coba simulasi", page: "lab" as PageId, doneKey: "simulasi" },
  { label: "Uji pemahaman", page: "kuis" as PageId, doneKey: "kuis" },
];

export function Home() {
  const { navigate, progress, progressPercent } = useApp();
  const nextTarget =
    progress.materiRead.length < 8
      ? "materi"
      : progress.practiceSolved.length < 12
        ? "latihan"
        : progress.quizBest === null
          ? "kuis"
          : "kesimpulan";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="grid items-center gap-8 pb-10 pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pb-14 lg:pt-14">
        <div className="relative z-10">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Pill dot="bg-emerald-400">IPAS · Kelas VI · Fase C</Pill>
            <Pill className="border-cyan-300/20 bg-cyan-400/[0.07] text-cyan-200">
              <Sparkles size={11} /> Pembelajaran interaktif
            </Pill>
          </div>

          <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.32em] text-cyan-300/90">
            Earth Tilt &amp; Seasons
          </p>
          <h1 className="text-balance font-display text-[2.55rem] font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.3rem]">
            Misteri
            <br />
            <span className="text-gradient">Empat Musim</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-300/90 sm:text-base">
            Jelajahi kemiringan Bumi, revolusi, dan rahasia pergantian musim. Ubah sumbu Bumi,
            putar orbit, dan temukan mengapa belahan dunia bisa memiliki musim yang berbeda.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" onClick={() => navigate("materi")} className="group">
              <Play size={17} className="fill-current" />
              MULAI BELAJAR
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate("lab")}>
              <Orbit size={17} className="text-cyan-300" />
              Coba laboratorium
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[11px] font-medium text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" /> 8 materi terstruktur
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" /> Simulasi tanpa WebGL
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" /> Progres tersimpan
            </span>
          </div>

          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-2.5 pr-4 sm:max-w-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-sky-500 font-display text-sm font-bold text-night-950">
              WA
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-500">Aplikasi dibuat oleh</p>
              <p className="font-display text-sm font-bold text-slate-100">Wiyanto Abu Hanif</p>
            </div>
            <GraduationCap size={18} className="ml-auto shrink-0 text-slate-600" />
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 rounded-[2.4rem] bg-cyan-400/[0.07] blur-3xl" />
          <Card glow className="relative overflow-hidden border-white/[0.13]">
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
            <div className="relative flex items-center justify-between border-b border-white/[0.08] px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
                  Peta orbit Bumi
                </span>
              </div>
              <Pill className="border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[8px] text-slate-400">
                Bukan skala
              </Pill>
            </div>

            <div className="relative px-1 py-2 sm:px-3">
              <Orrery angle={180} tilt={23.5} view="3d" />
              <div className="absolute left-3 top-3 rounded-xl border border-amber-300/20 bg-night-950/80 px-2.5 py-1.5 backdrop-blur sm:left-5 sm:top-5">
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-amber-300/80">Kemiringan</p>
                <p className="font-display text-base font-bold text-amber-200">23,5°</p>
              </div>
              <div className="absolute bottom-2 right-3 hidden rounded-xl border border-white/10 bg-night-950/85 px-3 py-2 backdrop-blur sm:block">
                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-500">Posisi kini · Juni</p>
                <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold">
                  <span className="text-amber-200">U: Panas</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-sky-300">S: Dingin</span>
                </div>
              </div>
            </div>

            <div className="relative grid grid-cols-4 gap-px border-t border-white/[0.08] bg-white/[0.04]">
              {ORBIT_POSITIONS.map((position) => (
                <div key={position.key} className="bg-night-900/70 px-2 py-2.5 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{position.month}</p>
                  <p className="mt-0.5 text-[8px] text-slate-500">{position.kind}</p>
                </div>
              ))}
            </div>
          </Card>
          <div className="absolute -bottom-4 -left-2 hidden items-center gap-2 rounded-xl border border-white/10 bg-night-800/90 px-3 py-2 backdrop-blur sm:flex">
            <Lightbulb size={14} className="text-amber-300" />
            <span className="text-[10px] font-medium text-slate-300">Sumbu tetap miring, posisi Bumi berubah</span>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <Card className="overflow-hidden">
          <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div className="flex items-center gap-4">
              <ProgressRing value={progressPercent} size={58} stroke={4} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-base font-bold text-white">Perjalanan belajarmu</h2>
                  <Pill className="border-cyan-300/20 bg-cyan-400/[0.07] px-2 py-0.5 text-[8px] text-cyan-200">
                    {progressPercent}% selesai
                  </Pill>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  Progres disimpan otomatis di perangkat ini. Lanjutkan kapan saja.
                </p>
                <div className="mt-2.5 sm:max-w-xs">
                  <ProgressBar
                    value={progressPercent}
                    barClassName="from-cyan-300 to-amber-300"
                    sublabel=""
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:justify-self-end">
              <Button size="sm" onClick={() => navigate(nextTarget)}>
                {progressPercent === 0 ? "Mulai petualangan" : "Lanjutkan belajar"}
                <ArrowRight size={14} />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate("kesimpulan")}>
                <Compass size={14} className="text-cyan-300" />
                Lihat ringkasan
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px border-t border-white/[0.07] bg-white/[0.05]">
            {quickSteps.map((step, index) => {
              const done =
                (step.doneKey === "sumbu" && progress.materiRead.length > 0) ||
                (step.doneKey === "simulasi" && progress.visited.includes("lab")) ||
                (step.doneKey === "kuis" && progress.quizBest !== null);
              return (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => navigate(step.page)}
                  className="group flex items-center gap-2.5 bg-night-900/80 px-3 py-3 text-left transition-colors hover:bg-night-800/90 sm:px-5"
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                      done
                        ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
                        : "border-white/15 bg-white/[0.03] text-slate-500",
                    )}
                  >
                    {done ? <CheckCircle2 size={13} /> : index + 1}
                  </span>
                  <span>
                    <span className="block text-[10px] font-semibold text-slate-200 sm:text-xs">{step.label}</span>
                    <span className="block text-[9px] text-slate-500">{done ? "Sudah dicoba" : "Belum dimulai"}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/80">Ruang jelajah</p>
            <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
              Pilih petualanganmu
            </h2>
            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-slate-400 sm:text-sm">
              Semua materi, simulasi, latihan, dan kuis dapat dibuka secara bebas. Mulai dari mana saja.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("guru")}>
            <GraduationCap size={15} className="text-cyan-300" />
            Ruang Guru
            <ArrowRight size={13} />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MENU.map((item, index) => {
            const Icon = item.icon;
            const meta =
              item.page === "materi"
                ? `${progress.materiRead.length}/8 selesai`
                : item.page === "latihan"
                  ? `${progress.practiceSolved.length}/12 soal`
                  : item.page === "kuis"
                    ? progress.quizBest !== null
                      ? `Nilai terbaik ${progress.quizBest}`
                      : "15 soal"
                    : item.page === "game"
                      ? progress.gameBest > 0
                        ? `Skor ${progress.gameBest}/500`
                        : "5 tantangan"
                      : item.page === "lab"
                        ? "Kontrol interaktif"
                        : item.page === "experiment"
                          ? "0° · 23,5° · 30°"
                          : item.page === "kesimpulan"
                            ? progress.visited.includes("kesimpulan")
                              ? "Sudah dibaca"
                              : "Ringkasan visual"
                            : "Panduan & kredit";
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => navigate(item.page)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_18px_50px_-24px_rgba(34,211,238,0.45)] sm:p-5",
                  item.tone,
                  item.featured && "border-cyan-300/20 sm:col-span-2",
                )}
              >
                <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/[0.035] blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="relative flex items-start justify-between gap-3">
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl border bg-gradient-to-br", item.iconBg)}>
                    <Icon size={19} strokeWidth={1.9} />
                  </span>
                  <div className="flex items-center gap-2">
                    {item.tag && (
                      <Pill
                        className={cn(
                          "px-2 py-0.5 text-[8px]",
                          item.featured
                            ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
                            : "border-orange-300/20 bg-orange-300/10 text-orange-200",
                        )}
                      >
                        {item.tag}
                      </Pill>
                    )}
                    <span className="font-display text-[10px] font-semibold text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <h3 className="relative mt-4 font-display text-base font-bold text-white sm:text-[17px]">{item.title}</h3>
                <p className={cn("relative mt-1.5 text-[11px] leading-relaxed text-slate-400", item.featured && "sm:max-w-md sm:text-xs")}>
                  {item.subtitle}
                </p>
                <div className="relative mt-4 flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">{meta}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 group-hover:border-cyan-300/30 group-hover:bg-cyan-300/10 group-hover:text-cyan-200">
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: Orbit,
            title: "Kemiringan yang setia",
            text: "Arah sumbu Bumi tetap relatif sama selama berevolusi. Itulah kunci perubahan musim.",
          },
          {
            icon: Sparkles,
            title: "Sinar yang tidak merata",
            text: "Sinar lebih tegak memusatkan energi. Sinar miring menyebarkannya ke area lebih luas.",
          },
          {
            icon: Compass,
            title: "Indonesia yang tropis",
            text: "Indonesia umumnya memiliki musim hujan dan kemarau, bukan empat musim lintang sedang.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <Icon size={17} className="mt-0.5 shrink-0 text-cyan-300" />
              <div>
                <p className="text-xs font-bold text-slate-200">{item.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{item.text}</p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
