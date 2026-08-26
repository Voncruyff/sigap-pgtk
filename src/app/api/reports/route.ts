import { NextResponse } from "next/server";
import { createReport, getAllReports } from "@/lib/report-services";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const reports = await getAllReports();
    return NextResponse.json(reports);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch reports";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newReport = await createReport(body);
    return NextResponse.json(newReport, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/reports error:", err);
    const message = err instanceof Error ? err.message : "Failed to create report in MySQL";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
