import { createClient } from "@/lib/supabase/server";

export async function getItemsForCatalog(filters: {
  type?: string | number | null;
  search?: string | null;
}) {
  const supabase = await createClient();

  const typeId = filters.type != null ? Number(filters.type) : undefined;
  const hasTypeFilter = typeof typeId === "number" && !Number.isNaN(typeId);
  const term = (filters.search || "").trim();

  let items: any[] = [];

  if (term) {
    let direct = supabase
      .from("items")
      .select("id")
      .or(`title.ilike.%${term}%,description.ilike.%${term}%`);
    if (hasTypeFilter) direct = direct.eq("item_type_id", typeId as number);

    const [directIdsRes, itemTypesRes, platformsRes, publishersRes, tagsRes] =
      await Promise.all([
        direct,
        supabase.from("item_types").select("id").ilike("name", `%${term}%`),
        supabase.from("platforms").select("id").ilike("name", `%${term}%`),
        supabase.from("publishers").select("id").ilike("name", `%${term}%`),
        supabase.from("tags").select("id").ilike("name", `%${term}%`),
      ]);

    const directIds = directIdsRes.data || [];
    const typeIds = (itemTypesRes.data || []).map((r: any) => Number(r.id));
    const platformIds = (platformsRes.data || []).map((r: any) => Number(r.id));
    const publisherIds = (publishersRes.data || []).map((r: any) =>
      Number(r.id)
    );
    const tagIds = (tagsRes.data || []).map((r: any) => Number(r.id));

    const [byType, byPlatform, byPublisher, tagItemLinks] = await Promise.all([
      typeIds.length
        ? supabase.from("items").select("id").in("item_type_id", typeIds)
        : Promise.resolve({ data: [] as any[] }),
      platformIds.length
        ? supabase.from("items").select("id").in("platform_id", platformIds)
        : Promise.resolve({ data: [] as any[] }),
      publisherIds.length
        ? supabase.from("items").select("id").in("publisher_id", publisherIds)
        : Promise.resolve({ data: [] as any[] }),
      tagIds.length
        ? supabase.from("item_tags").select("item_id").in("tag_id", tagIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const tagItemIds = (tagItemLinks.data || []).map((r: any) =>
      Number(r.item_id)
    );
    let tagFilteredIds: number[] = tagItemIds;
    if (hasTypeFilter && tagItemIds.length) {
      const { data: narrowed } = await supabase
        .from("items")
        .select("id")
        .in("id", tagItemIds)
        .eq("item_type_id", typeId as number);
      tagFilteredIds = (narrowed || []).map((r: any) => Number(r.id));
    }

    const idSet = new Set<number>();
    for (const r of directIds) idSet.add(Number(r.id));
    for (const r of (byType as any).data || []) idSet.add(Number(r.id));
    for (const r of (byPlatform as any).data || []) idSet.add(Number(r.id));
    for (const r of (byPublisher as any).data || []) idSet.add(Number(r.id));
    for (const id of tagFilteredIds) idSet.add(Number(id));

    const finalIds = Array.from(idSet);

    if (finalIds.length === 0) return [];

    let finalQuery = supabase
      .from("items")
      .select(
        `
        *,
        item_types(name),
        platforms(name),
        conditions(name),
        locations(name)
      `
      )
      .order("created_at", { ascending: false });

    if (hasTypeFilter)
      finalQuery = finalQuery.eq("item_type_id", typeId as number);
    finalQuery = finalQuery.in("id", finalIds);

    const { data } = await finalQuery;
    items = data || [];
  } else {
    let query = supabase
      .from("items")
      .select(
        `
        *,
        item_types(name),
        platforms(name),
        conditions(name),
        locations(name)
      `
      )
      .order("created_at", { ascending: false });
    if (hasTypeFilter) query = query.eq("item_type_id", typeId as number);
    const { data } = await query;
    items = data || [];
  }

  return items;
}
