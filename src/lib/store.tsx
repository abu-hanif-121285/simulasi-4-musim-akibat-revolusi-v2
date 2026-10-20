import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type PageId =
  | "home"
  | "materi"
  | "lab"
  | "experiment"
  | "latihan"
  | "game"
  | "kuis"
  | "kesimpulan"
  | "tentang"
  | "guru";

export const PAGE_LABELS: Record<PageId, string> = {
  home: "Menu Utama",
  materi: "Materi",
  lab: "Laboratorium Simulasi",
  experiment: "Eksperimen Tanpa Kemiringan",
  latihan: "Latihan",
  game: "Buru Musim",
  kuis: "Kuis Tantangan",
  kesimpulan: "Kesimpulan",
  tentang: "Tentang Aplikasi",
  guru: "Ruang Guru",
};

const VALID_PAGES = Object.keys(PAGE_LABELS) as PageId[];

export type Settings = {
  sound: boolean;
  animationSpeed: number;
};

export type Progress = {
  materiRead: number[];
  practiceSolved: number[];
  quizBest: number | null;
  gameBest: number;
  visited: PageId[];
  reflection: string;
};

type AppContextValue = {
  page: PageId;
  navigate: (page: PageId) => void;
  settings: Settings;
  updateSettings: (next: Partial<Settings>) => void;
  progress: Progress;
  progressPercent: number;
  markMateri: (id: number) => void;
  markPractice: (id: number) => void;
  recordQuiz: (score: number) => void;
  recordGame: (score: number) => void;
  setReflection: (text: string) => void;
  clearProgress: () => void;
  resetAll: () => void;
  playFx: (kind: "correct" | "wrong" | "click" | "win") => void;
};

const emptyProgress: Progress = {
  materiRead: [],
  practiceSolved: [],
  quizBest: null,
  gameBest: 0,
  visited: [],
  reflection: "",
};

const defaultSettings: Settings = {
  sound: true,
  animationSpeed: 1,
};

const PROGRESS_KEY = "earth-tilt-seasons:progress:v1";
const SETTINGS_KEY = "earth-tilt-seasons:settings:v1";

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<T>;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

function getPageFromHash(): PageId {
  if (typeof window === "undefined") return "home";
  const raw = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return VALID_PAGES.includes(raw as PageId) ? (raw as PageId) : "home";
}

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) audioContext = new Ctor();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

function tone(freq: number, start: number, duration: number, type: OscillatorType, volume = 0.07) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.02);
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>(getPageFromHash);
  const [settings, setSettings] = useState<Settings>(() => readStored(SETTINGS_KEY, defaultSettings));
  const [progress, setProgress] = useState<Progress>(() => readStored(PROGRESS_KEY, emptyProgress));
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      /* Local storage dapat diblokir oleh browser. */
    }
  }, [settings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      /* Aplikasi tetap berjalan tanpa penyimpanan. */
    }
  }, [progress]);

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
    };
  }, []);

  useEffect(() => {
    if (page === "home") return;
    setProgress((prev) =>
      prev.visited.includes(page) ? prev : { ...prev, visited: [...prev.visited, page] },
    );
  }, [page]);

  const navigate = useCallback((next: PageId) => {
    setPage(next);
    const target = next === "home" ? "#/" : `#/${next}`;
    if (window.location.hash !== target) {
      window.history.pushState(null, "", target);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const updateSettings = useCallback((next: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...next }));
  }, []);

  const markMateri = useCallback((id: number) => {
    setProgress((prev) =>
      prev.materiRead.includes(id)
        ? prev
        : { ...prev, materiRead: [...prev.materiRead, id].sort((a, b) => a - b) },
    );
  }, []);

  const markPractice = useCallback((id: number) => {
    setProgress((prev) =>
      prev.practiceSolved.includes(id)
        ? prev
        : { ...prev, practiceSolved: [...prev.practiceSolved, id].sort((a, b) => a - b) },
    );
  }, []);

  const recordQuiz = useCallback((score: number) => {
    setProgress((prev) => ({
      ...prev,
      quizBest: prev.quizBest === null ? score : Math.max(prev.quizBest, score),
    }));
  }, []);

  const recordGame = useCallback((score: number) => {
    setProgress((prev) => ({ ...prev, gameBest: Math.max(prev.gameBest, score) }));
  }, []);

  const setReflection = useCallback((text: string) => {
    setProgress((prev) => ({ ...prev, reflection: text }));
  }, []);

  const clearProgress = useCallback(() => {
    setProgress({ ...emptyProgress });
    try {
      window.localStorage.removeItem(PROGRESS_KEY);
    } catch {
      /* abaikan */
    }
  }, []);

  const resetAll = useCallback(() => {
    setProgress({ ...emptyProgress });
    setSettings({ ...defaultSettings });
    try {
      window.localStorage.removeItem(PROGRESS_KEY);
      window.localStorage.removeItem(SETTINGS_KEY);
    } catch {
      /* abaikan */
    }
  }, []);

  const playFx = useCallback((kind: "correct" | "wrong" | "click" | "win") => {
    if (!settingsRef.current.sound) return;
    if (kind === "correct") {
      tone(523.25, 0, 0.14, "sine", 0.06);
      tone(659.25, 0.1, 0.16, "sine", 0.06);
      tone(783.99, 0.22, 0.22, "sine", 0.05);
    } else if (kind === "win") {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.12, 0.25, "triangle", 0.05));
    } else if (kind === "wrong") {
      tone(196, 0, 0.16, "sine", 0.045);
      tone(155.56, 0.13, 0.22, "sine", 0.04);
    } else {
      tone(880, 0, 0.035, "sine", 0.02);
    }
  }, []);

  const progressPercent = useMemo(() => {
    const materiPart = (progress.materiRead.length / 8) * 40;
    const practicePart = (ratio(progress.practiceSolved.length, 12) ?? 0) * 20;
    const quizPart = ((progress.quizBest ?? 0) / 100) * 25;
    const gamePart = Math.min(progress.gameBest / 500, 1) * 10;
    const closingPart = progress.visited.includes("kesimpulan") ? 5 : 0;
    return Math.round(Math.min(100, materiPart + practicePart + quizPart + gamePart + closingPart));
  }, [progress]);

  const value = useMemo<AppContextValue>(
    () => ({
      page,
      navigate,
      settings,
      updateSettings,
      progress,
      progressPercent,
      markMateri,
      markPractice,
      recordQuiz,
      recordGame,
      setReflection,
      clearProgress,
      resetAll,
      playFx,
    }),
    [
      page,
      navigate,
      settings,
      updateSettings,
      progress,
      progressPercent,
      markMateri,
      markPractice,
      recordQuiz,
      recordGame,
      setReflection,
      clearProgress,
      resetAll,
      playFx,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function ratio(value: number, total: number): number | null {
  if (!total) return null;
  return Math.min(1, value / total);
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp harus dipakai di dalam AppProvider");
  return ctx;
}
