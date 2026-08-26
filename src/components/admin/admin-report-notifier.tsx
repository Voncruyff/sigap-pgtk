"use client";

import { useEffect, useRef } from "react";
import { sendBrowserPushNotification, getNotificationSettings } from "@/lib/notifications";

export function AdminReportNotifier() {
  const lastKnownReportId = useRef<string | null>(null);
  const isFirstCheck = useRef<boolean>(true);

  useEffect(() => {
    // Initial fetch to set baseline report ID
    const checkNewReports = async () => {
      try {
        const settings = getNotificationSettings();
        if (!settings.pushEnabled && !settings.soundEnabled) return;

        const res = await fetch("/api/reports?limit=1");
        if (!res.ok) return;

        const data = await res.json();
        const latest = Array.isArray(data) ? data[0] : (data.reports ? data.reports[0] : null);

        if (!latest || !latest.id) return;

        if (isFirstCheck.current) {
          lastKnownReportId.current = latest.id;
          isFirstCheck.current = false;
          return;
        }

        // If a new report has appeared
        if (lastKnownReportId.current && latest.id !== lastKnownReportId.current) {
          lastKnownReportId.current = latest.id;

          // Trigger YouTube-style Desktop Push Notification
          sendBrowserPushNotification({
            title: `Laporan Baru #${latest.ticket_number || "SIGAP"}`,
            body: `${latest.nama_pelapor || "Pelapor"} (${latest.unit_kerja || latest.bagian || "Unit Kerja"}): ${latest.deskripsi || latest.lokasi_kerusakan || "Laporan kerusakan baru masuk"}`,
            onClickUrl: `/admin/laporan/${latest.id}`,
          });
        }
      } catch (err) {
        // Silently ignore polling network glitch
      }
    };

    checkNewReports();
    const interval = setInterval(checkNewReports, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}
