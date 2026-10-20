import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Earth,
  GraduationCap,
  Home as HomeIcon,
  Menu,
  Orbit,
  Settings,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AppProvider, PAGE_LABELS, useApp, type PageId } from "./lib/store";
import { Button, Modal, ProgressBar, ProgressRing, SegmentedControl, ToggleRow } from "./components/ui";
import { PageBoundary } from "./components/ErrorBoundary";
import { Home } from "./pages/Home";
import { Materi } from "./pages/Materi";
import { Lab } from "./pages/Lab";
import { Experiment } from "./pages/Experiment";
import { Practice } from "./pages/Practice";
import { Game } from "./pages/Game";
import { Quiz } from "./pages/Quiz";
import { Conclusion } from "./pages/Conclusion";
import { About } from "./pages/About";
import { Teacher } from "./pages/Teacher";
import { cn } from "./utils/cn";

const PRIMARY_NAV: { page: PageId; label: string }[] = [
  { page: "materi", label: "Materi" },
  { page: "lab", label: "Laboratorium" },
  { page: "latihan", label: "Latihan" },
  { page: "kuis", label: "Kuis" },
];

const ALL_NAV: { page: PageId; label: string; description: string }[] = [
  { page: "home", label: "Menu Utama", description: "Kembali ke halaman pembuka." },
  { page: "materi", label: "Materi", description: "Delapan bagian konsep dasar." },
  { page: "lab", label: "Laboratorium Simulasi", description: "Atur orbit, kemiringan, dan musim." },
  { page: "experiment", label: "Eksperimen Tanpa Kemiringan", description: "Uji 0°, 23,5°, dan 30°." },
  { page: "latihan", label: "Latihan", description: "Dua belas soal beragam." },
  { page: "game", label: "Buru Musim", description: "Mini game posisi orbit." },
  { page: "kuis", label: "Kuis Tantangan", description: "Lima belas soal dan rekap topik." },
  { page: "kesimpulan", label: "Kesimpulan", description: "Enam benang merah dan refleksi." },
  { page: "tentang", label: "Tentang Aplikasi", description: "Tujuan, akurasi, dan kredit." },
  { page: "guru", label: "Ruang Guru", description: "Panduan, kunci, rubrik, pengaturan." },
];

function renderPage(page: PageId) {
  switch (page) {
    case "materi":
      return <Materi />;
    case "lab":
      return <Lab />;
    case "experiment":
      return <Experiment />;
    case "latihan":
      return <Practice />;
    case "game":
      return <Game />;
    case "kuis":
      return <Quiz />;
    case "kesimpulan":
      return <Conclusion />;
    case "tentang":
      return <About />;
    case "guru":
      return <Teacher />;
    default:
      return <Home />;
  }
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-w-0 items-center gap-2.5 rounded-lg py-1 pr-2 text-left"
      aria-label="Kembali ke menu utama Earth Tilt and Seasons"
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/25 bg-gradient-to-br from-cyan-400/25 to-blue-600/20 text-cyan-200 transition-colors group-hover:border-cyan-300/45">
        <Earth size={19} strokeWidth={1.8} />
        <span className="pointer-events-none absolute inset-[-4px] rounded-full border border-cyan-300/10" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-[12px] font-bold leading-tight tracking-[0.13em] text-white">
          EARTH TILT
        </span>
        <span className="block truncate text-[8px] font-bold uppercase leading-tight tracking-[0.21em] text-cyan-300/70">
          &amp; Seasons
        </span>
      </span>
    </button>
  );
}

