import React from "react";
import Link from "next/link";
import { ArrowLeft, User, Wrench, MapPin, Calendar, Clock, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportStatusBadge } from "@/components/user/report-status-badge";

export interface LaporanDetailItem {
  id: string;
  ticket_number: string;
  nama_pelapor: string;
  bagian: string;
  unit_kerja: string;
  nomor_hp?: string;
  lokasi_kerusakan: string;
  peralatan?: string;
  deskripsi: string;
  foto_url?: string;
  status: string;
  created_at: string;
}

export interface LaporanDetailViewProps {
  report: LaporanDetailItem;
}

export function LaporanDetailView({ report }: LaporanDetailViewProps) {
  const dateObj = new Date(report.created_at);
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="space-y-4">
        <Link href="/admin/laporan">
          <Button variant="ghost" size="sm" className="-ml-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50/80 rounded-full font-bold">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Kembali ke Daftar Laporan
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-sky-100/80 pb-4 sm:pb-5">
          <div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Nomor Tiket Laporan Resmi
            </div>
            <h1 className="text-xl sm:text-3xl font-mono font-bold tracking-wider text-sky-700 mt-0.5 sm:mt-1">
              {report.ticket_number}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ReportStatusBadge status={report.status} />
          </div>
        </div>
      </div>

      {/* Grid Detail Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Details (2 Columns on Desktop) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Card 1: Informasi Pelapor & Lokasi */}
          <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-md lg:shadow-xl shadow-sky-100/50 overflow-hidden">
            <CardHeader className="p-3.5 sm:p-5 pb-3 border-b border-sky-100/80 bg-slate-50/70">
              <CardTitle className="text-xs sm:text-sm font-extrabold flex items-center gap-2 text-sky-800">
                <User className="h-4 w-4 text-sky-600" />
                Informasi Pelapor & Lokasi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-5 pt-4 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Nama Pelapor</span>
                  <span className="font-bold text-slate-800">{report.nama_pelapor}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Bagian / Unit Kerja</span>
                  <span className="font-bold text-slate-800">
                    {report.bagian} &bull; {report.unit_kerja}
                  </span>
                </div>
              </div>

              <div className="border-t border-sky-100/80 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-medium block flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-sky-600" /> Nomor HP / Kontak
                  </span>
                  <span className="font-semibold text-slate-800">{report.nomor_hp || "-"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-sky-600" /> Lokasi Kerusakan
                  </span>
                  <span className="font-semibold text-slate-800">{report.lokasi_kerusakan}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Detail Kerusakan & Foto */}
          <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-sky-100/50 overflow-hidden">
            <CardHeader className="pb-3.5 border-b border-sky-100/80 bg-slate-50/70">
              <CardTitle className="text-sm font-extrabold flex items-center gap-2 text-sky-800">
                <Wrench className="h-4 w-4 text-sky-600" />
                Detail Kerusakan & Lampiran Foto
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1.5">Deskripsi Kerusakan</span>
                <p className="text-sm text-slate-800 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 whitespace-pre-wrap leading-relaxed">
                  {report.deskripsi}
                </p>
              </div>



              {/* Lampiran Foto */}
              {report.foto_url ? (
                <div className="pt-2">
                  <span className="text-xs text-slate-400 font-medium block mb-2">Foto Lampiran</span>
                  <div className="relative max-w-sm rounded-2xl overflow-hidden border border-sky-100 shadow-md bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={report.foto_url}
                      alt="Foto Kerusakan"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-2 text-xs text-slate-400 italic">
                  Tidak ada lampiran foto untuk laporan ini.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel: Informasi Waktu */}
        <div className="space-y-6">
          <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-sky-100/50 overflow-hidden">
            <CardHeader className="pb-3.5 border-b border-sky-100/80 bg-slate-50/70">
              <CardTitle className="text-sm font-extrabold text-slate-900">
                Informasi Waktu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                  <Calendar className="h-4 w-4 shrink-0" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Tanggal Laporan</span>
                  <span className="font-bold text-slate-800">{formattedDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t border-sky-100/80 pt-4">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                  <Clock className="h-4 w-4 shrink-0" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Waktu Laporan</span>
                  <span className="font-bold text-slate-800">{formattedTime} WIB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
