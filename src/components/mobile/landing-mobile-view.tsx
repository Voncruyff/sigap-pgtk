"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowRight, ShieldCheck, Clock, FileCheck } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export function LandingMobileView() {
  return (
    <div className="space-y-6 py-3">
      {/* Mobile Hero Banner Section */}
      <StaggerContainer className="text-center space-y-3.5 pt-1">
        <StaggerItem>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[11px] font-bold text-sky-800 border border-slate-200 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
            </span>
            <span>PG TRANGKIL &bull; SIGAP</span>
          </div>
        </StaggerItem>

        <StaggerItem className="space-y-1.5 px-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Sistem Pelaporan Gangguan <br />
            <span className="text-sky-700">
              &amp; Perbaikan (SIGAP)
            </span>
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Layanan pencatatan dan pelaporan kerusakan fasilitas &amp; peralatan pabrik secara terpadu.
          </p>
        </StaggerItem>

        {/* Mobile Single Primary Action Button */}
        <StaggerItem className="pt-2 px-1">
          <Link href="/lapor" className="w-full block">
            <Button
              size="lg"
              className="w-full h-12 rounded-2xl text-sm font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-md shadow-sky-700/20 active:scale-98 transition-all"
            >
              <Wrench className="mr-2 h-4 w-4" />
              Buat Laporan Kerusakan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </StaggerItem>
      </StaggerContainer>

      {/* Mobile 3 Steps List */}
      <section className="space-y-3 pt-2">
        <FadeIn className="text-center space-y-0.5">
          <h2 className="text-sm font-extrabold text-slate-900">
            Alur Pelaporan Kerusakan
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            3 langkah mudah dari smartphone Anda
          </p>
        </FadeIn>

        <div className="space-y-2.5">
          <div className="border border-slate-200/90 bg-white rounded-2xl p-3.5 flex items-center gap-3.5 shadow-2xs">
            <div className="h-8 w-8 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              1
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                Isi Formulir Kerusakan
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight font-medium mt-0.5">
                Pilih unit kerja &amp; lampirkan foto kerusakan langsung dari HP.
              </p>
            </div>
          </div>

          <div className="border border-slate-200/90 bg-white rounded-2xl p-3.5 flex items-center gap-3.5 shadow-2xs">
            <div className="h-8 w-8 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              2
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                Dapatkan Nomor Tiket
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight font-medium mt-0.5">
                Nomor tiket resmi otomatis diterbitkan sebagai bukti pelaporan.
              </p>
            </div>
          </div>

          <div className="border border-slate-200/90 bg-white rounded-2xl p-3.5 flex items-center gap-3.5 shadow-2xs">
            <div className="h-8 w-8 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              3
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                Tercatat di Riwayat
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight font-medium mt-0.5">
                Laporan masuk ke sistem riwayat petugas untuk ditindaklanjuti.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
