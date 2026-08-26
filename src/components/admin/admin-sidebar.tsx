"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  FileText,
  History,
  Activity,
  Users,
  Settings,
  LogOut,
  Loader2,
  ShieldCheck,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Laporan", href: "/admin/laporan", icon: FileText },
  { label: "Riwayat Laporan", href: "/admin/riwayat", icon: History },
  { label: "Daftar Admin", href: "/admin/kelola-admin", icon: Users },
  { label: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
  { label: "Log Aktivitas", href: "/admin/log-aktivitas", icon: Activity },
];

interface NavLinksProps {
  onItemClick?: () => void;
  isCollapsed?: boolean;
}

export function AdminNavLinks({ onItemClick, isCollapsed = false }: NavLinksProps) {
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
            title={isCollapsed ? item.label : undefined}
            className={`flex items-center rounded-2xl text-xs sm:text-sm font-bold transition-colors ${
              isCollapsed
                ? "justify-center h-10 w-10 mx-auto"
                : "justify-between px-3.5 py-2.5"
            } ${
              isActive
                ? "bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-md shadow-sky-600/20"
                : "text-slate-600 hover:bg-sky-50/80 hover:text-sky-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-sky-600"}`} />
              {!isCollapsed && <span>{item.label}</span>}
            </div>

            {!isCollapsed && isLoadingThis && (
              <Loader2 className="h-4 w-4 animate-spin shrink-0 opacity-90" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  const handleNavigate = (href: string, e: React.MouseEvent) => {
    if (pathname === href) return;

    e.preventDefault();
    setLoadingHref(href);

    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <nav
      suppressHydrationWarning
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-sky-100/90 shadow-[0_-4px_25px_rgba(2,132,199,0.12)] px-2 py-1.5 flex items-center justify-around"
    >
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
            className={`relative flex flex-col items-center justify-center w-full py-1.5 px-1 rounded-2xl transition-all duration-200 ${
              isActive ? "text-sky-700 font-extrabold" : "text-slate-500 hover:text-sky-600 font-medium"
            }`}
          >
            {/* Active Indicator Top Glowing Pill */}
            {isActive && (
              <span className="absolute -top-1.5 h-1 w-7 bg-gradient-to-r from-sky-500 to-sky-700 rounded-full shadow-xs" />
            )}

            <div className={`p-1 rounded-xl transition-all ${isActive ? "bg-sky-100/80 text-sky-700 scale-110 shadow-xs" : ""}`}>
              {isLoadingThis ? (
                <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
              ) : (
                <Icon className={`h-5 w-5 ${isActive ? "text-sky-700 stroke-[2.5]" : "text-slate-500"}`} />
              )}
            </div>

            <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? "text-sky-800 font-black" : "text-slate-500 font-medium"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Restore collapsed state from localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem("sigap_admin_sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sigap_admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
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
      {/* Desktop Floating Non-Stick/Fixed Card Sidebar (lg+) */}
      <aside
        className={`hidden lg:flex flex-col border border-sky-100/90 bg-white/95 backdrop-blur-2xl p-3.5 space-y-4 shrink-0 fixed top-3 left-3 bottom-3 z-30 shadow-[0_10px_35px_rgba(2,132,199,0.08)] rounded-3xl transition-all duration-300 ease-in-out h-[calc(100vh-1.5rem)] ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Floating Expand/Collapse Button on Edge (Guaranteed Never Clipped) */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="absolute -right-3.5 top-6 z-50 h-7 w-7 rounded-full bg-white border border-sky-200/90 shadow-md text-sky-700 hover:text-sky-900 hover:bg-sky-50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          title={isCollapsed ? "Buka Sidebar (Expand)" : "Sembunyikan Sidebar (Collapse)"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Header & Logo */}
        <div className="border-b border-sky-100/80 pb-3">
          {!isCollapsed ? (
            <Link href="/admin/dashboard" className="block group pr-2">
              <div className="relative h-8 w-auto flex items-center mb-1">
                <Image
                  src="/assets/images/logo-pg-trangkil.png"
                  alt="Logo PT Kebon Agung PG Trangkil"
                  width={200}
                  height={40}
                  priority
                  className="h-6.5 w-auto object-contain drop-shadow-xs"
                />
              </div>
              <div className="inline-flex items-center gap-1.5 bg-sky-50/80 border border-sky-100 px-2 py-0.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
                </span>
                <span className="font-extrabold text-[10px] tracking-wide text-sky-800">
                  SIGAP Admin
                </span>
              </div>
            </Link>
          ) : (
            <Link href="/admin/dashboard" className="mx-auto block" title="SIGAP Admin Panel">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-600/30 mx-auto">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </Link>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2">
          <AdminNavLinks isCollapsed={isCollapsed} />
        </div>

        {/* Footer Info & Logout Button */}
        <div className="pt-4 border-t border-sky-100/80 space-y-3">
          {!isCollapsed ? (
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2 text-slate-500 text-[11px] font-medium">
              <Building className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span className="truncate">PT Kebon Agung PG Trangkil</span>
            </div>
          ) : (
            <div className="flex justify-center" title="PT Kebon Agung PG Trangkil">
              <Building className="h-4 w-4 text-slate-400" />
            </div>
          )}

          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Logout"
            className={`w-full bg-rose-50 hover:bg-rose-600 border border-rose-200/90 text-rose-700 hover:text-white rounded-2xl font-bold transition-all shadow-2xs hover:shadow-md cursor-pointer active:scale-[0.98] ${
              isCollapsed ? "justify-center p-0 h-11 w-11 mx-auto" : "justify-center px-3.5 h-11 text-xs"
            }`}
            size="sm"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <LogOut className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Logout</span>}
              </div>
            )}
          </Button>
        </div>
      </aside>

      {/* Layout Spacer for Flex Container so Main Content respects the fixed floating sidebar */}
      <div
        className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[92px]" : "w-[272px]"
        }`}
      />

      {/* Mobile Top Header (< lg) */}
      <header className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-sky-100/90 bg-white/95 backdrop-blur-xl sticky top-0 z-40 shadow-xs">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image
            src="/assets/images/logo-pg-trangkil.png"
            alt="Logo PT Kebon Agung PG Trangkil"
            width={180}
            height={38}
            className="h-7 w-auto object-contain"
          />
          <span className="font-black text-[11px] text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
            Admin
          </span>
        </Link>

        <Button
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-xl font-bold text-xs px-3.5 h-8 border border-rose-200/90 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors active:scale-95"
        >
          {isLoggingOut ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span>Logout</span>
            </>
          )}
        </Button>
      </header>

      {/* Mobile Bottom Navigation Bar (Shopee Style) */}
      <AdminBottomNav />
    </>
  );
}


