import React from "react";
import { getAllReports, getActivityLogs } from "@/lib/report-services";
import { getAllAdminUsers } from "@/lib/admin-services";
import { DashboardView, DashboardReportItem, DashboardLogItem } from "./dashboard-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  let todayCount = 0;
  let thisWeekCount = 0;
  let thisMonthCount = 0;
  let thisYearCount = 0;
  let totalCount = 0;
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

      const now = new Date();

      // Start of Today (00:00:00)
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Start of This Week (Monday 00:00:00)
      const dayOfWeek = now.getDay();
      const diffToMonday = (dayOfWeek + 6) % 7;
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday);

      // Start of This Month (1st day 00:00:00)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Start of This Year (Jan 1st 00:00:00)
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      todayCount = reportsData.filter(
        (r: { created_at: Date }) => new Date(r.created_at) >= startOfToday
      ).length;

      thisWeekCount = reportsData.filter(
        (r: { created_at: Date }) => new Date(r.created_at) >= startOfWeek
      ).length;

      thisMonthCount = reportsData.filter(
        (r: { created_at: Date }) => new Date(r.created_at) >= startOfMonth
      ).length;

      thisYearCount = reportsData.filter(
        (r: { created_at: Date }) => new Date(r.created_at) >= startOfYear
      ).length;

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
      todayCount={todayCount}
      thisWeekCount={thisWeekCount}
      thisMonthCount={thisMonthCount}
      thisYearCount={thisYearCount}
      totalCount={totalCount}
      totalAdminCount={totalAdminCount}
      recentReports={recentReports}
      recentLogs={recentLogs}
    />
  );
}
