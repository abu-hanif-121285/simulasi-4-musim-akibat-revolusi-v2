import { useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  FlaskConical,
  Info,
  Menu,
} from "lucide-react";
import { Button, Card, PageHeader, Pill, ProgressBar, ProgressRing } from "../components/ui";
import { LessonContent, LessonContinue } from "../components/LessonSections";
import { LESSONS } from "../data/reference";
import { useApp } from "../lib/store";
import { cn } from "../utils/cn";

export function Materi() {
  const { progress, markMateri, navigate, progressPercent, playFx } = useApp();
  const [active, setActive] = useState(() => {
    const firstUnread = LESSONS.find((lesson) => !progress.materiRead.includes(lesson.id));
    return firstUnread?.id ?? 1;
  });
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lesson = LESSONS.find((item) => item.id === active) ?? LESSONS[0];
  const isRead = progress.materiRead.includes(lesson.id);

  const selectLesson = (id: number) => {
    setActive(id);
    playFx("click");
    window.setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  };

  const next = () => {
    markMateri(lesson.id);
    if (active >= 8) {
      navigate("kesimpulan");
      return;
    }
    selectLesson(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    selectLesson(active - 1);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Materi · 8 bagian"
        title="Perjalanan dari sumbu Bumi ke musim"
        description="Pelajari konsepnya selangkah demi selangkah. Setiap bagian memiliki ilustrasi interaktif dan cek pemahaman singkat."
        icon={BookOpen}
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Materi selesai</p>
              <p className="mt-0.5 text-xs font-semibold text-cyan-200">{progress.materiRead.length} dari 8</p>
            </div>
            <ProgressRing value={progressPercent} />
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="lg:self-start">
          <Card className="hidden overflow-hidden p-3 lg:sticky lg:top-24 lg:block">
            <div className="mb-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Peta materi</p>
                <span className="text-[10px] font-bold text-cyan-300">{(progress.materiRead.length / 8) * 100 | 0}%</span>
              </div>
              <div className="mt-2">
                <ProgressBar value={progress.materiRead.length} max={8} />
              </div>
              <p className="mt-2 text-[9px] leading-relaxed text-slate-500">Ditandai selesai saat kamu lanjut atau menjawab cek pemahaman.</p>
            </div>
            <nav aria-label="Daftar materi" className="space-y-1">
              {LESSONS.map((item) => {
                const done = progress.materiRead.includes(item.id);
                const current = item.id === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectLesson(item.id)}
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "group flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-all",
                      current
                        ? "bg-cyan-400/10 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.16)]"
                        : "hover:bg-white/[0.045]",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold transition-colors",
                        done
                          ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-300"
                          : current
                            ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-200"
                            : "border-white/12 text-slate-500 group-hover:text-slate-300",
                      )}
                    >
                      {done ? <Check size={12} /> : String(item.id).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className={cn("block text-[11px] font-semibold leading-snug", current ? "text-cyan-100" : "text-slate-300")}>
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[9px] text-slate-500">{item.duration}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-3 border-t border-white/[0.07] pt-3">
              <button
                type="button"
                onClick={() => navigate("lab")}
                className="flex w-full items-center gap-2 rounded-lg bg-white/[0.035] px-2.5 py-2 text-left text-[10px] font-semibold text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-cyan-200"
              >
                <FlaskConical size={13} className="text-cyan-300" />
                Praktikkan di laboratorium
                <ArrowRight size={12} className="ml-auto" />
              </button>
            </div>
          </Card>

          <div className="lg:hidden">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pilih bagian materi</p>
              <span className="text-[10px] text-cyan-300">{progress.materiRead.length}/8 selesai</span>
            </div>
            <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
              {LESSONS.map((item) => {
                const done = progress.materiRead.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectLesson(item.id)}
                    className={cn(
                      "flex min-w-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-[10px] font-bold transition-colors",
                      item.id === active
                        ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-100"
                        : done
                          ? "border-emerald-300/20 bg-emerald-400/[0.06] text-emerald-300"
                          : "border-white/10 bg-white/[0.025] text-slate-500",
                    )}
                    aria-label={`Materi ${item.id}: ${item.title}`}
                  >
                    {done && item.id !== active ? <Check size={11} /> : item.id}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div ref={contentRef} className="scroll-mt-24">
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 font-display text-[10px] font-bold text-cyan-200">
                  {String(lesson.id).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-500">{lesson.kicker}</p>
                  <p className="text-[10px] font-semibold text-slate-300">Materi {lesson.id} dari 8</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Pill className="px-2 py-0.5 text-[8px]"><Clock3 size={9} /> {lesson.duration}</Pill>
                {isRead ? (
                  <Pill className="border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-[8px] text-emerald-200">
                    <CheckCircle2 size={9} /> Selesai
                  </Pill>
                ) : (
                  <Pill className="px-2 py-0.5 text-[8px]">Belum selesai</Pill>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">{lesson.title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">{lesson.summary}</p>
              <div className="my-5 h-px bg-gradient-to-r from-cyan-300/20 via-white/[0.06] to-transparent" />
              <LessonContent key={active} id={active} />
              <LessonContinue
                id={active}
                onPrev={prev}
                onNext={next}
                isLast={active === 8}
                isRead={isRead}
                onMarkRead={() => {
                  markMateri(active);
                  playFx("click");
                }}
              />
            </div>
          </Card>

          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-[10px] leading-relaxed text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-start gap-1.5">
              <Info size={12} className="mt-0.5 shrink-0 text-cyan-300/70" />
              Ingin melihat konsep dalam gerak? Coba laboratorium simulasi.
            </span>
            <div className="flex shrink-0 gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("home")}>
                <Menu size={13} /> Menu utama
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate("lab")}>
                Buka Lab <ArrowRight size={12} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
