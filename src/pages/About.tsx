import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Database,
  Earth,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Info,
  Laptop,
  Layers,
  Shield,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Button, Card, PageHeader, Pill } from "../components/ui";
import { Globe } from "../components/Globe";
import { LEARNING_OBJECTIVES, QURAN_REFLECTION, TEACHER_GUIDE } from "../data/reference";
import { useApp } from "../lib/store";

const FEATURES = [
  { title: "8 materi interaktif", text: "Dari sumbu Bumi hingga mitos atau fakta." },
  { title: "Laboratorium simulasi", text: "Kemiringan 0°–30°, posisi orbit, dan tampilan visual." },
  { title: "Latihan 12 soal", text: "Pilihan ganda, benar–salah, mencocokkan, mengurutkan." },
  { title: "Kuis 15 soal", text: "Timer opsional, kategori nilai, dan rekap topik." },
  { title: "Mini game Buru Musim", text: "Tantangan orbit dengan sistem petunjuk dan poin." },
  { title: "Progres lokal", text: "Tersimpan di perangkat, tanpa membuat akun." },
];

export function About() {
  const { navigate, progress } = useApp();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Tentang aplikasi"
        title="Kenali ruang belajarmu"
        description="Identitas, tujuan, teknologi, dan catatan akurasi aplikasi pembelajaran interaktif Earth Tilt & Seasons."
        icon={Info}
        actions={
          <Button variant="secondary" size="sm" onClick={() => navigate("home")}>
            <Earth size={14} /> Menu utama
          </Button>
        }
      />

      <Card glow className="relative overflow-hidden p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/[0.08] blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_250px] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill dot="bg-cyan-400">IPAS · Fase C</Pill>
              <Pill className="border-white/10 px-2 py-0.5 text-[8px]">Kelas VI SD</Pill>
              <Pill className="border-white/10 px-2 py-0.5 text-[8px]">Bahasa Indonesia</Pill>
            </div>
            <p className="mt-4 font-display text-[10px] font-bold uppercase tracking-[0.26em] text-cyan-300/80">
              Earth Tilt &amp; Seasons
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              Misteri Empat Musim
            </h2>
            <p className="mt-1.5 text-sm text-slate-300/80">
              “Jelajahi Kemiringan Bumi, Revolusi, dan Rahasia Pergantian Musim”
            </p>
            <p className="mt-4 max-w-xl text-[11px] leading-relaxed text-slate-400 sm:text-xs">
              Aplikasi ini dirancang agar siswa dapat melihat, memanipulasi, membandingkan, dan menjelaskan hubungan
              antara kemiringan sumbu Bumi, revolusi, penyinaran Matahari, dan pergantian musim — tanpa harus
              menghafal kesimpulan.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => navigate("materi")}>
                Mulai dari materi <ArrowRight size={13} />
              </Button>
              <Button size="sm" variant="secondary" onClick={() => navigate("lab")}>
                Coba laboratorium
              </Button>
              <Button size="sm" variant="ghost" onClick={() => navigate("guru")}>
                <GraduationCap size={14} /> Ruang Guru
              </Button>
            </div>
          </div>
          <div className="relative mx-auto flex flex-col items-center rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(8,47,73,0.4),rgba(3,8,23,0.4))] p-4 text-center">
            <Globe size={155} tilt={23.5} showAxis spinning lightAngle={-35} />
            <div className="mt-1 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1.5">
              <p className="text-[8px] font-bold uppercase tracking-wider text-amber-300/70">Aplikasi dibuat oleh</p>
              <p className="mt-0.5 font-display text-sm font-bold text-amber-100">Wiyanto Abu Hanif</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <TargetIcon />
            <h2 className="font-display text-base font-bold text-white">Tujuan pembelajaran</h2>
          </div>
          <ul className="mt-3 space-y-2">
            {LEARNING_OBJECTIVES.map((objective) => (
              <li key={objective} className="flex gap-2 text-[11px] leading-relaxed text-slate-400">
                <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-400" />
                {objective}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-cyan-300" />
            <h2 className="font-display text-base font-bold text-white">Fitur utama</h2>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5">
                <p className="text-[10px] font-bold text-slate-200">{feature.title}</p>
                <p className="mt-0.5 text-[9px] leading-relaxed text-slate-500">{feature.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-cyan-300" />
            <h2 className="font-display text-base font-bold text-white">Cara menggunakan</h2>
          </div>
          <div className="mt-3 space-y-2.5">
            {[
              "Mulai dari Materi 1 atau langsung ke Laboratorium Simulasi.",
              "Di laboratorium, tekan Putar/Jeda, ubah sliders kemiringan, dan pilih posisi Maret–Desember.",
              "Bandingkan hasil di panel informasi dan grafik lama siang sebelum menarik kesimpulan.",
              "Uji eksperimen sumbu 0°, 23,5°, dan 30° di menu Eksperimen.",
              "Kerjakan Latihan, Buru Musim, dan Kuis. Progresmu tersimpan di perangkat.",
            ].map((step, index) => (
              <div key={step} className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 text-[9px] font-bold text-cyan-200">
                  {index + 1}
                </span>
                <p className="text-[11px] leading-relaxed text-slate-400">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-[10px] leading-relaxed text-slate-500">
            <span className="font-semibold text-slate-300">Tips pembelajaran: </span>
            Minta siswa memprediksi terlebih dahulu, lalu mengubah slider untuk menguji prediksinya. Guru dapat
            membuka panduan lengkap di Ruang Guru.
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <TriangleAlert size={16} className="text-amber-300" />
            <h2 className="font-display text-base font-bold text-white">Catatan akurasi & keterbatasan</h2>
          </div>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-400">
            <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" /> Ukuran Matahari, Bumi, jarak, dan orbit tidak berskala astronomis.</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" /> Nilai lama siang adalah perkiraan model sederhana, bukan data astronomi presisi.</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" /> Tanggal ekuinoks dan solstis merupakan perkiraan dan dapat bergeser antartahun.</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" /> Visualisasi sumbu memakai proyeksi penyederhanaan agar dapat dipahami.</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" /> Kemiringan sumbu tidak menjelaskan seluruh ragam iklim lokal.</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" /> Aplikasi tidak memberi angka suhu atau prediksi cuaca.</li>
          </ul>
          <div className="mt-3 flex gap-2 rounded-xl border border-amber-300/15 bg-amber-400/[0.04] p-2.5 text-[9px] leading-relaxed text-amber-100/70">
            <Info size={12} className="mt-0.5 shrink-0 text-amber-300" />
            Fokus utama aplikasi adalah geometri penyinaran dan hubungan sebab-akibat, bukan pemodelan iklim.
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-4">
          <Laptop size={16} className="text-cyan-300" />
          <h3 className="mt-2 font-display text-sm font-bold text-white">Teknologi</h3>
          <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
            Dibangun dengan React, Vite, dan Tailwind CSS. Visual astronomi menggunakan SVG dan CSS native sehingga
            tidak memerlukan WebGL atau CDN library 3D. Aplikasi tidak menggunakan backend berbayar.
          </p>
          <p className="mt-2 text-[9px] leading-relaxed text-slate-600">
            Font dari Google Fonts bersifat opsional. Jika koneksi internet tidak tersedia, font sistem tetap digunakan.
          </p>
        </Card>
        <Card className="p-4">
          <Shield size={16} className="text-emerald-300" />
          <h3 className="mt-2 font-display text-sm font-bold text-white">Privasi & data</h3>
          <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
            Progres materi, latihan, kuis, game, dan refleksi disimpan melalui LocalStorage di browser ini. Data tidak
            dikirim ke server. Menghapus data situs akan menghapus progres.
          </p>
          <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.025] px-2 py-1.5 text-[9px] text-slate-500">
            <Database size={11} /> Progres saat ini: {progress.materiRead.length} materi, {progress.practiceSolved.length} latihan
          </div>
        </Card>
        <Card className="p-4">
          <HeartHandshake size={16} className="text-amber-300" />
          <h3 className="mt-2 font-display text-sm font-bold text-white">Refleksi nilai</h3>
          <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
            {QURAN_REFLECTION.surah} menjadi bahan refleksi tentang keteraturan Matahari, Bulan, serta pergantian siang
            dan malam. Sumber terjemahan: {QURAN_REFLECTION.source}.
          </p>
          <p className="mt-2 text-[9px] leading-relaxed text-slate-600">
            Refleksi keagamaan tidak menggantikan penjelasan ilmiah. Ayat tidak menyebut angka 23,5°.
          </p>
          <button
            type="button"
            onClick={() => navigate("kesimpulan")}
            className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Baca refleksi lengkap <ArrowRight size={12} />
          </button>
        </Card>
      </div>

      <Card className="mt-4 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-300/70">Kredit & sumber</p>
            <h3 className="mt-1 font-display text-base font-bold text-white">Earth Tilt &amp; Seasons — Misteri Empat Musim</h3>
            <div className="mt-2 space-y-1 text-[10px] leading-relaxed text-slate-400">
              <p>Created by <strong className="text-slate-200">Wiyanto Abu Hanif</strong>. Mata pelajaran IPAS, Kelas VI / Fase C.</p>
              <p>Terjemahan QS Yunus [10]: 5–6 dari Kementerian Agama RI. Ikon dari Lucide. Font Plus Jakarta Sans &amp; Space Grotesk.</p>
              <p>Panduan penggunaan untuk pendamping tersedia di Ruang Guru. Semua fitur inti dapat diakses tanpa kata sandi.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button variant="secondary" size="sm" onClick={() => navigate("guru")}>
              <GraduationCap size={14} /> Ruang Guru
            </Button>
            <Button size="sm" onClick={() => navigate("home")}>
              <Earth size={14} /> Menu utama
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/[0.07] pt-3 text-[9px] text-slate-600">
          <span>Versi 1.0 · Edisi pembelajaran</span>
          <span className="inline-flex items-center gap-1"><Sparkles size={10} /> Dibuat untuk pembelajaran yang menumbuhkan rasa ingin tahu.</span>
          <span className="inline-flex items-center gap-1"><ExternalLink size={10} /> Tanpa akun · tanpa pengumpulan data pribadi</span>
        </div>
      </Card>

      <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-[9px] leading-relaxed text-slate-600">
        <strong className="text-slate-500">Panduan singkat dari guru:</strong> {TEACHER_GUIDE[0].body}
      </div>
    </div>
  );
}

function TargetIcon() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
      <Sparkles size={15} />
    </span>
  );
}
