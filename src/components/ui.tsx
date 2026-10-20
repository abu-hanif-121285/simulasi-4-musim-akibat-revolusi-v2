import {
  type ButtonHTMLAttributes,
  type ReactNode,
  useEffect,
} from "react";
import { X, type LucideIcon } from "lucide-react";
import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "gold" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-400 text-[#041020] shadow-[0_10px_35px_-10px_rgba(34,211,238,0.65)] hover:brightness-110 hover:shadow-[0_14px_38px_-10px_rgba(34,211,238,0.8)]",
  secondary:
    "glass text-slate-100 hover:bg-white/10 hover:border-white/20",
  ghost: "text-slate-300 hover:bg-white/[0.07] hover:text-white",
  gold: "bg-gradient-to-r from-amber-300 to-yellow-400 text-[#211603] shadow-[0_10px_30px_-12px_rgba(251,191,36,0.7)] hover:brightness-110",
  danger:
    "border border-rose-400/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "min-h-9 rounded-xl px-3.5 py-2 text-xs font-semibold",
  md: "min-h-11 rounded-xl px-4.5 py-2.5 text-sm font-semibold",
  lg: "min-h-13 rounded-2xl px-6 py-3.5 text-sm font-bold sm:text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass-deep relative rounded-3xl",
        glow && "shadow-[0_0_70px_-24px_rgba(34,211,238,0.4)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  className,
  dot,
}: {
  children: ReactNode;
  className?: string;
  dot?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-300",
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />}
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  max = 100,
  label,
  sublabel,
  className,
  barClassName,
}: {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  className?: string;
  barClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      {(label || sublabel) && (
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-300">{label}</span>
          <span className="text-slate-500">{sublabel ?? `${Math.round(pct)}%`}</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 transition-all duration-700",
            barClassName,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressRing({
  value,
  size = 42,
  stroke = 3.5,
}: {
  value: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-cyan-200">
        {Math.round(value)}%
      </span>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={cn("relative", compact ? "py-5 sm:py-6" : "py-7 sm:py-10")}>
      <div className="pointer-events-none absolute -left-10 top-0 h-40 w-72 rounded-full bg-cyan-500/[0.09] blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 flex items-center gap-2.5">
            {Icon && (
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
                <Icon size={16} strokeWidth={2} />
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-[0.23em] text-cyan-300/90">
              {eyebrow}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[2.15rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-[15px]">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300/80">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">{title}</h2>
        {description && <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ToggleRow({
  title,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
      {Icon && <Icon size={15} className="shrink-0 text-cyan-300" />}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-200">{title}</p>
        {description && <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full border transition-colors duration-200",
          checked
            ? "border-cyan-300/50 bg-cyan-400/80"
            : "border-white/15 bg-slate-600/50",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all duration-200",
            checked ? "left-[19px]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string; icon?: LucideIcon }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("segmented flex-wrap", className)} role="group">
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all",
              active
                ? "bg-cyan-400/15 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.2)]"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
            )}
          >
            {Icon && <Icon size={13} />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Tutup dialog"
        onClick={onClose}
        className="absolute inset-0 bg-[#020613]/80 backdrop-blur-md"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "glass-deep relative z-10 w-full overflow-hidden rounded-3xl shadow-2xl animate-rise",
          maxWidth,
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-display text-base font-bold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={17} />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function IconBubble({
  icon: Icon,
  tone = "cyan",
  size = "md",
}: {
  icon: LucideIcon;
  tone?: "cyan" | "gold" | "green" | "orange" | "violet";
  size?: "sm" | "md" | "lg";
}) {
  const tones = {
    cyan: "border-cyan-300/20 bg-cyan-400/10 text-cyan-300",
    gold: "border-amber-300/20 bg-amber-400/10 text-amber-300",
    green: "border-emerald-300/20 bg-emerald-400/10 text-emerald-300",
    orange: "border-orange-300/20 bg-orange-400/10 text-orange-300",
    violet: "border-violet-300/20 bg-violet-400/10 text-violet-300",
  };
  const sizes = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-10 w-10 rounded-xl",
    lg: "h-12 w-12 rounded-2xl",
  };
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center border", tones[tone], sizes[size])}>
      <Icon size={size === "sm" ? 14 : size === "md" ? 17 : 21} strokeWidth={1.9} />
    </span>
  );
}

export function EmptyStars() {
  return <div className="starfield" aria-hidden="true" />;
}
