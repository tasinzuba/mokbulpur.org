"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export type CategoryDatum = {
  label: string;
  value: number;
};

const COLORS = ["#48cae4", "#22d3ee", "#0284c7", "#fbbf24", "#f87171", "#a78bfa"];

export function CategoryPieChart({ data }: { data: CategoryDatum[] }) {
  const locale = useLocale() as Locale;
  const formatter = (v: number) =>
    new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US").format(v);

  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div className="grid h-[320px] place-items-center text-sm text-muted">
        —
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            strokeWidth={2}
            stroke="#ffffff"
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
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
            verticalAlign="bottom"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
