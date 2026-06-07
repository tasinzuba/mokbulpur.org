import { cn } from "@/lib/utils";

function extractCountryCode(flag: string): string | null {
  const trimmed = flag.trim();
  if (!trimmed) return null;

  if (/^[A-Za-z]{2}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  const codePoints = Array.from(trimmed)
    .map((c) => c.codePointAt(0))
    .filter(
      (cp): cp is number => cp !== undefined && cp >= 0x1f1e6 && cp <= 0x1f1ff,
    );
  if (codePoints.length === 2) {
    return codePoints
      .map((cp) => String.fromCharCode(cp - 0x1f1e6 + 0x41))
      .join("")
      .toLowerCase();
  }
  return null;
}

export function CountryFlag({
  flag,
  className,
  alt = "",
}: {
  flag?: string | null;
  className?: string;
  alt?: string;
}) {
  if (!flag) return null;
  const code = extractCountryCode(flag);
  if (!code) {
    return <span className={className}>{flag}</span>;
  }
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`https://flagcdn.com/24x18/${code}.png`}
      srcSet={`https://flagcdn.com/48x36/${code}.png 2x`}
      width={20}
      height={15}
      alt={alt}
      className={cn(
        "inline-block h-[1em] w-auto rounded-[3px] align-[-2px] shadow-sm ring-1 ring-black/10",
        className,
      )}
      loading="lazy"
    />
  );
}
