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
    <div className="min-h-screen min-h-[100dvh] lg:h-screen lg:overflow-hidden w-full flex flex-col lg:flex-row bg-slate-50/70 text-slate-800 antialiased selection:bg-sky-500/20 selection:text-sky-700 relative">
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
      <div className="relative z-10 flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-hidden">
        {/* Fixed Desktop Top Header Bar */}
        <AdminHeader />

        {/* Main Content Area (Natural mobile scroll, strict desktop scroll) */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 pb-28 lg:pb-6 lg:overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 📱 Mobile Fixed Floating Dockbar (Always visible on mobile view) */}
      <AdminDockbar />
    </div>
  );
}
