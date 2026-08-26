import React from "react";
import { getCompletedReports } from "@/lib/report-services";
import { RiwayatView, CompletedReportItem } from "./riwayat-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminRiwayatPage() {
  let completedReports: CompletedReportItem[] = [];

  try {
    const data = await getCompletedReports();

    if (data && data.length > 0) {
      completedReports = data.map((item: { created_at: Date; updated_at: Date; [key: string]: unknown }) => ({
        ...(item as unknown as CompletedReportItem),
        created_at: item.created_at.toISOString(),
        updated_at: item.updated_at.toISOString(),
      }));
    }
  } catch (err) {
    console.warn("MySQL fetch completed reports error:", err);
  }

  return <RiwayatView completedReports={completedReports} />;
}
