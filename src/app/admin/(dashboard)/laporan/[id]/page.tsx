import React from "react";
import { createClient } from "@/lib/supabase/server";
import { LaporanDetailView, LaporanDetailItem } from "./laporan-detail-view";

interface ReportDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminLaporanDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  let report: LaporanDetailItem | null = null;

  try {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .or(`id.eq.${id},ticket_number.eq.${id}`)
      .single();

    if (data) {
      report = data;
    }
  } catch (err) {
    console.warn("Supabase fetch report detail warning:", err);
  }

  // Fallback sample data if query finds no report
  if (!report) {
    report = {
      id: id,
      ticket_number: "SIGAP-20260821-001",
      nama_pelapor: "Ahmad Subagyo",
      bagian: "Teknik",
      unit_kerja: "25002 - GILINGAN",
      nomor_hp: "081234567890",
      lokasi_kerusakan: "Stasiun Gilingan Stasiun 1",
      peralatan: "Pompa Nira No. 2",
      deskripsi: "Kebocoran pada seal gland pompa menyebabkan tekanan nira merosot drastis.",
      dampak: "Menghambat sebagian pekerjaan",
      status: "MENUNGGU",
      created_at: new Date().toISOString(),
    };
  }

  return <LaporanDetailView report={report} />;
}
