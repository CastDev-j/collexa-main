"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  Heart,
  Users,
  Settings,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/items", label: "Catálogo", icon: Package },
  { href: "/dashboard/loans", label: "Préstamos", icon: Users },
  { href: "/dashboard/wishlist", label: "Lista de Deseos", icon: Heart },
  { href: "/dashboard/insights", label: "Estadísticas", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

function truncateEmail(email: string): string {
  if (email.length <= 8) return email;
  return email.substring(0, 8) + "...";
}

export function DashboardNav({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-bold text-xl text-primary hover:text-orange-600 transition-colors"
            >
              Collexa
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "gap-2",
                        isActive && "bg-slate-100 text-slate-900"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:block">
              {truncateEmail(user.email)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="max-w-6xl mx-auto">
          <ul className="grid grid-cols-5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center py-2 text-xs text-slate-600",
                      isActive && "text-slate-900"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="mt-0.5">{item.label.split(" ")[0]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
