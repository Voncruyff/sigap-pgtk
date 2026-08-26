import React from "react";
import { getAllReports } from "@/lib/report-services";
import { DashboardView, DashboardReportItem } from "./dashboard-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  let totalCount = 0;
  let waitingCount = 0;
  let processingCount = 0;
  let completedCount = 0;
  let recentReports: DashboardReportItem[] = [];

  try {
    const reportsData = await getAllReports();

    if (reportsData && reportsData.length > 0) {
      totalCount = reportsData.length;
      waitingCount = reportsData.filter((r: { status: string }) => r.status === "MENUNGGU").length;
      processingCount = reportsData.filter((r: { status: string }) => r.status === "DIPROSES").length;
      completedCount = reportsData.filter((r: { status: string }) => r.status === "SELESAI").length;
      recentReports = reportsData.slice(0, 5).map((r: { created_at: Date; [key: string]: unknown }) => ({
        ...(r as unknown as DashboardReportItem),
        created_at: r.created_at.toISOString(),
      }));
    }
  } catch (err) {
    console.warn("MySQL fetch warning in dashboard:", err);
  }

  return (
    <DashboardView
      totalCount={totalCount}
      waitingCount={waitingCount}
      processingCount={processingCount}
      completedCount={completedCount}
      recentReports={recentReports}
    />
  );
}
