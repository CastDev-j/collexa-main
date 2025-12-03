import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

type CountRow = { id: number; name: string; count: number };

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <Card className="p-4">{children}</Card>
    </div>
  );
}

function List({
  items,
}: {
  items: { label: string; value: string | number }[];
}) {
  if (!items.length)
    return <p className="text-slate-600">Sin datos suficientes</p>;
  return (
    <ul className="divide-y divide-slate-200">
      {items.map((it) => (
        <li key={it.label} className="flex items-center justify-between py-2">
          <span className="text-slate-700">{it.label}</span>
          <span className="font-medium text-slate-900">{it.value}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function InsightsPage() {
  const supabase = await createClient();

  // Parallel fetch reference catalogs
  const [itemTypesRes, platformsRes, locationsRes] = await Promise.all([
    supabase.from("item_types").select("id, name"),
    supabase.from("platforms").select("id, name"),
    supabase.from("locations").select("id, name"),
  ]);

  const typeMap = new Map<number, string>(
    (itemTypesRes.data || []).map((r: any) => [Number(r.id), r.name])
  );
  const platformMap = new Map<number, string>(
    (platformsRes.data || []).map((r: any) => [Number(r.id), r.name])
  );
  const locationMap = new Map<number, string>(
    (locationsRes.data || []).map((r: any) => [Number(r.id), r.name])
  );

  // Fetch items minimal fields to aggregate safely on server
  const { data: items = [] } = await supabase
    .from("items")
    .select(
      "id, item_type_id, platform_id, location_id, personal_rating, release_year"
    );

  // Aggregations
  const byType = new Map<number, number>();
  const byPlatform = new Map<number, number>();
  const byLocation = new Map<number, number>();
  const ratingDist = new Map<number, number>();
  const byYear = new Map<number, number>();

  for (const it of items) {
    if (it.item_type_id)
      byType.set(it.item_type_id, (byType.get(it.item_type_id) || 0) + 1);
    if (it.platform_id)
      byPlatform.set(it.platform_id, (byPlatform.get(it.platform_id) || 0) + 1);
    if (it.location_id)
      byLocation.set(it.location_id, (byLocation.get(it.location_id) || 0) + 1);
    if (it.personal_rating != null) {
      const r = Number(it.personal_rating);
      ratingDist.set(r, (ratingDist.get(r) || 0) + 1);
    }
    if (it.release_year)
      byYear.set(it.release_year, (byYear.get(it.release_year) || 0) + 1);
  }

  const typeList = Array.from(byType.entries())
    .map(([id, count]) => ({
      label: typeMap.get(id) || `Tipo ${id}`,
      value: count,
    }))
    .sort((a, b) => Number(b.value) - Number(a.value));

  const platformList = Array.from(byPlatform.entries())
    .map(([id, count]) => ({
      label: platformMap.get(id) || `Plataforma ${id}`,
      value: count,
    }))
    .sort((a, b) => Number(b.value) - Number(a.value));

  const locationList = Array.from(byLocation.entries())
    .map(([id, count]) => ({
      label: locationMap.get(id) || `Ubicación ${id}`,
      value: count,
    }))
    .sort((a, b) => Number(b.value) - Number(a.value));

  const ratingList = Array.from(ratingDist.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([r, count]) => ({ label: `${r} ★`, value: count }));

  const yearList = Array.from(byYear.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([y, count]) => ({ label: String(y), value: count }));

  // Tags frequency
  const { data: tagLinks = [] } = await supabase
    .from("item_tags")
    .select("tag_id, tags(name)");

  const tagCount = new Map<string, number>();
  for (const t of tagLinks) {
    const name = t.tags?.name || `Tag ${t.tag_id}`;
    tagCount.set(name, (tagCount.get(name) || 0) + 1);
  }
  const tagList = Array.from(tagCount.entries())
    .map(([label, count]) => ({ label, value: count }))
    .sort((a, b) => Number(b.value) - Number(a.value))
    .slice(0, 10);

  // Loans metrics
  const today = new Date().toISOString().slice(0, 10);
  const [activeLoans, returnedLoans, overdueLoans, returnedDurations] =
    await Promise.all([
      supabase
        .from("loans")
        .select("*", { count: "exact", head: true })
        .eq("is_returned", false),
      supabase
        .from("loans")
        .select("*", { count: "exact", head: true })
        .eq("is_returned", true),
      supabase
        .from("loans")
        .select("*", { count: "exact", head: true })
        .eq("is_returned", false)
        .not("due_date", "is", null)
        .lt("due_date", today),
      supabase
        .from("loans")
        .select("loan_date, return_date")
        .eq("is_returned", true),
    ]);

  let avgLoanDays = 0;
  if (Array.isArray(returnedDurations.data) && returnedDurations.data.length) {
    const diffs = returnedDurations.data
      .filter((r: any) => r.loan_date && r.return_date)
      .map((r: any) => {
        const start = new Date(r.loan_date as string).getTime();
        const end = new Date(r.return_date as string).getTime();
        return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      });
    const total = diffs.reduce((a: number, b: number) => a + b, 0);
    avgLoanDays = diffs.length ? Math.round(total / diffs.length) : 0;
  }

  // Wishlist metrics
  const { data: wishlistRows = [] } = await supabase
    .from("wishlist")
    .select("priority, estimated_price");

  const prioCount = new Map<string, number>();
  let wishlistTotal = 0;
  for (const w of wishlistRows) {
    const p = w.priority || "N/A";
    prioCount.set(p, (prioCount.get(p) || 0) + 1);
    wishlistTotal += Number(w.estimated_price || 0);
  }
  const wishlistPrioList = Array.from(prioCount.entries()).map(
    ([label, count]) => ({ label, value: count })
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Estadísticas</h1>
        <p className="text-slate-600 mt-2">Resumen analítico de tu colección</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Por Tipo">
          <List
            items={typeList.map((x) => ({ label: x.label, value: x.value }))}
          />
        </Section>

        <Section title="Por Plataforma">
          <List
            items={platformList.map((x) => ({
              label: x.label,
              value: x.value,
            }))}
          />
        </Section>

        <Section title="Por Ubicación">
          <List
            items={locationList.map((x) => ({
              label: x.label,
              value: x.value,
            }))}
          />
        </Section>

        <Section title="Distribución de Ratings">
          <List items={ratingList} />
        </Section>

        <Section title="Items por Año de Lanzamiento">
          <List items={yearList} />
        </Section>

        <Section title="Tags más usados (Top 10)">
          <List items={tagList} />
        </Section>

        <Section title="Préstamos">
          <List
            items={[
              { label: "Activos", value: activeLoans.count || 0 },
              { label: "Devueltos", value: returnedLoans.count || 0 },
              { label: "Vencidos", value: overdueLoans.count || 0 },
              { label: "Duración promedio (días)", value: avgLoanDays },
            ]}
          />
        </Section>

        <Section title="Wishlist">
          <List
            items={[
              ...wishlistPrioList,
              {
                label: "Valor estimado total",
                value: `$${wishlistTotal.toFixed(2)}`,
              },
            ]}
          />
        </Section>
      </div>
    </div>
  );
}
