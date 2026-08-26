"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Search, ArrowRight, ShieldCheck, Clock, FileCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { LandingMobileView } from "@/components/mobile/landing-mobile-view";

export function LandingView() {
  return (
    <>
      {/* 🖥️ Tampilan Utama Desktop / PC */}
      <div className="hidden lg:block space-y-12 py-6">
        {/* Desktop Hero Section */}
        <StaggerContainer className="text-center space-y-6 max-w-4xl mx-auto pt-4 relative">
          <StaggerItem>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-sky-800 border border-sky-200/80 shadow-2xs backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
              </span>
              <span className="tracking-wide">PT KEBON AGUNG &bull; PABRIK GULA TRANGKIL</span>
            </div>
          </StaggerItem>

          <StaggerItem className="space-y-3">
            <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Layanan Pelaporan <br />
              <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
                Gangguan & Perbaikan
              </span>
            </h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Laporkan kendala fasilitas atau peralatan pabrik secara mudah dan cepat. Dapatkan nomor tiket resmi dan pantau status perbaikan secara realtime.
            </p>
          </StaggerItem>

          <StaggerItem className="flex items-center justify-center gap-4 pt-2">
            <Link href="/lapor">
              <Button
                size="lg"
                className="h-13 px-8 rounded-full text-base font-bold bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg shadow-sky-600/25 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Wrench className="mr-2 h-5 w-5" />
                Laporkan Kerusakan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cek-status">
              <Button
                variant="outline"
                size="lg"
                className="h-13 px-8 rounded-full text-base font-bold border-sky-200/90 text-sky-800 bg-white/80 hover:bg-sky-50/90 hover:border-sky-300 transition-all shadow-2xs hover:scale-[1.02] active:scale-95"
              >
                <Search className="mr-2 h-5 w-5 text-sky-600" />
                Cek Status Laporan
              </Button>
            </Link>
          </StaggerItem>
        </StaggerContainer>

        {/* Desktop 2 Cards Grid */}
        <StaggerContainer className="grid grid-cols-2 gap-5 max-w-4xl mx-auto">
          <StaggerItem>
            <Link href="/lapor" className="group block">
              <Card className="border border-sky-100/90 bg-white/90 backdrop-blur-md rounded-3xl shadow-md hover:shadow-xl shadow-sky-100/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-sky-300">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-500/25 shrink-0 group-hover:scale-105 transition-transform">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        Laporkan Kerusakan
                      </h3>
                      <ArrowRight className="h-4 w-4 text-sky-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-1" />
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-snug font-medium">
                      Isi formulir kerusakan fasilitas atau peralatan pabrik online tanpa perlu login.
                    </p>
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md text-[11px] font-bold border border-sky-100">
                        <Sparkles className="h-3 w-3" />
                        Form Cepat &bull; Foto
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </StaggerItem>

          <StaggerItem>
            <Link href="/cek-status" className="group block">
              <Card className="border border-sky-100/90 bg-white/90 backdrop-blur-md rounded-3xl shadow-md hover:shadow-xl shadow-sky-100/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-sky-300">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 shrink-0 group-hover:scale-105 transition-transform">
                    <Search className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        Cek Status Laporan
                      </h3>
                      <ArrowRight className="h-4 w-4 text-sky-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-1" />
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-snug font-medium">
                      Masukkan nomor tiket laporan untuk memantau progres penanganan teknisi.
                    </p>
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[11px] font-bold border border-indigo-100">
                        <CheckCircle2 className="h-3 w-3" />
                        Lacak Realtime
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </StaggerItem>
        </StaggerContainer>

        {/* Desktop 3 Steps */}
        <section className="max-w-4xl mx-auto space-y-4 pt-2">
          <FadeIn className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-900">
              3 Langkah Mudah Pelaporan
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Proses cepat dari pengajuan hingga tindak lanjut perbaikan
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-3 gap-4">
            <StaggerItem>
              <div className="border border-sky-100/90 bg-white/85 backdrop-blur-md rounded-2xl p-4 text-center space-y-2 shadow-2xs hover:shadow-md transition-all">
                <div className="mx-auto h-10 w-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center justify-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-sky-600 shrink-0" />
                  Isi Form Laporan
                </h4>
                <p className="text-xs text-slate-500 leading-snug font-medium">
                  Pilih Bagian & Unit Kerja, masukkan lokasi & deskripsi kerusakan.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="border border-sky-100/90 bg-white/85 backdrop-blur-md rounded-2xl p-4 text-center space-y-2 shadow-2xs hover:shadow-md transition-all">
                <div className="mx-auto h-10 w-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-sky-600 shrink-0" />
                  Dapatkan Kode Tiket
                </h4>
                <p className="text-xs text-slate-500 leading-snug font-medium">
                  Sistem menerbitkan nomor tiket unik (<code className="font-mono text-sky-700">SIGAP-2026...</code>).
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="border border-sky-100/90 bg-white/85 backdrop-blur-md rounded-2xl p-4 text-center space-y-2 shadow-2xs hover:shadow-md transition-all">
                <div className="mx-auto h-10 w-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center justify-center gap-1.5">
                  <Clock className="h-4 w-4 text-sky-600 shrink-0" />
                  Pantau Progres
                </h4>
                <p className="text-xs text-slate-500 leading-snug font-medium">
                  Cek status perkembangan penanganan hingga perbaikan selesai.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>
      </div>

      {/* 📱 Tampilan Khusus Mobile HP (Disimpan di Folder src/components/mobile/) */}
      <div className="block lg:hidden">
        <LandingMobileView />
      </div>
    </>
  );
}
