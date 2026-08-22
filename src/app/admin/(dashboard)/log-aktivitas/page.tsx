import React from "react";
import { Activity, Search, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LogItem {
  id: string;
  waktu: string;
  admin: string;
  role: string;
  aktivitas: string;
  target: string;
  deskripsi: string;
}

const SAMPLE_LOGS: LogItem[] = [
  {
    id: "1",
    waktu: "2026-08-21T08:30:00.000Z",
    admin: "Administrator SIGAP",
    role: "Super Admin",
    aktivitas: "Ubah Status",
    target: "SIGAP-20260821-002",
    deskripsi: "Mengubah status laporan dari MENUNGGU menjadi DIPROSES.",
  },
  {
    id: "2",
    waktu: "2026-08-21T07:15:00.000Z",
    admin: "Teknisi Listrik",
    role: "Petugas Lapangan",
    aktivitas: "Penanganan",
    target: "SIGAP-20260821-002",
    deskripsi: "Menambahkan catatan penanganan: Penggantian MCCB 380V selesai.",
  },
  {
    id: "3",
    waktu: "2026-08-20T14:30:00.000Z",
    admin: "Administrator SIGAP",
    role: "Super Admin",
    aktivitas: "Ubah Status",
    target: "SIGAP-20260820-005",
    deskripsi: "Mengubah status laporan dari DIPROSES menjadi SELESAI.",
  },
  {
    id: "4",
    waktu: "2026-08-20T09:00:00.000Z",
    admin: "System",
    role: "Automated Service",
    aktivitas: "Laporan Baru",
    target: "SIGAP-20260821-001",
    deskripsi: "Laporan baru dibuat oleh pelapor Ahmad Subagyo (Teknik).",
  },
];

export default function AdminLogAktivitasPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
          Log Aktivitas & Audit Trail
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Catatan terintegrasi untuk memantau jejak aktivitas perbaikan dan perubahan data oleh petugas.
        </p>
      </div>

      {/* Main Table Card */}
      <Card className="border shadow-xs">
        <CardHeader className="pb-3 border-b bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-600" />
                Jejak Audit Aktivitas
              </CardTitle>
              <CardDescription className="text-xs">
                Catatan kejadian realtime sistem SIGAP
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari log / admin / tiket..."
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
                  <TableHead className="w-[160px]">Waktu Aktivitas</TableHead>
                  <TableHead>Petugas / Admin</TableHead>
                  <TableHead className="w-[130px]">Aktivitas</TableHead>
                  <TableHead className="w-[150px]">Target Tiket</TableHead>
                  <TableHead>Deskripsi Perubahan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SAMPLE_LOGS.map((log) => {
                  const dateObj = new Date(log.waktu);
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
                    <TableRow key={log.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="font-medium text-foreground">{formattedDate}</div>
                        <div className="text-[11px]">{formattedTime} WIB</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                          {log.admin}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{log.role}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-normal">
                          {log.aktivitas}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {log.target}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {log.deskripsi}
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
