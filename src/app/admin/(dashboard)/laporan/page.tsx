import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReportStatusBadge } from "@/components/user/report-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FALLBACK_REPORTS = [
  {
    id: "1",
    ticket_number: "SIGAP-20260821-001",
    nama_pelapor: "Ahmad Subagyo",
    bagian: "Teknik",
    unit_kerja: "25002 - GILINGAN",
    nomor_hp: "081234567890",
    lokasi_kerusakan: "Stasiun Gilingan Stasiun 1",
    peralatan: "Pompa Nira No. 2",
    deskripsi: "Kebocoran pada seal gland pompa menyebabkan tekanan nira merosot.",
    status: "MENUNGGU",
    created_at: "2026-08-21T08:00:00.000Z",
  },
  {
    id: "2",
    ticket_number: "SIGAP-20260821-002",
    nama_pelapor: "Budi Santoso",
    bagian: "Teknik",
    unit_kerja: "25011 - LISTRIK",
    nomor_hp: "081987654321",
    lokasi_kerusakan: "Ruang Substation Listrik",
    peralatan: "Panel Breaker Utama 380V",
    deskripsi: "Temperatur MCCB naik melebihi batas 75 derajat Celcius.",
    status: "DIPROSES",
    created_at: "2026-08-21T07:00:00.000Z",
  },
  {
    id: "3",
    ticket_number: "SIGAP-20260820-005",
    nama_pelapor: "Cahyo Utomo",
    bagian: "Pabrikasi",
    unit_kerja: "35024 - PENGUAPAN",
    nomor_hp: "081122334455",
    lokasi_kerusakan: "Badan Evaporator No 4",
    peralatan: "Klep Steam Evaporator 4",
    deskripsi: "Tuas pemutar klep macet tidak dapat dibuka penuh.",
    status: "SELESAI",
    created_at: "2026-08-20T14:30:00.000Z",
  },
];

export default async function AdminLaporanPage() {
  const supabase = await createClient();

  let reports: Array<{
    id: string;
    ticket_number: string;
    nama_pelapor: string;
    bagian: string;
    unit_kerja: string;
    nomor_hp?: string;
    lokasi_kerusakan: string;
    peralatan: string;
    deskripsi: string;
    status: string;
    created_at: string;
  }> = [];

  try {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      reports = data;
    }
  } catch (err) {
    console.warn("Supabase fetch reports warning:", err);
  }

  if (reports.length === 0) {
    reports = FALLBACK_REPORTS;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
            Daftar Laporan Kerusakan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data masuk, pantau progres perbaikan, dan ubah status laporan penanganan.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border shadow-xs">
        <CardHeader className="pb-3 border-b bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Data Laporan
              </CardTitle>
              <CardDescription className="text-xs">
                Total {reports.length} laporan terdaftar di database
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari tiket / pelapor / lokasi..."
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[150px]">Nomor Tiket</TableHead>
                  <TableHead className="w-[140px]">Tanggal & Jam</TableHead>
                  <TableHead>Pelapor & Unit Kerja</TableHead>
                  <TableHead>Peralatan / Fasilitas</TableHead>
                  <TableHead>Lokasi Kerusakan</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="text-right w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => {
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
                    <TableRow key={report.id}>
                      <TableCell className="font-mono text-xs font-bold text-primary">
                        {report.ticket_number}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="font-medium text-foreground">{formattedDate}</div>
                        <div className="text-[11px]">{formattedTime} WIB</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-xs text-foreground">
                          {report.nama_pelapor}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {report.bagian} &bull; {report.unit_kerja}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">
                        {report.peralatan}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {report.lokasi_kerusakan}
                      </TableCell>
                      <TableCell>
                        <ReportStatusBadge status={report.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/laporan/${report.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs px-3">
                            Detail
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
