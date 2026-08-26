"use client";

import React from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusSearchForm } from "@/components/user/status-search-form";
import { MyReportsList } from "@/components/user/my-reports-list";
import { FadeIn, FadeInScale } from "@/components/ui/motion";

export function CekStatusView() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header Halaman Dynamic */}
      <FadeIn>
        <PageHeader
          title="Cek Status Laporan"
          description="Masukkan nomor laporan untuk melihat perkembangan penanganan kerusakan oleh tim teknisi."
          badgeText="Pencarian Tiket"
          icon={Search}
          backUrl="/"
          backLabel="Kembali ke Beranda"
        />
      </FadeIn>

      {/* Form Cek Status & List Laporan Saya */}
      <FadeInScale delay={0.1} className="space-y-6">
        <StatusSearchForm />
        <MyReportsList />
      </FadeInScale>
    </div>
  );
}