function Shell() {
  const { page, navigate, progressPercent, settings, updateSettings, progress, playFx } = useApp();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = page === "home";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [page]);

  useEffect(() => {
    document.title =
      page === "home"
        ? "Earth Tilt & Seasons — Misteri Empat Musim"
        : `${PAGE_LABELS[page]} · Earth Tilt & Seasons`;
  }, [page]);

  const go = (target: PageId) => {
    navigate(target);
    setMenuOpen(false);
    setSettingsOpen(false);
  };

  return (
    <div className="relative isolate min-h-screen overflow-x-clip">
      <div className="space-bg" aria-hidden="true" />
      <div className="starfield" aria-hidden="true" />

      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-night-950/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Logo onClick={() => navigate("home")} />

          <nav aria-label="Navigasi utama" className="ml-3 hidden items-center gap-0.5 lg:flex">
            {PRIMARY_NAV.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => navigate(item.page)}
                aria-current={page === item.page ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-[11px] font-semibold transition-colors",
                  page === item.page ? "text-cyan-200" : "text-slate-400 hover:text-slate-100",
                )}
              >
                {item.label}
                {page === item.page && (
                  <span className="absolute inset-x-3 -bottom-[9px] h-px bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
                )}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-[10px] font-semibold text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-white lg:hidden"
              aria-label="Buka menu semua halaman"
            >
              <Menu size={15} />
              <span className="hidden sm:inline">Jelajah</span>
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="hidden h-9 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-[10px] font-semibold text-slate-300 transition-colors hover:border-cyan-300/25 hover:bg-cyan-400/[0.05] hover:text-cyan-100 md:inline-flex"
              aria-label="Buka pengaturan"
            >
              <Settings size={14} />
              <span className="hidden xl:inline">Pengaturan</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const nextSound = !settings.sound;
                updateSettings({ sound: nextSound });
                if (nextSound) playFx("click");
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
              aria-label={settings.sound ? "Matikan efek suara" : "Nyalakan efek suara"}
              aria-pressed={settings.sound}
            >
              {settings.sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
            <button
              type="button"
              onClick={() => go("guru")}
              className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white sm:flex"
              aria-label="Buka Ruang Guru"
            >
              <GraduationCap size={15} />
            </button>
            <button type="button" onClick={() => navigate("home")} className="ml-1 rounded-full" aria-label="Progres belajar">
              <ProgressRing value={progressPercent} size={36} stroke={3} />
            </button>
          </div>
        </div>

        {!isHome && (
          <div className="border-t border-white/[0.06] bg-night-900/35">
            <div className="mx-auto flex h-10 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => navigate("home")}
                className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold text-slate-400 transition-colors hover:text-cyan-200"
              >
                <ArrowLeft size={12} /> Menu utama
              </button>
              <span className="h-3.5 w-px bg-white/10" />
              <span className="flex min-w-0 items-center gap-1.5 text-[10px] text-slate-500">
                <span className="h-1 w-1 shrink-0 rounded-full bg-cyan-300" />
                <span className="truncate font-semibold text-slate-300">{PAGE_LABELS[page]}</span>
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span className="hidden text-[9px] text-slate-600 sm:inline">Progres belajar</span>
                <ProgressBar value={progressPercent} className="w-16 sm:w-24" />
                <span className="text-[9px] font-bold text-cyan-200">{progressPercent}%</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="relative min-h-[70vh]">
        <PageBoundary key={page}>
          <div className="animate-rise">{renderPage(page)}</div>
        </PageBoundary>
      </main>

      <footer className="relative mt-6 border-t border-white/[0.07] bg-night-950/45">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <Logo onClick={() => navigate("home")} />
              <p className="mt-3 max-w-xs text-[10px] leading-relaxed text-slate-500">
                Aplikasi pembelajaran IPAS kelas VI SD/Fase C tentang kemiringan sumbu Bumi, revolusi, dan
                pergantian musim.
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 sm:max-w-xs">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-300 to-sky-500 font-display text-[9px] font-bold text-night-950">
                  WA
                </span>
                <p className="text-[9px] leading-relaxed text-slate-500">
                  Created by <strong className="text-slate-300">Wiyanto Abu Hanif</strong>
                </p>
                <CheckCircle2 size={12} className="ml-auto shrink-0 text-emerald-400" />
              </div>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Jelajah</p>
              <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {ALL_NAV.slice(1, 8).map((item) => (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => navigate(item.page)}
                    className="text-left text-[10px] text-slate-500 transition-colors hover:text-cyan-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Untuk pendamping</p>
              <div className="mt-2.5 flex flex-col items-start gap-1.5">
                <button
                  type="button"
                  onClick={() => navigate("guru")}
                  className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 transition-colors hover:text-cyan-200"
                >
                  <GraduationCap size={12} /> Ruang Guru
                </button>
                <button
                  type="button"
                  onClick={() => navigate("tentang")}
                  className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 transition-colors hover:text-cyan-200"
                >
                  <Sparkles size={12} /> Tentang &amp; catatan akurasi
                </button>
                <span className="inline-flex items-center gap-1.5 text-[9px] text-slate-600">
                  <Volume2 size={11} /> Suara {settings.sound ? "aktif" : "nonaktif"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[9px] text-slate-600">
                  <Orbit size={11} /> Progres lokal: {progress.visited.length} halaman dikunjungi
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-white/[0.06] pt-4 text-[9px] leading-relaxed text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>Earth Tilt &amp; Seasons — Misteri Empat Musim · IPAS Kelas VI / Fase C · Bahasa Indonesia</p>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Visual SVG native, tanpa WebGL</span>
              <span aria-hidden="true">·</span>
              <span>Dibuat untuk pembelajaran yang bermakna</span>
            </p>
          </div>
        </div>
      </footer>

      <Modal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Jelajah aplikasi"
        maxWidth="max-w-lg"
      >
        <div className="grid gap-1.5 sm:grid-cols-2">
          {ALL_NAV.map((item) => {
            const active = page === item.page;
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => go(item.page)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all",
                  active
                    ? "border-cyan-300/30 bg-cyan-400/[0.08]"
                    : "border-white/[0.07] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.045]",
                )}
              >
                <span className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border",
                  active ? "border-cyan-300/30 bg-cyan-400/15 text-cyan-200" : "border-white/10 text-slate-500",
                )}>
                  {item.page === "home" ? <HomeIcon size={12} /> : item.page === "guru" ? <GraduationCap size={12} /> : <Orbit size={12} />}
                </span>
                <span>
                  <span className={cn("block text-[11px] font-bold", active ? "text-cyan-100" : "text-slate-200")}>{item.label}</span>
                  <span className="mt-0.5 block text-[9px] leading-relaxed text-slate-500">{item.description}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" onClick={() => { setMenuOpen(false); setSettingsOpen(true); }}>
            <Settings size={13} /> Pengaturan
          </Button>
          <Button variant="ghost" size="sm" onClick={() => go("guru")}>
            <GraduationCap size={13} /> Ruang Guru
          </Button>
        </div>
      </Modal>

      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Pengaturan belajar"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => go("guru")}>
              <GraduationCap size={13} /> Ruang Guru
            </Button>
            <Button size="sm" onClick={() => setSettingsOpen(false)}>Selesai</Button>
          </>
        }
      >
        <div className="space-y-2.5">
          <ToggleRow
            title="Efek suara"
            description="Bunyi saat menjawab dan menyelesaikan tantangan."
            checked={settings.sound}
            onChange={(value) => updateSettings({ sound: value })}
            icon={settings.sound ? Volume2 : VolumeX}
          />
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold text-slate-200">Kecepatan animasi default</p>
                <p className="mt-0.5 text-[9px] text-slate-500">Nilai awal laboratorium simulasi.</p>
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
                { value: "2", label: "Maks." },
              ]}
            />
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
            <div className="flex items-center gap-2">
              <ProgressRing value={progressPercent} size={38} stroke={3} />
              <div>
                <p className="text-[10px] font-semibold text-slate-200">Progres belajar {progressPercent}%</p>
                <p className="mt-0.5 text-[9px] text-slate-500">Tersimpan otomatis di perangkat ini.</p>
              </div>
            </div>
            <div className="mt-2">
              <ProgressBar value={progressPercent} />
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-cyan-300/15 bg-cyan-400/[0.035] p-2.5 text-[9px] leading-relaxed text-slate-500">
            <Sparkles size={12} className="mt-0.5 shrink-0 text-cyan-300" />
            Aplikasi dapat digunakan tanpa akun. Data progres tidak dikirim ke server. Gunakan menu Tentang untuk
            membaca catatan akurasi dan keterbatasan simulasi.
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
