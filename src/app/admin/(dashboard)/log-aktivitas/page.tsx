import React from "react";
import { LogAktivitasView, LogItem } from "./log-aktivitas-view";

const SAMPLE_LOGS: LogItem[] = [
  {
    id: "1",
    waktu: "2026-08-21T08:30:00.000Z",
    admin: "Administrator SIGAP",
    role: "Super Admin",
    aktivitas: "Ubah Status",
    target: "SIGAP-20260821-002",
    deskripsi: "Mengubah status laporan dari MENUNGGU menjadi DIPROSES.",
  },
  {
    id: "2",
    waktu: "2026-08-21T07:15:00.000Z",
    admin: "Teknisi Listrik",
    role: "Petugas Lapangan",
    aktivitas: "Penanganan",
    target: "SIGAP-20260821-002",
    deskripsi: "Menambahkan catatan penanganan: Penggantian MCCB 380V selesai.",
  },
  {
    id: "3",
    waktu: "2026-08-20T14:30:00.000Z",
    admin: "Administrator SIGAP",
    role: "Super Admin",
    aktivitas: "Ubah Status",
    target: "SIGAP-20260820-005",
    deskripsi: "Mengubah status laporan dari DIPROSES menjadi SELESAI.",
  },
  {
    id: "4",
    waktu: "2026-08-20T09:00:00.000Z",
    admin: "System",
    role: "Automated Service",
    aktivitas: "Laporan Baru",
    target: "SIGAP-20260821-001",
    deskripsi: "Laporan baru dibuat oleh pelapor Ahmad Subagyo (Teknik).",
  },
];

export default function AdminLogAktivitasPage() {
  return <LogAktivitasView logs={SAMPLE_LOGS} />;
}
