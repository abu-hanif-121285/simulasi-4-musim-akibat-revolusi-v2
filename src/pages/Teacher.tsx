import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Eye,
  EyeOff,
  Gamepad2,
  GraduationCap,
  KeyRound,
  ListChecks,
  RotateCcw,
  Settings2,
  Shield,
  SlidersHorizontal,
  Target,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  Button,
  Card,
  Modal,
  PageHeader,
  Pill,
  ProgressBar,
  SegmentedControl,
  ToggleRow,
} from "../components/ui";
import { LESSONS, LEARNING_OBJECTIVES, TEACHER_GUIDE, TEACHER_RUBRIC } from "../data/reference";
import { PRACTICE_QUESTIONS, QUIZ_QUESTIONS, type PracticeQuestion } from "../data/questions";
import { useApp } from "../lib/store";
import { cn } from "../utils/cn";

type TabId = "panduan" | "tujuan" | "kunci" | "rubrik" | "pengaturan";
type ResetKind = "progress" | "all" | null;

function practiceAnswer(question: PracticeQuestion): string {
  if (question.type === "mc") return `${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}`;
  if (question.type === "tf") return question.correct ? "Benar" : "Salah";
  if (question.type === "matching") return question.pairs.map((pair) => `${pair.left} → ${pair.right}`).join("; ");
  return question.correctOrder.join(" → ");
}

