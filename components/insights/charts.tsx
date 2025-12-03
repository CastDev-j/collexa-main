"use client";

import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  Legend,
} from "recharts";

const COLORS = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#84cc16",
];

export function PieChartCard({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number }[];
}) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-slate-900 mb-3">{title}</h3>
      <div className="h-[260px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function BarChartCard({
  title,
  data,
  xKey,
  yKey,
}: {
  title: string;
  data: any[];
  xKey: string;
  yKey: string;
}) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-slate-900 mb-3">{title}</h3>
      <div className="h-[260px]">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey={yKey} fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function AreaChartCard({
  title,
  data,
  xKey,
  yKey,
}: {
  title: string;
  data: any[];
  xKey: string;
  yKey: string;
}) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-slate-900 mb-3">{title}</h3>
      <div className="h-[260px]">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke="#0ea5e9"
              fill="#bae6fd"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
