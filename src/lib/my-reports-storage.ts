"use client";

export interface LocalReportItem {
  ticket_number: string;
  peralatan: string;
  unit_kerja: string;
  created_at: string;
}

const STORAGE_KEY = "sigap_my_reports_history";

export function getLocalReportHistory(): LocalReportItem[] {
  if (typeof window === "undefined") return [];
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];
    return JSON.parse(rawData) as LocalReportItem[];
  } catch (err) {
    console.warn("Failed to read local report history:", err);
    return [];
  }
}

export function saveReportToLocalHistory(report: {
  ticket_number: string;
  peralatan: string;
  unit_kerja: string;
  created_at?: string;
}): void {
  if (typeof window === "undefined" || !report.ticket_number) return;
  try {
    const history = getLocalReportHistory();
    // Avoid duplicate ticket numbers
    const exists = history.some((item) => item.ticket_number === report.ticket_number);
    if (!exists) {
      const newItem: LocalReportItem = {
        ticket_number: report.ticket_number,
        peralatan: report.peralatan || "Fasilitas / Peralatan",
        unit_kerja: report.unit_kerja || "Unit Kerja",
        created_at: report.created_at || new Date().toISOString(),
      };
      const updated = [newItem, ...history];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn("Failed to save local report history:", err);
  }
}

export function removeReportFromLocalHistory(ticketNumber: string): LocalReportItem[] {
  if (typeof window === "undefined") return [];
  try {
    const history = getLocalReportHistory();
    const updated = history.filter((item) => item.ticket_number !== ticketNumber);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("Failed to remove local report history item:", err);
    return [];
  }
}
