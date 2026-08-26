import React from "react";
import { getAllReports } from "@/lib/report-services";
import { RiwayatView, CompletedReportItem } from "./riwayat-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminRiwayatPage() {
  let reports: CompletedReportItem[] = [];

  try {
    const data = await getAllReports();

    if (data && data.length > 0) {
      reports = data.map((item: { created_at: Date; updated_at: Date; [key: string]: unknown }) => ({
        ...(item as unknown as CompletedReportItem),
        created_at: item.created_at.toISOString(),
        updated_at: item.updated_at.toISOString(),
      }));
    }
  } catch (err) {
    console.warn("MySQL fetch all reports for riwayat error:", err);
  }

  return <RiwayatView completedReports={reports} />;
}
