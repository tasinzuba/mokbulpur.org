"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { updateSettingsAction } from "./actions";
import { buttonStyles } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import type { Settings } from "@/lib/supabase/types";

export function SettingsForm({ settings }: { settings: Settings }) {
  const t = useTranslations("adminSettings");
  const [state, formAction, pending] = useActionState(
    updateSettingsAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      <Field
        label={t("orgName")}
        name="org_name"
        defaultValue={settings.org_name}
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label={t("joiningAmount")}
          name="joining_amount"
          defaultValue={settings.joining_amount}
          required
          min={0}
        />
        <NumberField
          label={t("monthlyAmount")}
          name="monthly_amount"
          defaultValue={settings.monthly_amount}
          required
          min={0}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label={t("collectionDayStart")}
          name="collection_day_start"
          defaultValue={settings.collection_day_start}
          required
          min={1}
          max={31}
        />
        <NumberField
          label={t("collectionDayEnd")}
          name="collection_day_end"
          defaultValue={settings.collection_day_end}
          required
          min={1}
          max={31}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label={t("finePerMonth")}
          name="fine_per_month"
          defaultValue={settings.fine_per_month}
          min={0}
        />
        <NumberField
          label={t("foundedYear")}
          name="founded_year"
          defaultValue={settings.founded_year}
          required
          min={2000}
          max={new Date().getFullYear() + 1}
        />
      </div>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      {state?.success && (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t("saved")}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className={buttonStyles({ size: "lg" })}
      >
        <Save className="h-5 w-5" />
        {pending ? t("saving") : t("save")}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
      />
    </label>
  );
}

function NumberField({
  label,
  name,
  defaultValue,
  required,
  min,
  max,
}: {
  label: string;
  name: string;
  defaultValue?: number;
  required?: boolean;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <input
        type="number"
        name={name}
        defaultValue={defaultValue}
        required={required}
        min={min}
        max={max}
        className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base tabular-nums focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
      />
    </label>
  );
}
