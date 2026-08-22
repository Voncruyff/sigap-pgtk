import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusSearchForm } from "@/components/user/status-search-form";

export default function CekStatusPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="space-y-4">
        <Link href="/" className="inline-block">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border border-sky-200/90 bg-white text-slate-700 hover:text-sky-700 hover:bg-sky-50/90 hover:border-sky-300 font-bold text-xs sm:text-sm shadow-2xs transition-all flex items-center gap-2 px-4 py-2.5"
          >
            <ArrowLeft className="h-4 w-4 text-sky-600" />
            Kembali ke Beranda
          </Button>
        </Link>

        <div className="space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100/60 px-3 py-1 rounded-full border border-sky-200/50">
            <Search className="h-3.5 w-3.5" />
            Pencarian Tiket
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
            Cek Status Laporan
          </h1>
          <p className="text-xs sm:text-base text-slate-500">
            Masukkan nomor laporan untuk melihat perkembangan penanganan kerusakan oleh tim teknisi.
          </p>
        </div>
      </div>

      {/* Form Cek Status */}
      <StatusSearchForm />
    </div>
  );
}
