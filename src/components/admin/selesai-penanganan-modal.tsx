"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Wrench, Loader2, Sparkles, AlertCircle, Building, User } from "lucide-react";
import { toast } from "sonner";

export interface SelesaiModalReportItem {
  id: string;
  ticket_number: string;
  nama_pelapor: string;
  bagian: string;
  unit_kerja: string;
  lokasi_kerusakan?: string;
  deskripsi?: string;
}

interface SelesaiPenangananModalProps {
  report: SelesaiModalReportItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (reportId: string, ticketNumber: string, penanganan: string) => void;
}

const PRESET_PENANGANAN = [
  "Perbaikan komponen & penggantian sparepart selesai dilakukan.",
  "Pembersihan, pelumasan & kalibrasi ulang fasilitas operasional.",
  "Pengelasan & perbaikan struktur pipa/mesin tuntas.",
  "Penyetelan sistem elektrikal/kontrol & uji fungsi normal.",
];

export function SelesaiPenangananModal({
  report,
  open,
  onOpenChange,
  onSuccess,
}: SelesaiPenangananModalProps) {
  const [penanganan, setPenanganan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens with a report
  React.useEffect(() => {
    if (open) {
      setPenanganan("");
      setError(null);
    }
  }, [open, report]);

  if (!report) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!penanganan.trim()) {
      setError("Deskripsi tindakan penanganan wajib diisi sebelum menyelesaikan laporan.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reports/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: report.id,
          status: "SELESAI",
          penanganan: penanganan.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal memperbarui status laporan");
      }

      toast.success("Laporan Berhasil Diselesaikan!", {
        description: `Tiket ${report.ticket_number} telah ditandai selesai dengan catatan penanganan.`,
      });

      onSuccess(report.id, report.ticket_number, penanganan.trim());
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Error completing report:", err);
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyelesaikan laporan.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyPreset = (preset: string) => {
    if (!penanganan) {
      setPenanganan(preset);
    } else {
      setPenanganan((prev) => `${prev.trim()} ${preset}`);
    }
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-5 sm:p-6 rounded-3xl bg-white border border-emerald-100 shadow-2xl space-y-4">
        {/* Header Dialog */}
        <DialogHeader className="space-y-1.5 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-2xs">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                Selesaikan Penanganan Laporan
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-medium">
                Tuliskan deskripsi tindakan perbaikan fasilitas sebelum menandai tiket selesai.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ringkasan Tiket & Pelapor */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Nomor Tiket
              </span>
              <span className="font-mono font-black text-xs text-sky-800 bg-white px-2.5 py-0.5 rounded-lg border border-sky-200 shadow-2xs">
                {report.ticket_number}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-600 truncate">
                <User className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="font-bold text-slate-800 truncate">{report.nama_pelapor}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 truncate">
                <Building className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="font-medium text-slate-700 truncate">
                  {report.bagian} - {report.unit_kerja}
                </span>
              </div>
            </div>
          </div>

          {/* Textarea Deskripsi Penanganan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="deskripsi-penanganan"
                className="text-xs font-black text-slate-800 flex items-center gap-1.5"
              >
                <Wrench className="h-3.5 w-3.5 text-emerald-600" />
                Deskripsi Tindakan Penanganan / Perbaikan <span className="text-rose-500">*</span>
              </Label>
              <span className="text-[10px] text-slate-400 font-medium">Wajib diisi</span>
            </div>

            <Textarea
              id="deskripsi-penanganan"
              rows={4}
              value={penanganan}
              onChange={(e) => {
                setPenanganan(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: Telah dilakukan pembongkaran dan penggantian seal valve No. 3 yang bocor. Dilanjutkan pengetesan tekanan uap pada 15 bar, hasil normal dan tidak ada kebocoran lagi."
              className={`text-xs font-medium rounded-2xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white shadow-2xs leading-relaxed resize-none ${
                error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20" : ""
              }`}
            />

            {error && (
              <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 pt-0.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </p>
            )}
          </div>

          {/* Quick Presets / Template Catatan */}
          <div className="space-y-1.5 pt-0.5">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              Template Cepat Tindakan (Klik untuk Menambahkan):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PENANGANAN.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="text-[10.5px] font-medium bg-slate-100/90 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 hover:border-emerald-200 px-2.5 py-1 rounded-xl transition-all text-left cursor-pointer active:scale-95"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="gap-2 sm:gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-10 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border-slate-200 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !penanganan.trim()}
              className="h-10 px-5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Simpan &amp; Tandai Selesai
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