export function Teacher() {
  const {
    progress,
    settings,
    updateSettings,
    clearProgress,
    resetAll,
    navigate,
    playFx,
  } = useApp();
  const [tab, setTab] = useState<TabId>("panduan");
  const [showKeys, setShowKeys] = useState(false);
  const [showQuizKeys, setShowQuizKeys] = useState(false);
  const [resetKind, setResetKind] = useState<ResetKind>(null);
  const [notice, setNotice] = useState("");

  const tabs: { id: TabId; label: string; icon: typeof BookOpen }[] = [
    { id: "panduan", label: "Panduan", icon: BookOpen },
    { id: "tujuan", label: "Tujuan", icon: Target },
    { id: "kunci", label: "Kunci jawaban", icon: KeyRound },
    { id: "rubrik", label: "Rubrik", icon: ClipboardCheck },
    { id: "pengaturan", label: "Pengaturan", icon: Settings2 },
  ];

  const confirmReset = () => {
    if (resetKind === "progress") {
      clearProgress();
      setNotice("Progres siswa berhasil dihapus. Pengaturan guru tetap disimpan.");
    } else if (resetKind === "all") {
      resetAll();
      setResetKind(null);
      navigate("home");
      return;
    }
    setResetKind(null);
    playFx("click");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Ruang Guru · pendamping"
        title="Kelola pembelajaran dengan tenang"
        description="Akses panduan, tujuan, kunci jawaban, rubrik, dan pengaturan aplikasi. Tidak ada kata sandi atau kredensial sensitif yang disimpan di aplikasi ini."
        icon={GraduationCap}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate("home")}>
              Menu utama
            </Button>
            <Pill className="border-emerald-300/20 bg-emerald-400/[0.07] text-emerald-200" dot="bg-emerald-400">
              Akses terbuka
            </Pill>
          </div>
        }
      />

      <Card className="mb-4 overflow-hidden">
        <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-white/[0.08] p-2">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => { setTab(item.id); playFx("click"); }}
                aria-pressed={active}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition-all",
                  active
                    ? "bg-cyan-400/10 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.16)]"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200",
                )}
              >
                <Icon size={13} /> {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-5">
          {tab === "panduan" && (
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-cyan-300" />
                  <h2 className="font-display text-base font-bold text-white">Petunjuk penggunaan aplikasi</h2>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  Alur singkat untuk memandu siswa kelas VI menjelajahi materi dan simulasi.
                </p>
                <div className="mt-3 space-y-2.5">
                  {TEACHER_GUIDE.map((guide, index) => (
                    <div key={guide.title} className="flex gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-[9px] font-bold text-cyan-200">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-[11px] font-bold text-slate-200">{guide.title}</p>
                        <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{guide.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <ListChecks size={16} className="text-emerald-300" />
                  <h2 className="font-display text-base font-bold text-white">Peta materi & alur 2 pertemuan</h2>
                </div>
                <div className="mt-3 space-y-1.5">
                  {LESSONS.map((lesson) => (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => navigate("materi")}
                      className="flex w-full items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2 text-left transition-colors hover:bg-white/[0.045]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/10 text-[8px] font-bold text-slate-500">{lesson.id}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[10px] font-semibold text-slate-300">{lesson.title}</span>
                        <span className="block text-[8px] text-slate-500">{lesson.duration}</span>
                      </span>
                      <ChevronRight size={12} className="text-slate-600" />
                    </button>
                  ))}
                </div>
                <div className="mt-3 rounded-xl border border-cyan-300/15 bg-cyan-400/[0.035] p-3 text-[10px] leading-relaxed text-slate-400">
                  <p className="font-bold text-cyan-200">Saran pembagian waktu</p>
                  <p className="mt-1">Pertemuan 1: materi 1–4 dan laboratorium. Pertemuan 2: materi 5–8, latihan, lalu kuis.</p>
                </div>
              </div>
            </div>
          )}

          {tab === "tujuan" && (
            <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-cyan-300" />
                  <h2 className="font-display text-base font-bold text-white">Tujuan pembelajaran</h2>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  IPAS Kelas VI SD / Fase C. Fokus pada pemahaman keterkaitan, bukan hafalan angka semata.
                </p>
                <ul className="mt-3 space-y-2">
                  {LEARNING_OBJECTIVES.map((objective, index) => (
                    <li key={objective} className="flex gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-400/10 text-[8px] font-bold text-emerald-300">{index + 1}</span>
                      <p className="text-[11px] leading-relaxed text-slate-400">{objective}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pemahaman kunci</p>
                  <div className="mt-2 space-y-2 text-[10px] leading-relaxed text-slate-500">
                    <p><strong className="text-slate-200">Acuan sudut:</strong> 23,5° diukur dari garis tegak lurus terhadap bidang orbit, bukan dari bidang orbit.</p>
                    <p><strong className="text-slate-200">Arah sumbu:</strong> tetap relatif sama selama revolusi dalam model sederhana.</p>
                    <p><strong className="text-slate-200">Musim:</strong> dijelaskan melalui sudut penyinaran dan lama siang, bukan terutama jarak Bumi–Matahari.</p>
                    <p><strong className="text-slate-200">Indonesia:</strong> umumnya musim hujan dan kemarau; tidak disamakan dengan empat musim lintang sedang.</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-amber-300/15 bg-amber-400/[0.035] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80">Miskonsepsi yang perlu diantisipasi</p>
                  <ul className="mt-2 space-y-1.5 text-[10px] leading-relaxed text-amber-100/70">
                    <li>• Musim panas karena Bumi paling dekat ke Matahari.</li>
                    <li>• Sumbu Bumi berputar mengikuti orbit.</li>
                    <li>• Seluruh Bumi berganti empat musim bersamaan.</li>
                    <li>• 23,5° adalah sudut sumbu terhadap bidang orbit.</li>
                    <li>• Indonesia memiliki empat musim seperti Eropa.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === "kunci" && (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <KeyRound size={16} className="text-amber-300" />
                    <h2 className="font-display text-base font-bold text-white">Kunci jawaban</h2>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Gunakan setelah siswa mencoba. Diskusikan alasan ilmiah, bukan hanya huruf jawabannya.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant={showKeys ? "secondary" : "primary"} onClick={() => setShowKeys((value) => !value)}>
                    {showKeys ? <EyeOff size={13} /> : <Eye size={13} />}
                    {showKeys ? "Sembunyikan kunci latihan" : "Buka kunci latihan"}
                  </Button>
                  <Button size="sm" variant={showQuizKeys ? "secondary" : "ghost"} onClick={() => setShowQuizKeys((value) => !value)}>
                    {showQuizKeys ? <EyeOff size={13} /> : <Eye size={13} />}
                    {showQuizKeys ? "Sembunyikan kunci kuis" : "Buka kunci kuis"}
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/[0.08]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Latihan · 12 soal</p>
                  <span className="text-[9px] text-slate-500">{showKeys ? "Kunci terbuka" : "Kunci tertutup"}</span>
                </div>
                <div className="divide-y divide-white/[0.05]">
                  {PRACTICE_QUESTIONS.map((question) => (
                    <div key={question.id} className="flex gap-3 px-3 py-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/10 text-[8px] font-bold text-slate-500">{question.id}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold leading-relaxed text-slate-300">{question.prompt}</p>
                        {showKeys ? (
                          <>
                            <p className="mt-1 rounded-md bg-emerald-400/[0.06] px-2 py-1 text-[10px] font-semibold leading-relaxed text-emerald-200">
                              {practiceAnswer(question)}
                            </p>
                            <p className="mt-1 text-[9px] leading-relaxed text-slate-500">{question.explanation}</p>
                          </>
                        ) : (
                          <p className="mt-0.5 text-[9px] text-slate-600">Kunci disembunyikan · {question.topic}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-white/[0.08]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Kuis tantangan · 15 soal</p>
                  <span className="text-[9px] text-slate-500">{showQuizKeys ? "Kunci terbuka" : "Kunci tertutup"}</span>
                </div>
                <div className="divide-y divide-white/[0.05]">
                  {QUIZ_QUESTIONS.map((question) => (
                    <div key={question.id} className="flex gap-3 px-3 py-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/10 text-[8px] font-bold text-slate-500">{question.id}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] leading-relaxed text-slate-300">{question.prompt}</p>
                        {showQuizKeys && (
                          <p className="mt-1 text-[10px] font-semibold leading-relaxed text-amber-200">
                            {String.fromCharCode(65 + question.correct)}. {question.options[question.correct]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "rubrik" && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <ClipboardCheck size={16} className="text-cyan-300" />
                    <h2 className="font-display text-base font-bold text-white">Rubrik penilaian</h2>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Skala 4–1 untuk mengamati pemahaman konsep dan sikap ilmiah. Kuis memberi data tambahan, bukan
                    satu-satunya bukti belajar.
                  </p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => window.print()}>
                  Cetak rubrik
                </Button>
              </div>
              <div className="mt-3 overflow-x-auto rounded-xl border border-white/[0.08]">
                <table className="w-full min-w-[720px] border-collapse text-left text-[10px]">
                  <thead>
                    <tr className="bg-white/[0.045] text-[9px] uppercase tracking-wider text-slate-400">
                      <th className="px-3 py-2 font-semibold">Aspek</th>
                      <th className="px-3 py-2 font-semibold text-emerald-300">4 · Mahir</th>
                      <th className="px-3 py-2 font-semibold">3 · Cakap</th>
                      <th className="px-3 py-2 font-semibold">2 · Berkembang</th>
                      <th className="px-3 py-2 font-semibold">1 · Awal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEACHER_RUBRIC.map((row) => (
                      <tr key={row.aspect} className="border-t border-white/[0.06]">
                        <td className="px-3 py-2.5 font-semibold text-slate-200">{row.aspect}</td>
                        <td className="px-3 py-2.5 leading-relaxed text-emerald-200/80">{row.level4}</td>
                        <td className="px-3 py-2.5 leading-relaxed text-slate-400">{row.level3}</td>
                        <td className="px-3 py-2.5 leading-relaxed text-slate-400">{row.level2}</td>
                        <td className="px-3 py-2.5 leading-relaxed text-slate-500">{row.level1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-[10px] leading-relaxed text-slate-500">
                  <span className="font-bold text-slate-300">Nilai kuis</span>: proporsi jawaban benar × 100. Kategori:
                  90+ ahli; 80–89 hebat; 70–79 berkembang; &lt;70 ulangi.
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-[10px] leading-relaxed text-slate-500">
                  <span className="font-bold text-slate-300">Latihan</span>: formatif, tanpa pengurangan skor. Fokus
                  pada perbaikan alasan ilmiah.
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-[10px] leading-relaxed text-slate-500">
                  <span className="font-bold text-slate-300">Buru Musim</span>: maksimal 500. 100 tanpa petunjuk, 70
                  setelah satu, 50 setelah dua petunjuk.
                </div>
              </div>
            </div>
          )}

          {tab === "pengaturan" && (
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <div>
                <div className="flex items-center gap-2">
                  <Settings2 size={16} className="text-cyan-300" />
                  <h2 className="font-display text-base font-bold text-white">Suara & animasi</h2>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  Pengaturan langsung tersimpan di perangkat. Kecepatan animasi dipakai sebagai nilai awal laboratorium.
                </p>
                <div className="mt-3 space-y-2.5">
                  <ToggleRow
                    title="Efek suara"
                    description="Bunyi umpan balik jawaban dan kemenangan."
                    checked={settings.sound}
                    onChange={(value) => updateSettings({ sound: value })}
                    icon={settings.sound ? Volume2 : VolumeX}
                  />
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <SlidersHorizontal size={13} className="text-cyan-300" />
                        <p className="text-[11px] font-semibold text-slate-200">Kecepatan animasi default</p>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-200">{settings.animationSpeed.toFixed(2)}×</span>
                    </div>
                    <SegmentedControl
                      value={String(settings.animationSpeed)}
                      onChange={(value) => updateSettings({ animationSpeed: Number(value) })}
                      options={[
                        { value: "0.5", label: "Lambat" },
                        { value: "1", label: "Normal" },
                        { value: "1.5", label: "Cepat" },
                        { value: "2", label: "Sangat cepat" },
                      ]}
                    />
                  </div>
                  <div className="flex gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-[10px] leading-relaxed text-slate-500">
                    <Shield size={13} className="mt-0.5 shrink-0 text-emerald-300/80" />
                    Tidak ada kata sandi atau token rahasia yang disimpan. Ruang Guru terbuka untuk pendamping; kunci
                    jawaban tetap tersembunyi di balik tombol.
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={16} className="text-rose-300" />
                  <h2 className="font-display text-base font-bold text-white">Data & atur ulang</h2>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  Data progres hanya tersimpan di browser perangkat ini.
                </p>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-slate-300">Progres siswa</p>
                      <span className="text-[10px] font-bold text-cyan-200">{progress.materiRead.length}/8 materi</span>
                    </div>
                    <div className="mt-2"><ProgressBar value={progress.materiRead.length} max={8} /></div>
                    <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[9px]">
                      <div className="rounded-md bg-white/[0.03] px-1 py-1.5 text-slate-400">{progress.practiceSolved.length} latihan</div>
                      <div className="rounded-md bg-white/[0.03] px-1 py-1.5 text-slate-400">{progress.quizBest ?? "–"} kuis</div>
                      <div className="rounded-md bg-white/[0.03] px-1 py-1.5 text-slate-400">{progress.gameBest} game</div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="justify-start" onClick={() => navigate("lab")}>
                    <Gamepad2 size={14} /> Buka laboratorium
                  </Button>
                  <Button variant="danger" size="sm" className="justify-start" onClick={() => setResetKind("progress")}>
                    <Trash2 size={14} /> Hapus progres siswa
                  </Button>
                  <Button variant="danger" size="sm" className="justify-start" onClick={() => setResetKind("all")}>
                    <RotateCcw size={14} /> Atur ulang seluruh aplikasi
                  </Button>
                  <p className="text-[9px] leading-relaxed text-slate-600">Atur ulang aplikasi juga mengembalikan pengaturan suara dan kecepatan ke default.</p>
                </div>
                {notice && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-400/[0.06] px-2.5 py-2 text-[10px] text-emerald-200">
                    <CheckCircle2 size={12} /> {notice}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-[10px] leading-relaxed text-slate-500">
          <span className="font-bold text-slate-300">Catatan akses:</span> tidak ada kata sandi default. Jangan membagikan
          kunci jawaban saat siswa masih mengerjakan.
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-[10px] leading-relaxed text-slate-500">
          <span className="font-bold text-slate-300">Penyimpanan:</span> LocalStorage browser. Menghapus data situs akan
          menghilangkan progres.
        </div>
        <button
          type="button"
          onClick={() => navigate("tentang")}
          className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-left text-[10px] leading-relaxed text-slate-500 transition-colors hover:bg-white/[0.04]"
        >
          <span className="font-bold text-slate-300">Tentang aplikasi & kredit</span>
          <span className="mt-1 block">Created by Wiyanto Abu Hanif.</span>
          <span className="mt-1 inline-flex items-center gap-1 text-cyan-300">Buka <ChevronRight size={11} /></span>
        </button>
      </div>

      <Modal
        open={resetKind !== null}
        onClose={() => setResetKind(null)}
        title={resetKind === "progress" ? "Hapus progres siswa?" : "Atur ulang seluruh aplikasi?"}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setResetKind(null)}>Batal</Button>
            <Button variant="danger" size="sm" onClick={confirmReset}>
              <RotateCcw size={13} /> Ya, lanjutkan
            </Button>
          </>
        }
      >
        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-400/10 text-rose-300">
            <Trash2 size={16} />
          </span>
          <div className="text-[11px] leading-relaxed text-slate-400">
            {resetKind === "progress"
              ? "Materi yang ditandai selesai, latihan, nilai kuis, skor game, dan refleksi siswa akan dihapus. Pengaturan suara dan animasi tetap."
              : "Semua progres siswa, refleksi, pengaturan suara, dan kecepatan animasi akan dikembalikan ke kondisi awal. Tindakan ini tidak dapat dibatalkan."}
          </div>
        </div>
      </Modal>
    </div>
  );
}
