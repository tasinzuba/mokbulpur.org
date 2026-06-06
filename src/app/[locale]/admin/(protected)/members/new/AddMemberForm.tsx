"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { addMemberAction } from "./actions";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AlertCircle, UserPlus } from "lucide-react";

export function AddMemberForm() {
  const t = useTranslations("admin.memberForm");
  const tAdmin = useTranslations("admin");
  const [state, formAction, pending] = useActionState(addMemberAction, null);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`${t("nameBn")} *`} name="name_bn" required />
        <Field label={`${t("nameEn")} *`} name="name_en" required />
      </div>

      <Field
        label={t("photoUrl")}
        name="photo_url"
        type="url"
        placeholder="https://..."
        hint={t("photoHint")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("country")} name="country" placeholder="Saudi Arabia" />
        <Field
          label={t("countryFlag")}
          name="country_flag"
          placeholder="🇧🇩"
          maxLength={16}
        />
      </div>

      <Field label={t("phone")} name="phone" type="tel" />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            {t("joinedYear")} *
          </span>
          <input
            name="joined_year"
            type="number"
            required
            min={2000}
            max={currentYear + 1}
            defaultValue={currentYear}
            className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            {t("joinedMonth")} *
          </span>
          <select
            name="joined_month"
            required
            defaultValue={currentMonth}
            className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {months.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          {t("notes")}
        </span>
        <textarea
          name="notes"
          rows={3}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {state.error === "missing" ? t("errorMissing") : state.error}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className={buttonStyles({ size: "lg" })}
        >
          <UserPlus className="h-5 w-5" />
          {pending ? t("submitting") : t("submit")}
        </button>
        <Link
          href="/admin/members"
          className={buttonStyles({ variant: "secondary", size: "lg" })}
        >
          {t("cancel")}
        </Link>
      </div>

      <p className="text-xs text-muted">
        ← {tAdmin("dashboard")} ·{" "}
        <Link href="/admin/members" className="underline hover:text-foreground">
          {tAdmin("manageMembers")}
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  maxLength,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}
