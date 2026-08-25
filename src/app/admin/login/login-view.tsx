import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";

export function LoginView() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50/70 text-slate-800 antialiased selection:bg-sky-500/20 selection:text-sky-700 relative overflow-hidden">
      {/* Premium Background Decorative Ambient Mesh & Dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky-300/30 via-indigo-100/20 to-transparent blur-3xl rounded-full animate-pulse-glow" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-sky-200/30 blur-3xl rounded-full" />
        <div className="absolute top-2/3 -left-32 w-[350px] h-[350px] bg-indigo-100/25 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Card Header & Form */}
        <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-sky-100/50 overflow-hidden transition-all">
          <CardHeader className="space-y-3 text-center pb-5 border-b border-sky-100/80 bg-gradient-to-r from-sky-50/70 via-white to-sky-50/70">
            <div className="mx-auto h-12 w-auto max-w-[240px] flex items-center justify-center pt-2">
              <Image
                src="/logo-pg-trangkil.png"
                alt="Logo PT Kebon Agung PG Trangkil"
                width={260}
                height={55}
                priority
                className="h-10 w-auto object-contain drop-shadow-xs"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/70 border border-sky-200 text-sky-800 text-xs font-black tracking-wider uppercase">
                <Shield className="h-3.5 w-3.5 text-sky-600" />
                SIGAP Admin Panel
              </div>
              <p className="text-xs text-slate-500 font-medium mt-2">
                Sistem Informasi Gangguan dan Perbaikan
                <br />
                PT Kebon Agung &bull; Pabrik Gula Trangkil
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-6">
            <LoginForm />
          </CardContent>
        </Card>

        {/* Tombol Kembali ke Halaman Utama */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:text-sky-700 bg-white/80 hover:bg-white border border-slate-200/80 hover:border-sky-300 shadow-2xs transition-all"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5 text-sky-600" />
            Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </div>
  );
}
