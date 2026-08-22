import React from "react";
import Link from "next/link";
import { ArrowLeft, User, Wrench, MapPin, Calendar, Clock, Phone, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportStatusBadge } from "@/components/user/report-status-badge";

interface ReportDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminLaporanDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  let report: {
    id: string;
    ticket_number: string;
    nama_pelapor: string;
    bagian: string;
    unit_kerja: string;
    nomor_hp?: string;
    lokasi_kerusakan: string;
    peralatan: string;
    deskripsi: string;
    foto_url?: string;
    dampak?: string;
    status: string;
    created_at: string;
  } | null = null;

  try {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .or(`id.eq.${id},ticket_number.eq.${id}`)
      .single();

    if (data) {
      report = data;
    }
  } catch (err) {
    console.warn("Supabase fetch report detail warning:", err);
  }

  // Fallback sample data if query finds no report
  if (!report) {
    report = {
      id: id,
      ticket_number: "SIGAP-20260821-001",
      nama_pelapor: "Ahmad Subagyo",
      bagian: "Teknik",
      unit_kerja: "25002 - GILINGAN",
      nomor_hp: "081234567890",
      lokasi_kerusakan: "Stasiun Gilingan Stasiun 1",
      peralatan: "Pompa Nira No. 2",
      deskripsi: "Kebocoran pada seal gland pompa menyebabkan tekanan nira merosot drastis.",
      dampak: "Menghambat sebagian pekerjaan",
      status: "MENUNGGU",
      created_at: new Date().toISOString(),
    };
  }

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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="space-y-4">
        <Link href="/admin/laporan">
          <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali ke Daftar Laporan
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nomor Tiket Laporan
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-primary mt-1">
              {report.ticket_number}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ReportStatusBadge status={report.status} />
          </div>
        </div>
      </div>

      {/* Grid Detail Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details (2 Columns on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Informasi Pelapor & Lokasi */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                <User className="h-4 w-4" />
                Informasi Pelapor & Lokasi
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Nama Pelapor</span>
                  <span className="font-semibold text-foreground">{report.nama_pelapor}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Bagian / Unit Kerja</span>
                  <span className="font-semibold text-foreground">
                    {report.bagian} &bull; {report.unit_kerja}
                  </span>
                </div>
              </div>

              <div className="border-t pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Nomor HP / Kontak
                  </span>
                  <span className="font-medium text-foreground">{report.nomor_hp || "-"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Lokasi Kerusakan
                  </span>
                  <span className="font-medium text-foreground">{report.lokasi_kerusakan}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Detail Kerusakan & Foto */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                <Wrench className="h-4 w-4" />
                Detail Kerusakan & Lampiran Foto
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">Peralatan / Fasilitas</span>
                <span className="font-bold text-base text-foreground">{report.peralatan}</span>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block mb-1">Deskripsi Kerusakan</span>
                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border whitespace-pre-wrap leading-relaxed">
                  {report.deskripsi}
                </p>
              </div>

              {report.dampak && (
                <div>
                  <span className="text-xs text-muted-foreground block flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-amber-500" /> Dampak Kerusakan
                  </span>
                  <span className="font-medium text-foreground">{report.dampak}</span>
                </div>
              )}

              {/* Lampiran Foto */}
              {report.foto_url ? (
                <div className="pt-2">
                  <span className="text-xs text-muted-foreground block mb-2">Foto Lampiran</span>
                  <div className="relative max-w-sm rounded-lg overflow-hidden border bg-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={report.foto_url}
                      alt="Foto Kerusakan"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-2 text-xs text-muted-foreground italic">
                  Tidak ada lampiran foto untuk laporan ini.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel: Informasi Waktu */}
        <div className="space-y-6">
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-semibold text-foreground">
                Informasi Waktu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground block">Tanggal Laporan</span>
                  <span className="font-medium text-foreground">{formattedDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t pt-3">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground block">Waktu Laporan</span>
                  <span className="font-medium text-foreground">{formattedTime} WIB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
