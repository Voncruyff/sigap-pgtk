"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Wrench, MapPin, Calendar, ArrowRight, Play, CheckCircle2, Loader2, Filter, Building } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReportStatusBadge } from "@/components/user/report-status-badge";
import { LaporanItem } from "@/app/admin/(dashboard)/laporan/laporan-list-view";
import { toast } from "sonner";

export interface LaporanMobileViewProps {
  reports: LaporanItem[];
}

export function LaporanMobileView({ reports: initialReports }: LaporanMobileViewProps) {
  const router = useRouter();
  const [reports, setReports] = useState<LaporanItem[]>(initialReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [bagianFilter, setBagianFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  React.useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  // Handle Quick Status Change on Mobile
  const handleUpdateStatus = async (id: string, newStatus: string, ticketNumber: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/reports/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) throw new Error("Gagal mengupdate status via API");

      setReports((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      toast.success(`Status ${ticketNumber} Diperbarui!`, {
        description: `Status diubah menjadi: ${newStatus}`,
      });

      router.refresh();
    } catch (err) {
      console.error("Gagal mengubah status di mobile:", err);
      toast.error("Gagal memperbarui status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      item.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama_pelapor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit_kerja.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchesBagian = bagianFilter === "ALL" || item.bagian === bagianFilter;

    return matchesSearch && matchesStatus && matchesBagian;
  });

  return (
    <div className="space-y-3">
      {/* Mobile Controls: Search & Select Filters */}
      <div className="space-y-2">
        {/* Mobile Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tiket / pelapor / alat..."
            className="pl-9 h-10 text-xs font-medium rounded-xl border-sky-200/90 focus:border-sky-500 bg-white shadow-2xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Mobile Select Bagian Filter */}
          <div className="relative flex items-center w-full">
            <Building className="absolute left-3 h-3.5 w-3.5 text-sky-600 pointer-events-none" />
            <select
              value={bagianFilter}
              onChange={(e) => setBagianFilter(e.target.value)}
              className="w-full pl-8 pr-7 h-9 text-[11px] font-bold rounded-xl border border-sky-200/90 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs cursor-pointer hover:border-sky-400 transition-all appearance-none truncate"
              aria-label="Filter Bagian Laporan"
            >
              <option value="ALL">Semua Bagian</option>
              <option value="TUK">TUK</option>
              <option value="Teknik">Teknik</option>
              <option value="Pabrikasi">Pabrikasi</option>
              <option value="Tanaman">Tanaman</option>
            </select>
            <div className="absolute right-2 pointer-events-none text-slate-400 text-[9px]">▼</div>
          </div>

          {/* Mobile Select Status Filter */}
          <div className="relative flex items-center w-full">
            <Filter className="absolute left-3 h-3.5 w-3.5 text-sky-600 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-8 pr-7 h-9 text-[11px] font-bold rounded-xl border border-sky-200/90 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs cursor-pointer hover:border-sky-400 transition-all appearance-none truncate"
              aria-label="Filter Status Laporan"
            >
              <option value="ALL">Semua Status ({reports.length})</option>
              <option value="MENUNGGU">Menunggu ({reports.filter((r) => r.status === "MENUNGGU").length})</option>
              <option value="DIPROSES">Diproses ({reports.filter((r) => r.status === "DIPROSES").length})</option>
              <option value="SELESAI">Selesai ({reports.filter((r) => r.status === "SELESAI").length})</option>
            </select>
            <div className="absolute right-2 pointer-events-none text-slate-400 text-[9px]">▼</div>
          </div>
        </div>
      </div>

      {/* Mobile Cards List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="text-center py-8 text-slate-400 italic text-xs bg-white rounded-2xl border border-sky-100 p-4">
            Tidak ada laporan yang cocok dengan filter.
          </div>
        ) : (
          filteredReports.map((report) => {
            const dateObj = new Date(report.created_at);
            const formattedDate = dateObj.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            const isUpdatingThis = updatingId === report.id;

            return (
              <Card
                key={report.id}
                className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden"
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
                      {report.unit_kerja}
                    </span>
                    <p className="text-slate-500 text-[11px] font-medium mt-0.5 line-clamp-2">
                      {report.deskripsi}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] gap-2">
                    <div className="space-y-0.5 min-w-0 pr-1">
                      <span className="font-bold text-slate-800 block truncate">
                        {report.nama_pelapor}
                      </span>
                      <span className="text-slate-400 font-medium truncate flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-sky-500 shrink-0" />
                        {report.unit_kerja}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Mobile Quick Action Button */}
                      {report.status === "MENUNGGU" && (
                        <Button
                          size="sm"
                          disabled={isUpdatingThis}
                          onClick={() => handleUpdateStatus(report.id, "DIPROSES", report.ticket_number)}
                          className="h-8 px-2.5 rounded-full text-[11px] font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-2xs"
                        >
                          {isUpdatingThis ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Play className="mr-1 h-3 w-3 fill-current" />
                              Proses
                            </>
                          )}
                        </Button>
                      )}

                      {report.status === "DIPROSES" && (
                        <Button
                          size="sm"
                          disabled={isUpdatingThis}
                          onClick={() => handleUpdateStatus(report.id, "SELESAI", report.ticket_number)}
                          className="h-8 px-2.5 rounded-full text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                        >
                          {isUpdatingThis ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Selesai
                            </>
                          )}
                        </Button>
                      )}

                      <Link href={`/admin/laporan/${report.id}`}>
                        <Button variant="outline" size="sm" className="h-8 px-2.5 rounded-full text-[11px] font-bold border-sky-200 text-sky-700">
                          Detail <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
