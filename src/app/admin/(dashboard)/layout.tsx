import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminReportNotifier } from "@/components/admin/admin-report-notifier";
import { AdminDockbar } from "@/components/mobile/admin-dockbar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col lg:flex-row bg-slate-50/70 text-slate-800 antialiased selection:bg-sky-500/20 selection:text-sky-700">
      {/* Background Push Notifier Listener */}
      <AdminReportNotifier />

      {/* Premium Background Decorative Ambient Mesh & Dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-sky-300/25 via-indigo-100/20 to-transparent blur-3xl rounded-full animate-pulse-glow" />
        <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-sky-200/25 blur-3xl rounded-full" />
        <div className="absolute top-2/3 -left-32 w-[400px] h-[400px] bg-indigo-100/20 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      </div>

      {/* Reusable Modular Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Wrapper Column */}
      <div className="relative z-10 flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden">
        {/* Fixed Desktop Top Header Bar */}
        <AdminHeader />

        {/* Main Content Area (Strictly Only This Scrolls) */}
        <main className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 lg:p-6 pb-28 lg:pb-6">
          {children}
        </main>
      </div>

      {/* 📱 Mobile Fixed Floating Dockbar (Always Top Level on Root Layout) */}
      <AdminDockbar />
    </div>
  );
}
