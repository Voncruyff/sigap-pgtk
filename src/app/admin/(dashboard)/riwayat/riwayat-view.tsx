"use client";

import React, { useState } from "react";
import Link from "next/link";
import { History, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
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
import { ExportDialog } from "@/components/admin/export-dialog";

export interface CompletedReportItem {
  id: string;
  ticket_number: string;
  nama_pelapor: string;
  bagian: string;
  unit_kerja: string;
  lokasi_kerusakan: string;
  peralatan?: string;
  deskripsi?: string;
  penanganan?: string | null;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface RiwayatViewProps {
  completedReports: CompletedReportItem[];
}

type SortField = "ticket_number" | "updated_at" | "nama_pelapor" | "lokasi_kerusakan";
type SortOrder = "asc" | "desc";

export function RiwayatView({ completedReports }: RiwayatViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "updated_at" ? "desc" : "asc");
    }
  };

  const filteredReports = completedReports.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.ticket_number.toLowerCase().includes(q) ||
      item.nama_pelapor.toLowerCase().includes(q) ||
      item.lokasi_kerusakan.toLowerCase().includes(q) ||
      item.unit_kerja.toLowerCase().includes(q) ||
      item.bagian.toLowerCase().includes(q) ||
      (item.penanganan && item.penanganan.toLowerCase().includes(q))
    );
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    let comparison = 0;
    if (sortField === "updated_at") {
      const dateA = new Date(a.updated_at || a.created_at).getTime();
      const dateB = new Date(b.updated_at || b.created_at).getTime();
      comparison = dateA - dateB;
    } else if (sortField === "ticket_number") {
      comparison = a.ticket_number.localeCompare(b.ticket_number, "id-ID");
    } else if (sortField === "nama_pelapor") {
      comparison = a.nama_pelapor.localeCompare(b.nama_pelapor, "id-ID");
    } else if (sortField === "lokasi_kerusakan") {
      comparison = a.lokasi_kerusakan.localeCompare(b.lokasi_kerusakan, "id-ID");
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const renderSortIndicator = (field: SortField) => {
    const isActive = sortField === field;
    if (!isActive) {
      return (
        <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
      );
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-emerald-600 shrink-0 stroke-[2.5]" />
    ) : (
      <ArrowDown className="h-3 w-3 text-emerald-600 shrink-0 stroke-[2.5]" />
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Header Halaman Dynamic */}
      <PageHeader
        title="Riwayat & Arsip Laporan"
        description="Daftar seluruh laporan gangguan fasilitas yang telah selesai ditangani beserta rincian tindakan perbaikan."
        badgeText="SIGAP Archive & History"
        badgeColor="emerald"
      />

      {/* 🖥️ Tampilan Utama Desktop / PC */}
      <div className="hidden lg:block">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <History className="h-4 w-4 text-emerald-600" />
                  Arsip Laporan Selesai
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">
                  Menampilkan {sortedReports.length} dari total {completedReports.length} laporan tuntas
                </CardDescription>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari tiket / pelapor / tindakan..."
                    className="pl-8.5 h-9 text-xs font-medium rounded-xl border-slate-200 focus:border-sky-500 focus:ring-sky-500/20 bg-white"
                  />
                </div>
                <ExportDialog completedReports={completedReports} />
              </div>
            </div>
          </div>
          <div className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/90 border-b border-sky-100/80 select-none">
                    <TableHead className="w-[145px] pl-5 pr-3 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleSort("ticket_number")}
                        className="inline-flex items-center gap-1.5 font-extrabold text-slate-700 text-xs hover:text-emerald-700 transition-colors group cursor-pointer"
                        title="Urutkan berdasarkan Nomor Tiket"
                      >
                        <span>Nomor Tiket</span>
                        {renderSortIndicator("ticket_number")}
                      </button>
                    </TableHead>
                    <TableHead className="w-[130px] px-3 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleSort("updated_at")}
                        className="inline-flex items-center gap-1.5 font-extrabold text-slate-700 text-xs hover:text-emerald-700 transition-colors group cursor-pointer"
                        title="Urutkan berdasarkan Waktu Selesai"
                      >
                        <span>Waktu Selesai</span>
                        {renderSortIndicator("updated_at")}
                      </button>
                    </TableHead>
                    <TableHead className="px-3 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleSort("nama_pelapor")}
                        className="inline-flex items-center gap-1.5 font-extrabold text-slate-700 text-xs hover:text-emerald-700 transition-colors group cursor-pointer"
                        title="Urutkan berdasarkan Nama Pelapor"
                      >
                        <span>Pelapor & Unit Kerja</span>
                        {renderSortIndicator("nama_pelapor")}
                      </button>
                    </TableHead>
                    <TableHead className="px-3 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleSort("lokasi_kerusakan")}
                        className="inline-flex items-center gap-1.5 font-extrabold text-slate-700 text-xs hover:text-emerald-700 transition-colors group cursor-pointer"
                        title="Urutkan berdasarkan Lokasi Kerusakan"
                      >
                        <span>Lokasi Kerusakan</span>
                        {renderSortIndicator("lokasi_kerusakan")}
                      </button>
                    </TableHead>
                    <TableHead className="px-3 py-3.5 font-extrabold text-slate-700 text-xs">
                      Tindakan Penanganan
                    </TableHead>
                    <TableHead className="w-[110px] font-extrabold text-slate-700 text-xs px-3 py-3.5">
                      Status
                    </TableHead>
                    <TableHead className="text-center w-[100px] font-extrabold text-slate-700 text-xs pr-5 pl-3 py-3.5">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-slate-400 italic text-xs">
                        Tidak ada riwayat laporan yang cocok dengan pencarian.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedReports.map((report) => {
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
                        <TableRow key={report.id} className="hover:bg-emerald-50/30 transition-colors border-b border-slate-100">
                          <TableCell className="font-mono text-xs font-bold text-sky-700 pl-5 pr-3 py-4">
                            {report.ticket_number}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 font-medium px-3 py-4">
                            <div className="font-semibold text-slate-800">{formattedDate}</div>
                            <div className="text-[11px] text-slate-400">{formattedTime} WIB</div>
                          </TableCell>
                          <TableCell className="px-3 py-4">
                            <div className="font-bold text-xs text-slate-800">
                              {report.nama_pelapor}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {report.bagian} &bull; {report.unit_kerja}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 font-medium px-3 py-4">
                            {report.lokasi_kerusakan}
                          </TableCell>
                          <TableCell className="text-xs text-emerald-900 font-medium px-3 py-4 max-w-[240px]">
                            {report.penanganan ? (
                              <div className="bg-emerald-50/80 border border-emerald-100 text-emerald-900 px-2.5 py-1.5 rounded-xl truncate text-[11px]" title={report.penanganan}>
                                {report.penanganan}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">-</span>
                            )}
                          </TableCell>
                          <TableCell className="px-3 py-4">
                            <ReportStatusBadge status={report.status} />
                          </TableCell>
                          <TableCell className="text-center pr-5 pl-3 py-4">
                            <div className="flex items-center justify-center">
                              <Link href={`/admin/laporan/${report.id}`}>
                                <Button variant="outline" size="sm" className="h-7 text-[11px] px-3 rounded-full border-sky-200 text-sky-700 hover:bg-sky-50 font-bold shadow-2xs cursor-pointer">
                                  Detail
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 Tampilan Khusus Mobile HP */}
      <div className="block lg:hidden">
        <RiwayatMobileView completedReports={completedReports} />
      </div>
    </div>
  );
}
