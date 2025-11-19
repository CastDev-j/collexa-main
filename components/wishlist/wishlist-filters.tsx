"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const priorities = [
  {
    name: "Baja",
    value: "Low",
  },
  {
    name: "Media",
    value: "Medium",
  },
  {
    name: "Alta",
    value: "High",
  },
];

export function WishlistFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPriority = searchParams.get("priority");

  const handlePriorityChange = (priority: string) => {
    const params = new URLSearchParams(searchParams);
    if (priority === currentPriority) {
      params.delete("priority");
    } else {
      params.set("priority", priority);
    }
    router.push(`/dashboard/wishlist?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <span className="text-sm text-slate-600 self-center">
        Filtrar por prioridad:
      </span>
      {priorities.map((priority) => (
        <Button
          key={priority.value}
          variant={currentPriority === priority.value ? "default" : "outline"}
          size="sm"
          onClick={() => handlePriorityChange(priority.value)}
        >
          {priority.name}
        </Button>
      ))}
    </div>
  );
}
