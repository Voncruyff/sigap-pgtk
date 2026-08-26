import React from "react";
import { getAllReports, getActivityLogs } from "@/lib/report-services";
import { getAllAdminUsers } from "@/lib/admin-services";
import { DashboardView, DashboardReportItem, DashboardLogItem } from "./dashboard-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  let totalCount = 0;
  let teknikCount = 0;
  let pabrikasiCount = 0;
  let tanamanCount = 0;
  let tukCount = 0;
  let totalAdminCount = 0;
  let recentReports: DashboardReportItem[] = [];
  let recentLogs: DashboardLogItem[] = [];

  try {
    const [reportsData, logsData, usersData] = await Promise.all([
      getAllReports(),
      getActivityLogs(),
      getAllAdminUsers(),
    ]);

    if (reportsData && reportsData.length > 0) {
      totalCount = reportsData.length;
      teknikCount = reportsData.filter((r: { bagian: string }) => r.bagian === "Teknik").length;
      pabrikasiCount = reportsData.filter((r: { bagian: string }) => r.bagian === "Pabrikasi").length;
      tanamanCount = reportsData.filter((r: { bagian: string }) => r.bagian === "Tanaman").length;
      tukCount = reportsData.filter((r: { bagian: string }) => r.bagian === "TUK").length;
      
      recentReports = reportsData.slice(0, 6).map((r: { created_at: Date; [key: string]: unknown }) => ({
        ...(r as unknown as DashboardReportItem),
        created_at: r.created_at.toISOString(),
      }));
    }

    if (logsData && logsData.length > 0) {
      recentLogs = logsData.slice(0, 4).map((l: { waktu: Date; [key: string]: unknown }) => ({
        ...(l as unknown as DashboardLogItem),
        waktu: l.waktu ? new Date(l.waktu).toISOString() : new Date().toISOString(),
      }));
    }

    if (usersData) {
      totalAdminCount = usersData.length;
    }
  } catch (err) {
    console.warn("MySQL fetch warning in dashboard:", err);
  }

  return (
    <DashboardView
      totalCount={totalCount}
      teknikCount={teknikCount}
      pabrikasiCount={pabrikasiCount}
      tanamanCount={tanamanCount}
      tukCount={tukCount}
      totalAdminCount={totalAdminCount}
      recentReports={recentReports}
      recentLogs={recentLogs}
    />
  );
}
