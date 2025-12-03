import { ItemForm } from "@/components/items/item-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewItemPage() {
  const supabase = await createClient();

  const [
    { data: itemTypes },
    { data: platforms },
    { data: conditions },
    { data: locations },
    { data: publishers },
    { data: creators },
    { data: genres },
    { data: tags },
  ] = await Promise.all([
    supabase.from("item_types").select("*").order("name"),
    supabase.from("platforms").select("*").order("name"),
    supabase.from("conditions").select("*").order("name"),
    supabase.from("locations").select("*").order("name"),
    supabase.from("publishers").select("*").order("name"),
    supabase.from("creators").select("*").order("name"),
    supabase.from("genres").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Agregar Item</h1>
        <p className="text-slate-600 mt-2">
          Completa los detalles de tu nuevo item
        </p>
      </div>

      <ItemForm
        itemTypes={itemTypes || []}
        platforms={platforms || []}
        conditions={conditions || []}
        locations={locations || []}
        publishers={publishers || []}
        creators={creators || []}
        genres={genres || []}
        tags={tags || []}
      />
    </div>
  );
}
