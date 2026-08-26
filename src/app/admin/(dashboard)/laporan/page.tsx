import React from "react";
import { getActiveReports } from "@/lib/report-services";
import { LaporanListView, LaporanItem } from "./laporan-list-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLaporanPage() {
  let reports: LaporanItem[] = [];

  try {
    const data = await getActiveReports();

    if (data && data.length > 0) {
      reports = data.map((item: { created_at: Date; [key: string]: unknown }) => ({
        ...(item as unknown as LaporanItem),
        created_at: item.created_at.toISOString(),
      }));
    }
  } catch (err) {
    console.warn("MySQL fetch reports error:", err);
  }

  return <LaporanListView reports={reports} />;
}
