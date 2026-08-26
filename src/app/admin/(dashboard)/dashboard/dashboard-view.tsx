import React from "react";
import Link from "next/link";
import {
  FileText,
  Wrench,
  Building,
  Sprout,
  Briefcase,
  ArrowUpRight,
  Sparkles,
  Users,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard, type StatColorScheme } from "@/components/admin/stat-card";
import { DashboardMobileView } from "@/components/mobile/dashboard-mobile-view";

export interface DashboardReportItem {
  id: string;
  ticket_number: string;
  nama_pelapor: string;
  bagian: string;
  unit_kerja: string;
  deskripsi: string;
  created_at: string;
}

export interface DashboardLogItem {
  id: string;
  waktu: string;
  admin: string;
  role: string;
  aktivitas: string;
  target: string;
  deskripsi: string;
}

export interface DashboardViewProps {
  totalCount: number;
  teknikCount: number;
  pabrikasiCount: number;
  tanamanCount: number;
  tukCount: number;
  totalAdminCount: number;
  recentReports: DashboardReportItem[];
  recentLogs: DashboardLogItem[];
}

export function DashboardView(props: DashboardViewProps) {
  const {
    totalCount,
    teknikCount,
    pabrikasiCount,
    tanamanCount,
    tukCount,
    totalAdminCount,
    recentReports,
    recentLogs,
  } = props;

  const stats: Array<{
    title: string;
    value: number;
    subtext: string;
    icon: any;
    colorScheme: StatColorScheme;
  }> = [
    {
      title: "Total Laporan",
      value: totalCount,
      subtext: "Catatan Kerusakan",
      icon: FileText,
      colorScheme: "sky",
    },
    {
      title: "Bagian Teknik",
      value: teknikCount,
      subtext: "Fasilitas & Mesin",
      icon: Wrench,
      colorScheme: "blue",
    },
    {
      title: "Bagian Pabrikasi",
      value: pabrikasiCount,
      subtext: "Pengolahan & Pabrik",
      icon: Building,
      colorScheme: "amber",
    },
    {
      title: "Bagian Tanaman",
      value: tanamanCount,
      subtext: "Bahan Baku Tebu",
      icon: Sprout,
      colorScheme: "emerald",
    },
    {
      title: "Bagian TUK",
      value: tukCount,
      subtext: "Tata Usaha & Umum",
      icon: Briefcase,
      colorScheme: "indigo",
    },
    {
      title: "Petugas Admin",
      value: totalAdminCount,
      subtext: "Akun Terdaftar",
      icon: Users,
      colorScheme: "purple",
    },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header Halaman Minimalis */}
      <PageHeader
        title="Dashboard Overview"
        description="Ringkasan catatan kerusakan fasilitas & aktivitas petugas PT Kebon Agung PG Trangkil."
        badgeText="SIGAP Summary"
      />

      {/* 🖥️ Tampilan Utama Desktop / PC */}
      <div className="hidden lg:block space-y-5">
        {/* Sleek Minimalist Stat Cards 6 Columns Grid */}
        <div className="grid grid-cols-6 gap-3.5">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              description={stat.subtext}
              icon={stat.icon}
              colorScheme={stat.colorScheme}
            />
          ))}
        </div>

        {/* Layout Grid 12 Kolom Simetris: Left Table Laporan (8 cols), Right Log Activity Feed (4 cols) */}
        <div className="grid grid-cols-12 gap-5 items-stretch">
          {/* LEFT: Desktop Table Laporan Terbaru (8 Kolom) */}
          <div className="col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Laporan Kerusakan Terbaru
                </h3>
              </div>
              <Link href="/admin/riwayat">
                <Button variant="ghost" size="sm" className="text-xs text-sky-700 font-bold hover:bg-sky-50 rounded-xl px-2.5 h-7 gap-1 cursor-pointer">
                  Buka Riwayat <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto flex-1">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70 border-b border-slate-100 hover:bg-slate-50/70">
                    <TableHead className="w-[140px] font-bold text-slate-600 text-xs py-3 pl-5">Nomor Tiket</TableHead>
                    <TableHead className="font-bold text-slate-600 text-xs py-3">Pelapor & Bagian</TableHead>
                    <TableHead className="font-bold text-slate-600 text-xs py-3">Unit Kerja</TableHead>
                    <TableHead className="text-right w-[90px] font-bold text-slate-600 text-xs py-3 pr-5">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-xs text-slate-400 font-medium">
                        Belum ada catatan kerusakan masuk
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-sky-50/30 transition-colors border-b border-slate-100/80">
                        <TableCell className="font-mono text-xs font-bold text-sky-700 py-3 pl-5">
                          {report.ticket_number}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="font-bold text-xs text-slate-800 truncate">
                            {report.nama_pelapor}
                          </div>
                          <span className="inline-flex items-center gap-1 font-semibold text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 mt-0.5">
                            Bagian {report.bagian}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-slate-600 font-medium truncate max-w-[220px]">
                          {report.unit_kerja}
                        </TableCell>
                        <TableCell className="text-right py-3 pr-5">
                          <Link href="/admin/riwayat">
                            <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 rounded-lg border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 font-bold shadow-2xs cursor-pointer">
                              Lihat
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* RIGHT: Log Aktivitas Feed (4 Kolom) */}
          <div className="col-span-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Log Aktivitas
                </h3>
              </div>
              <Link href="/admin/log-aktivitas">
                <Button variant="ghost" size="sm" className="text-xs text-purple-700 font-bold hover:bg-purple-50 rounded-xl px-2.5 h-7 gap-1 cursor-pointer">
                  Semua <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="p-3 divide-y divide-slate-100/80 flex-1 overflow-y-auto">
              {recentLogs.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400 font-medium">
                  Belum ada catatan log aktivitas
                </div>
              ) : (
                recentLogs.map((log) => {
                  const dateObj = new Date(log.waktu);
                  const timeStr = dateObj.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div key={log.id} className="p-2.5 hover:bg-slate-50/70 rounded-xl transition-colors space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-xs text-slate-900 truncate">
                          {log.admin}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {timeStr} WIB
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium truncate" title={log.deskripsi || log.aktivitas}>
                        {log.deskripsi || log.aktivitas}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 📱 Tampilan Khusus Mobile HP */}
      <div className="block lg:hidden">
        <DashboardMobileView {...props} />
      </div>
    </div>
  );
}
