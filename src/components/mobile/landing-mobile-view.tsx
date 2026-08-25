"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Search, ArrowRight, ShieldCheck, Clock, FileCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export function LandingMobileView() {
  return (
    <div className="space-y-6 py-2">
      {/* Mobile Hero Banner Section */}
      <StaggerContainer className="text-center space-y-3.5 pt-1">
        <StaggerItem>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-sky-800 border border-sky-200/80 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
            </span>
            <span>PG TRANGKIL &bull; SIGAP</span>
          </div>
        </StaggerItem>

        <StaggerItem className="space-y-1.5 px-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
            Layanan Pelaporan <br />
            <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Gangguan & Perbaikan
            </span>
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Laporkan kendala fasilitas atau peralatan secara online & lacak nomor tiket perbaikan realtime.
          </p>
        </StaggerItem>

        {/* Mobile Touch Action Buttons */}
        <StaggerItem className="flex flex-col gap-2.5 pt-1 px-2">
          <Link href="/lapor" className="w-full">
            <Button
              size="lg"
              className="w-full h-12 rounded-full text-xs font-bold bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-md shadow-sky-600/25 active:scale-95"
            >
              <Wrench className="mr-2 h-4 w-4" />
              Laporkan Kerusakan Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/cek-status" className="w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 rounded-full text-xs font-bold border-sky-200/90 text-sky-800 bg-white hover:bg-sky-50 active:scale-95"
            >
              <Search className="mr-2 h-4 w-4 text-sky-600" />
              Cek Status Tiket Laporan
            </Button>
          </Link>
        </StaggerItem>
      </StaggerContainer>

      {/* Mobile Stacked Action Cards */}
      <div className="space-y-3 px-1">
        <Link href="/lapor" className="block">
          <Card className="border border-sky-100/90 bg-white/90 rounded-2xl shadow-sm active:scale-98 transition-transform">
            <CardContent className="p-4 flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0">
                <Wrench className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Laporkan Kerusakan</h3>
                  <ArrowRight className="h-4 w-4 text-sky-600 shrink-0 ml-1" />
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">
                  Isi formulir kerusakan fasilitas online tanpa login.
                </p>
                <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-sky-100 mt-1">
                  <Sparkles className="h-3 w-3" /> Form Cepat
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/cek-status" className="block">
          <Card className="border border-sky-100/90 bg-white/90 rounded-2xl shadow-sm active:scale-98 transition-transform">
            <CardContent className="p-4 flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                <Search className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Cek Status Laporan</h3>
                  <ArrowRight className="h-4 w-4 text-sky-600 shrink-0 ml-1" />
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">
                  Pantau tiket laporan perbaikan langsung di HP.
                </p>
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-indigo-100 mt-1">
                  <CheckCircle2 className="h-3 w-3" /> Lacak Realtime
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Mobile 3 Steps List */}
      <section className="space-y-3 pt-1">
        <FadeIn className="text-center space-y-0.5">
          <h2 className="text-base font-black text-slate-900">
            3 Langkah Pelaporan HP
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Proses pelaporan praktis lewat smartphone
          </p>
        </FadeIn>

        <div className="space-y-2.5">
          <div className="border border-sky-100/90 bg-white/85 rounded-2xl p-3 flex items-center gap-3 shadow-2xs">
            <div className="h-8 w-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs shrink-0">
              1
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                <FileCheck className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                Isi Form Laporan
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Pilih unit kerja, peralatan & jelaskan masalahnya.
              </p>
            </div>
          </div>

          <div className="border border-sky-100/90 bg-white/85 rounded-2xl p-3 flex items-center gap-3 shadow-2xs">
            <div className="h-8 w-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs shrink-0">
              2
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                Dapatkan Tiket
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Tiket disimpan otomatis di riwayat HP.
              </p>
            </div>
          </div>

          <div className="border border-sky-100/90 bg-white/85 rounded-2xl p-3 flex items-center gap-3 shadow-2xs">
            <div className="h-8 w-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs shrink-0">
              3
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                Pantau Perbaikan
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Pantau perkembangan penanganan perbaikan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
