import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Clock, Wrench, CheckCircle2, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportStatusBadge } from "@/components/user/report-status-badge";

export interface StatusDetailReportItem {
  id?: string;
  ticket_number?: string;
  bagian?: string;
  unit_kerja?: string;
  lokasi_kerusakan?: string;
  peralatan?: string;
  deskripsi?: string;
  status?: string;
  created_at?: string;
}

export interface StatusDetailViewProps {
  ticketNumber: string;
  report: StatusDetailReportItem | null;
}

export function StatusDetailView({ ticketNumber, report }: StatusDetailViewProps) {
  const status = report?.status || "MENUNGGU";

  // Calculate progress step
  let currentStep = 2; // Default MENUNGGU
  if (status === "DIPROSES") currentStep = 3;
  if (status === "SELESAI") currentStep = 4;

  const steps = [
    { id: 1, name: "Laporan Dikirim", icon: FileText },
    { id: 2, name: "Menunggu Penanganan", icon: Clock },
    { id: 3, name: "Sedang Diproses", icon: Wrench },
    { id: 4, name: "Selesai", icon: CheckCircle2 },
  ];

  const formattedDate = report?.created_at
    ? new Date(report.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="space-y-4">
        <Link href="/cek-status">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50/80 rounded-full"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Kembali
          </Button>
        </Link>

        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100/60 px-3 py-1 rounded-full border border-sky-200/50 mb-1">
            SIGAP Status
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Perkembangan Laporan
          </h1>
        </div>
      </div>

      {/* Notice jika tiket tidak ditemukan di database */}
      {!report && (
        <div className="bg-amber-500/10 border border-amber-200/80 text-amber-900 rounded-2xl p-4 text-xs flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <span>
            Nomor laporan <strong>{ticketNumber}</strong> belum ditemukan di database. Menampilkan pratinjau status awal penanganan.
          </span>
        </div>
      )}

      {/* Card Status Utama */}
      <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-xs rounded-3xl shadow-xl shadow-sky-100/50 overflow-hidden">
        <CardHeader className="pb-4 border-b border-sky-100/80 bg-gradient-to-r from-sky-50/80 to-white">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <div className="text-xs font-semibold text-slate-400">Nomor Tiket Resmi</div>
              <CardTitle className="text-xl font-mono font-bold tracking-wider text-sky-700">
                {ticketNumber}
              </CardTitle>
            </div>
            <ReportStatusBadge status={status} />
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Tanggal Laporan</span>
              <span className="font-semibold text-slate-800">{formattedDate}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Status Penanganan</span>
              <span className="font-semibold text-slate-800">{status}</span>
            </div>
          </div>

          <div className="border-t border-sky-100/80 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Peralatan / Fasilitas</span>
              <span className="font-semibold text-slate-800">{report?.peralatan || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Unit / Bagian Kerja</span>
              <span className="font-semibold text-slate-800">
                {report?.unit_kerja || report?.lokasi_kerusakan || "-"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Status Visual */}
      <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-xs rounded-3xl shadow-xl shadow-sky-100/50 overflow-hidden">
        <CardHeader className="pb-3 border-b border-sky-100/80 bg-sky-50/50">
          <CardTitle className="text-sm font-bold text-slate-800">
            Garis Waktu Penanganan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <div key={step.id} className="relative flex items-start gap-4">
                  {/* Vertical Line Connector */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 -bottom-6 w-0.5 transition-colors ${
                        step.id < currentStep ? "bg-sky-500" : "bg-slate-200"
                      }`}
                    />
                  )}

                  {/* Icon Circle */}
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all ${
                      isCompleted
                        ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-500/20"
                        : isCurrent
                        ? "bg-sky-100 text-sky-700 border-sky-500 ring-4 ring-sky-100"
                        : "bg-slate-100 text-slate-400 border-slate-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Step Name */}
                  <div className="pt-1">
                    <p
                      className={`text-sm font-semibold ${
                        isCurrent
                          ? "text-sky-700 font-bold"
                          : isCompleted
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Catatan & Tombol Cek Lain */}
      <div className="space-y-4 pt-2 text-center sm:text-left">
        <p className="text-xs text-slate-500 bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100">
          Status laporan diperbarui oleh petugas SIGAP setelah perbaikan ditindaklanjuti.
        </p>

        <div>
          <Link href="/cek-status" className="block sm:inline-block">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-full border-sky-200 text-sky-700 hover:bg-sky-50"
            >
              <Search className="mr-2 h-4 w-4" />
              Cek Laporan Lain
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
