"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getLocalReportHistory,
  removeReportFromLocalHistory,
  LocalReportItem,
} from "@/lib/my-reports-storage";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/motion";

export function UserPengaturanView() {
  const [localReports, setLocalReports] = useState<LocalReportItem[]>([]);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  useEffect(() => {
    setLocalReports(getLocalReportHistory());
  }, []);

  const handleConfirmClearAll = () => {
    localStorage.removeItem("sigap_my_reports_history");
    setLocalReports([]);
    toast.success("Seluruh riwayat tiket lokal berhasil dibersihkan.");
    setIsClearModalOpen(false);
  };

  const handleRemoveSingleTicket = (ticketNumber: string) => {
    const updated = removeReportFromLocalHistory(ticketNumber);
    setLocalReports(updated);
    toast.success(`Tiket ${ticketNumber} dihapus.`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header Halaman Dynamic */}
      <FadeIn>
        <PageHeader
          title="Pengaturan & Riwayat Tiket"
          description="Kelola riwayat tiket laporan yang tersimpan secara lokal di perangkat ini."
          badgeText="User Settings"
          icon={Settings}
          backUrl="/"
          backLabel="Kembali ke Beranda"
        />
      </FadeIn>

      <div className="space-y-5">
        {/* Kelola Riwayat Tiket Perangkat */}
        <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-sky-100/50 overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-sky-100/80 bg-slate-50/50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900">
                Riwayat Tiket Tersimpan di Perangkat
              </CardTitle>
              <CardDescription className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                Total {localReports.length} tiket tersimpan di browser ini
              </CardDescription>
            </div>
            {localReports.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsClearModalOpen(true)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full px-3 h-8 cursor-pointer"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Hapus Semua
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {localReports.length === 0 ? (
              <div className="text-xs text-slate-400 italic text-center py-4">
                Belum ada tiket yang tersimpan di perangkat ini.
              </div>
            ) : (
              localReports.map((item) => (
                <div
                  key={item.ticket_number}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs"
                >
                  <div>
                    <Link
                      href={`/status/${item.ticket_number}`}
                      className="font-mono font-bold text-sky-700 hover:underline"
                    >
                      {item.ticket_number}
                    </Link>
                    <div className="text-[11px] text-slate-500 font-medium truncate">
                      {item.unit_kerja}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSingleTicket(item.ticket_number)}
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pop-up Modal Custom: Konfirmasi Hapus Semua Riwayat Tiket */}
      <Dialog open={isClearModalOpen} onOpenChange={setIsClearModalOpen}>
        <DialogContent className="max-w-md p-5 sm:p-6 rounded-3xl bg-white border border-rose-200 shadow-2xl space-y-4">
          <DialogHeader className="space-y-1 pb-2 border-b border-rose-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-700 ring-4 ring-rose-50 shrink-0">
                <AlertTriangle className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-black tracking-tight text-slate-900">
                  Konfirmasi Hapus Riwayat Tiket
                </DialogTitle>
                <DialogDescription className="text-xs text-rose-600 font-bold">
                  Membersihkan seluruh catatan tiket di perangkat ini.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 space-y-1">
              <p className="text-slate-700 font-medium leading-relaxed">
                Apakah Anda yakin ingin menghapus seluruh {localReports.length} riwayat tiket yang tersimpan di perangkat ini?
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsClearModalOpen(false)}
              className="h-10 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border-slate-200 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleConfirmClearAll}
              className="h-10 px-5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 cursor-pointer"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Hapus Semua Riwayat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
