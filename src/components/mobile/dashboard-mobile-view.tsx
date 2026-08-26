import React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportStatusBadge } from "@/components/user/report-status-badge";
import { DashboardReportItem, DashboardLogItem } from "@/app/admin/(dashboard)/dashboard/dashboard-view";

export interface DashboardMobileViewProps {
  totalCount: number;
  waitingCount: number;
  processingCount: number;
  completedCount: number;
  totalAdminCount: number;
  recentReports: DashboardReportItem[];
  recentLogs: DashboardLogItem[];
}

export function DashboardMobileView({
  totalCount,
  waitingCount,
  processingCount,
  completedCount,
  totalAdminCount,
  recentReports,
  recentLogs,
}: DashboardMobileViewProps) {
  const stats = [
    {
      title: "Total",
      value: totalCount,
      subtext: "Terverifikasi",
      icon: FileText,
      iconBg: "bg-sky-50 text-sky-600 border-sky-100",
      valueColor: "text-slate-900",
    },
    {
      title: "Menunggu",
      value: waitingCount,
      subtext: "Disposisi",
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      valueColor: "text-amber-600",
    },
    {
      title: "Diproses",
      value: processingCount,
      subtext: "Perbaikan",
      icon: Wrench,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      valueColor: "text-blue-600",
    },
    {
      title: "Selesai",
      value: completedCount,
      subtext: "Tuntas",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      valueColor: "text-emerald-600",
    },
    {
      title: "Akun Admin",
      value: totalAdminCount,
      subtext: "Petugas",
      icon: Users,
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
      valueColor: "text-purple-700",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stat Cards 2 Columns Grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const isLastSingle = idx === stats.length - 1 && stats.length % 2 !== 0;

          return (
            <div
              key={idx}
              className={`bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs space-y-1 ${
                isLastSingle ? "col-span-2 flex items-center justify-between space-y-0" : ""
              }`}
            >
              <div className={isLastSingle ? "flex items-center gap-3" : ""}>
                <div className={`p-1.5 rounded-lg border ${stat.iconBg} inline-block`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {stat.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {stat.subtext}
                  </span>
                </div>
              </div>
              <div className={`text-xl font-black ${stat.valueColor}`}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Recent Reports List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Laporan Terbaru
            </h2>
          </div>
          <Link href="/admin/laporan" className="text-xs font-bold text-sky-700 flex items-center gap-0.5">
            Semua <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentReports.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center text-xs text-slate-400">
            Belum ada laporan masuk
          </div>
        ) : (
          recentReports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-700">
                  {report.ticket_number}
                </span>
                <ReportStatusBadge status={report.status} />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-800 block truncate">
                  {report.nama_pelapor}
                </span>
                <span className="text-[11px] text-slate-500 font-medium truncate block">
                  {report.unit_kerja}
                </span>
              </div>
              <div className="pt-1 flex justify-end">
                <Link href={`/admin/laporan/${report.id}`}>
                  <Button variant="outline" size="sm" className="h-7 text-[11px] px-3 rounded-lg border-slate-200 text-slate-700 font-bold">
                    Detail
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile Card: Log Activity Feed */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-purple-600" />
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Log Aktivitas
            </h3>
          </div>
          <Link href="/admin/log-aktivitas" className="text-xs font-bold text-purple-700 flex items-center gap-0.5">
            Semua <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100/80">
          {recentLogs.length === 0 ? (
            <div className="py-3 text-center text-xs text-slate-400">
              Belum ada log aktivitas
            </div>
          ) : (
            recentLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="py-2 first:pt-0 last:pb-0 space-y-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800 truncate">{log.admin}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.waktu).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-snug line-clamp-2">
                  {log.deskripsi || log.aktivitas}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
