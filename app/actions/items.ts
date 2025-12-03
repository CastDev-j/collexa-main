"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const itemData: any = {
    user_id: user.id,
    title: formData.get("title"),
    description: formData.get("description"),
    item_type_id: formData.get("item_type_id"),
    platform_id: formData.get("platform_id") || null,
    publisher_id: formData.get("publisher_id") || null,
    location_id: formData.get("location_id") || null,
    condition_id: formData.get("condition_id") || null,
    release_year: formData.get("release_year") || null,
    purchase_date: formData.get("purchase_date") || null,
    purchase_price: formData.get("purchase_price") || null,
    personal_rating: formData.get("personal_rating") || null,
    cover_image_url: formData.get("cover_image_url") || null,
  };

  const { data: newItem, error } = await supabase
    .from("items")
    .insert(itemData)
    .select()
    .single();

  if (error) throw error;

  // Guardar las etiquetas seleccionadas
  const tagsStr = formData.get("tags");
  if (tagsStr && newItem) {
    const tagIds = JSON.parse(tagsStr as string);
    if (tagIds.length > 0) {
      const itemTagsData = tagIds.map((tagId: number) => ({
        item_id: newItem.id,
        tag_id: tagId,
      }));
      await supabase.from("item_tags").insert(itemTagsData);
    }
  }

  revalidatePath("/dashboard/items");
  revalidatePath("/dashboard");
}

export async function updateItem(id: number, formData: FormData) {
  const supabase = await createClient();

  const itemData: any = {
    title: formData.get("title"),
    description: formData.get("description"),
    item_type_id: formData.get("item_type_id"),
    platform_id: formData.get("platform_id") || null,
    publisher_id: formData.get("publisher_id") || null,
    location_id: formData.get("location_id") || null,
    condition_id: formData.get("condition_id") || null,
    release_year: formData.get("release_year") || null,
    purchase_date: formData.get("purchase_date") || null,
    purchase_price: formData.get("purchase_price") || null,
    personal_rating: formData.get("personal_rating") || null,
    cover_image_url: formData.get("cover_image_url") || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("items").update(itemData).eq("id", id);

  if (error) throw error;

  // Actualizar las etiquetas
  const tagsStr = formData.get("tags");
  if (tagsStr) {
    const tagIds = JSON.parse(tagsStr as string);

    // Eliminar las etiquetas actuales
    await supabase.from("item_tags").delete().eq("item_id", id);

    // Insertar las nuevas etiquetas
    if (tagIds.length > 0) {
      const itemTagsData = tagIds.map((tagId: number) => ({
        item_id: id,
        tag_id: tagId,
      }));
      await supabase.from("item_tags").insert(itemTagsData);
    }
  }

  revalidatePath("/dashboard/items");
  revalidatePath(`/dashboard/items/${id}`);
  revalidatePath("/dashboard");
}

export async function deleteItem(id: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/dashboard/items");
  revalidatePath("/dashboard");
}

export async function fetchItemsForCatalog(filters: {
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
    if (finalIds.length) {
      finalQuery = finalQuery.in("id", finalIds);
    } else {
      items = [];
    }

    if (items.length === 0 && finalIds.length) {
      const { data } = await finalQuery;
      items = data || [];
    }
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

  revalidatePath("/dashboard/items");
  return items;
}
