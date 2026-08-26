import { CompletedReportItem } from "@/app/admin/(dashboard)/riwayat/riwayat-view";

export interface ExportFilterOptions {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  bagian?: string;    // 'ALL' | 'TUK' | 'Teknik' | 'Pabrikasi' | 'Tanaman'
}

export function filterReportsForExport(
  reports: CompletedReportItem[],
  options: ExportFilterOptions
): CompletedReportItem[] {
  return reports.filter((item) => {
    // Filter by Bagian
    if (options.bagian && options.bagian !== "ALL") {
      if (item.bagian !== options.bagian) return false;
    }

    // Filter by Date Range
    const itemDate = new Date(item.updated_at || item.created_at);
    if (isNaN(itemDate.getTime())) return true;

    if (options.startDate) {
      const start = new Date(options.startDate);
      start.setHours(0, 0, 0, 0);
      if (itemDate < start) return false;
    }

    if (options.endDate) {
      const end = new Date(options.endDate);
      end.setHours(23, 59, 59, 999);
      if (itemDate > end) return false;
    }

    return true;
  });
}

function formatDateIndo(dateStr?: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 📗 1. Export as Excel / CSV
export function exportToExcel(reports: CompletedReportItem[], options: ExportFilterOptions) {
  const headers = [
    "No",
    "Nomor Tiket",
    "Nama Pelapor",
    "Bagian",
    "Unit Kerja",
    "Lokasi Kerusakan",
    "Status",
    "Waktu Lapor",
    "Waktu Selesai",
  ];

  const rows = reports.map((r, idx) => [
    idx + 1,
    `"${r.ticket_number}"`,
    `"${r.nama_pelapor.replace(/"/g, '""')}"`,
    `"${r.bagian.replace(/"/g, '""')}"`,
    `"${r.unit_kerja.replace(/"/g, '""')}"`,
    `"${r.lokasi_kerusakan.replace(/"/g, '""')}"`,
    `"${r.status}"`,
    `"${formatDateIndo(r.created_at)}"`,
    `"${formatDateIndo(r.updated_at || r.created_at)}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `SIGAP_Riwayat_Laporan_${options.startDate || "all"}_sd_${options.endDate || "all"}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 📄 2. Export as TXT
export function exportToTxt(reports: CompletedReportItem[], options: ExportFilterOptions) {
  const lineSeparator = "=".repeat(80);
  const subSeparator = "-".repeat(80);

  const startText = options.startDate ? options.startDate : "Awal";
  const endText = options.endDate ? options.endDate : "Sekarang";
  const bagianText = options.bagian && options.bagian !== "ALL" ? options.bagian : "Semua Bagian";

  let content = `${lineSeparator}\r\n`;
  content += `       LAPORAN RIWAYAT GANGGUAN & PERBAIKAN FASILITAS (SIGAP)\r\n`;
  content += `                       PT KEBON AGUNG - PG TRANGKIL\r\n`;
  content += `${lineSeparator}\r\n`;
  content += `Tanggal Cetak  : ${new Date().toLocaleString("id-ID")}\r\n`;
  content += `Periode Data   : ${startText} s/d ${endText}\r\n`;
  content += `Filter Bagian  : ${bagianText}\r\n`;
  content += `Total Laporan  : ${reports.length} Laporan Selesai\r\n`;
  content += `${lineSeparator}\r\n\r\n`;

  if (reports.length === 0) {
    content += `(Tidak ada riwayat laporan yang sesuai dengan rentang tanggal yang dipilih)\r\n`;
  } else {
    reports.forEach((r, idx) => {
      content += `[${idx + 1}] NOMOR TIKET : ${r.ticket_number}\r\n`;
      content += `    Pelapor      : ${r.nama_pelapor}\r\n`;
      content += `    Bagian       : ${r.bagian}\r\n`;
      content += `    Unit Kerja   : ${r.unit_kerja}\r\n`;
      content += `    Lokasi       : ${r.lokasi_kerusakan}\r\n`;
      content += `    Status       : ${r.status}\r\n`;
      content += `    Waktu Masuk  : ${formatDateIndo(r.created_at)}\r\n`;
      content += `    Waktu Selesai: ${formatDateIndo(r.updated_at || r.created_at)}\r\n`;
      content += `${subSeparator}\r\n`;
    });
  }

  content += `\r\n${lineSeparator}\r\n`;
  content += `Dicetak otomatis oleh Sistem SIGAP PG Trangkil\r\n`;
  content += `${lineSeparator}\r\n`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `SIGAP_Riwayat_Laporan_${options.startDate || "all"}_sd_${options.endDate || "all"}.txt`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 🟦 3. Export as Word / DOCX
export function exportToDocx(reports: CompletedReportItem[], options: ExportFilterOptions) {
  const startText = options.startDate ? options.startDate : "Awal";
  const endText = options.endDate ? options.endDate : "Sekarang";
  const bagianText = options.bagian && options.bagian !== "ALL" ? options.bagian : "Semua Bagian";

  const rowsHtml = reports
    .map(
      (r, idx) => `
      <tr>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px;">${idx + 1}</td>
        <td style="font-family: Consolas, monospace; font-weight: bold; color: #0284c7; border: 1px solid #cbd5e1; padding: 6px;">${r.ticket_number}</td>
        <td style="font-weight: bold; border: 1px solid #cbd5e1; padding: 6px;">${r.nama_pelapor}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${r.bagian}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${r.unit_kerja}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${r.lokasi_kerusakan}</td>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px;">
          <b style="color: #15803d; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">${r.status}</b>
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${formatDateIndo(r.updated_at || r.created_at)}</td>
      </tr>
    `
    )
    .join("");

  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Laporan Riwayat SIGAP - PT Kebon Agung PG Trangkil</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; color: #0f172a; }
        h1 { color: #0284c7; font-size: 16pt; margin: 0; text-align: center; text-transform: uppercase; font-weight: bold; }
        h2 { color: #334155; font-size: 12pt; margin: 4px 0; text-align: center; font-weight: bold; }
        .sub-header { color: #64748b; font-size: 10pt; font-weight: bold; text-align: center; margin-bottom: 16px; }
        .meta-table { width: 100%; margin-bottom: 16px; font-size: 10pt; border-collapse: collapse; }
        .meta-table td { padding: 4px; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
        .data-table th { background-color: #0284c7; color: #ffffff; padding: 8px; border: 1px solid #0284c7; font-weight: bold; text-align: left; }
      </style>
    </head>
    <body>
      <h1>SISTEM INFORMASI GANGGUAN DAN PERBAIKAN (SIGAP)</h1>
      <h2>REKAPITULASI ARSIP LAPORAN GANGGUAN & PERBAIKAN</h2>
      <div class="sub-header">PT KEBON AGUNG &bull; PABRIK GULA TRANGKIL</div>

      <table class="meta-table">
        <tr>
          <td style="width: 140px; font-weight: bold;">Periode Data</td>
          <td>: ${startText} s/d ${endText}</td>
          <td style="width: 140px; font-weight: bold;">Tanggal Cetak</td>
          <td>: ${new Date().toLocaleString("id-ID")}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Filter Bagian</td>
          <td>: ${bagianText}</td>
          <td style="font-weight: bold;">Total Laporan Selesai</td>
          <td>: <b>${reports.length} Tiket Laporan</b></td>
        </tr>
      </table>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">No</th>
            <th style="width: 130px;">Nomor Tiket</th>
            <th style="width: 120px;">Nama Pelapor</th>
            <th style="width: 70px;">Bagian</th>
            <th>Unit / Bagian Kerja</th>
            <th>Lokasi Kerusakan</th>
            <th style="width: 70px; text-align: center;">Status</th>
            <th style="width: 120px;">Waktu Selesai</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || `<tr><td colspan="8" style="text-align: center; padding: 15px;">Tidak ada data laporan</td></tr>`}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(["\uFEFF" + wordContent], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `SIGAP_Riwayat_Laporan_${options.startDate || "all"}_sd_${options.endDate || "all"}.doc`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 📕 3. Export as PDF (Direct Print without about:blank tab)
export function exportToPdf(reports: CompletedReportItem[], options: ExportFilterOptions) {
  const startText = options.startDate ? options.startDate : "Awal";
  const endText = options.endDate ? options.endDate : "Sekarang";
  const bagianText = options.bagian && options.bagian !== "ALL" ? options.bagian : "Semua Bagian";

  const rowsHtml = reports
    .map(
      (r, idx) => `
      <tr>
        <td style="text-align: center; padding: 7px 8px; border: 1px solid #cbd5e1;">${idx + 1}</td>
        <td style="padding: 7px 8px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: bold; color: #0369a1;">${r.ticket_number}</td>
        <td style="padding: 7px 8px; border: 1px solid #cbd5e1; font-weight: 600;">${r.nama_pelapor}</td>
        <td style="padding: 7px 8px; border: 1px solid #cbd5e1;">${r.bagian}</td>
        <td style="padding: 7px 8px; border: 1px solid #cbd5e1;">${r.unit_kerja}</td>
        <td style="padding: 7px 8px; border: 1px solid #cbd5e1;">${r.lokasi_kerusakan}</td>
        <td style="text-align: center; padding: 7px 8px; border: 1px solid #cbd5e1;">
          <span style="background-color: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 9999px; font-weight: bold; font-size: 11px;">
            ${r.status}
          </span>
        </td>
        <td style="padding: 7px 8px; border: 1px solid #cbd5e1; font-size: 11px;">${formatDateIndo(r.updated_at || r.created_at)}</td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <title>Laporan Riwayat SIGAP - PT KEBON AGUNG</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 12mm 10mm;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 10px 15px;
          font-size: 12px;
          background: #ffffff;
        }
        .header {
          text-align: center;
          border-bottom: 2.5px solid #0284c7;
          padding-bottom: 10px;
          margin-bottom: 14px;
        }
        .header h1 {
          margin: 0;
          font-size: 17px;
          text-transform: uppercase;
          color: #0369a1;
          letter-spacing: 0.5px;
          font-weight: 800;
        }
        .header h2 {
          margin: 3px 0 0 0;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }
        .meta-table {
          width: 100%;
          margin-bottom: 12px;
          font-size: 11.5px;
        }
        .meta-table td {
          padding: 3px 0;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 6px;
          font-size: 11px;
        }
        .data-table th {
          background-color: #f1f5f9;
          color: #1e293b;
          padding: 8px;
          border: 1px solid #cbd5e1;
          text-align: left;
          font-weight: 700;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SISTEM INFORMASI GANGGUAN DAN PERBAIKAN (SIGAP)</h1>
        <h2>REKAPITULASI ARSIP LAPORAN GANGGUAN & PERBAIKAN</h2>
        <div style="font-size: 11px; color: #475569; margin-top: 3px; font-weight: bold; letter-spacing: 0.5px;">PT KEBON AGUNG - PG TRANGKIL</div>
      </div>

      <table class="meta-table">
        <tr>
          <td style="width: 140px; font-weight: bold;">Periode Data</td>
          <td>: ${startText} s/d ${endText}</td>
          <td style="width: 140px; font-weight: bold;">Tanggal Cetak</td>
          <td>: ${new Date().toLocaleString("id-ID")}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Filter Bagian</td>
          <td>: ${bagianText}</td>
          <td style="font-weight: bold;">Total Laporan Selesai</td>
          <td>: <strong>${reports.length} Tiket Laporan</strong></td>
        </tr>
      </table>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">No</th>
            <th style="width: 135px;">Nomor Tiket</th>
            <th style="width: 125px;">Nama Pelapor</th>
            <th style="width: 75px;">Bagian</th>
            <th>Unit / Bagian Kerja</th>
            <th>Lokasi Kerusakan</th>
            <th style="width: 75px; text-align: center;">Status</th>
            <th style="width: 120px;">Waktu Selesai</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || `<tr><td colspan="8" style="text-align: center; padding: 20px; color: #64748b;">Tidak ada data laporan</td></tr>`}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Use hidden iframe to trigger print without opening about:blank tab
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    // Fallback if iframe fails
    const win = window.open("", "_blank");
    if (win) {
      win.document.open();
      win.document.write(htmlContent);
      win.document.close();
      win.focus();
      win.print();
    }
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1500);
  }, 300);
}
