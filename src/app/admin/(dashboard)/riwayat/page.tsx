import React from "react";
import Link from "next/link";
import { History, Search } from "lucide-react";
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

const FALLBACK_COMPLETED_REPORTS = [
  {
    id: "3",
    ticket_number: "SIGAP-20260820-005",
    nama_pelapor: "Cahyo Utomo",
    bagian: "Pabrikasi",
    unit_kerja: "35024 - PENGUAPAN",
    lokasi_kerusakan: "Badan Evaporator No 4",
    peralatan: "Klep Steam Evaporator 4",
    status: "SELESAI",
    created_at: "2026-08-20T14:30:00.000Z",
    updated_at: "2026-08-21T02:00:00.000Z",
  },
  {
    id: "4",
    ticket_number: "SIGAP-20260819-012",
    nama_pelapor: "Dedi Setiawan",
    bagian: "Teknik",
    unit_kerja: "25002 - GILINGAN",
    lokasi_kerusakan: "Stasiun Gilingan No 3",
    peralatan: "Conveyor Tebu No. 1",
    status: "SELESAI",
    created_at: "2026-08-19T10:15:00.000Z",
    updated_at: "2026-08-20T11:00:00.000Z",
  },
];

export default async function AdminRiwayatPage() {
  const supabase = await createClient();

  let completedReports: Array<{
    id: string;
    ticket_number: string;
    nama_pelapor: string;
    bagian: string;
    unit_kerja: string;
    lokasi_kerusakan: string;
    peralatan: string;
    status: string;
    created_at: string;
    updated_at?: string;
  }> = [];

  try {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("status", "SELESAI")
      .order("updated_at", { ascending: false });

    if (data) {
      completedReports = data;
    }
  } catch (err) {
    console.warn("Supabase fetch completed reports warning:", err);
  }

  if (completedReports.length === 0) {
    completedReports = FALLBACK_COMPLETED_REPORTS;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
          Riwayat & Arsip Laporan
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Daftar seluruh laporan gangguan fasilitas yang telah selesai ditangani oleh tim teknisi.
        </p>
      </div>

      {/* Main Table Card */}
      <Card className="border shadow-xs">
        <CardHeader className="pb-3 border-b bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-emerald-600" />
                Arsip Laporan Selesai
              </CardTitle>
              <CardDescription className="text-xs">
                Total {completedReports.length} laporan tuntas tersimpan
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari riwayat tiket / pelapor..."
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
                  <TableHead className="w-[140px]">Waktu Selesai</TableHead>
                  <TableHead>Pelapor & Unit Kerja</TableHead>
                  <TableHead>Peralatan</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="text-right w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedReports.map((report) => {
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
