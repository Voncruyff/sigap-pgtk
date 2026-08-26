import React from "react";
import { getReportByTicket } from "@/lib/report-services";
import { StatusDetailView, StatusDetailReportItem } from "./status-detail-view";

interface StatusDetailPageProps {
  params: Promise<{
    ticketNumber: string;
  }>;
}

export default async function StatusDetailPage({ params }: StatusDetailPageProps) {
  const { ticketNumber } = await params;
  let report: StatusDetailReportItem | null = null;

  try {
    const data = await getReportByTicket(ticketNumber);
    if (data) {
      report = {
        ...data,
        created_at: data.created_at.toISOString(),
      };
    }
  } catch (err) {
    console.warn("MySQL fetch report error:", err);
  }

  return <StatusDetailView ticketNumber={ticketNumber} report={report} />;
}
