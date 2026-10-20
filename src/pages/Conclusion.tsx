import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  CloudRain,
  Compass,
  Earth,
  MessageCircleHeart,
  Orbit,
  Save,
  Sparkles,
  Sun,
  Telescope,
  ThermometerSun,
} from "lucide-react";
import { Button, Card, PageHeader, Pill, ProgressBar } from "../components/ui";
import { Orrery } from "../components/Orrery";
import { LESSONS, QURAN_REFLECTION } from "../data/reference";
import { useApp } from "../lib/store";
import { cn } from "../utils/cn";

const POINTS = [
  {
    icon: Compass,
    title: "Sumbu Bumi adalah garis khayal",
    text: "Garis ini melewati Kutub Utara dan Kutub Selatan serta menjadi poros rotasi Bumi.",
    tone: "cyan",
  },
  {
    icon: Telescope,
    title: "Miring 23,5° dari garis tegak lurus",
    text: "Acuannya adalah garis tegak lurus terhadap bidang orbit. Terhadap bidang orbit, padanannya sekitar 66,5°.",
    tone: "amber",
  },
  {
    icon: Orbit,
    title: "Revolusi memerlukan 365¼ hari",
    text: "Bumi bergerak mengelilingi Matahari. Arah kemiringan sumbu tetap relatif sama selama revolusi.",
    tone: "violet",
  },
  {
    icon: Sun,
    title: "Kemiringan + revolusi = perubahan penyinaran",
    text: "Sudut datang sinar dan lama siang berubah sepanjang tahun. Jarak Bumi–Matahari bukan penyebab utama musim.",
    tone: "gold",
  },
  {
    icon: ThermometerSun,
    title: "Musim kedua belahan berlawanan",
    text: "Saat satu belahan condong ke Matahari, belahan lain menjauh. Dalam konteks empat musim, panas berhadapan dengan dingin.",
    tone: "orange",
  },
  {
    icon: CloudRain,
    title: "Indonesia: tropis, hujan, kemarau",
    text: "Pola musim Indonesia dipengaruhi angin muson, distribusi curah hujan, dan sirkulasi atmosfer.",
    tone: "emerald",
  },
];

const TONE_MAP: Record<string, string> = {
  cyan: "border-cyan-300/20 bg-cyan-400/[0.045] text-cyan-300",
  amber: "border-amber-300/20 bg-amber-400/[0.045] text-amber-300",
  violet: "border-violet-300/20 bg-violet-400/[0.045] text-violet-300",
  gold: "border-yellow-300/20 bg-yellow-400/[0.045] text-yellow-300",
  orange: "border-orange-300/20 bg-orange-400/[0.045] text-orange-300",
  emerald: "border-emerald-300/20 bg-emerald-400/[0.045] text-emerald-300",
};

