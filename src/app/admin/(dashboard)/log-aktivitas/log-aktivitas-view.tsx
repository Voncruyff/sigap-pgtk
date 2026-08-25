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

export interface LogItem {
  id: string;
  waktu: string;
  admin: string;
  role: string;
  aktivitas: string;
  target: string;
  deskripsi: string;
}

export interface LogAktivitasViewProps {
  logs: LogItem[];
}

export function LogAktivitasView({ logs }: LogAktivitasViewProps) {
  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="border-b border-sky-100/80 pb-4 sm:pb-5">
        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-purple-200/60 mb-1.5">
          SIGAP Audit Trail
        </div>
        <h1 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900">
          Log Aktivitas & Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 sm:mt-1">
          Catatan terintegrasi untuk memantau jejak aktivitas perbaikan dan perubahan data oleh petugas.
        </p>
      </div>

      {/* Main Table Card */}
      <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-md lg:shadow-xl shadow-sky-100/50 overflow-hidden">
        <CardHeader className="p-3.5 sm:p-5 pb-3 sm:pb-4 border-b border-sky-100/80 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-600" />
                Jejak Audit Aktivitas Petugas
              </CardTitle>
              <CardDescription className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                Catatan kejadian realtime sistem SIGAP
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari log / admin / tiket..."
                  className="pl-8 h-9 text-xs font-medium rounded-xl border-sky-200/80 focus:border-sky-500 focus:ring-sky-500/20 bg-white/80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b border-sky-100/80">
                  <TableHead className="w-[160px] font-bold text-slate-700 text-xs">Waktu Aktivitas</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Petugas / Admin</TableHead>
                  <TableHead className="w-[130px] font-bold text-slate-700 text-xs">Aktivitas</TableHead>
                  <TableHead className="w-[150px] font-bold text-slate-700 text-xs">Target Tiket</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Deskripsi Perubahan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
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
                    <TableRow key={log.id} className="hover:bg-purple-50/30 transition-colors">
                      <TableCell className="text-xs text-slate-500 font-medium">
                        <div className="font-semibold text-slate-800">{formattedDate}</div>
                        <div className="text-[11px] text-slate-400">{formattedTime} WIB</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
                          {log.admin}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">{log.role}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-bold rounded-full bg-slate-50 border-slate-200 text-slate-700 px-2.5">
                          {log.aktivitas}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-sky-700">
                        {log.target}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 font-medium">
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
