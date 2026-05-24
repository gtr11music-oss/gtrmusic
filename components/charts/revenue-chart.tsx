"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyAnalytics } from "@/types";

interface RevenueChartProps {
  data: MonthlyAnalytics[];
  type?: "area" | "bar";
}

export function RevenueChart({ data, type = "area" }: RevenueChartProps) {
  const chartData = data.map((d) => ({
    name: d.month,
    revenue: Math.round(d.revenue * 100) / 100,
    streams: d.streams,
    hours: d.listenHours,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      {type === "area" ? (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "#132238",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
            }}
            formatter={(v) => [`$${v}`, "الإيراد"]}
          />
          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revGrad)" />
        </AreaChart>
      ) : (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "#132238",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
            }}
          />
          <Bar dataKey="streams" fill="#1db954" radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}
