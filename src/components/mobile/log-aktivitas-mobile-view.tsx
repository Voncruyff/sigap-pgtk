"use client";

import React, { useState } from "react";
import {
  Activity,
  Search,
  ShieldCheck,
  User,
  Crown,
  Wrench,
  Clock,
  Tag,
  Filter,
  FileCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogItem } from "@/app/admin/(dashboard)/log-aktivitas/log-aktivitas-view";
import { formatDateIndonesian } from "@/lib/date-utils";

export interface LogAktivitasMobileViewProps {
  logs: LogItem[];
}

export function LogAktivitasMobileView({ logs }: LogAktivitasMobileViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState<string>("ALL");

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.admin.toLowerCase().includes(q) ||
      log.aktivitas.toLowerCase().includes(q) ||
      log.target.toLowerCase().includes(q) ||
      log.deskripsi.toLowerCase().includes(q);

    const matchesFilter =
      activityFilter === "ALL" ||
      (activityFilter === "ADMIN" &&
        (log.aktivitas.includes("Admin") || log.aktivitas.includes("Ban") || log.aktivitas.includes("Unban"))) ||
      (activityFilter === "LAPORAN" &&
        (log.aktivitas.includes("Laporan") || log.aktivitas.includes("Perbaikan") || log.aktivitas.includes("Disposisi")));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-3.5 pb-8">
      {/* 🔍 Search & Filters Bar */}
      <div className="space-y-2">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari log / nama admin / tiket..."
            className="pl-9.5 h-10 text-xs font-medium rounded-xl border-slate-200 focus:border-sky-500 bg-white shadow-2xs"
          />
        </div>

        <div className="relative w-full">
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="w-full px-3 h-9 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs cursor-pointer"
            aria-label="Filter Jenis Aktivitas"
          >
            <option value="ALL">Semua Jenis Aktivitas</option>
            <option value="LAPORAN">📋 Penanganan Laporan &amp; Perbaikan</option>
            <option value="ADMIN">👥 Manajemen &amp; Keamanan Akun Admin</option>
          </select>
        </div>
      </div>

      {/* 📜 Mobile Timeline Activity Cards */}
      {filteredLogs.length === 0 ? (
        <Card className="border border-dashed border-slate-200 bg-white/80 rounded-2xl p-6 text-center shadow-2xs">
          <p className="text-xs text-slate-400 italic font-medium">
            Tidak ada catatan log aktivitas yang cocok dengan pencarian.
          </p>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredLogs.map((log) => {
            const dateObj = new Date(log.waktu);
            const formattedDate = dateObj.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const formattedTime = dateObj.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const isSuper = log.role === "SUPER_ADMIN";
            const isBanOrDelete =
              log.aktivitas.includes("Ban") || log.aktivitas.includes("Hapus");
            const isReportResolve = log.aktivitas.includes("Selesai") || log.aktivitas.includes("Penyelesaian");

            return (
              <Card
                key={log.id}
                className="border border-slate-200/80 bg-white rounded-2xl shadow-2xs hover:border-sky-300 transition-all overflow-hidden"
              >
                <CardContent className="p-3.5 space-y-2.5">
                  {/* Top Row: Activity Badge & Timestamp */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                        isBanOrDelete
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : isReportResolve
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-purple-50 text-purple-800 border-purple-200"
                      }`}
                    >
                      <Activity className="h-3 w-3" />
                      {log.aktivitas}
                    </span>

                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      {formattedDate}, {formattedTime}
                    </span>
                  </div>

                  {/* Target & Description */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-400 font-medium">Target:</span>
                      <span className="font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100 font-bold text-[11px]">
                        {log.target}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                      {log.deskripsi}
                    </p>
                  </div>

                  {/* Footer Row: Admin Info */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="h-5 w-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {log.admin.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-800 truncate">{log.admin}</span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold shrink-0 ${
                        isSuper ? "text-purple-700" : "text-sky-700"
                      }`}
                    >
                      {isSuper ? <Crown className="h-3 w-3" /> : <Wrench className="h-3 w-3" />}
                      {isSuper ? "Super Admin" : "Admin Teknis"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
