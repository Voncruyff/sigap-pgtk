import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportForm } from "@/components/user/report-form";

export default function LaporPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="space-y-4">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50/80 rounded-full text-xs sm:text-sm"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100/60 px-3 py-1 rounded-full border border-sky-200/50">
            <Wrench className="h-3.5 w-3.5" />
            Formulir Online
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
            Laporkan Kerusakan
          </h1>
          <p className="text-xs sm:text-base text-slate-500">
            Laporkan kerusakan fasilitas atau peralatan agar dapat segera ditindaklanjuti oleh petugas SIGAP.
          </p>
        </div>
      </div>

      {/* Form Laporan Card */}
      <ReportForm />
    </div>
  );
}
