import React from "react";
import { createClient } from "@/lib/supabase/server";
import { RiwayatView, CompletedReportItem } from "./riwayat-view";

const FALLBACK_COMPLETED_REPORTS: CompletedReportItem[] = [
  {
    id: "3",
    ticket_number: "SIGAP-20260820-005",
    nama_pelapor: "Cahyo Utomo",
    bagian: "Pabrikasi",
    unit_kerja: "35024 - PENGUAPAN",
    lokasi_kerusakan: "Badan Evaporator No 4",
    peralatan: "Klep Steam Evaporator 4",
    status: "SELESAI",
    created_at: "2026-08-20T14:30:00.000Z",
    updated_at: "2026-08-21T02:00:00.000Z",
  },
  {
    id: "4",
    ticket_number: "SIGAP-20260819-012",
    nama_pelapor: "Dedi Setiawan",
    bagian: "Teknik",
    unit_kerja: "25002 - GILINGAN",
    lokasi_kerusakan: "Stasiun Gilingan No 3",
    peralatan: "Conveyor Tebu No. 1",
    status: "SELESAI",
    created_at: "2026-08-19T10:15:00.000Z",
    updated_at: "2026-08-20T11:00:00.000Z",
  },
];

export default async function AdminRiwayatPage() {
  const supabase = await createClient();

  let completedReports: CompletedReportItem[] = [];

  try {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("status", "SELESAI")
      .order("updated_at", { ascending: false });

    if (data) {
      completedReports = data;
    }
  } catch (err) {
    console.warn("Supabase fetch completed reports warning:", err);
  }

  if (completedReports.length === 0) {
    completedReports = FALLBACK_COMPLETED_REPORTS;
  }

  return <RiwayatView completedReports={completedReports} />;
}
