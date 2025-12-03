import Link from "next/link";
import { cn } from "@/lib/utils";

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [
    { href: "/dashboard/insights", label: "Overview" },
    { href: "/dashboard/insights/collection", label: "Colección" },
    { href: "/dashboard/insights/loans", label: "Préstamos" },
    { href: "/dashboard/insights/wishlist", label: "Wishlist" },
    { href: "/dashboard/insights/tags", label: "Tags" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "px-3 py-1.5 rounded border text-sm text-slate-700 hover:bg-slate-50"
            )}
          >
            {l.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
