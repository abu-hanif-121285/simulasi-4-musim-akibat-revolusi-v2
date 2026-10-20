import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class PageBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Informasi ini membantu pengembang saat simulasi kompleks diuji.
    console.error("Earth Tilt & Seasons — galat tampilan:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="glass-deep overflow-hidden rounded-3xl p-5 sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Tampilan pengganti</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white">Simulasi sedang tidak dapat ditampilkan</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Materi inti tetap dapat kamu pelajari. Aplikasi menggunakan visual SVG native, sehingga masalah biasanya
            hanya pada peramban yang perlu dimuat ulang.
          </p>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Ringkasan konsep</p>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-300">
              <li>• Sumbu Bumi adalah garis khayal yang melewati kedua kutub.</li>
              <li>• Sumbu Bumi miring 23,5° dari garis tegak lurus terhadap bidang orbit.</li>
              <li>• Kemiringan sumbu tetap relatif sama selama revolusi.</li>
              <li>• Kemiringan + revolusi mengubah sudut penyinaran dan lama siang.</li>
              <li>• Belahan Utara dan Selatan umumnya memiliki musim berlawanan.</li>
              <li>• Indonesia umumnya memiliki musim hujan dan kemarau.</li>
            </ul>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-cyan-300 px-4 py-2 text-xs font-bold text-night-950 transition hover:bg-cyan-200"
            >
              Muat ulang halaman
            </button>
            <a
              href="#/materi"
              onClick={() => window.setTimeout(() => window.location.reload(), 60)}
              className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.06]"
            >
              Buka materi dasar
            </a>
            <a
              href="#/home"
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 transition hover:text-cyan-200"
            >
              Menu utama
            </a>
          </div>
        </div>
      </div>
    );
  }
}
