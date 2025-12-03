"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import Link from "next/link";

interface Item {
  id: number;
  title: string;
  cover_image_url: string | null;
  personal_rating: number | null;
  item_types: { name: string } | null;
  platforms: { name: string } | null;
}

export function ItemsGrid({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 text-lg">No se encontraron items</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <Link key={item.id} href={`/dashboard/items/${item.id}`}>
          <Card className="overflow-hidden cursor-pointer p-0">
            <div className="aspect-3/4 bg-slate-200 relative">
              {item.cover_image_url ? (
                <img
                  src={item.cover_image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-slate-400" />
                </div>
              )}
            </div>
            <CardContent className="p-3 space-y-1">
              <h3 className="font-semibold text-slate-900 truncate text-balance">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 truncate">
                {item.item_types?.name || "Sin tipo"}
              </p>
              {item.personal_rating && (
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i < item.personal_rating!
                          ? "text-yellow-500"
                          : "text-slate-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
