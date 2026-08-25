import React from "react";
import Link from "next/link";
import { Search, Wrench, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReportStatusBadge } from "@/components/user/report-status-badge";
import { LaporanItem } from "@/app/admin/(dashboard)/laporan/laporan-list-view";

export interface LaporanMobileViewProps {
  reports: LaporanItem[];
}

export function LaporanMobileView({ reports }: LaporanMobileViewProps) {
  return (
    <div className="space-y-3.5">
      {/* Mobile Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cari nomor tiket / pelapor..."
          className="pl-9 h-10 text-xs font-medium rounded-2xl border-sky-200/90 focus:border-sky-500 bg-white shadow-2xs"
        />
      </div>

      {/* Mobile Cards List */}
      <div className="space-y-3">
        {reports.map((report) => {
          const dateObj = new Date(report.created_at);
          const formattedDate = dateObj.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <Card
              key={report.id}
              className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <CardHeader className="p-3.5 pb-2.5 bg-slate-50/70 border-b border-sky-100/60 flex flex-row items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-black text-sky-700 block">
                    {report.ticket_number}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {formattedDate}
                  </span>
                </div>
                <ReportStatusBadge status={report.status} />
              </CardHeader>
              <CardContent className="p-3.5 space-y-2.5 text-xs">
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    {report.peralatan}
                  </span>
                  <p className="text-slate-500 text-[11px] font-medium mt-0.5 line-clamp-2">
                    {report.deskripsi}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <span className="font-bold text-slate-800 block truncate">
                      {report.nama_pelapor}
                    </span>
                    <span className="text-slate-400 font-medium truncate flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-sky-500 shrink-0" />
                      {report.unit_kerja}
                    </span>
                  </div>

                  <Link href={`/admin/laporan/${report.id}`} className="shrink-0">
                    <Button size="sm" className="h-8 px-3 rounded-full text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-2xs">
                      Detail <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
