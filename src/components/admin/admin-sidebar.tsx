"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  FileText,
  History,
  Activity,
  LogOut,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Daftar Laporan", href: "/admin/laporan", icon: FileText },
  { label: "Riwayat Laporan", href: "/admin/riwayat", icon: History },
  { label: "Log Aktivitas", href: "/admin/log-aktivitas", icon: Activity },
];

interface NavLinksProps {
  onItemClick?: () => void;
}

export function AdminNavLinks({ onItemClick }: NavLinksProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  const handleNavigate = (href: string, e: React.MouseEvent) => {
    if (pathname === href) return;

    e.preventDefault();
    setLoadingHref(href);
    if (onItemClick) onItemClick();

    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <nav className="space-y-1">
      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
        const isLoadingThis = isPending && loadingHref === item.href && pathname !== item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => handleNavigate(item.href, e)}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </div>

            {isLoadingThis && (
              <Loader2 className="h-4 w-4 animate-spin shrink-0 opacity-90" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Desktop Permanent Sidebar (lg+) */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card p-4 space-y-6 shrink-0 h-screen sticky top-0">
        <div className="px-3 py-2 border-b pb-4">
          <h2 className="text-lg font-extrabold tracking-tight text-primary">SIGAP Admin</h2>
          <p className="text-xs text-muted-foreground font-medium">PT Kebon Agung - PG Trangkil</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AdminNavLinks />
        </div>

        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            size="sm"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Keluar...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile Top Header + Sheet Drawer (< lg) */}
      <header className="lg:hidden flex items-center justify-between h-14 px-4 border-b bg-card sticky top-0 z-40">
        <div>
          <span className="font-extrabold text-primary">SIGAP</span>
          <span className="text-xs text-muted-foreground ml-1.5 font-medium">Admin Panel</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="outline" size="icon-sm" aria-label="Buka Menu Navigasi" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader className="text-left mb-4 border-b pb-3">
              <SheetTitle className="text-primary font-bold">SIGAP Admin</SheetTitle>
            </SheetHeader>
            <AdminNavLinks onItemClick={() => setOpen(false)} />
            <div className="mt-8 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                size="sm"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Keluar...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </>
                )}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
