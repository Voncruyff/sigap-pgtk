import React from "react";
import Link from "next/link";
import { History, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReportStatusBadge } from "@/components/user/report-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiwayatMobileView } from "@/components/mobile/riwayat-mobile-view";

export interface CompletedReportItem {
  id: string;
  ticket_number: string;
  nama_pelapor: string;
  bagian: string;
  unit_kerja: string;
  lokasi_kerusakan: string;
  peralatan: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface RiwayatViewProps {
  completedReports: CompletedReportItem[];
}

export function RiwayatView({ completedReports }: RiwayatViewProps) {
  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="border-b border-sky-100/80 pb-4 sm:pb-5">
        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-emerald-200/60 mb-1.5">
          SIGAP Archive & History
        </div>
        <h1 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900">
          Riwayat & Arsip Laporan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 sm:mt-1">
          Daftar seluruh laporan gangguan fasilitas yang telah selesai ditangani oleh tim teknisi.
        </p>
      </div>

      {/* 🖥️ Tampilan Utama Desktop / PC */}
      <div className="hidden lg:block">
        <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-sky-100/50 overflow-hidden">
          <CardHeader className="p-5 pb-4 border-b border-sky-100/80 bg-slate-50/50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <History className="h-4 w-4 text-emerald-600" />
                  Arsip Laporan Selesai
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">
                  Total {completedReports.length} laporan tuntas tersimpan
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Cari riwayat tiket / pelapor..."
                    className="pl-8 h-9 text-xs font-medium rounded-xl border-sky-200/80 focus:border-sky-500 focus:ring-sky-500/20 bg-white/80"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b border-sky-100/80">
                    <TableHead className="w-[150px] font-bold text-slate-700 text-xs">Nomor Tiket</TableHead>
                    <TableHead className="w-[140px] font-bold text-slate-700 text-xs">Waktu Selesai</TableHead>
                    <TableHead className="font-bold text-slate-700 text-xs">Pelapor & Unit Kerja</TableHead>
                    <TableHead className="font-bold text-slate-700 text-xs">Peralatan</TableHead>
                    <TableHead className="font-bold text-slate-700 text-xs">Lokasi</TableHead>
                    <TableHead className="w-[120px] font-bold text-slate-700 text-xs">Status</TableHead>
                    <TableHead className="text-right w-[100px] font-bold text-slate-700 text-xs">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedReports.map((report) => {
                    const dateObj = new Date(report.updated_at || report.created_at);
                    const formattedDate = dateObj.toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                    const formattedTime = dateObj.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <TableRow key={report.id} className="hover:bg-emerald-50/30 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-sky-700">
                          {report.ticket_number}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 font-medium">
                          <div className="font-semibold text-slate-800">{formattedDate}</div>
                          <div className="text-[11px] text-slate-400">{formattedTime} WIB</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-xs text-slate-800">
                            {report.nama_pelapor}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {report.bagian} &bull; {report.unit_kerja}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-800">
                          {report.peralatan}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 font-medium">
                          {report.lokasi_kerusakan}
                        </TableCell>
                        <TableCell>
                          <ReportStatusBadge status={report.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/laporan/${report.id}`}>
                            <Button variant="outline" size="sm" className="h-7 text-xs px-3.5 rounded-full border-sky-200 text-sky-700 hover:bg-sky-50 font-bold shadow-2xs">
                              Detail
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 📱 Tampilan Khusus Mobile HP (Disimpan di Folder src/components/mobile/) */}
      <div className="block lg:hidden">
        <RiwayatMobileView completedReports={completedReports} />
      </div>
    </div>
  );
}
