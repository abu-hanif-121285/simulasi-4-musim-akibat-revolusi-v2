import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Lightbulb,
  Link2,
  ListOrdered,
  RotateCcw,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { Button, Card, PageHeader, Pill, ProgressBar, ProgressRing } from "../components/ui";
import { SeasonScene, TiltReferenceDiagram } from "../components/Diagrams";
import { PRACTICE_QUESTIONS, type PracticeQuestion } from "../data/questions";
import { useApp } from "../lib/store";
import { cn } from "../utils/cn";

function typeLabel(question: PracticeQuestion) {
  if (question.type === "mc") return "Pilihan ganda";
  if (question.type === "tf") return "Benar / salah";
  if (question.type === "matching") return "Mencocokkan";
  return "Mengurutkan";
}

function typeIcon(question: PracticeQuestion) {
  if (question.type === "matching") return <Link2 size={11} />;
  if (question.type === "ordering") return <ListOrdered size={11} />;
  return <Target size={11} />;
}

function QuestionVisual({ question }: { question: PracticeQuestion }) {
  if (question.type === "matching" || question.type === "ordering") return null;
  if (!question.visual) return null;
  if (question.visual === "tilt") {
    return (
      <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-[#041024]/70">
        <TiltReferenceDiagram showAngle={false} showReference />
      </div>
    );
  }
  if (question.visual === "north-summer") return <div className="mb-4"><SeasonScene hemisphere="utara" /></div>;
  if (question.visual === "south-summer") return <div className="mb-4"><SeasonScene hemisphere="selatan" /></div>;
  return null;
}

function isChoiceCorrect(question: PracticeQuestion, value: number) {
  if (question.type === "mc") return value === question.correct;
  if (question.type === "tf") return (value === 1) === question.correct;
  return false;
}

function MatchingExercise({
  question,
  onCorrect,
}: {
  question: Extract<PracticeQuestion, { type: "matching" }>;
  onCorrect: () => void;
}) {
  const { playFx } = useApp();
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const usedRights = Object.values(assignments);
  const allAssigned = Object.keys(assignments).length === question.pairs.length;
  const correctCount = question.pairs.filter(
    (pair, index) => assignments[index] === pair.right,
  ).length;
  const allCorrect = correctCount === question.pairs.length;

  const assign = (right: string) => {
    if (checked || selectedLeft === null || usedRights.includes(right)) return;
    setAssignments((prev) => ({ ...prev, [selectedLeft]: right }));
    setSelectedLeft(null);
  };

  const remove = (index: number) => {
    if (checked) return;
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const check = () => {
    setChecked(true);
    if (allCorrect) {
      onCorrect();
      playFx("correct");
    } else {
      playFx("wrong");
    }
  };

  const reset = () => {
    setAssignments({});
    setSelectedLeft(null);
    setChecked(false);
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Istilah</p>
          {question.pairs.map((pair, index) => {
            const isAssigned = Boolean(assignments[index]);
            return (
              <div key={pair.left} className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedLeft(index)}
                  disabled={checked}
                  className={cn(
                    "flex min-h-11 flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-left text-[11px] font-semibold transition-all",
                    selectedLeft === index
                      ? "border-cyan-300/45 bg-cyan-400/10 text-cyan-100"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20",
                    checked && isAssigned && assignments[index] === pair.right && "answer-correct",
                    checked && isAssigned && assignments[index] !== pair.right && "answer-wrong",
                  )}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 text-[9px] text-slate-500">{index + 1}</span>
                  {pair.left}
                </button>
                {assignments[index] && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex h-11 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-white/5 hover:text-rose-300"
                    aria-label={`Lepas pasangan ${pair.left}`}
                    disabled={checked}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Pasangan</p>
          {question.pairs.map((pair) => {
            const remaining = !usedRights.includes(pair.right);
            return (
              <button
                key={pair.right}
                type="button"
                onClick={() => assign(pair.right)}
                disabled={checked || !remaining}
                className={cn(
                  "flex min-h-11 w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-[11px] leading-relaxed transition-all",
                  remaining
                    ? "border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/30 hover:bg-cyan-400/[0.05]"
                    : "border-white/[0.05] bg-white/[0.012] text-slate-600 line-through",
                )}
              >
                {remaining ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/70" /> : <Check size={11} className="shrink-0 text-slate-600" />}
                {pair.right}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-[10px] text-slate-500">
        {selectedLeft !== null
          ? `Sekarang pilih pasangan untuk "${question.pairs[selectedLeft].left}".`
          : "Pilih istilah di kiri, lalu pilih pasangannya di kanan."}
      </p>
      {checked && (
        <div className={cn("mt-3 rounded-xl border p-3", allCorrect ? "border-emerald-300/20 bg-emerald-400/[0.06]" : "border-amber-300/20 bg-amber-400/[0.06]")}>
          <p className={cn("text-xs font-bold", allCorrect ? "text-emerald-200" : "text-amber-200")}>
            {allCorrect ? "Tepat! Semua pasangan benar." : `Benar ${correctCount} dari ${question.pairs.length}. Perbaiki pasangan yang salah.`}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{question.explanation}</p>
          {!allCorrect && (
            <Button size="sm" variant="secondary" className="mt-2" onClick={reset}>
              <RotateCcw size={12} /> Coba lagi
            </Button>
          )}
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <Button size="sm" onClick={check} disabled={!allAssigned || checked}>
          <Check size={14} /> Periksa jawaban
        </Button>
      </div>
    </div>
  );
}

function OrderingExercise({
  question,
  onCorrect,
}: {
  question: Extract<PracticeQuestion, { type: "ordering" }>;
  onCorrect: () => void;
}) {
  const { playFx } = useApp();
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const available = question.items.filter((item) => !order.includes(item));
  const isCorrect = order.every((item, index) => item === question.correctOrder[index]);

  const check = () => {
    setChecked(true);
    if (isCorrect) {
      onCorrect();
      playFx("correct");
    } else {
      playFx("wrong");
    }
  };

  return (
    <div>
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Urutanmu</p>
        <div className="mt-2 flex min-h-12 flex-wrap gap-1.5">
          {order.length === 0 && <span className="self-center text-[10px] text-slate-600">Klik kartu di bawah untuk menyusun urutan.</span>}
          {order.map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                if (checked) return;
                setOrder((prev) => prev.filter((value) => value !== item));
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/20 bg-cyan-400/[0.07] px-2.5 py-1.5 text-[11px] font-semibold text-cyan-100"
            >
              <span className="text-[9px] text-cyan-300/70">{index + 1}</span>
              {item}
              {!checked && <X size={10} className="text-slate-500" />}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-500">Pilihan</p>
        <div className="flex flex-wrap gap-2">
          {available.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setOrder((prev) => [...prev, item])}
              disabled={checked}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold text-slate-300 transition-all hover:border-cyan-300/30 hover:bg-cyan-400/[0.05]"
            >
              {item}
            </button>
          ))}
          {available.length === 0 && <span className="text-[10px] text-slate-600">Semua pilihan sudah dipakai.</span>}
        </div>
      </div>
      {checked && (
        <div className={cn("mt-3 rounded-xl border p-3", isCorrect ? "border-emerald-300/20 bg-emerald-400/[0.06]" : "border-amber-300/20 bg-amber-400/[0.06]")}>
          <p className={cn("text-xs font-bold", isCorrect ? "text-emerald-200" : "text-amber-200")}>
            {isCorrect ? "Tepat! Urutanmu benar." : `Belum tepat. Urutan yang benar: ${question.correctOrder.join(" → ")}.`}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{question.explanation}</p>
          {!isCorrect && (
            <Button size="sm" variant="secondary" className="mt-2" onClick={() => { setOrder([]); setChecked(false); }}>
              <RotateCcw size={12} /> Susun ulang
            </Button>
          )}
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <Button size="sm" onClick={check} disabled={order.length !== question.items.length || checked}>
          <Check size={14} /> Periksa urutan
        </Button>
      </div>
    </div>
  );
}

export function Practice() {
  const { progress, markPractice, playFx, navigate } = useApp();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const question = PRACTICE_QUESTIONS[current];
  const selected = answers[question.id];
  const isChecked = Boolean(checked[question.id]);
  const solvedBefore = progress.practiceSolved.includes(question.id);
  const choiceCorrect = selected !== undefined ? isChoiceCorrect(question, selected) : false;
  const showSuccess = isChecked ? choiceCorrect : solvedBefore;
  const completion = progress.practiceSolved.length;

  const correctInfo = useMemo(() => {
    if (question.type === "mc") return question.correct;
    if (question.type === "tf") return question.correct ? 1 : 0;
    return null;
  }, [question]);

  const choose = (value: number) => {
    if (isChecked) return;
    playFx("click");
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const check = () => {
    if (selected === undefined || question.type === "matching" || question.type === "ordering") return;
    setChecked((prev) => ({ ...prev, [question.id]: true }));
    if (isChoiceCorrect(question, selected)) {
      markPractice(question.id);
      playFx("correct");
    } else {
      playFx("wrong");
    }
  };

  const retry = () => {
    setChecked((prev) => ({ ...prev, [question.id]: false }));
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[question.id];
      return next;
    });
    playFx("click");
  };

  const go = (index: number) => {
    setCurrent(Math.max(0, Math.min(PRACTICE_QUESTIONS.length - 1, index)));
    playFx("click");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Latihan · 12 soal"
        title="Uji gagasan, bukan sekadar hafalan"
        description="Kerjakan soal pilihan ganda, benar–salah, mencocokkan, dan mengurutkan. Setiap jawaban memiliki penjelasan ilmiah."
        icon={Target}
        actions={
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Terselesaikan</p>
              <p className="mt-0.5 text-xs font-semibold text-cyan-200">{completion} / 12 soal</p>
            </div>
            <ProgressRing value={(completion / 12) * 100} />
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="order-2 lg:order-1">
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 font-display text-[10px] font-bold text-cyan-200">
                  {String(current + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">{question.topic}</p>
                  <p className="text-[10px] font-semibold text-slate-300">Soal {current + 1} dari {PRACTICE_QUESTIONS.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Pill className="px-2 py-0.5 text-[8px]">{typeIcon(question)} {typeLabel(question)}</Pill>
                {progress.practiceSolved.includes(question.id) && (
                  <Pill className="border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-[8px] text-emerald-200">
                    <CheckCircle2 size={9} /> Selesai
                  </Pill>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <QuestionVisual question={question} />
              <h2 className="text-balance text-[15px] font-bold leading-relaxed text-white sm:text-base">{question.prompt}</h2>

              {question.type === "mc" && (
                <div className="mt-4 grid gap-2">
                  {question.options.map((option, index) => {
                    const chosen = selected === index;
                    const showCorrect = isChecked && index === correctInfo;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => choose(index)}
                        disabled={isChecked}
                        className={cn(
                          "flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all",
                          showCorrect
                            ? "answer-correct text-emerald-100"
                            : isChecked && chosen
                              ? "answer-wrong text-rose-100"
                              : chosen
                                ? "border-cyan-300/40 bg-cyan-400/[0.09] text-cyan-100"
                                : "border-white/10 bg-white/[0.025] text-slate-300 hover:border-white/20 hover:bg-white/[0.045]",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[9px] font-bold",
                            showCorrect
                              ? "border-emerald-300/40 bg-emerald-400/20 text-emerald-200"
                              : isChecked && chosen
                                ? "border-rose-300/40 bg-rose-400/15 text-rose-200"
                                : chosen
                                  ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-200"
                                  : "border-white/15 text-slate-500",
                          )}
                        >
                          {showCorrect ? <Check size={12} /> : isChecked && chosen ? <X size={12} /> : String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {question.type === "tf" && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {["Salah", "Benar"].map((option, index) => {
                    const chosen = selected === index;
                    const showCorrect = isChecked && index === correctInfo;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => choose(index)}
                        disabled={isChecked}
                        className={cn(
                          "flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border text-xs font-bold transition-all",
                          showCorrect
                            ? "answer-correct text-emerald-200"
                            : isChecked && chosen
                              ? "answer-wrong text-rose-200"
                              : chosen
                                ? "border-cyan-300/40 bg-cyan-400/[0.09] text-cyan-100"
                                : "border-white/10 bg-white/[0.025] text-slate-300 hover:border-white/20",
                        )}
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current/30">
                          {index === 1 ? <Check size={14} /> : <X size={14} />}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {question.type === "matching" && (
                <div className="mt-4">
                  <MatchingExercise
                    question={question}
                    onCorrect={() => markPractice(question.id)}
                  />
                </div>
              )}
              {question.type === "ordering" && (
                <div className="mt-4">
                  <OrderingExercise
                    question={question}
                    onCorrect={() => markPractice(question.id)}
                  />
                </div>
              )}

              {(question.type === "mc" || question.type === "tf") && (
                <>
                  {!isChecked && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[10px] text-slate-500">Pilih satu jawaban, lalu periksa.</p>
                      <Button size="sm" onClick={check} disabled={selected === undefined}>
                        <Check size={14} /> Periksa jawaban
                      </Button>
                    </div>
                  )}
                  {(isChecked || solvedBefore) && (
                    <div
                      className={cn(
                        "mt-4 flex gap-2.5 rounded-xl border p-3.5",
                        showSuccess
                          ? "border-emerald-300/20 bg-emerald-400/[0.055]"
                          : "border-amber-300/20 bg-amber-400/[0.055]",
                      )}
                      role="status"
                    >
                      {showSuccess ? (
                        <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-300" />
                      ) : (
                        <Lightbulb size={17} className="mt-0.5 shrink-0 text-amber-300" />
                      )}
                      <div>
                        <p className={cn("text-xs font-bold", showSuccess ? "text-emerald-200" : "text-amber-200")}>
                          {showSuccess ? "Jawaban tepat." : "Belum tepat."}
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{question.explanation}</p>
                        {!isChecked && solvedBefore && (
                          <p className="mt-1 text-[10px] text-emerald-300/80">Soal ini pernah kamu jawab benar sebelumnya.</p>
                        )}
                        {!showSuccess && (
                          <Button variant="secondary" size="sm" className="mt-2" onClick={retry}>
                            <RotateCcw size={12} /> Coba lagi
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-white/[0.08] px-4 py-3 sm:px-5">
              <Button variant="ghost" size="sm" onClick={() => go(current - 1)} disabled={current === 0}>
                <ChevronLeft size={15} /> Sebelumnya
              </Button>
              <span className="hidden text-[9px] text-slate-600 sm:block">Tidak ada pengurangan skor karena salah</span>
              <Button size="sm" onClick={() => go(current + 1)} disabled={current === PRACTICE_QUESTIONS.length - 1}>
                Berikutnya <ChevronRight size={15} />
              </Button>
            </div>
          </Card>

          {completion === 12 && (
            <Card glow className="mt-4 overflow-hidden p-4 sm:p-5">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-300/10 text-amber-300">
                  <Trophy size={22} />
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-base font-bold text-white">Semua latihan selesai!</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Kamu sudah menuntaskan 12 soal. Lanjutkan ke kuis tantangan untuk melihat penguasaanmu.
                  </p>
                </div>
                <Button size="sm" onClick={() => navigate("kuis")}>
                  Buka kuis <ArrowRight size={14} />
                </Button>
              </div>
            </Card>
          )}
        </div>

        <aside className="order-1 space-y-3 lg:order-2">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Peta soal</p>
              <span className="text-[10px] font-bold text-cyan-200">{completion}/12</span>
            </div>
            <div className="mt-2"><ProgressBar value={completion} max={12} /></div>
            <div className="mt-3 grid grid-cols-6 gap-1.5 lg:grid-cols-4">
              {PRACTICE_QUESTIONS.map((item, index) => {
                const done = progress.practiceSolved.includes(item.id);
                const active = index === current;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(index)}
                    aria-label={`Soal ${index + 1}`}
                    aria-current={active ? "step" : undefined}
                    className={cn(
                      "relative flex h-8 items-center justify-center rounded-lg border text-[10px] font-bold transition-all",
                      active
                        ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                        : done
                          ? "border-emerald-300/20 bg-emerald-400/[0.07] text-emerald-300"
                          : "border-white/10 bg-white/[0.025] text-slate-500 hover:border-white/20",
                    )}
                  >
                    {done && !active ? <Check size={11} /> : index + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-3 border-t border-white/[0.07] pt-3 text-[9px] text-slate-500">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> selesai</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-300" /> aktif</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-cyan-300" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Cara menilai</p>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
              Latihan tidak memberi nilai akhir. Kamu bisa mencoba lagi tanpa pengurangan skor. Kunci lengkap
              tersedia di Ruang Guru untuk pendamping.
            </p>
            <div className="mt-3 grid gap-2">
              <Button variant="secondary" size="sm" onClick={() => navigate("guru")}>
                Buka Ruang Guru
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("materi")}>
                Kembali ke materi
              </Button>
            </div>
          </Card>

          <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.035] p-3 text-[10px] leading-relaxed text-emerald-100/70">
            <span className="font-bold text-emerald-200">Ingat: </span>
            sumber utama musim adalah kemiringan sumbu + revolusi, bukan perubahan jarak Bumi–Matahari.
          </div>
        </aside>
      </div>
    </div>
  );
}
