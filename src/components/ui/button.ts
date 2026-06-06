import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "elevated";
type Size = "sm" | "md" | "lg";

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]";

  const variants: Record<Variant, string> = {
    primary:
      "bg-primary text-primary-fg shadow-sm hover:bg-primary-hover hover:shadow-[var(--shadow-brand)] hover:-translate-y-0.5",
    secondary:
      "bg-card text-foreground border border-border hover:bg-muted-bg hover:border-muted shadow-sm",
    outline:
      "border border-primary/30 text-primary hover:bg-primary hover:text-primary-fg hover:border-primary",
    ghost: "text-foreground hover:bg-muted-bg",
    elevated:
      "bg-card text-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-border/50",
  };

  const sizes: Record<Size, string> = {
    sm: "h-9 px-3.5 text-sm rounded-lg",
    md: "h-11 px-5 text-base rounded-xl",
    lg: "h-14 px-7 text-base rounded-2xl sm:text-lg",
  };

  return cn(base, variants[variant], sizes[size], className);
}
