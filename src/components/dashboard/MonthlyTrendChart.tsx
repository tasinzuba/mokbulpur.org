"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export type MonthlyDatum = {
  label: string;
  collected: number;
  spent: number;
};

export function MonthlyTrendChart({
  data,
  collectedLabel,
  spentLabel,
}: {
  data: MonthlyDatum[];
  collectedLabel: string;
  spentLabel: string;
}) {
  const locale = useLocale() as Locale;
  const formatter = (v: number) =>
    new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US").format(v);

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="collectedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#48cae4" stopOpacity={1} />
              <stop offset="100%" stopColor="#0284c7" stopOpacity={0.9} />
            </linearGradient>
            <linearGradient id="spentFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatter}
          />
          <Tooltip
            cursor={{ fill: "#48cae415" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #cdf4fc",
              boxShadow: "0 4px 16px -4px rgb(14 165 233 / 0.15)",
              fontSize: 13,
              fontWeight: 500,
            }}
            formatter={(v) => `৳${formatter(Number(v))}`}
          />
          <Legend
            wrapperStyle={{ fontSize: 13, fontWeight: 500 }}
            iconType="circle"
          />
          <Bar
            dataKey="collected"
            name={collectedLabel}
            fill="url(#collectedFill)"
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="spent"
            name={spentLabel}
            fill="url(#spentFill)"
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
