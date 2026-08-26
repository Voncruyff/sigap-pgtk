"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Wrench, MapPin, Calendar, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReportStatusBadge } from "@/components/user/report-status-badge";
import { CompletedReportItem } from "@/app/admin/(dashboard)/riwayat/riwayat-view";
import { ExportDialog } from "@/components/admin/export-dialog";

export interface RiwayatMobileViewProps {
  completedReports: CompletedReportItem[];
}

export function RiwayatMobileView({ completedReports }: RiwayatMobileViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = completedReports.filter((report) => {
    const q = searchQuery.toLowerCase();
    return (
      report.ticket_number.toLowerCase().includes(q) ||
      report.nama_pelapor.toLowerCase().includes(q) ||
      report.unit_kerja.toLowerCase().includes(q) ||
      report.lokasi_kerusakan.toLowerCase().includes(q) ||
      (report.penanganan && report.penanganan.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-3.5 pb-8">
      {/* Mobile Search & Export Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari arsip tiket / pelapor / tindakan..."
            className="pl-9.5 h-10 text-xs font-medium rounded-xl border-slate-200 focus:border-sky-500 bg-white shadow-2xs"
          />
        </div>
        <ExportDialog completedReports={completedReports} />
      </div>

      {/* Mobile Cards List */}
      {filteredReports.length === 0 ? (
        <Card className="border border-dashed border-slate-200 bg-white/80 rounded-2xl p-6 text-center shadow-2xs">
          <p className="text-xs text-slate-400 italic font-medium">
            Tidak ada riwayat laporan yang cocok dengan pencarian.
          </p>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredReports.map((report) => {
            const dateObj = new Date(report.updated_at || report.created_at);
            const formattedDate = dateObj.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <Card
                key={report.id}
                className="border border-slate-200/80 bg-white rounded-2xl shadow-2xs hover:border-emerald-300 transition-all overflow-hidden"
              >
                <CardHeader className="p-3 pb-2 bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-black text-sky-700 block">
                      {report.ticket_number}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      Selesai: {formattedDate}
                    </span>
                  </div>
                  <ReportStatusBadge status={report.status} />
                </CardHeader>
                <CardContent className="p-3.5 space-y-2.5 text-xs">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-sky-700 shrink-0" />
                      {report.unit_kerja}
                    </span>
                    {report.lokasi_kerusakan && (
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                        Lokasi: {report.lokasi_kerusakan}
                      </p>
                    )}
                  </div>

                  {report.deskripsi && (
                    <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[11px] text-slate-700 font-medium line-clamp-2 leading-relaxed">
                      <span className="font-bold text-slate-800 block text-[10px] uppercase tracking-wide mb-0.5">
                        Deskripsi Kerusakan:
                      </span>
                      {report.deskripsi}
                    </div>
                  )}

                  {report.penanganan && (
                    <div className="bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-xl text-[11px] text-emerald-950 font-medium line-clamp-2 leading-relaxed">
                      <span className="font-bold text-emerald-800 block text-[10px] uppercase tracking-wide mb-0.5">
                        Tindakan Penanganan:
                      </span>
                      {report.penanganan}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <span className="font-bold text-slate-800 block truncate">
                        {report.nama_pelapor}
                      </span>
                      <span className="text-slate-400 font-medium truncate flex items-center gap-1 text-[10px]">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        {report.bagian} &bull; {report.unit_kerja}
                      </span>
                    </div>

                    <Link href={`/admin/laporan/${report.id}`} className="shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] px-2.5 rounded-full border-sky-200 text-sky-700 hover:bg-sky-50 font-bold shadow-2xs cursor-pointer"
                        title="Lihat Detail Laporan"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Detail
                      </Button>
                    </Link>
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
