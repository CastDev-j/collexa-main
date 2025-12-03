import { createClient } from "@/lib/supabase/server";
import { AreaChartCard, BarChartCard } from "@/components/insights/charts";

type Loan = {
  loan_date: string;
  return_date: string | null;
  is_returned: boolean;
};

function lastNMonthsLabels(n: number): string[] {
  const labels: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(d);
    dt.setMonth(d.getMonth() - i);
    labels.push(
      `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`
    );
  }
  return labels;
}

export default async function LoansInsightsPage() {
  const supabase = await createClient();
  const { data: loans = [] } = await supabase
    .from("loans")
    .select("loan_date, return_date, is_returned");

  // Monthly counts for last 12 months
  const months = lastNMonthsLabels(12);
  const startedPerMonth = new Map(months.map((m) => [m, 0]));
  const returnedPerMonth = new Map(months.map((m) => [m, 0]));

  for (const l of loans as Loan[]) {
    const startKey = l.loan_date?.slice(0, 7);
    if (startedPerMonth.has(startKey))
      startedPerMonth.set(startKey, (startedPerMonth.get(startKey) || 0) + 1);
    const retKey = l.return_date?.slice(0, 7);
    if (retKey && returnedPerMonth.has(retKey))
      returnedPerMonth.set(retKey, (returnedPerMonth.get(retKey) || 0) + 1);
  }

  const monthlySeries = months.map((m) => ({
    month: m,
    started: startedPerMonth.get(m) || 0,
    returned: returnedPerMonth.get(m) || 0,
  }));

  // Active vs returned summary
  const active = (loans as Loan[]).filter((l) => !l.is_returned).length;
  const done = (loans as Loan[]).filter((l) => l.is_returned).length;
  const statusData = [
    { name: "Activos", value: active },
    { name: "Devueltos", value: done },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Estadísticas de Préstamos
        </h1>
        <p className="text-slate-600">Tendencias mensuales y estado general</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AreaChartCard
          title="Préstamos iniciados por mes"
          data={monthlySeries}
          xKey="month"
          yKey="started"
        />
        <AreaChartCard
          title="Préstamos devueltos por mes"
          data={monthlySeries}
          xKey="month"
          yKey="returned"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChartCard
          title="Estado actual"
          data={statusData}
          xKey="name"
          yKey="value"
        />
      </div>
    </div>
  );
}
