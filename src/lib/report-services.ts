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
  penanganan: true,
  created_at: true,
  updated_at: true,
};

async function ensurePenangananColumn() {
  try {
    await db.$executeRawUnsafe(
      `ALTER TABLE reports ADD COLUMN penanganan TEXT DEFAULT NULL`
    );
  } catch {
    // Column already exists or table not ready, safely ignore
  }
}

export async function getAllReports() {
  try {
    await ensurePenangananColumn();
    return await db.report.findMany({
      select: reportSelect,
      orderBy: { created_at: "desc" },
    });
  } catch (err) {
    console.error("Failed to fetch reports from MySQL:", err);
    return [];
  }
}

export async function getActiveReports() {
  try {
    await ensurePenangananColumn();
    return await db.report.findMany({
      where: {
        status: { in: ["MENUNGGU", "DIPROSES"] },
      },
      select: reportSelect,
      orderBy: { created_at: "desc" },
    });
  } catch (err) {
    console.error("Failed to fetch active reports from MySQL:", err);
    return [];
  }
}

export async function getReportByTicket(ticketNumber: string) {
  try {
    await ensurePenangananColumn();
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
    await ensurePenangananColumn();
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
    await ensurePenangananColumn();
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
  const basePrefix = "SIGAP";
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

  let currentTicket = data.ticket_number;
  if (!currentTicket) {
    const timestampEntropy = String(Date.now()).slice(-4);
    const randomSalt = Math.floor(100 + Math.random() * 900);
    currentTicket = `${basePrefix}-${dateStr}-${timestampEntropy}${randomSalt}`;
  }

  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await db.report.create({
        data: {
          ticket_number: currentTicket,
          nama_pelapor: data.nama_pelapor,
          bagian: data.bagian,
          unit_kerja: data.unit_kerja,
          nomor_hp: data.nomor_hp || null,
          lokasi_kerusakan: data.lokasi_kerusakan,
          deskripsi: data.deskripsi,
          foto_url: data.foto_url || null,
          status: "MENUNGGU",
        },
      });
    } catch (err: unknown) {
      const isUniqueConstraint =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code: string }).code === "P2002";

      if (isUniqueConstraint && attempt < maxAttempts - 1) {
        const timestampEntropy = String(Date.now()).slice(-4);
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

export async function updateReportStatus(
  id: string,
  newStatus: string,
  adminName = "Admin SIGAP",
  penanganan?: string | null
) {
  try {
    await ensurePenangananColumn();
    const now = new Date();

    if (penanganan !== undefined && penanganan !== null) {
      await db.$executeRawUnsafe(
        `UPDATE reports SET status = ?, penanganan = ?, updated_at = ? WHERE id = ? OR ticket_number = ?`,
        newStatus,
        penanganan,
        now,
        id,
        id
      );
    } else {
      await db.$executeRawUnsafe(
        `UPDATE reports SET status = ?, updated_at = ? WHERE id = ? OR ticket_number = ?`,
        newStatus,
        now,
        id,
        id
      );
    }

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
      penanganan?: string | null;
      created_at: Date | string;
      updated_at: Date | string;
    }>>(
      `SELECT id, ticket_number, nama_pelapor, bagian, unit_kerja, nomor_hp, lokasi_kerusakan, deskripsi, foto_url, status, penanganan, created_at, updated_at FROM reports WHERE id = ? OR ticket_number = ? LIMIT 1`,
      id,
      id
    );

    const report = reports && reports.length > 0
      ? reports[0]
      : { id, ticket_number: id, status: newStatus, penanganan, updated_at: now };

    // Record activity log
    try {
      const logId = crypto.randomUUID();
      const logDeskripsi = penanganan
        ? `Mengubah status laporan ${report.ticket_number} menjadi ${newStatus}. Catatan penanganan: ${penanganan}`
        : `Mengubah status laporan ${report.ticket_number} menjadi ${newStatus}.`;

      await db.$executeRawUnsafe(
        `INSERT INTO activity_logs (id, waktu, admin, role, aktivitas, target, deskripsi) VALUES (?, ?, ?, 'SUPER_ADMIN', ?, ?, ?)`,
        logId,
        now,
        adminName,
        newStatus === "SELESAI" ? "Penyelesaian Perbaikan" : "Disposisi Laporan",
        report.ticket_number,
        logDeskripsi
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
