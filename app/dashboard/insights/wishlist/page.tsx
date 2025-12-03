import { createClient } from "@/lib/supabase/server";
import { PieChartCard, BarChartCard } from "@/components/insights/charts";

export default async function WishlistInsightsPage() {
  const supabase = await createClient();

  const [wishlist, platforms] = await Promise.all([
    supabase.from("wishlist").select("priority, estimated_price, platform_id"),
    supabase.from("platforms").select("id, name"),
  ]);

  const pMap = new Map<number, string>(
    (platforms.data || []).map((r: any) => [Number(r.id), r.name])
  );

  const prioCount = new Map<string, number>();
  const spendByPlatform = new Map<number, number>();

  for (const w of wishlist.data || []) {
    const p = w.priority || "N/A";
    prioCount.set(p, (prioCount.get(p) || 0) + 1);
    if (w.platform_id) {
      spendByPlatform.set(
        w.platform_id,
        (spendByPlatform.get(w.platform_id) || 0) +
          Number(w.estimated_price || 0)
      );
    }
  }

  const prioData = Array.from(prioCount.entries()).map(([name, value]) => ({
    name,
    value,
  }));
  const spendPlatformData = Array.from(spendByPlatform.entries())
    .map(([id, value]) => ({
      name: pMap.get(id) || `Plataforma ${id}`,
      value: Number(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Estadísticas de Wishlist
        </h1>
        <p className="text-slate-600">Prioridades y estimado por plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChartCard title="Distribución por prioridad" data={prioData} />
        <BarChartCard
          title="Valor estimado por plataforma"
          data={spendPlatformData}
          xKey="name"
          yKey="value"
        />
      </div>
    </div>
  );
}
