import { createClient } from "@/lib/supabase/server";
import { BarChartCard, PieChartCard } from "@/components/insights/charts";
import { Card } from "@/components/ui/card";

export default async function TagsInsightsPage() {
  const supabase = await createClient();

  const [{ data: tagLinks = [] }, { data: tags = [] }, { data: items = [] }] =
    await Promise.all([
      supabase
        .from("item_tags")
        .select("tag_id, item_id, tags(name, color_hex)"),
      supabase.from("tags").select("*"),
      supabase.from("items").select("id"),
    ]);

  // Contar items por etiqueta
  const tagCount = new Map<
    number,
    { name: string; count: number; color: string }
  >();
  for (const link of tagLinks) {
    const tagId = link.tag_id;
    const tagName = link.tags?.name || `Tag ${tagId}`;
    const tagColor = link.tags?.color_hex || "#6B7280";

    if (tagCount.has(tagId)) {
      const existing = tagCount.get(tagId)!;
      tagCount.set(tagId, { ...existing, count: existing.count + 1 });
    } else {
      tagCount.set(tagId, { name: tagName, count: 1, color: tagColor });
    }
  }

  const sortedTags = Array.from(tagCount.values()).sort(
    (a, b) => b.count - a.count
  );

  const barData = sortedTags.slice(0, 20).map((tag) => ({
    name: tag.name,
    value: tag.count,
  }));

  const pieData = sortedTags.slice(0, 10).map((tag) => ({
    name: tag.name,
    value: tag.count,
  }));

  const totalItems = items.length;
  const itemsWithTags = new Set(tagLinks.map((link) => link.item_id)).size;
  const itemsWithoutTags = totalItems - itemsWithTags;
  const percentageWithTags =
    totalItems > 0 ? ((itemsWithTags / totalItems) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Estadísticas de Etiquetas
        </h1>
        <p className="text-slate-600">
          Análisis del uso de etiquetas en tu colección
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-sm text-slate-600">Total de Etiquetas</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {tags.length}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-slate-600">Items Etiquetados</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {itemsWithTags}
            <span className="text-sm text-slate-600 ml-2">/ {totalItems}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {percentageWithTags}% del total
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-slate-600">Items sin Etiquetas</div>
          <div className="text-3xl font-bold text-orange-600 mt-2">
            {itemsWithoutTags}
          </div>
        </Card>
      </div>

      {sortedTags.length > 0 ? (
        <>
          <BarChartCard
            title="Top 20 Etiquetas Más Usadas"
            data={barData}
            xKey="name"
            yKey="value"
          />

          <PieChartCard
            title="Distribución de las 10 Etiquetas Principales"
            data={pieData}
          />

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Todas las Etiquetas
            </h2>
            <div className="flex flex-wrap gap-3">
              {sortedTags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg"
                >
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                  <span className="text-sm text-slate-600">
                    {tag.count} {tag.count === 1 ? "item" : "items"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-slate-600">
            No hay etiquetas en uso. Crea etiquetas en Configuración y asígnalas
            a tus items.
          </p>
        </Card>
      )}
    </div>
  );
}