export function Conclusion() {
  const { progress: learnerProgress, progressPercent, setReflection, playFx, navigate } = useApp();
  const [draft, setDraft] = useState(learnerProgress.reflection);
  const [saved, setSaved] = useState(Boolean(learnerProgress.reflection));
  const isDirty = draft.trim() !== learnerProgress.reflection.trim();

  const save = () => {
    setReflection(draft.trim());
    setSaved(true);
    playFx("correct");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Kesimpulan · benang merah"
        title="Enam hal yang perlu kamu bawa pulang"
        description="Kemiringan sumbu Bumi tidak bekerja sendirian. Ia bekerja bersama revolusi, sudut penyinaran, dan lama siang untuk menjelaskan musim."
        icon={Sparkles}
        actions={
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Progres belajar</p>
              <p className="mt-0.5 text-xs font-semibold text-cyan-200">{progressPercent}%</p>
            </div>
            <ProgressBar value={progressPercent} className="w-24" />
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_0.92fr]">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {POINTS.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.045]"
              >
                <div className="flex items-start justify-between">
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl border", TONE_MAP[point.tone])}>
                    <Icon size={17} />
                  </span>
                  <span className="font-display text-2xl font-bold text-white/[0.08]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-3 text-xs font-bold leading-snug text-slate-100">{point.title}</h3>
                <p className="mt-1.5 text-[10px] leading-relaxed text-slate-400">{point.text}</p>
              </div>
            );
          })}
        </div>

        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Orbit size={14} className="text-cyan-300" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Diagram akhir</p>
            </div>
            <Pill className="px-2 py-0.5 text-[8px]">Ilustrasi · bukan skala</Pill>
          </div>
          <div className="bg-[radial-gradient(ellipse_at_center,rgba(8,47,73,0.3),rgba(3,8,23,0.5))] px-1">
            <Orrery angle={180} tilt={23.5} view="3d" showAngle showSeasons showRays />
          </div>
          <div className="grid grid-cols-3 gap-px border-t border-white/[0.07] bg-white/[0.05]">
            <div className="bg-night-900/90 px-3 py-2">
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Bumi</p>
              <p className="mt-0.5 text-[10px] font-semibold text-cyan-200">Sumbu miring 23,5°</p>
            </div>
            <div className="bg-night-900/90 px-3 py-2">
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Revolusi</p>
              <p className="mt-0.5 text-[10px] font-semibold text-slate-200">&lt; 1 tahun</p>
            </div>
            <div className="bg-night-900/90 px-3 py-2">
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Akibat</p>
              <p className="mt-0.5 text-[10px] font-semibold text-amber-200">4 posisi musim</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/[0.035] p-4">
          <p className="text-[9px] font-bold uppercase tracking-wider text-cyan-300/80">Bukan jarak, tetapi geometri</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
            Bumi justru berada paling dekat ke Matahari sekitar awal Januari, bukan Juni. Sudut penyinaran dan lama
            siang adalah kunci perubahan musim.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.035] p-4">
          <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-300/80">Bukan seluruh Bumi</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
            Empat musim adalah pola di wilayah beriklim sedang. Indonesia yang tropis memiliki pola musim hujan dan
            kemarau yang dipengaruhi atmosfer.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-300/15 bg-amber-400/[0.035] p-4">
          <p className="text-[9px] font-bold uppercase tracking-wider text-amber-300/80">Tetap ada variasi</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
            Dua wilayah pada lintang yang sama dapat memiliki curah hujan berbeda. Lintang bukan satu-satunya faktor
            iklim.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <MessageCircleHeart size={16} className="text-cyan-300" />
            <h2 className="font-display text-base font-bold text-white">Refleksi akhir</h2>
          </div>
          <blockquote className="mt-3 rounded-xl border border-cyan-300/20 bg-cyan-400/[0.05] p-3.5 text-sm font-semibold leading-relaxed text-cyan-50">
            “Sekarang, dapatkah kamu menjelaskan mengapa musim panas di belahan Utara terjadi ketika belahan
            Selatan mengalami musim dingin?”
          </blockquote>
          <div className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-400">
            <p className="flex gap-2"><span className="font-bold text-cyan-300">1.</span> Apa peran kemiringan sumbu dalam jawabanmu?</p>
            <p className="flex gap-2"><span className="font-bold text-cyan-300">2.</span> Bagaimana sudut penyinaran dan lama siang mendukung penjelasanmu?</p>
            <p className="flex gap-2"><span className="font-bold text-cyan-300">3.</span> Mengapa jarak Bumi–Matahari bukan jawaban utamanya?</p>
          </div>
          <div className="mt-3">
            <label htmlFor="reflection" className="mb-1.5 block text-[10px] font-semibold text-slate-400">
              Tuliskan refleksimu (disimpan di perangkat ini)
            </label>
            <textarea
              id="reflection"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setSaved(false);
              }}
              rows={4}
              maxLength={800}
              placeholder="Saat belahan Utara condong ke Matahari, sinar datang lebih ..."
              className="w-full resize-y rounded-xl border border-white/10 bg-night-950/50 px-3 py-2.5 text-xs leading-relaxed text-slate-200 placeholder:text-slate-600 focus:border-cyan-300/40 focus:outline-none"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[9px] text-slate-600">{draft.length}/800 · tersimpan otomatis setelah menekan tombol</span>
              <Button size="sm" onClick={save} disabled={!isDirty || draft.trim().length === 0}>
                {saved && !isDirty ? <Check size={13} /> : <Save size={13} />}
                {saved && !isDirty ? "Tersimpan" : "Simpan refleksi"}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-4 sm:p-5">
          <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-emerald-400/[0.06] blur-3xl" />
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300">
              <BookOpen size={15} />
            </span>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-emerald-300/80">Refleksi nilai</p>
              <h2 className="font-display text-base font-bold text-white">{QURAN_REFLECTION.surah}</h2>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-[1.9] text-slate-300">
            “{QURAN_REFLECTION.ayah5}”
          </p>
          <p className="mt-2 text-[11px] leading-[1.9] text-slate-300">
            “{QURAN_REFLECTION.ayah6}”
          </p>
          <p className="mt-2 text-[9px] text-slate-600">Sumber: {QURAN_REFLECTION.source}.</p>
          <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Renungkan</p>
            <ul className="mt-1.5 space-y-1.5 text-[10px] leading-relaxed text-slate-400">
              <li>• Apa yang kita pelajari dari keteraturan gerak Bumi?</li>
              <li>• Bagaimana siang, malam, dan musim membantu kehidupan?</li>
              <li>• Sikap apa yang sebaiknya kita tunjukkan saat mempelajari alam?</li>
            </ul>
          </div>
          <div className="mt-3 flex gap-2 rounded-xl border border-emerald-300/15 bg-emerald-400/[0.04] p-2.5 text-[9px] leading-relaxed text-slate-400">
            <InfoIcon />
            <span>{QURAN_REFLECTION.note}</span>
          </div>
        </Card>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-300/20 bg-gradient-to-r from-amber-300/[0.08] via-white/[0.03] to-cyan-300/[0.06] p-5 text-center sm:p-6">
        <p className="mx-auto max-w-2xl font-display text-base font-bold leading-relaxed text-amber-100 sm:text-lg">
          “Melalui keteraturan alam semesta, kita belajar untuk mengamati, berpikir, bersyukur, dan menjaga bumi
          sebagai amanah.”
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button size="sm" onClick={() => navigate("kuis")}>
            <TrophyIcon /> Buka kuis tantangan
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate("lab")}>
            <Orbit size={14} /> Coba simulasi lagi
          </Button>
          <Button size="sm" variant="ghost" onClick={() => navigate("materi")}>
            <BookOpen size={14} /> Buka materi
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] text-slate-500">
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-400" /> Materi {learnerProgress.materiRead.length}/{LESSONS.length}</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-400" /> Latihan {learnerProgress.practiceSolved.length}/12</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-400" /> Kuis {learnerProgress.quizBest ?? 0}/100</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Earth size={12} className="text-cyan-300" /> Selesai menjelajah empat musim? Progress tersimpan di perangkatmu.
        </span>
        <Button variant="ghost" size="sm" onClick={() => navigate("kuis")}>
          Lanjut ke kuis <ArrowRight size={13} />
        </Button>
      </div>
    </div>
  );
}

function InfoIcon() {
  return <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white/15 text-[9px] text-slate-500">i</span>;
}

function TrophyIcon() {
  return <Sparkles size={14} />;
}
