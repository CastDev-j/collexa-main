import { createClient } from "@/lib/supabase/server";
import { ItemsGrid } from "@/components/items/items-grid";
import { ItemsFilters } from "@/components/items/items-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getItemsForCatalog } from "@/lib/items/queries";

// Optimizar el cache para búsquedas
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const items = await getItemsForCatalog({
    type: params.type ?? null,
    search: params.search ?? null,
  });

  const { data: itemTypes } = await supabase
    .from("item_types")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Catálogo</h1>
          <p className="text-slate-600 mt-2">
            Gestiona todos tus items en un solo lugar
          </p>
        </div>
        <Link href="/dashboard/items/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Item
          </Button>
        </Link>
      </div>

      <ItemsFilters itemTypes={itemTypes || []} />

      <ItemsGrid items={items} />
    </div>
  );
}
