import { useState } from "react";
import {
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Gamepad2,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { Button, Card, PageHeader, Pill, ProgressBar } from "../components/ui";
import { Orrery } from "../components/Orrery";
import { GAME_QUESTIONS } from "../data/questions";
import { positionForAngle } from "../data/astronomy";
import { useApp } from "../lib/store";
import { cn } from "../utils/cn";

const MAX_SCORE = GAME_QUESTIONS.length * 100;

function pointsForHints(hintsUsed: number) {
  if (hintsUsed <= 0) return 100;
  if (hintsUsed === 1) return 70;
  return 50;
}

export function Game() {
  const { progress, recordGame, playFx, navigate } = useApp();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wrongChoices, setWrongChoices] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [earned, setEarned] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = GAME_QUESTIONS[index];
  const position = positionForAngle(question.angle);
  const progressPercent = (index / GAME_QUESTIONS.length) * 100;

  const start = () => {
    setStarted(true);
    setFinished(false);
    setIndex(0);
    setScore(0);
    setHintsUsed(0);
    setWrongChoices([]);
    setCorrectAnswer(null);
    setEarned(0);
    playFx("click");
  };

  const choose = (option: number) => {
    if (correctAnswer !== null) return;
    if (option === question.correct) {
      const points = pointsForHints(hintsUsed);
      setEarned(points);
      setScore((value) => value + points);
      setCorrectAnswer(option);
      playFx("correct");
    } else {
      if (!wrongChoices.includes(option)) {
        setWrongChoices((prev) => [...prev, option]);
        setHintsUsed((value) => Math.min(2, value + 1));
      }
      playFx("wrong");
    }
  };

  const next = () => {
    if (correctAnswer === null) return;
    if (index === GAME_QUESTIONS.length - 1) {
      setFinished(true);
      recordGame(score);
      playFx("win");
    } else {
      setIndex((value) => value + 1);
      setHintsUsed(0);
      setWrongChoices([]);
      setCorrectAnswer(null);
      setEarned(0);
      playFx("click");
    }
  };

  const showHint = () => {
    if (hintsUsed >= 2) return;
    setHintsUsed((value) => value + 1);
    playFx("click");
  };

  const firstHint = hintsUsed >= 1;
  const secondHint = hintsUsed >= 2;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Buru Musim · mini game"
        title="Temukan musim di posisi orbit"
        description="Baca petunjuk visual pada model Bumi, lalu pilih musim yang tepat. Semakin sedikit petunjuk, semakin besar poinmu."
        icon={Gamepad2}
        actions={
          <div className="flex items-center gap-2">
            <Pill className="border-amber-300/20 bg-amber-400/[0.07] text-amber-200">
              <Trophy size={10} /> Terbaik {progress.gameBest}/{MAX_SCORE}
            </Pill>
            {started && !finished && (
              <Pill className="border-white/10 px-2 py-0.5 text-[8px]">
                Putaran {index + 1}/{GAME_QUESTIONS.length}
              </Pill>
            )}
          </div>
        }
      />

      {!started && (
        <Card glow className="relative overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-amber-400/[0.08] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-cyan-400/[0.06] blur-3xl" />
          <div className="relative grid items-center gap-7 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Pill dot="bg-amber-400">Bonus kegiatan</Pill>
              <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">Buru Musim</h2>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
                Lima posisi orbit, lima tantangan. Perhatikan arah kemiringan sumbu, belahan yang condong
                ke Matahari, dan petunjuk yang tersedia. Jawaban salah akan memberimu kesempatan mencoba lagi.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {[
                  { icon: Gamepad2, title: "5 putaran", text: "Satu posisi orbit setiap soal." },
                  { icon: Star, title: "Maks. 500", text: "100 poin per jawaban." },
                  { icon: Lightbulb, title: "2 petunjuk", text: "Poin menyesuaikan petunjuk." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <Icon size={15} className="text-cyan-300" />
                      <p className="mt-1.5 text-[11px] font-bold text-slate-200">{item.title}</p>
                      <p className="mt-0.5 text-[9px] leading-relaxed text-slate-500">{item.text}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <Button onClick={start}>
                  <Play size={16} /> Mulai Buru Musim
                </Button>
                <Button variant="secondary" onClick={() => navigate("lab")}>
                  Buka laboratorium
                </Button>
              </div>
              <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-[10px] leading-relaxed text-slate-500">
                Skor: benar tanpa petunjuk <strong className="text-emerald-300">100</strong> · setelah satu petunjuk{" "}
                <strong className="text-amber-300">70</strong> · setelah dua petunjuk{" "}
                <strong className="text-orange-300">50</strong>. Salah tidak mengurangi skor.
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#041024]/70 p-2">
              <Orrery angle={180} tilt={23.5} view="3d" showAngle={false} showSeasons showRays />
              <div className="absolute left-3 top-3 rounded-lg border border-white/10 bg-night-900/80 px-2.5 py-1.5 backdrop-blur">
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Contoh tantangan</p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-200">Kutub Utara condong ke Matahari</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {started && !finished && (
        <>
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Gamepad2 size={14} className="text-amber-300" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Buru Musim</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-slate-500">Skor</span>
                <span className="font-display text-base font-bold text-amber-200">{score}</span>
              </div>
            </div>
            <div className="p-1"><ProgressBar value={progressPercent} barClassName="from-amber-300 to-cyan-300" /></div>

            <div className="grid gap-0 lg:grid-cols-[1fr_0.85fr]">
              <div className="relative bg-[radial-gradient(ellipse_at_center,rgba(8,47,73,0.34),rgba(3,8,23,0.65))] lg:border-r lg:border-white/[0.07]">
                <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.12]" />
                <div className="relative p-1">
                  <Orrery
                    angle={question.angle}
                    tilt={23.5}
                    view="3d"
                    showAngle
                    showAxis
                    showRays
                    showOrbit
                    showSeasons
                  />
                </div>
                <div className="absolute left-3 top-3 rounded-lg border border-white/10 bg-night-900/85 px-2.5 py-1.5 backdrop-blur">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Petunjuk visual</p>
                  <p className="mt-0.5 text-[10px] font-semibold text-slate-200">
                    {question.angle === 180
                      ? "Cermati kutub yang miring ke arah Matahari"
                      : question.angle === 0
                        ? "Perhatikan kutub Selatan"
                        : "Bandingkan lama siang di kedua belahan"}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <Pill dot="bg-cyan-400">Tantangan {index + 1}/5</Pill>
                  {correctAnswer !== null ? (
                    <Pill className="border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-[8px] text-emerald-200">
                      +{earned} poin
                    </Pill>
                  ) : (
                    <Pill className="border-white/10 px-2 py-0.5 text-[8px]">{position.month}</Pill>
                  )}
                </div>
                <h2 className="mt-3 text-balance text-[15px] font-bold leading-relaxed text-white sm:text-base">{question.prompt}</h2>
                <div className="mt-4 grid gap-2">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = optionIndex === question.correct;
                    const isWrong = wrongChoices.includes(optionIndex);
                    const chosenCorrect = correctAnswer === optionIndex;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => choose(optionIndex)}
                        disabled={correctAnswer !== null || isWrong}
                        className={cn(
                          "flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-all",
                          chosenCorrect
                            ? "answer-correct text-emerald-100"
                            : isWrong
                              ? "answer-wrong text-rose-200 line-through"
                              : correctAnswer !== null && isCorrect
                                ? "border-emerald-300/20 bg-emerald-400/[0.04] text-emerald-300/60"
                                : "border-white/10 bg-white/[0.025] text-slate-300 hover:border-amber-300/25 hover:bg-white/[0.045]",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[9px] font-bold",
                            chosenCorrect
                              ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-200"
                              : isWrong
                                ? "border-rose-300/40 bg-rose-400/15 text-rose-300"
                                : "border-white/15 text-slate-500",
                          )}
                        >
                          {chosenCorrect ? <Check size={12} /> : isWrong ? <X size={11} /> : String.fromCharCode(65 + optionIndex)}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {correctAnswer === null && (
                  <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
                        <Lightbulb size={12} className="text-amber-300" /> Petunjuk ({hintsUsed}/2)
                      </p>
                      <Button size="sm" variant="ghost" onClick={showHint} disabled={hintsUsed >= 2}>
                        {hintsUsed === 0 ? "Minta petunjuk" : hintsUsed === 1 ? "Petunjuk kedua" : "Semua petunjuk"}
                      </Button>
                    </div>
                    {firstHint && (
                      <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
                        <span className="font-bold text-amber-200">1.</span> {question.hint}
                      </p>
                    )}
                    {secondHint && (
                      <p className="mt-1.5 text-[10px] leading-relaxed text-slate-400">
                        <span className="font-bold text-amber-200">2.</span> Ingat pola: kemiringan sumbu + revolusi
                        mengubah sudut penyinaran dan lama siang. Belahan yang condong ke Matahari mengalami musim panas
                        di wilayah beriklim sedang.
                      </p>
                    )}
                    {wrongChoices.length > 0 && correctAnswer === null && (
                      <p className="mt-2 text-[10px] leading-relaxed text-rose-300/80">
                        Belum tepat. Kesempatan masih terbuka. Poin maksimum sekarang {pointsForHints(hintsUsed)}.
                      </p>
                    )}
                  </div>
                )}

                {correctAnswer !== null && (
                  <div className="mt-3 rounded-xl border border-emerald-300/20 bg-emerald-400/[0.06] p-3" role="status">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-300" />
                      <p className="text-xs font-bold text-emerald-200">Tepat! +{earned} poin</p>
                      <Sparkles size={13} className="ml-auto text-amber-300" />
                    </div>
                    <p className="mt-1.5 text-[10px] leading-relaxed text-slate-400">{question.explanation}</p>
                    <Button size="sm" className="mt-2.5 w-full" onClick={next}>
                      {index === GAME_QUESTIONS.length - 1 ? "Lihat hasil" : "Tantangan berikutnya"} <ArrowRight size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="mt-3 flex flex-col items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5 sm:flex-row">
            <div className="flex gap-1.5">
              {GAME_QUESTIONS.map((item, i) => (
                <span key={item.id} className={cn("h-1.5 w-6 rounded-full", i < index ? "bg-emerald-400" : i === index ? "bg-amber-300" : "bg-white/10")} />
              ))}
            </div>
            <p className="text-[9px] text-slate-500">Salah tidak mengurangi skor. Coba lagi dengan petunjuk yang ada.</p>
            <Button variant="ghost" size="sm" onClick={start}>
              <RotateCcw size={12} /> Ulang game
            </Button>
          </div>
        </>
      )}

      {finished && (
        <Card glow className="relative overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute inset-0 grid-lines opacity-20" />
          <div className="relative mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-300">
              <Trophy size={34} />
            </div>
            <Pill className="mt-4 border-amber-300/20 bg-amber-300/[0.07] text-amber-200">
              <Award size={10} /> Misi selesai
            </Pill>
            <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">Kamu menyelesaikan Buru Musim!</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Skor akhir {score} dari {MAX_SCORE}. {score >= 400 ? "Pemahamanmu tentang posisi orbit dan musim sangat baik." : "Tinjau kembali petunjuk visual dan coba tingkatkan skormu."}
            </p>
            <div className="mx-auto mt-4 max-w-xs">
              <ProgressBar value={(score / MAX_SCORE) * 100} barClassName="from-amber-300 to-cyan-300" label="Skor" sublabel={`${score}/${MAX_SCORE}`} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Putaran", value: "5/5", icon: Gamepad2 },
                { label: "Skor", value: `${score}`, icon: Star },
                { label: "Terbaik", value: `${Math.max(progress.gameBest, score)}`, icon: Trophy },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <Icon size={14} className="mx-auto text-cyan-300" />
                    <p className="mt-1 font-display text-lg font-bold text-white">{item.value}</p>
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">{item.label}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button onClick={start}><RotateCcw size={14} /> Main lagi</Button>
              <Button variant="secondary" onClick={() => navigate("latihan")}>Latihan soal</Button>
              <Button variant="ghost" onClick={() => navigate("kuis")}>Kuis tantangan <ArrowRight size={14} /></Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
