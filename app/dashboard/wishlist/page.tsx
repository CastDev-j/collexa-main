import { createClient } from "@/lib/supabase/server";
import { WishlistGrid } from "@/components/wishlist/wishlist-grid";
import { WishlistFilters } from "@/components/wishlist/wishlist-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function WishlistPage({
  searchParams,
}: {
  searchParams: Promise<{ priority?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  let query = supabase
    .from("wishlist")
    .select("*, item_types(name), platforms(name)")
    .order("created_at", { ascending: false });

  if (params.priority) {
    query = query.eq("priority", params.priority);
  }

  const { data: wishlist } = await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lista de Deseos</h1>
          <p className="text-slate-600 mt-2">
            Items que te gustaría adquirir en el futuro
          </p>
        </div>
        <Link href="/dashboard/wishlist/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Item
          </Button>
        </Link>
      </div>

      <WishlistFilters />

      <WishlistGrid items={wishlist || []} />
    </div>
  );
}
