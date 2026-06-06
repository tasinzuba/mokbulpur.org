"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { loginAction } from "./actions";
import { buttonStyles } from "@/components/ui/button";

export function LoginForm() {
  const t = useTranslations("admin");
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <Field
        icon={<Mail className="h-4 w-4" />}
        name="email"
        type="email"
        label={t("email")}
        autoComplete="email"
        required
      />
      <Field
        icon={<Lock className="h-4 w-4" />}
        name="password"
        type="password"
        label={t("password")}
        autoComplete="current-password"
        required
      />

      {state?.error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t("loginError")}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className={buttonStyles({ size: "lg", className: "w-full" })}
      >
        <LogIn className="h-5 w-5" />
        {pending ? t("signingIn") : t("signIn")}
      </button>
    </form>
  );
}

function Field({
  icon,
  label,
  name,
  type,
  autoComplete,
  required,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          {icon}
        </span>
        <input
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          className="h-12 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-base text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </label>
  );
}
