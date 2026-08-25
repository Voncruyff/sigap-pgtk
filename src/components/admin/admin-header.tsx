"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, ShieldCheck, Clock } from "lucide-react";

export function AdminHeader() {
  const pathname = usePathname();

  // Determine active page title for header dynamically
  let pageTitle = "Dashboard Overview";
  if (pathname.includes("/admin/laporan/")) pageTitle = "Detail Laporan Kerusakan";
  else if (pathname.startsWith("/admin/laporan")) pageTitle = "Daftar Laporan Kerusakan";
  else if (pathname.startsWith("/admin/riwayat")) pageTitle = "Riwayat & Arsip Laporan";
  else if (pathname.startsWith("/admin/log-aktivitas")) pageTitle = "Log Aktivitas Petugas";

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="hidden lg:flex items-center justify-between h-16 px-6 lg:px-8 border-b border-sky-100/90 bg-white/85 backdrop-blur-xl sticky top-0 z-20 shadow-2xs shrink-0 w-full">
      {/* Left: Active Page Title & Company Tag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100/80 shadow-xs">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-none">
              {pageTitle}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-1">
              <span>PT Kebon Agung PG Trangkil</span>
              <span>&bull;</span>
              <span className="text-sky-700 font-semibold">SIGAP Panel Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Date, Status Badge, & Quick Actions */}
      <div className="flex items-center gap-3.5">
        {/* Date Display */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50/80 px-3 py-1.5 rounded-full border border-slate-200/60">
          <Clock className="h-3.5 w-3.5 text-sky-600" />
          <span suppressHydrationWarning>{currentDate}</span>
        </div>

        {/* System Online Status Pill */}
        <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/80 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem SIGAP Online</span>
        </div>

        {/* View Public Portal Button */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-sky-700 bg-white hover:bg-sky-50 px-3.5 py-1.5 rounded-full border border-slate-200/80 hover:border-sky-300 transition-all shadow-2xs"
          title="Buka Halaman Utama Publik SIGAP"
        >
          <span>Lihat Web User</span>
          <ExternalLink className="h-3.5 w-3.5 text-sky-600" />
        </Link>
      </div>
    </header>
  );
}
