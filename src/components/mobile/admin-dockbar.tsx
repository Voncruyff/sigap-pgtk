"use client";

import React, { useTransition, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  History,
  Users,
  Settings,
  Loader2,
} from "lucide-react";

export const ADMIN_DOCKBAR_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Laporan", href: "/admin/laporan", icon: FileText },
  { label: "Riwayat", href: "/admin/riwayat", icon: History },
  { label: "Admin", href: "/admin/kelola-admin", icon: Users },
  { label: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
];

export function AdminDockbar() {
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
      aria-label="Admin Mobile Navigation Dockbar"
      className="lg:hidden fixed bottom-3 inset-x-3 max-w-md mx-auto z-50 bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_10px_35px_rgba(2,132,199,0.18)] rounded-3xl p-1 flex items-center justify-around pointer-events-auto"
    >
      {ADMIN_DOCKBAR_ITEMS.map((item) => {
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
            className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 rounded-2xl transition-all duration-200 active:scale-95 ${
              isActive
                ? "text-sky-700 font-extrabold"
                : "text-slate-500 hover:text-sky-700 font-medium"
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-sky-100/90 text-sky-700 shadow-2xs scale-105"
                  : "hover:bg-slate-100/60"
              }`}
            >
              {isLoadingThis ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin text-sky-600" />
              ) : (
                <Icon
                  className={`h-4.5 w-4.5 ${
                    isActive ? "text-sky-700 stroke-[2.5]" : "text-slate-500"
                  }`}
                />
              )}
            </div>

            <span
              className={`text-[9.5px] tracking-tight mt-0.5 leading-none ${
                isActive ? "text-sky-900 font-black" : "text-slate-500 font-medium"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
