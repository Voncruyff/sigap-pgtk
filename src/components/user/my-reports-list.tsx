"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ExternalLink, Trash2, BookmarkCheck, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getLocalReportHistory,
  removeReportFromLocalHistory,
  LocalReportItem,
} from "@/lib/my-reports-storage";
import { toast } from "sonner";

export function MyReportsList() {
  const [history, setHistory] = useState<LocalReportItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHistory(getLocalReportHistory());
    setIsLoaded(true);
  }, []);

  const handleDelete = (ticketNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = removeReportFromLocalHistory(ticketNumber);
    setHistory(updated);
    toast.success("Nomor tiket dihapus dari riwayat perangkat.");
  };

  if (!isLoaded || history.length === 0) {
    return null;
  }

  return (
    <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-sky-100/50 overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-sky-100/80 bg-gradient-to-r from-sky-50/80 via-white to-white">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BookmarkCheck className="h-4.5 w-4.5 text-sky-600 shrink-0" />
              Laporan Saya di Perangkat Ini
            </CardTitle>
            <CardDescription className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              Klik laporan di bawah untuk langsung mengecek perkembangan perbaikan.
            </CardDescription>
          </div>
          <span className="text-[10px] font-bold text-sky-700 bg-sky-100/80 px-2.5 py-0.5 rounded-full border border-sky-200">
            {history.length} Tiket
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-2.5">
        {history.map((item) => {
          const dateObj = new Date(item.created_at);
          const formattedDate = dateObj.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <div
              key={item.ticket_number}
              className="group border border-slate-200/70 hover:border-sky-300 bg-slate-50/50 hover:bg-sky-50/40 rounded-2xl p-3 sm:p-3.5 transition-all flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-black text-sky-700">
                    {item.ticket_number}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {formattedDate}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 truncate">
                  {item.unit_kerja}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Link href={`/status/${item.ticket_number}`}>
                  <Button
                    size="sm"
                    className="h-8 px-3 rounded-full text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-2xs"
                  >
                    Lihat Status
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDelete(item.ticket_number, e)}
                  title="Hapus dari riwayat HP"
                  className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
