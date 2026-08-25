import React from "react";
import { createClient } from "@/lib/supabase/server";
import { LaporanListView, LaporanItem } from "./laporan-list-view";

const FALLBACK_REPORTS: LaporanItem[] = [
  {
    id: "1",
    ticket_number: "SIGAP-20260821-001",
    nama_pelapor: "Ahmad Subagyo",
    bagian: "Teknik",
    unit_kerja: "25002 - GILINGAN",
    nomor_hp: "081234567890",
    lokasi_kerusakan: "Stasiun Gilingan Stasiun 1",
    peralatan: "Pompa Nira No. 2",
    deskripsi: "Kebocoran pada seal gland pompa menyebabkan tekanan nira merosot.",
    status: "MENUNGGU",
    created_at: "2026-08-21T08:00:00.000Z",
  },
  {
    id: "2",
    ticket_number: "SIGAP-20260821-002",
    nama_pelapor: "Budi Santoso",
    bagian: "Teknik",
    unit_kerja: "25011 - LISTRIK",
    nomor_hp: "081987654321",
    lokasi_kerusakan: "Ruang Substation Listrik",
    peralatan: "Panel Breaker Utama 380V",
    deskripsi: "Temperatur MCCB naik melebihi batas 75 derajat Celcius.",
    status: "DIPROSES",
    created_at: "2026-08-21T07:00:00.000Z",
  },
  {
    id: "3",
    ticket_number: "SIGAP-20260820-005",
    nama_pelapor: "Cahyo Utomo",
    bagian: "Pabrikasi",
    unit_kerja: "35024 - PENGUAPAN",
    nomor_hp: "081122334455",
    lokasi_kerusakan: "Badan Evaporator No 4",
    peralatan: "Klep Steam Evaporator 4",
    deskripsi: "Tuas pemutar klep macet tidak dapat dibuka penuh.",
    status: "SELESAI",
    created_at: "2026-08-20T14:30:00.000Z",
  },
];

export default async function AdminLaporanPage() {
  const supabase = await createClient();

  let reports: LaporanItem[] = [];

  try {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      reports = data;
    }
  } catch (err) {
    console.warn("Supabase fetch reports warning:", err);
  }

  if (reports.length === 0) {
    reports = FALLBACK_REPORTS;
  }

  return <LaporanListView reports={reports} />;
}
