"use client";

import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportForm } from "@/components/user/report-form";
import { FadeIn, FadeInScale } from "@/components/ui/motion";

export default function LaporPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Halaman */}
      <FadeIn className="space-y-4">
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
      </FadeIn>

      {/* Form Laporan Card */}
      <FadeInScale delay={0.1}>
        <ReportForm />
      </FadeInScale>
    </div>
  );
}
