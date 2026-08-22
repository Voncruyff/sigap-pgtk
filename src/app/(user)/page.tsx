import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Search, ArrowRight, ShieldCheck, Clock, FileCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16 py-2 sm:py-8">
      {/* Hero Banner Section */}
      <section className="text-center space-y-5 sm:space-y-6 max-w-4xl mx-auto pt-2 sm:pt-4">
        {/* Company Identity Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-sky-800 border border-sky-200/60 shadow-xs backdrop-blur-xs">
          <span className="h-2 w-2 rounded-full bg-sky-600 animate-ping" />
          <span>PT KEBON AGUNG &bull; PABRIK GULA TRANGKIL</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight px-2">
            Layanan Pelaporan <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 bg-clip-text text-transparent">
              Gangguan & Perbaikan
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
            Laporkan kendala fasilitas atau peralatan pabrik secara mudah dan cepat. Dapatkan nomor tiket resmi dan pantau status perbaikan secara realtime.
          </p>
        </div>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <Link href="/lapor" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 rounded-full text-sm sm:text-base font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xl shadow-sky-600/25 transition-all hover:scale-105"
            >
              <Wrench className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Laporkan Kerusakan
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <Link href="/cek-status" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 rounded-full text-sm sm:text-base font-semibold border-sky-200 text-sky-700 hover:bg-sky-50/80 hover:border-sky-300 transition-all"
            >
              <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              Cek Status Laporan
            </Button>
          </Link>
        </div>
      </section>

      {/* 2 Main Interactive Action Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
        {/* Card 1: Buat Laporan */}
        <Link href="/lapor" className="group block">
          <Card className="h-full border border-sky-100 bg-white/90 backdrop-blur-xs rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-lg shadow-sky-100/60 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-sky-500/15 group-hover:border-sky-300">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-500/30 group-hover:scale-110 transition-transform">
                <Wrench className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors flex items-center justify-between">
                  Laporkan Kerusakan
                  <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sky-600" />
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Isi formulir kerusakan fasilitas atau mesin peralatan pabrik secara online tanpa perlu login.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-sky-600">
                <span>Formulir Cepat &bull; Unggah Foto</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 2: Cek Status */}
        <Link href="/cek-status" className="group block">
          <Card className="h-full border border-sky-100 bg-white/90 backdrop-blur-xs rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-lg shadow-sky-100/60 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-sky-500/15 group-hover:border-sky-300">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-600/30 group-hover:scale-110 transition-transform">
                <Search className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors flex items-center justify-between">
                  Cek Status Laporan
                  <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sky-600" />
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Masukkan nomor tiket laporan Anda untuk memantau progres penanganan oleh tim teknisi.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-sky-600">
                <span>Lacak Realtime &bull; Bebas Ribet</span>
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
          <p className="text-xs sm:text-sm text-slate-500">
            Proses cepat dari pengajuan hingga tindak lanjut perbaikan fasilitas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Step 1 */}
          <Card className="border border-sky-100/80 bg-white/70 backdrop-blur-xs rounded-2xl p-3.5 sm:p-4 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow">
            <CardContent className="pt-2 space-y-2.5">
              <div className="mx-auto h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-base sm:text-lg">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-center gap-1.5">
                <FileCheck className="h-4 w-4 text-sky-600" />
                Isi Form Laporan
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pilih Bagian & Unit Kerja, masukkan nama peralatan dan deskripsikan kerusakan yang terjadi.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border border-sky-100/80 bg-white/70 backdrop-blur-xs rounded-2xl p-3.5 sm:p-4 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow">
            <CardContent className="pt-2 space-y-2.5">
              <div className="mx-auto h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-base sm:text-lg">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-sky-600" />
                Dapatkan Kode Tiket
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sistem akan menerbitkan kode unik tiket laporan (contoh: <code className="font-mono text-sky-700">SIGAP-20260821-001</code>).
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border border-sky-100/80 bg-white/70 backdrop-blur-xs rounded-2xl p-3.5 sm:p-4 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow">
            <CardContent className="pt-2 space-y-2.5">
              <div className="mx-auto h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-base sm:text-lg">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-center gap-1.5">
                <Clock className="h-4 w-4 text-sky-600" />
                Pantau Progres
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cek status perkembangan penanganan secara berkala hingga perbaikan diselesaikan petugas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
