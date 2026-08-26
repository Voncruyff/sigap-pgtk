"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ExternalLink, Trash2, BookmarkCheck } from "lucide-react";
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
    <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-2xs overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4 text-sky-700 shrink-0" />
              Laporan Saya di Perangkat Ini
            </CardTitle>
            <CardDescription className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              Klik laporan di bawah untuk mengecek progres penanganan teknisi.
            </CardDescription>
          </div>
          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
            {history.length} Tiket
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-2">
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
              className="border border-slate-200/80 hover:border-sky-300 bg-white hover:bg-sky-50/30 rounded-xl p-3 transition-all flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-sky-700">
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

              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/status/${item.ticket_number}`}>
                  <Button
                    size="sm"
                    className="h-8 px-3 rounded-lg text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-2xs cursor-pointer"
                  >
                    Detail
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDelete(item.ticket_number, e)}
                  title="Hapus dari riwayat HP"
                  className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
