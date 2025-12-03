import { createClient } from "@/lib/supabase/server";
import { PieChartCard, BarChartCard } from "@/components/insights/charts";

export default async function CollectionInsightsPage() {
  const supabase = await createClient();

  const [itemTypes, platforms, items] = await Promise.all([
    supabase.from("item_types").select("id, name"),
    supabase.from("platforms").select("id, name"),
    supabase
      .from("items")
      .select("id, item_type_id, platform_id, release_year, personal_rating"),
  ]);

  const tMap = new Map<number, string>(
    (itemTypes.data || []).map((r: any) => [Number(r.id), r.name])
  );
  const pMap = new Map<number, string>(
    (platforms.data || []).map((r: any) => [Number(r.id), r.name])
  );

  const byType = new Map<number, number>();
  const byPlatform = new Map<number, number>();
  const byYear = new Map<number, number>();

  for (const it of items.data || []) {
    if (it.item_type_id)
      byType.set(it.item_type_id, (byType.get(it.item_type_id) || 0) + 1);
    if (it.platform_id)
      byPlatform.set(it.platform_id, (byPlatform.get(it.platform_id) || 0) + 1);
    if (it.release_year)
      byYear.set(it.release_year, (byYear.get(it.release_year) || 0) + 1);
  }

  const typeData = Array.from(byType.entries()).map(([id, count]) => ({
    name: tMap.get(id) || `Tipo ${id}`,
    value: count,
  }));
  const platformData = Array.from(byPlatform.entries()).map(([id, count]) => ({
    name: pMap.get(id) || `Plataforma ${id}`,
    value: count,
  }));
  const yearData = Array.from(byYear.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([y, count]) => ({ year: String(y), count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Estadísticas de Colección
        </h1>
        <p className="text-slate-600">
          Distribuciones por tipo, plataforma y año
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChartCard title="Por Tipo" data={typeData} />
        <PieChartCard title="Por Plataforma" data={platformData} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <BarChartCard
          title="Items por Año"
          data={yearData}
          xKey="year"
          yKey="count"
        />
      </div>
    </div>
  );
}
