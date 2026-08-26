"use client";

import React, { useState } from "react";
import { Search, Wrench, MapPin, Calendar, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompletedReportItem } from "@/app/admin/(dashboard)/riwayat/riwayat-view";
import { ExportDialog } from "@/components/admin/export-dialog";

export interface RiwayatMobileViewProps {
  completedReports: CompletedReportItem[];
  onSelectReport?: (report: CompletedReportItem) => void;
}

export function RiwayatMobileView({ completedReports, onSelectReport }: RiwayatMobileViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBagian, setSelectedBagian] = useState<string>("SEMUA");

  const filteredReports = completedReports.filter((report) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      report.ticket_number.toLowerCase().includes(q) ||
      report.nama_pelapor.toLowerCase().includes(q) ||
      report.unit_kerja.toLowerCase().includes(q) ||
      report.lokasi_kerusakan.toLowerCase().includes(q) ||
      report.bagian.toLowerCase().includes(q);

    const matchBagian =
      selectedBagian === "SEMUA" || report.bagian.toUpperCase() === selectedBagian.toUpperCase();

    return matchSearch && matchBagian;
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
            placeholder="Cari tiket / pelapor / unit..."
            className="pl-9.5 h-10 text-xs font-medium rounded-xl border-slate-200 focus:border-sky-500 bg-white shadow-2xs"
          />
        </div>
        <ExportDialog completedReports={completedReports} />
      </div>

      {/* Mobile Department Filter Scroll Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {["SEMUA", "Teknik", "Pabrikasi", "Tanaman", "TUK"].map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setSelectedBagian(b)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              selectedBagian === b
                ? "bg-sky-700 text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Mobile Cards List */}
      {filteredReports.length === 0 ? (
        <Card className="border border-dashed border-slate-200 bg-white/80 rounded-2xl p-6 text-center shadow-2xs">
          <p className="text-xs text-slate-400 italic font-medium">
            Tidak ada catatan kerusakan yang cocok dengan pencarian / filter.
          </p>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredReports.map((report) => {
            const dateObj = new Date(report.created_at);
            const formattedDate = dateObj.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <Card
                key={report.id}
                className="border border-slate-200/80 bg-white rounded-2xl shadow-2xs hover:border-sky-300 transition-all overflow-hidden"
              >
                <CardHeader className="p-3 pb-2 bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-black text-sky-700 block">
                      {report.ticket_number}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      Lapor: {formattedDate}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-bold text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                    Bagian {report.bagian}
                  </span>
                </CardHeader>
                <CardContent className="p-3.5 space-y-2 text-xs">
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                      {report.unit_kerja}
                    </span>
                    {report.deskripsi && (
                      <p className="text-[11px] text-slate-600 font-medium mt-1 line-clamp-2 leading-relaxed">
                        {report.deskripsi}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <span className="font-bold text-slate-800 block truncate">
                        {report.nama_pelapor}
                      </span>
                      <span className="text-slate-400 font-medium truncate flex items-center gap-1 text-[10px]">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        {report.unit_kerja}
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectReport && onSelectReport(report)}
                      className="h-7 text-[11px] px-3 rounded-xl border-sky-200 text-sky-700 hover:bg-sky-50 font-bold shadow-2xs cursor-pointer shrink-0"
                      title="Lihat Detail Laporan"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Detail
                    </Button>
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
