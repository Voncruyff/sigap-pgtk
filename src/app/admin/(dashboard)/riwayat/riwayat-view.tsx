"use client";

import React, { useState } from "react";
import {
  History,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Calendar,
  User,
  Phone,
  Building,
  FileText,
  ImageIcon,
  CheckCircle2,
  Copy,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";

export interface CompletedReportItem {
  id: string;
  ticket_number: string;
  nama_pelapor: string;
  bagian: string;
  unit_kerja: string;
  nomor_hp?: string | null;
  lokasi_kerusakan: string;
  deskripsi?: string;
  foto_url?: string | null;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface RiwayatViewProps {
  completedReports: CompletedReportItem[];
}

type SortField = "created_at" | "ticket_number" | "nama_pelapor" | "bagian";
type SortOrder = "asc" | "desc";

export function RiwayatView({ completedReports }: RiwayatViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBagian, setSelectedBagian] = useState<string>("SEMUA");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedReport, setSelectedReport] = useState<CompletedReportItem | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "created_at" ? "desc" : "asc");
    }
  };

  const copyTicket = (ticket: string) => {
    navigator.clipboard.writeText(ticket);
    toast.success("Nomor tiket berhasil disalin!");
  };

  const filteredReports = completedReports.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.ticket_number.toLowerCase().includes(q) ||
      item.nama_pelapor.toLowerCase().includes(q) ||
      item.lokasi_kerusakan.toLowerCase().includes(q) ||
      item.unit_kerja.toLowerCase().includes(q) ||
      item.bagian.toLowerCase().includes(q);

    const matchBagian =
      selectedBagian === "SEMUA" || item.bagian.toUpperCase() === selectedBagian.toUpperCase();

    return matchSearch && matchBagian;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    let comparison = 0;
    if (sortField === "created_at") {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      comparison = dateA - dateB;
    } else if (sortField === "ticket_number") {
      comparison = a.ticket_number.localeCompare(b.ticket_number, "id-ID");
    } else if (sortField === "nama_pelapor") {
      comparison = a.nama_pelapor.localeCompare(b.nama_pelapor, "id-ID");
    } else if (sortField === "bagian") {
      comparison = a.bagian.localeCompare(b.bagian, "id-ID");
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const renderSortIndicator = (field: SortField) => {
    const isActive = sortField === field;
    if (!isActive) {
      return (
        <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
      );
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-sky-600 shrink-0 stroke-[2.5]" />
    ) : (
      <ArrowDown className="h-3 w-3 text-sky-600 shrink-0 stroke-[2.5]" />
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Header Halaman Dynamic */}
      <PageHeader
        title="Riwayat Laporan Kerusakan"
        description="Daftar seluruh catatan laporan gangguan dan kerusakan fasilitas PT Kebon Agung PG Trangkil."
        badgeText="SIGAP Record & History"
        badgeColor="sky"
      />

      {/* 🖥️ Tampilan Utama Desktop / PC */}
      <div className="hidden lg:block">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <History className="h-4 w-4 text-sky-600" />
                  Daftar Catatan Kerusakan
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">
                  Menampilkan {sortedReports.length} dari total {completedReports.length} catatan laporan
                </CardDescription>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="flex items-center gap-3">
                {/* Bagian Filter Pills */}
                <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs">
                  {["SEMUA", "Teknik", "Pabrikasi", "Tanaman", "TUK"].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBagian(b)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedBagian === b
                          ? "bg-sky-700 text-white shadow-2xs"
                          : "text-slate-600 hover:text-sky-700 hover:bg-white"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                <div className="relative w-60">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari tiket / pelapor / unit..."
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
                    <TableHead className="w-[150px] pl-5 pr-3 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleSort("ticket_number")}
                        className="inline-flex items-center gap-1.5 font-extrabold text-slate-700 text-xs hover:text-sky-700 transition-colors group cursor-pointer"
                        title="Urutkan berdasarkan Nomor Tiket"
                      >
                        <span>Nomor Tiket</span>
                        {renderSortIndicator("ticket_number")}
                      </button>
                    </TableHead>
                    <TableHead className="w-[140px] px-3 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleSort("created_at")}
                        className="inline-flex items-center gap-1.5 font-extrabold text-slate-700 text-xs hover:text-sky-700 transition-colors group cursor-pointer"
                        title="Urutkan berdasarkan Waktu Lapor"
                      >
                        <span>Waktu Lapor</span>
                        {renderSortIndicator("created_at")}
                      </button>
                    </TableHead>
                    <TableHead className="px-3 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleSort("nama_pelapor")}
                        className="inline-flex items-center gap-1.5 font-extrabold text-slate-700 text-xs hover:text-sky-700 transition-colors group cursor-pointer"
                        title="Urutkan berdasarkan Nama Pelapor"
                      >
                        <span>Pelapor & Unit Kerja</span>
                        {renderSortIndicator("nama_pelapor")}
                      </button>
                    </TableHead>
                    <TableHead className="w-[130px] px-3 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleSort("bagian")}
                        className="inline-flex items-center gap-1.5 font-extrabold text-slate-700 text-xs hover:text-sky-700 transition-colors group cursor-pointer"
                        title="Urutkan berdasarkan Bagian"
                      >
                        <span>Bagian</span>
                        {renderSortIndicator("bagian")}
                      </button>
                    </TableHead>
                    <TableHead className="px-3 py-3.5">
                      Deskripsi Kerusakan
                    </TableHead>
                    <TableHead className="text-center w-[100px] font-extrabold text-slate-700 text-xs pr-5 pl-3 py-3.5">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-slate-400 italic text-xs">
                        Tidak ada catatan laporan yang cocok dengan pencarian / filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedReports.map((report) => {
                      const dateObj = new Date(report.created_at);
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
                        <TableRow key={report.id} className="hover:bg-sky-50/30 transition-colors border-b border-slate-100">
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
                            <div className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                              {report.unit_kerja}
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-4">
                            <span className="inline-flex items-center gap-1 font-bold text-[11px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                              {report.bagian}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 font-medium px-3 py-4 max-w-[250px] truncate" title={report.deskripsi}>
                            {report.deskripsi || report.lokasi_kerusakan}
                          </TableCell>
                          <TableCell className="text-center pr-5 pl-3 py-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                              className="h-7 text-[11px] px-3 rounded-xl border-sky-200 text-sky-700 hover:bg-sky-50 font-bold shadow-2xs cursor-pointer gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Detail
                            </Button>
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
        <RiwayatMobileView
          completedReports={completedReports}
          onSelectReport={(report) => setSelectedReport(report)}
        />
      </div>

      {/* 🔍 Detail Modal Dialog Laporan Kerusakan */}
      <Dialog open={Boolean(selectedReport)} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="max-w-lg p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader className="border-b border-slate-100 pb-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Detail Catatan Kerusakan
                  </span>
                  <button
                    type="button"
                    onClick={() => copyTicket(selectedReport.ticket_number)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition-colors cursor-pointer"
                    title="Salin Nomor Tiket"
                  >
                    <span>{selectedReport.ticket_number}</span>
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
                <DialogTitle className="text-base sm:text-lg font-black text-slate-900">
                  {selectedReport.unit_kerja}
                </DialogTitle>
              </DialogHeader>

              {/* Detail Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-1">
                  <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
                    <User className="h-3 w-3 text-sky-600" />
                    Nama Pelapor
                  </span>
                  <p className="font-bold text-slate-900">{selectedReport.nama_pelapor}</p>
                  {selectedReport.nomor_hp && (
                    <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1 pt-0.5">
                      <Phone className="h-3 w-3 text-emerald-600" />
                      {selectedReport.nomor_hp}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-1">
                  <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
                    <Building className="h-3 w-3 text-sky-600" />
                    Bagian / Departemen
                  </span>
                  <p className="font-bold text-slate-900">{selectedReport.bagian}</p>
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 pt-0.5">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {new Date(selectedReport.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })} WIB
                  </p>
                </div>
              </div>

              {/* Deskripsi Kerusakan */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-sky-600" />
                  Rincian Gangguan / Kerusakan:
                </span>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                  {selectedReport.deskripsi || selectedReport.lokasi_kerusakan || "Tidak ada deskripsi rinci."}
                </div>
              </div>

              {/* Foto Kerusakan */}
              {selectedReport.foto_url ? (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-sky-600" />
                    Foto Lampiran Kerusakan:
                  </span>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 max-h-72 flex items-center justify-center shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedReport.foto_url}
                      alt="Foto Kerusakan"
                      className="max-h-72 w-auto object-contain rounded-xl"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-slate-400 text-xs font-medium">
                  Tidak ada foto lampiran kerusakan
                </div>
              )}

              {/* Modal Footer Action */}
              <div className="pt-2 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedReport(null)}
                  className="h-9 px-5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Tutup
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
