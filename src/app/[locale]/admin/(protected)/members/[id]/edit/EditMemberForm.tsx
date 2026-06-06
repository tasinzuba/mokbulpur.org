"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { updateMemberAction } from "./actions";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AlertCircle, Save } from "lucide-react";
import type { Member } from "@/lib/supabase/types";

export function EditMemberForm({ member }: { member: Member }) {
  const t = useTranslations("admin.memberForm");
  const tAdmin = useTranslations("admin");
  const boundAction = updateMemberAction.bind(null, member.id);
  const [state, formAction, pending] = useActionState(boundAction, null);

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
        <Field
          label={`${t("nameBn")} *`}
          name="name_bn"
          required
          defaultValue={member.name_bn}
        />
        <Field
          label={`${t("nameEn")} *`}
          name="name_en"
          required
          defaultValue={member.name_en}
        />
      </div>

      <Field
        label={t("photoUrl")}
        name="photo_url"
        type="url"
        placeholder="https://i.ibb.co/..../photo.jpg"
        hint={t("photoHint")}
        defaultValue={member.photo_url ?? ""}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("country")}
          name="country"
          placeholder="Saudi Arabia"
          defaultValue={member.country ?? ""}
        />
        <Field
          label={t("countryFlag")}
          name="country_flag"
          placeholder="🇧🇩"
          maxLength={16}
          defaultValue={member.country_flag ?? ""}
        />
      </div>

      <Field
        label={t("phone")}
        name="phone"
        type="tel"
        defaultValue={member.phone ?? ""}
      />

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
            max={new Date().getFullYear() + 1}
            defaultValue={member.joined_year}
            className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            {t("joinedMonth")} *
          </span>
          <select
            name="joined_month"
            required
            defaultValue={member.joined_month}
            className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
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
          defaultValue={member.notes ?? ""}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-base focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
        />
      </label>

      <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-card p-3">
        <input
          type="checkbox"
          name="active"
          defaultChecked={member.active}
          className="mt-0.5 h-4 w-4 rounded border-border text-[#0284c7] focus:ring-[#48cae4]"
        />
        <span className="text-sm text-foreground">{t("activeStatus")}</span>
      </label>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
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
          <Save className="h-5 w-5" />
          {pending ? t("updating") : t("update")}
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
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  hint?: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base placeholder:text-muted focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
      />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}
