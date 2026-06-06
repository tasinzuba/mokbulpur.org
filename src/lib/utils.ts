import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBDT(amount: number, locale: "bn" | "en" = "bn"): string {
  const formatter = new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-IN", {
    maximumFractionDigits: 0,
  });
  return `৳${formatter.format(amount)}`;
}

export function formatDate(date: Date | string, locale: "bn" | "en" = "bn"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function monthLabel(
  year: number,
  month: number,
  locale: "bn" | "en" = "bn",
): string {
  const d = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "short",
  }).format(d);
}
