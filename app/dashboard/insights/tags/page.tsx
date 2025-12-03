import { createClient } from "@/lib/supabase/server";
import { BarChartCard } from "@/components/insights/charts";

export default async function TagsInsightsPage() {
  const supabase = await createClient();
  const { data: tagLinks = [] } = await supabase
    .from("item_tags")
    .select("tag_id, tags(name)");

  const count = new Map<string, number>();
  for (const t of tagLinks) {
    const name = t.tags?.name || `Tag ${t.tag_id}`;
    count.set(name, (count.get(name) || 0) + 1);
  }
  const data = Array.from(count.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Estadísticas de Tags
        </h1>
        <p className="text-slate-600">Tags más frecuentes en tu colección</p>
      </div>
      <BarChartCard title="Top 20 Tags" data={data} xKey="name" yKey="value" />
    </div>
  );
}
