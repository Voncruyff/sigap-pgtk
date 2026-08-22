"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LockKeyhole, Wrench, Search, Building, Menu, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Buat Laporan", href: "/lapor", icon: Wrench },
    { label: "Cek Status", href: "/cek-status", icon: Search },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-800 antialiased selection:bg-sky-500/20 selection:text-sky-700">
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky-200/40 via-sky-100/20 to-transparent blur-3xl rounded-full opacity-70" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-sky-100/30 blur-3xl rounded-full" />
      </div>

      {/* Responsive Header Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-sky-100/80 transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          {/* Logo Original PT Kebon Agung Pabrik Gula Trangkil */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group py-1">
            <div className="relative h-11 w-auto max-w-[220px] sm:max-w-[290px] flex items-center">
              <Image
                src="/logo-pg-trangkil.png"
                alt="Logo PT Kebon Agung Pabrik Gula Trangkil"
                width={300}
                height={60}
                priority
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
            <div className="hidden xl:flex items-center gap-1.5 border-l pl-3 ml-1 border-sky-100">
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="font-extrabold text-sm tracking-tight text-slate-900">
                SIGAP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Hidden on Mobile < md) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                      : "text-slate-600 hover:text-sky-600 hover:bg-sky-50/80"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-sky-500"}`} />
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/admin/login"
              className="ml-2 px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:text-sky-700 bg-slate-100 hover:bg-sky-100/60 transition-all flex items-center gap-1.5 border border-slate-200/60"
            >
              <LockKeyhole className="h-3.5 w-3.5 text-sky-600" />
              Login Admin
            </Link>
          </nav>

          {/* Mobile Navigation Drawer Trigger (Visible on Mobile < md) */}
          <div className="flex md:hidden items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger render={<Button variant="outline" size="icon-sm" className="rounded-xl border-sky-200 text-sky-700" aria-label="Buka Menu" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6">
                <SheetHeader className="text-left border-b pb-4 mb-6">
                  <SheetTitle className="text-sky-700 font-extrabold flex items-center gap-2">
                    <Image
                      src="/logo-pg-trangkil.png"
                      alt="Logo PT Kebon Agung PG Trangkil"
                      width={240}
                      height={50}
                      className="h-8 sm:h-9 w-auto object-contain"
                    />
                  </SheetTitle>
                  <p className="text-xs text-slate-500 font-medium pt-1">
                    SIGAP — Sistem Informasi Gangguan & Perbaikan
                  </p>
                </SheetHeader>

                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                            : "text-slate-700 hover:bg-sky-50"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-sky-600"}`} />
                        {item.label}
                      </Link>
                    );
                  })}

                  <div className="pt-4 border-t mt-4">
                    <Link
                      href="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-sky-100/60 border border-slate-200/60"
                    >
                      <LockKeyhole className="h-4 w-4 text-sky-600" />
                      Login Admin
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {children}
      </main>

      {/* Footer Modern */}
      <footer className="relative z-10 border-t border-sky-100/80 py-8 bg-white/80 backdrop-blur-xs text-slate-500 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-sky-600" />
            <span className="font-semibold text-slate-700">PT Kebon Agung &bull; Pabrik Gula Trangkil</span>
          </div>
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} SIGAP — Sistem Informasi Gangguan & Perbaikan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
