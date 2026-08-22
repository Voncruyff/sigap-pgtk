import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Search, ArrowRight, ShieldCheck, Clock, FileCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16 py-2 sm:py-8">
      {/* Hero Banner Section */}
      <section className="text-center space-y-5 sm:space-y-6 max-w-4xl mx-auto pt-2 sm:pt-4 relative">
        {/* Company Identity Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs sm:text-sm font-bold text-sky-800 border border-sky-200/80 shadow-sm backdrop-blur-md hover:scale-[1.02] transition-transform">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-600"></span>
          </span>
          <span className="tracking-wide">PT KEBON AGUNG &bull; PABRIK GULA TRANGKIL</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight px-2">
            Layanan Pelaporan <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Gangguan & Perbaikan
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-2 font-medium">
            Laporkan kendala fasilitas atau peralatan pabrik secara mudah dan cepat. Dapatkan nomor tiket resmi dan pantau status perbaikan secara realtime.
          </p>
        </div>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3">
          <Link href="/lapor" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-14 px-7 sm:px-9 rounded-full text-sm sm:text-base font-bold bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-xl shadow-sky-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Wrench className="mr-2.5 h-4 w-4 sm:h-5 sm:w-5" />
              Laporkan Kerusakan
              <ArrowRight className="ml-2.5 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <Link href="/cek-status" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-14 px-7 sm:px-9 rounded-full text-sm sm:text-base font-bold border-sky-200/90 text-sky-800 bg-white/80 hover:bg-sky-50/90 hover:border-sky-300 transition-all shadow-xs hover:scale-105 active:scale-95"
            >
              <Search className="mr-2.5 h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              Cek Status Laporan
            </Button>
          </Link>
        </div>
      </section>

      {/* 2 Main Interactive Action Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
        {/* Card 1: Buat Laporan */}
        <Link href="/lapor" className="group block">
          <Card className="h-full border border-sky-100/90 bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-xl shadow-sky-100/60 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-sky-500/15 group-hover:border-sky-300">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform">
                <Wrench className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors flex items-center justify-between">
                  Laporkan Kerusakan
                  <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sky-600" />
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  Isi formulir kerusakan fasilitas atau mesin peralatan pabrik secara online tanpa perlu login.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-sky-600">
                <span className="inline-flex items-center gap-1 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                  <Sparkles className="h-3 w-3" />
                  Formulir Cepat &bull; Unggah Foto
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 2: Cek Status */}
        <Link href="/cek-status" className="group block">
          <Card className="h-full border border-sky-100/90 bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-xl shadow-sky-100/60 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-sky-500/15 group-hover:border-sky-300">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                <Search className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors flex items-center justify-between">
                  Cek Status Laporan
                  <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sky-600" />
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  Masukkan nomor tiket laporan Anda untuk memantau progres penanganan oleh tim teknisi.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-indigo-600">
                <span className="inline-flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  <CheckCircle2 className="h-3 w-3" />
                  Lacak Realtime &bull; Bebas Ribet
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* 3 Easy Steps Section (1-2-3 Guide) */}
      <section className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pt-2">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
            3 Langkah Mudah Pelaporan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Proses cepat dari pengajuan hingga tindak lanjut perbaikan fasilitas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Step 1 */}
          <Card className="border border-sky-100/90 bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center space-y-3 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-2 space-y-2.5">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-black text-lg shadow-md shadow-sky-500/20">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-center gap-1.5">
                <FileCheck className="h-4 w-4 text-sky-600" />
                Isi Form Laporan
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Pilih Bagian & Unit Kerja, masukkan nama peralatan dan deskripsikan kerusakan yang terjadi.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border border-sky-100/90 bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center space-y-3 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-2 space-y-2.5">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-black text-lg shadow-md shadow-sky-500/20">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-sky-600" />
                Dapatkan Kode Tiket
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Sistem akan menerbitkan kode unik tiket laporan (contoh: <code className="font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">SIGAP-20260821-001</code>).
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border border-sky-100/90 bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center space-y-3 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-2 space-y-2.5">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-black text-lg shadow-md shadow-sky-500/20">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-center gap-1.5">
                <Clock className="h-4 w-4 text-sky-600" />
                Pantau Progres
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Cek status perkembangan penanganan secara berkala hingga perbaikan diselesaikan petugas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
