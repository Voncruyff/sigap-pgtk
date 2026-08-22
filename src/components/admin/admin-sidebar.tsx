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
  Building,
  ShieldCheck,
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
    <nav className="space-y-1.5">
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
            className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-md shadow-sky-600/25 scale-[1.01]"
                : "text-slate-600 hover:bg-sky-50/80 hover:text-sky-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-sky-600"}`} />
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
      <aside className="hidden lg:flex flex-col w-64 border-r border-sky-100/80 bg-white p-5 space-y-6 shrink-0 h-screen sticky top-0 shadow-xs">
        <div className="px-2 py-1 border-b border-sky-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-black text-sm shadow-md shadow-sky-500/20">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-slate-900 leading-none">SIGAP Admin</h2>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">PT Kebon Agung &bull; PG Trangkil</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-2">
          <AdminNavLinks />
        </div>

        <div className="pt-4 border-t border-sky-100">
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl font-bold"
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
                Keluar Admin
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile Top Header + Sheet Drawer (< lg) */}
      <header className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-sky-100/90 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-black text-sky-700">SIGAP</span>
          <span className="text-xs text-slate-500 font-semibold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
            Admin Panel
          </span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="outline" size="icon-sm" className="rounded-xl border-sky-200 text-sky-700" aria-label="Buka Menu Navigasi" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6">
            <SheetHeader className="text-left mb-6 border-b pb-4">
              <SheetTitle className="text-sky-700 font-black text-lg">SIGAP Admin</SheetTitle>
              <p className="text-xs text-slate-500">PT Kebon Agung PG Trangkil</p>
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
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl font-bold"
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
                    Keluar Admin
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
