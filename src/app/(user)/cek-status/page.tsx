import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusSearchForm } from "@/components/user/status-search-form";

export default function CekStatusPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="space-y-4">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50/80 rounded-full"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100/60 px-3 py-1 rounded-full border border-sky-200/50">
            <Search className="h-3.5 w-3.5" />
            Pencarian Tiket
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Cek Status Laporan
          </h1>
          <p className="text-sm sm:text-base text-slate-500">
            Masukkan nomor laporan untuk melihat perkembangan penanganan kerusakan oleh tim teknisi.
          </p>
        </div>
      </div>

      {/* Form Cek Status */}
      <StatusSearchForm />
    </div>
  );
}
