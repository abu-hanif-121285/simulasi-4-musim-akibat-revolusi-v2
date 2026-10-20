import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Info,
  Minus,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  Trophy,
  X,
} from "lucide-react";
import { Button, Card, Modal, PageHeader, Pill, ProgressBar, ProgressRing, ToggleRow } from "../components/ui";
import { QUIZ_QUESTIONS, SCORE_BANDS } from "../data/questions";
import { useApp } from "../lib/store";
import { cn } from "../utils/cn";

type Phase = "intro" | "quiz" | "result";

const TOTAL_SECONDS = 15 * 60;

export function Quiz() {
  const { progress, recordQuiz, playFx, navigate } = useApp();
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(QUIZ_QUESTIONS.length).fill(null));
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const savedRef = useRef(false);

  const question = QUIZ_QUESTIONS[current];
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const selected = answers[current];
  const correctCount = QUIZ_QUESTIONS.reduce(
    (total, item, index) => total + (answers[index] === item.correct ? 1 : 0),
    0,
  );
  const wrongCount = QUIZ_QUESTIONS.reduce(
    (total, item, index) => total + (answers[index] !== null && answers[index] !== item.correct ? 1 : 0),
    0,
  );
  const unanswered = QUIZ_QUESTIONS.length - correctCount - wrongCount;
  const score = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
  const band = SCORE_BANDS.find((item) => score >= item.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
  const allTopics = Array.from(new Set(QUIZ_QUESTIONS.map((item) => item.topic)));
  const mastered = allTopics.filter((topic) =>
    QUIZ_QUESTIONS.every((item, index) => item.topic !== topic || answers[index] === item.correct),
  );
  const needsReview = allTopics.filter((topic) =>
    QUIZ_QUESTIONS.some((item, index) => item.topic === topic && answers[index] !== item.correct),
  );
  const bestCategory =
    progress.quizBest === null
      ? null
      : SCORE_BANDS.find((item) => progress.quizBest !== null && progress.quizBest >= item.min) ?? SCORE_BANDS[3];

  useEffect(() => {
    if (phase !== "quiz" || !timerEnabled || timeLeft <= 0) return;
    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, timerEnabled, timeLeft]);

  useEffect(() => {
    if (phase === "quiz" && timerEnabled && timeLeft === 0) {
      setPhase("result");
    }
  }, [phase, timerEnabled, timeLeft]);

  useEffect(() => {
    if (phase !== "result") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!savedRef.current) {
      savedRef.current = true;
      recordQuiz(score);
      playFx(score >= 70 ? "win" : "wrong");
    }
  }, [phase, score, recordQuiz, playFx]);

  const start = () => {
    savedRef.current = false;
    setAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
    setCurrent(0);
    setTimeLeft(TOTAL_SECONDS);
    setPhase("quiz");
    setConfirmOpen(false);
    playFx("click");
  };

  const choose = (index: number) => {
    if (phase !== "quiz") return;
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = index;
      return next;
    });
    playFx("click");
  };

  const finish = () => {
    setConfirmOpen(false);
    setPhase("result");
  };

  const go = (index: number) => {
    setCurrent(Math.max(0, Math.min(QUIZ_QUESTIONS.length - 1, index)));
    playFx("click");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Kuis tantangan · 15 soal"
        title="Seberapa jauh pemahamanmu?"
        description="Satu soal tampil pada satu waktu. Jawaban benarmu dihitung otomatis di akhir kuis. Timer bersifat opsional."
        icon={Trophy}
        actions={
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Nilai terbaik</p>
              <p className="mt-0.5 text-xs font-semibold text-amber-200">
                {progress.quizBest === null ? "Belum ada" : progress.quizBest}
              </p>
            </div>
            <ProgressRing value={progress.quizBest ?? 0} />
          </div>
        }
      />

      {phase === "intro" && (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card glow className="relative overflow-hidden p-5 sm:p-7">
            <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-amber-400/[0.09] blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-300/10 text-amber-300">
                  <Trophy size={23} />
                </span>
                <div>
                  <Pill className="border-amber-300/20 bg-amber-300/[0.06] px-2 py-0.5 text-[8px] text-amber-200">Kuis akhir</Pill>
                  <h2 className="mt-1 font-display text-2xl font-bold text-white">Tantangan Penjelajah Musim</h2>
                </div>
              </div>
              <p className="mt-3 max-w-lg text-xs leading-relaxed text-slate-400 sm:text-sm">
                Lima belas soal mencakup sumbu Bumi, acuan sudut, revolusi, ekuinoks, solstis, iklim Indonesia,
                dan eksperimen kemiringan. Pilih jawaban terbaikmu; kamu dapat kembali ke soal sebelumnya.
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {[
                  { icon: Target, title: "15 soal", text: "Pilihan ganda" },
                  { icon: Award, title: "100 poin", text: "Dihitung otomatis" },
                  { icon: BookOpen, title: "Rekap topik", text: "Kuat & perlu diulang" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <Icon size={15} className="text-cyan-300" />
                      <p className="mt-1.5 text-[11px] font-bold text-slate-200">{item.title}</p>
                      <p className="text-[9px] text-slate-500">{item.text}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5">
                <ToggleRow
                  title="Aktifkan timer 15 menit"
                  description="Opsional. Jika waktu habis, kuis otomatis diperiksa."
                  checked={timerEnabled}
                  onChange={setTimerEnabled}
                  icon={Timer}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <Button onClick={start}>
                  <Play size={15} /> Mulai kuis
                </Button>
                <Button variant="secondary" onClick={() => navigate("materi")}>
                  <BookOpen size={14} /> Pelajari materi dulu
                </Button>
              </div>
              <p className="mt-3 flex items-start gap-1.5 text-[9px] leading-relaxed text-slate-600">
                <Info size={11} className="mt-0.5 shrink-0" />
                Nilai dihitung dari persentase jawaban benar. Soal yang tidak dijawab dihitung belum benar.
              </p>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">Kategori nilai</p>
              <div className="mt-3 space-y-2">
                {SCORE_BANDS.map((item, index) => (
                  <div key={item.title} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5">
                    <span className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold",
                      index === 0 ? "bg-amber-300/15 text-amber-200" : index === 1 ? "bg-cyan-300/10 text-cyan-200" : "bg-white/[0.05] text-slate-400",
                    )}>
                      {item.min}+
                    </span>
                    <div>
                      <p className="text-[11px] font-bold text-slate-200">{item.title}</p>
                      <p className="text-[9px] leading-relaxed text-slate-500">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            {progress.quizBest !== null && (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Nilai terbaikmu</p>
                    <p className="mt-1 font-display text-2xl font-bold text-amber-200">{progress.quizBest}</p>
                  </div>
                  <ProgressRing value={progress.quizBest} size={52} stroke={4} />
                </div>
                <p className="mt-1 text-[10px] text-slate-400">{bestCategory?.title}</p>
                <p className="mt-1 text-[9px] leading-relaxed text-slate-600">Progres tersimpan di perangkat ini.</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {phase === "quiz" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
          <Card className="order-2 overflow-hidden lg:order-1">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-300/20 bg-amber-300/10 font-display text-[10px] font-bold text-amber-200">
                  {current + 1}
                </span>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">{question.topic}</p>
                  <p className="text-[10px] font-semibold text-slate-300">Soal {current + 1} dari {QUIZ_QUESTIONS.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {timerEnabled && (
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-bold",
                    timeLeft <= 60
                      ? "border-rose-300/25 bg-rose-400/10 text-rose-200"
                      : "border-white/10 bg-white/[0.03] text-slate-300",
                  )}>
                    <Clock3 size={11} /> {formatTime(timeLeft)}
                  </span>
                )}
                <Pill className="px-2 py-0.5 text-[8px]">{answeredCount}/{QUIZ_QUESTIONS.length} dijawab</Pill>
              </div>
            </div>
            <div className="px-4 pt-3"><ProgressBar value={(current / QUIZ_QUESTIONS.length) * 100} /></div>

            <div className="p-4 sm:p-6">
              <h2 className="text-balance text-[15px] font-bold leading-relaxed text-white sm:text-base">{question.prompt}</h2>
              <div className="mt-4 grid gap-2">
                {question.options.map((option, index) => {
                  const isSelected = selected === index;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => choose(index)}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex min-h-12 items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-xs font-medium leading-relaxed transition-all",
                        isSelected
                          ? "border-cyan-300/45 bg-cyan-400/[0.09] text-cyan-50 shadow-[inset_0_0_24px_rgba(34,211,238,0.05)]"
                          : "border-white/10 bg-white/[0.025] text-slate-300 hover:border-white/20 hover:bg-white/[0.045]",
                      )}
                    >
                      <span className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[9px] font-bold",
                        isSelected ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-200" : "border-white/15 text-slate-500",
                      )}>
                        {isSelected ? <Check size={12} /> : String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-500">
                <Info size={11} /> Jawaban benar ditampilkan pada rekap akhir.
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-white/[0.08] px-4 py-3">
              <Button variant="ghost" size="sm" onClick={() => go(current - 1)} disabled={current === 0}>
                <ChevronLeft size={15} /> Sebelumnya
              </Button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  className="text-[10px] font-semibold text-slate-500 transition-colors hover:text-cyan-200"
                >
                  Selesaikan lebih awal
                </button>
                {current === QUIZ_QUESTIONS.length - 1 ? (
                  <Button size="sm" onClick={() => setConfirmOpen(true)}>
                    Selesai <Check size={14} />
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => go(current + 1)} disabled={selected === null || selected === undefined}>
                    Berikutnya <ChevronRight size={15} />
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <aside className="order-1 space-y-3 lg:order-2">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Navigasi soal</p>
                <span className="text-[10px] font-bold text-cyan-200">{answeredCount}/15</span>
              </div>
              <div className="mt-3 grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-5">
                {QUIZ_QUESTIONS.map((item, index) => {
                  const isAnswered = answers[index] !== null;
                  const active = index === current;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => go(index)}
                      aria-label={`Soal ${index + 1}`}
                      aria-current={active ? "step" : undefined}
                      className={cn(
                        "flex h-7 items-center justify-center rounded-md border text-[9px] font-bold transition-all",
                        active
                          ? "border-amber-300/50 bg-amber-300/15 text-amber-100"
                          : isAnswered
                            ? "border-cyan-300/20 bg-cyan-400/[0.07] text-cyan-300"
                            : "border-white/10 bg-white/[0.02] text-slate-600 hover:border-white/20",
                      )}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 border-t border-white/[0.07] pt-3">
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setConfirmOpen(true)}>
                  <Check size={13} /> Selesaikan kuis
                </Button>
              </div>
            </Card>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Ingat</p>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                Kuis mengukur pemahaman, bukan menghukum. Kamu dapat mengulang kuis kapan saja.
              </p>
            </div>
          </aside>
        </div>
      )}

      {phase === "result" && (
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <Card glow className="relative overflow-hidden p-5 text-center sm:p-7">
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-20" />
            <div className="relative">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-300">
                <Trophy size={28} />
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/80">Nilai akhir</p>
              <div className="mt-2 flex items-center justify-center">
                <div className="relative">
                  <ProgressRing value={score} size={138} stroke={8} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-4xl font-bold text-white">{score}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500">dari 100</span>
                  </div>
                </div>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-amber-200">{band.title}</h2>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{band.note}</p>
              {timerEnabled && (
                <Pill className="mt-3 border-white/10 px-2 py-0.5 text-[8px]">
                  <Clock3 size={9} /> {timeLeft === 0 ? "Waktu habis" : "Kuis dengan timer"}
                </Pill>
              )}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-white">Rekap hasil</h3>
              <Pill className="px-2 py-0.5 text-[8px]">Terbaik: {Math.max(progress.quizBest ?? 0, score)}</Pill>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: "Benar", value: correctCount, icon: Check, tone: "text-emerald-300 border-emerald-300/20 bg-emerald-400/[0.055]" },
                { label: "Salah", value: wrongCount, icon: X, tone: "text-rose-300 border-rose-300/20 bg-rose-400/[0.045]" },
                { label: "Kosong", value: unanswered, icon: Minus, tone: "text-slate-400 border-white/10 bg-white/[0.025]" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className={cn("rounded-xl border p-3", item.tone)}>
                    <Icon size={14} />
                    <p className="mt-1 font-display text-xl font-bold text-white">{item.value}</p>
                    <p className="text-[9px] uppercase tracking-wider opacity-70">{item.label}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.07]">
              <div className="flex h-full">
                <div className="bg-emerald-400" style={{ width: `${(correctCount / 15) * 100}%` }} />
                <div className="bg-rose-400" style={{ width: `${(wrongCount / 15) * 100}%` }} />
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">Topik yang sudah dikuasai</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {mastered.length > 0 ? mastered.map((topic) => (
                  <span key={topic} className="inline-flex items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-400/[0.06] px-2.5 py-1 text-[9px] font-semibold text-emerald-200">
                    <Check size={10} /> {topic}
                  </span>
                )) : <span className="text-[10px] text-slate-500">Belum ada topik yang seluruh soalnya benar.</span>}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80">Perlu dipelajari kembali</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {needsReview.length > 0 ? needsReview.map((topic) => (
                  <span key={topic} className="inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-400/[0.06] px-2.5 py-1 text-[9px] font-semibold text-amber-200">
                    <ArrowRight size={10} /> {topic}
                  </span>
                )) : <span className="text-[10px] text-emerald-300/80">Semua topik dikuasai. Luar biasa!</span>}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" onClick={start}>
                <RotateCcw size={14} /> Ulangi kuis
              </Button>
              <Button size="sm" variant="secondary" onClick={() => navigate("materi")}>
                <BookOpen size={14} /> Kembali ke materi
              </Button>
              <Button size="sm" variant="ghost" onClick={() => navigate("kesimpulan")}>
                Lihat kesimpulan <ArrowRight size={13} />
              </Button>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-cyan-300/15 bg-cyan-400/[0.04] p-3 text-[10px] leading-relaxed text-slate-400">
              <Sparkles size={13} className="mt-0.5 shrink-0 text-cyan-300" />
              {score >= 70
                ? "Gunakan hasil ini untuk merayakan proses belajarmu. Diskusikan topik yang perlu diulang dengan guru atau teman."
                : "Kembali ke laboratorium dan ubah kemiringan sumbu. Mengamati perubahan secara langsung membantu memperkuat pemahaman."}
            </div>
          </Card>
        </div>
      )}

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Selesaikan kuis sekarang?"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(false)}>Kembali</Button>
            <Button size="sm" onClick={finish}><Check size={14} /> Ya, selesaikan</Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-400/10 text-amber-300">
            {answeredCount === QUIZ_QUESTIONS.length ? <Check size={17} /> : <Info size={17} />}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              {answeredCount} dari {QUIZ_QUESTIONS.length} soal sudah dijawab.
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
              {answeredCount === QUIZ_QUESTIONS.length
                ? "Semua soal telah dijawab. Nilai akan langsung dihitung."
                : "Soal yang belum dijawab akan dihitung sebagai belum benar. Kamu masih bisa kembali jika ingin melengkapi."}
            </p>
            {timerEnabled && <p className="mt-2 text-[10px] text-cyan-300">Sisa waktu: {formatTime(timeLeft)}</p>}
          </div>
        </div>
      </Modal>
    </div>
  );
}
