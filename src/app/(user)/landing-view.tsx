"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowRight, ShieldCheck, Clock, FileCheck } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { LandingMobileView } from "@/components/mobile/landing-mobile-view";

export function LandingView() {
  return (
    <>
      {/* 🖥️ Tampilan Utama Desktop / PC */}
      <div className="hidden lg:block space-y-12 py-6">
        {/* Desktop Hero Section Minimalis & Corporate */}
        <StaggerContainer className="text-center space-y-5 max-w-3xl mx-auto pt-4">
          <StaggerItem>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-sky-800 border border-slate-200 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
              </span>
              <span className="tracking-wider">PT KEBON AGUNG &bull; PABRIK GULA TRANGKIL</span>
            </div>
          </StaggerItem>

          <StaggerItem className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Sistem Pelaporan Gangguan <br />
              <span className="text-sky-700">
                &amp; Perbaikan Fasilitas (SIGAP)
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
              Layanan praktis pencatatan dan pelaporan kerusakan peralatan &amp; fasilitas pabrik. Kirim laporan secara cepat tanpa login dan otomatis tercatat ke sistem riwayat.
            </p>
          </StaggerItem>

          <StaggerItem className="flex items-center justify-center pt-2">
            <Link href="/lapor">
              <Button
                size="lg"
                className="h-13 px-9 rounded-2xl text-base font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-md shadow-sky-700/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Wrench className="mr-2.5 h-5 w-5" />
                Buat Laporan Kerusakan Sekarang
                <ArrowRight className="ml-2.5 h-5 w-5" />
              </Button>
            </Link>
          </StaggerItem>
        </StaggerContainer>

        {/* Desktop 3 Easy Steps Section */}
        <section className="max-w-4xl mx-auto space-y-6 pt-4">
          <FadeIn className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">
              Alur Pelaporan Kerusakan
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              3 langkah praktis pencatatan gangguan fasilitas pabrik
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-3 gap-5">
            <StaggerItem>
              <div className="border border-slate-200/90 bg-white rounded-3xl p-6 text-center space-y-3 shadow-2xs hover:border-sky-300 transition-all">
                <div className="mx-auto h-11 w-11 rounded-2xl bg-sky-700 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  1
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center justify-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-sky-600 shrink-0" />
                  Isi Formulir
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Pilih Bagian &amp; Unit Kerja serta jelaskan lokasi &amp; kondisi kerusakan peralatan.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="border border-slate-200/90 bg-white rounded-3xl p-6 text-center space-y-3 shadow-2xs hover:border-sky-300 transition-all">
                <div className="mx-auto h-11 w-11 rounded-2xl bg-sky-700 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  2
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-sky-600 shrink-0" />
                  Nomor Tiket
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Sistem otomatis menerbitkan nomor tiket resmi sebagai tanda bukti pelaporan Anda.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="border border-slate-200/90 bg-white rounded-3xl p-6 text-center space-y-3 shadow-2xs hover:border-sky-300 transition-all">
                <div className="mx-auto h-11 w-11 rounded-2xl bg-sky-700 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  3
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center justify-center gap-1.5">
                  <Clock className="h-4 w-4 text-sky-600 shrink-0" />
                  Tercatat di Riwayat
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Laporan masuk ke sistem riwayat petugas untuk ditinjau dan ditindaklanjuti.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>
      </div>

      {/* 📱 Tampilan Khusus Mobile HP */}
      <div className="block lg:hidden">
        <LandingMobileView />
      </div>
    </>
  );
}
