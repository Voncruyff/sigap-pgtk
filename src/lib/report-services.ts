import { db } from "@/lib/db";
import crypto from "crypto";

const reportSelect = {
  id: true,
  ticket_number: true,
  nama_pelapor: true,
  bagian: true,
  unit_kerja: true,
  nomor_hp: true,
  lokasi_kerusakan: true,
  deskripsi: true,
  foto_url: true,
  status: true,
  created_at: true,
  updated_at: true,
};

export async function getAllReports() {
  try {
    return await db.report.findMany({
      select: reportSelect,
      orderBy: { created_at: "desc" },
    });
  } catch (err) {
    console.error("Failed to fetch reports from MySQL:", err);
    return [];
  }
}

export async function getReportByTicket(ticketNumber: string) {
  try {
    return await db.report.findUnique({
      where: { ticket_number: ticketNumber },
      select: reportSelect,
    });
  } catch (err) {
    console.error("Failed to fetch report by ticket from MySQL:", err);
    return null;
  }
}

export async function getReportById(id: string) {
  try {
    return await db.report.findUnique({
      where: { id },
      select: reportSelect,
    });
  } catch (err) {
    console.error("Failed to fetch report by ID from MySQL:", err);
    return null;
  }
}

export async function getCompletedReports() {
  try {
    return await db.report.findMany({
      where: { status: "SELESAI" },
      select: reportSelect,
      orderBy: { updated_at: "desc" },
    });
  } catch (err) {
    console.error("Failed to fetch completed reports from MySQL:", err);
    return [];
  }
}

export async function getActivityLogs() {
  try {
    return await db.activityLog.findMany({
      orderBy: { waktu: "desc" },
    });
  } catch (err) {
    console.error("Failed to fetch activity logs from MySQL:", err);
    return [];
  }
}

export async function createReport(data: {
  ticket_number?: string;
  nama_pelapor: string;
  bagian: string;
  unit_kerja: string;
  nomor_hp?: string | null;
  lokasi_kerusakan: string;
  deskripsi: string;
  foto_url?: string | null;
}) {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const basePrefix = data.bagian ? data.bagian.replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase() : "TRK";

  let currentTicket = data.ticket_number || `${basePrefix}-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Auto-retry loop to handle any possible unique constraint collision seamlessly
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await db.report.create({
        data: {
          ticket_number: currentTicket,
          nama_pelapor: data.nama_pelapor.trim(),
          bagian: data.bagian.trim(),
          unit_kerja: data.unit_kerja.trim(),
          nomor_hp: data.nomor_hp || null,
          lokasi_kerusakan: data.lokasi_kerusakan || data.unit_kerja,
          deskripsi: data.deskripsi.trim(),
          foto_url: data.foto_url || null,
          status: "MENUNGGU",
        },
        select: reportSelect,
      });
    } catch (err: any) {
      const isDuplicate = err?.code === "P2002" || err?.message?.includes("Unique constraint") || err?.message?.includes("Duplicate entry");
      if (isDuplicate) {
        const timestampEntropy = Date.now().toString().slice(-4);
        const randomSalt = Math.floor(1000 + Math.random() * 9000);
        currentTicket = `${basePrefix}-${dateStr}-${timestampEntropy}${randomSalt}`;
        continue;
      }
      console.error("Failed to create report in MySQL:", err);
      throw err;
    }
  }

  throw new Error("Gagal membuat laporan setelah beberapa percobaan nomor tiket unik.");
}

export async function updateReportStatus(id: string, newStatus: string, adminName = "Admin SIGAP") {
  try {
    const now = new Date();

    // Update by id or ticket_number
    await db.$executeRawUnsafe(
      `UPDATE reports SET status = ?, updated_at = ? WHERE id = ? OR ticket_number = ?`,
      newStatus,
      now,
      id,
      id
    );

    const reports = await db.$queryRawUnsafe<Array<{
      id: string;
      ticket_number: string;
      nama_pelapor: string;
      bagian: string;
      unit_kerja: string;
      nomor_hp: string | null;
      lokasi_kerusakan: string;
      deskripsi: string;
      foto_url: string | null;
      status: string;
      created_at: Date | string;
      updated_at: Date | string;
    }>>(
      `SELECT id, ticket_number, nama_pelapor, bagian, unit_kerja, nomor_hp, lokasi_kerusakan, deskripsi, foto_url, status, created_at, updated_at FROM reports WHERE id = ? OR ticket_number = ? LIMIT 1`,
      id,
      id
    );

    const report = reports && reports.length > 0
      ? reports[0]
      : { id, ticket_number: id, status: newStatus, updated_at: now };

    // Record activity log
    try {
      const logId = crypto.randomUUID();
      await db.$executeRawUnsafe(
        `INSERT INTO activity_logs (id, waktu, admin, role, aktivitas, target, deskripsi) VALUES (?, ?, ?, 'SUPER_ADMIN', ?, ?, ?)`,
        logId,
        now,
        adminName,
        newStatus === "SELESAI" ? "Penyelesaian Perbaikan" : "Disposisi Laporan",
        report.ticket_number,
        `Mengubah status laporan ${report.ticket_number} menjadi ${newStatus}.`
      );
    } catch (logErr) {
      console.warn("Failed to create activity log:", logErr);
    }

    return report;
  } catch (err) {
    console.error("Failed to update report status in MySQL:", err);
    throw err;
  }
}
