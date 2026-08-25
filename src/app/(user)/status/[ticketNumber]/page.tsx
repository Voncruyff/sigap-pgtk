import React from "react";
import { createClient } from "@/lib/supabase/server";
import { StatusDetailView, StatusDetailReportItem } from "./status-detail-view";

interface StatusDetailPageProps {
  params: Promise<{
    ticketNumber: string;
  }>;
}

export default async function StatusDetailPage({ params }: StatusDetailPageProps) {
  const { ticketNumber } = await params;
  const supabase = await createClient();

  let report: StatusDetailReportItem | null = null;

  try {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("ticket_number", ticketNumber)
      .single();

    if (data) {
      report = data;
    }
  } catch (err) {
    console.warn("Supabase fetch report warning:", err);
  }

  return <StatusDetailView ticketNumber={ticketNumber} report={report} />;
}
