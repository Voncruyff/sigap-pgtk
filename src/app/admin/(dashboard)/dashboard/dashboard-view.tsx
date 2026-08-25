import React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportStatusBadge } from "@/components/user/report-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardMobileView } from "@/components/mobile/dashboard-mobile-view";

export interface DashboardReportItem {
  id: string;
  ticket_number: string;
  nama_pelapor: string;
  unit_kerja: string;
  peralatan: string;
  status: string;
  created_at: string;
}

export interface DashboardViewProps {
  totalCount: number;
  waitingCount: number;
  processingCount: number;
  completedCount: number;
  recentReports: DashboardReportItem[];
}

export function DashboardView(props: DashboardViewProps) {
  const { totalCount, waitingCount, processingCount, completedCount, recentReports } = props;

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-sky-100/80 pb-4 sm:pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100/60 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-sky-200/50 mb-1.5">
            SIGAP System Summary
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900">
            Dashboard Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 sm:mt-1">
            Ringkasan data gangguan & penanganan fasilitas PT Kebon Agung PG Trangkil.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/admin/laporan">
            <Button size="sm" className="rounded-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-bold text-xs shadow-md shadow-sky-600/20 active:scale-[0.98]">
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Kelola Laporan
            </Button>
          </Link>
        </div>
      </div>

      {/* 🖥️ Tampilan Utama Desktop / PC */}
      <div className="hidden lg:block space-y-6">
        {/* Stat Cards 4 Columns */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-sky-100/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Laporan
              </CardTitle>
              <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100/80 shadow-xs">
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-black text-slate-900">{totalCount}</div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-bold">Terverifikasi</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border border-amber-100/90 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-amber-100/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Menunggu
              </CardTitle>
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100/80 shadow-xs">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-black text-amber-600">{waitingCount}</div>
              <p className="text-xs text-slate-500 mt-1 font-medium">Perlu disposisi</p>
            </CardContent>
          </Card>

          <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-sky-100/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Dipproses
              </CardTitle>
              <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100/80 shadow-xs">
                <Wrench className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-black text-sky-600">{processingCount}</div>
              <p className="text-xs text-slate-500 mt-1 font-medium">Dalam perbaikan</p>
            </CardContent>
          </Card>

          <Card className="border border-emerald-100/90 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-emerald-100/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Selesai
              </CardTitle>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 shadow-xs">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-black text-emerald-600">{completedCount}</div>
              <p className="text-xs text-slate-500 mt-1 font-medium">Perbaikan tuntas</p>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Table Laporan Terbaru */}
        <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-sky-100/50 overflow-hidden w-full">
          <CardHeader className="flex flex-row items-center justify-between p-5 pb-3 border-b border-sky-100/80 bg-slate-50/50">
            <div>
              <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-600" />
                Laporan Kerusakan Terbaru
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 font-medium">
                Daftar laporan masuk yang membutuhkan respon admin
              </CardDescription>
            </div>
            <Link href="/admin/laporan">
              <Button variant="ghost" size="sm" className="text-xs text-sky-700 font-bold hover:bg-sky-50 rounded-full px-3 h-8">
                Lihat Semua <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b border-sky-100/80">
                    <TableHead className="w-[140px] font-bold text-slate-700 text-xs py-2.5">Nomor Tiket</TableHead>
                    <TableHead className="font-bold text-slate-700 text-xs py-2.5">Pelapor & Unit</TableHead>
                    <TableHead className="font-bold text-slate-700 text-xs py-2.5">Peralatan</TableHead>
                    <TableHead className="w-[120px] font-bold text-slate-700 text-xs py-2.5">Status</TableHead>
                    <TableHead className="text-right w-[80px] font-bold text-slate-700 text-xs py-2.5">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-sky-50/40 transition-colors">
                      <TableCell className="font-mono text-xs font-bold text-sky-700 py-3">
                        {report.ticket_number}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="font-bold text-xs text-slate-800">
                          {report.nama_pelapor}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate max-w-[180px]">
                          {report.unit_kerja}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-700 py-3">
                        {report.peralatan}
                      </TableCell>
                      <TableCell className="py-3">
                        <ReportStatusBadge status={report.status} />
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <Link href={`/admin/laporan/${report.id}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs px-3 rounded-full border-sky-200 text-sky-700 hover:bg-sky-50 font-bold">
                            Detail
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 📱 Tampilan Khusus Mobile HP (Disimpan di Folder src/components/mobile/) */}
      <div className="block lg:hidden">
        <DashboardMobileView {...props} />
      </div>
    </div>
  );
}
