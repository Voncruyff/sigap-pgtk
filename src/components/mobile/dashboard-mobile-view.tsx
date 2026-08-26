import React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportStatusBadge } from "@/components/user/report-status-badge";

export interface DashboardReportItem {
  id: string;
  ticket_number: string;
  nama_pelapor: string;
  unit_kerja: string;
  peralatan?: string;
  status: string;
  created_at: string;
}

export interface DashboardMobileViewProps {
  totalCount: number;
  waitingCount: number;
  processingCount: number;
  completedCount: number;
  recentReports: DashboardReportItem[];
}

export function DashboardMobileView({
  totalCount,
  waitingCount,
  processingCount,
  completedCount,
  recentReports,
}: DashboardMobileViewProps) {
  return (
    <div className="space-y-4">
      {/* Stat Cards 2 Columns Grid for Mobile */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Total */}
        <div className="bg-white/95 border border-sky-100 p-3 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
            <span>Total</span>
            <FileText className="h-3.5 w-3.5 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
          <span className="text-[10px] text-emerald-600 font-bold">Terverifikasi</span>
        </div>

        {/* Menunggu */}
        <div className="bg-white/95 border border-amber-100 p-3 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
            <span>Menunggu</span>
            <Clock className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">{waitingCount}</div>
          <span className="text-[10px] text-slate-400 font-medium">Perlu disposisi</span>
        </div>

        {/* Diproses */}
        <div className="bg-white/95 border border-sky-100 p-3 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
            <span>Diproses</span>
            <Wrench className="h-3.5 w-3.5 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-600 mt-1">{processingCount}</div>
          <span className="text-[10px] text-slate-400 font-medium">Dalam perbaikan</span>
        </div>

        {/* Selesai */}
        <div className="bg-white/95 border border-emerald-100 p-3 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
            <span>Selesai</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</div>
          <span className="text-[10px] text-slate-400 font-medium">Perbaikan tuntas</span>
        </div>
      </div>

      {/* Mobile Recent Reports Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Laporan Masuk Terbaru
          </h2>
          <Link href="/admin/laporan" className="text-xs font-bold text-sky-700 flex items-center gap-1">
            Lihat Semua <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentReports.map((report) => (
          <Card key={report.id} className="border border-sky-100/90 bg-white/95 rounded-2xl p-3 shadow-2xs">
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-700">
                  {report.ticket_number}
                </span>
                <ReportStatusBadge status={report.status} />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block truncate">
                  {report.nama_pelapor}
                </span>
                <span className="text-[11px] text-slate-500 font-medium truncate block">
                  {report.unit_kerja}
                </span>
              </div>
              <div className="pt-1 flex justify-end">
                <Link href={`/admin/laporan/${report.id}`}>
                  <Button variant="outline" size="sm" className="h-7 text-[11px] px-3 rounded-full border-sky-200 text-sky-700 font-bold">
                    Detail
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
