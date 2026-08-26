"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  Search,
  AlertCircle,
  Building,
  Calendar,
  Tag,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ReportStatusBadge } from "@/components/user/report-status-badge";
import { NotificationPermissionButton } from "@/components/ui/notification-permission-button";

export interface StatusDetailReportItem {
  id?: string;
  ticket_number?: string;
  nama_pelapor?: string;
  bagian?: string;
  unit_kerja?: string;
  lokasi_kerusakan?: string;
  peralatan?: string;
  deskripsi?: string;
  status?: string;
  foto_url?: string | null;
  created_at?: string;
}

export interface StatusDetailViewProps {
  ticketNumber: string;
  report: StatusDetailReportItem | null;
}

export function StatusDetailView({ ticketNumber, report }: StatusDetailViewProps) {
  const status = report?.status || "MENUNGGU";

  // Calculate progress step index (1-based)
  let currentStep = 2; // Default MENUNGGU
  if (status === "DIPROSES") currentStep = 3;
  if (status === "SELESAI") currentStep = 4;

  const steps = [
    { id: 1, name: "Laporan Terkirim", desc: "Formulir diterima", icon: FileText },
    { id: 2, name: "Menunggu Disposisi", desc: "Verifikasi admin", icon: Clock },
    { id: 3, name: "Sedang Diproses", desc: "Perbaikan teknis", icon: Wrench },
    { id: 4, name: "Perbaikan Selesai", desc: "Tuntas & verifikasi", icon: CheckCircle2 },
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
    <div className="max-w-3xl mx-auto space-y-5 pb-12">
      {/* Header Halaman Dynamic */}
      <PageHeader
        title="Status Penanganan Tiket"
        description="Pantau progres perbaikan dan respon tim teknisi secara realtime."
        badgeText="SIGAP Status Tracker"
        backUrl="/cek-status"
        backLabel="Kembali"
      >
        <NotificationPermissionButton />
      </PageHeader>

      {/* Notice jika tiket tidak ditemukan di database */}
      {!report && (
        <div className="bg-amber-50 border border-amber-200/80 text-amber-900 rounded-2xl p-4 text-xs flex items-center gap-3 shadow-2xs">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <span>
            Nomor tiket <strong>{ticketNumber}</strong> belum terdaftar di database. Menampilkan status pratinjau awal penanganan.
          </span>
        </div>
      )}

      {/* Sleek Horizontal Stepper Bar (Desktop & Mobile) */}
      <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-2xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Nomor Tiket Resmi
              </span>
              <CardTitle className="text-lg sm:text-xl font-mono font-bold tracking-wide text-sky-700 mt-0.5">
                {ticketNumber}
              </CardTitle>
            </div>
            <ReportStatusBadge status={status} />
          </div>
        </CardHeader>

        {/* Stepper Progress Bar */}
        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-sky-50/80 border-sky-300 ring-2 ring-sky-100"
                      : isCompleted
                      ? "bg-slate-50/80 border-slate-200"
                      : "bg-white border-slate-100 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCompleted
                          ? "bg-sky-700 text-white"
                          : isCurrent
                          ? "bg-sky-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isCurrent
                          ? "text-sky-700"
                          : isCompleted
                          ? "text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      Langkah {step.id}
                    </span>
                  </div>

                  <h4
                    className={`text-xs font-bold leading-snug ${
                      isCurrent
                        ? "text-sky-900"
                        : isCompleted
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {step.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Details Grid: Left Metadata & Right Description / Photo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Left Card: Metadata Informasi Tiket */}
        <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-2xs overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Tag className="h-4 w-4 text-sky-700 shrink-0" />
              Detail Informasi Tiket
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">
                  Tanggal Pengajuan
                </span>
                <span className="font-bold text-slate-800">{formattedDate}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
              <Building className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">
                  Bagian &amp; Unit Kerja
                </span>
                <span className="font-bold text-slate-800 block">
                  {report?.bagian ? `Bagian ${report.bagian}` : "-"}
                </span>
                <span className="text-slate-600 font-semibold block">
                  {report?.unit_kerja || report?.lokasi_kerusakan || "-"}
                </span>
              </div>
            </div>

            {report?.nama_pelapor && (
              <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">
                    Nama Pelapor
                  </span>
                  <span className="font-bold text-slate-800">
                    {report.nama_pelapor}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Card: Deskripsi Kerusakan & Lampiran Foto */}
        <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-2xs overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-sky-700 shrink-0" />
              Rincian Kerusakan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block mb-1">
                Deskripsi Kendala / Perbaikan
              </span>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 font-medium text-slate-700 leading-relaxed">
                {report?.deskripsi || "Tidak ada deskripsi rinci yang dimasukkan."}
              </div>
            </div>

            {report?.foto_url && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium block mb-1.5 flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5 text-sky-600" />
                  Foto Lampiran Kerusakan
                </span>
                <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200 shadow-2xs bg-slate-100">
                  <Image
                    src={report.foto_url}
                    alt="Foto Kerusakan"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
          💡 Status diperbarui oleh petugas SIGAP setelah verifikasi teknis di lapangan.
        </p>

        <Link href="/cek-status">
          <Button
            variant="outline"
            className="h-10 px-5 rounded-xl border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 font-bold text-xs shadow-2xs cursor-pointer transition-all shrink-0"
          >
            <Search className="mr-2 h-4 w-4" />
            Cek Tiket Lainnya
          </Button>
        </Link>
      </div>
    </div>
  );
}
