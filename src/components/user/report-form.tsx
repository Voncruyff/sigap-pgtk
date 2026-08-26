"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, FileText, Loader2, CheckCircle2, Copy, Plus, Home } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  reportSchema,
  ReportFormValues,
  WORK_UNITS,
} from "./report-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./image-upload";
import { saveReportToLocalHistory } from "@/lib/my-reports-storage";

function generateTicketNumber(bagian?: string) {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const timeEntropy = Date.now().toString().slice(-4);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  let prefix = "TRK";
  if (bagian) {
    const cleaned = bagian.trim().toUpperCase();
    if (cleaned === "TUK" || cleaned.startsWith("TUK")) {
      prefix = "TUK";
    } else if (cleaned.startsWith("TEK")) {
      prefix = "TNK";
    } else if (cleaned.startsWith("PAB")) {
      prefix = "PBK";
    } else if (cleaned.startsWith("TAN")) {
      prefix = "TNM";
    } else {
      prefix = cleaned.replace(/[^A-Z0-9]/g, "").slice(0, 3) || "TRK";
    }
  }
  return `${prefix}-${dateStr}-${timeEntropy}${randomNum}`;
}

export function ReportForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<{
    ticketNumber: string;
    namaPelapor: string;
    bagian: string;
    unitKerja: string;
    deskripsi: string;
  } | null>(null);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      namaPelapor: "",
      bagian: "",
      unitKerja: "",
      nomorHp: "",
      deskripsi: "",
      foto: null,
    },
  });

  const selectedBagian = useWatch({ control: form.control, name: "bagian" });

  const filteredWorkUnits = selectedBagian
    ? WORK_UNITS.filter((unit) => unit.department === selectedBagian)
    : [];

  const copyTicketNumber = () => {
    if (submittedReport) {
      navigator.clipboard.writeText(submittedReport.ticketNumber);
      toast.success("Nomor tiket berhasil disalin ke clipboard!");
    }
  };

  const handleCreateNewReport = () => {
    setSubmittedReport(null);
    form.reset({
      namaPelapor: "",
      bagian: "",
      unitKerja: "",
      nomorHp: "",
      deskripsi: "",
      foto: null,
    });
  };

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    try {
      let fotoUrl: string | null = null;

      // Handle image if provided (base64 data url for MySQL storage)
      if (data.foto instanceof File) {
        fotoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(data.foto as File);
        });
      }

      const ticketNumber = generateTicketNumber(data.bagian);

      const payload = {
        ticket_number: ticketNumber,
        nama_pelapor: data.namaPelapor,
        bagian: data.bagian,
        unit_kerja: data.unitKerja,
        nomor_hp: data.nomorHp || null,
        lokasi_kerusakan: data.unitKerja,
        deskripsi: data.deskripsi,
        foto_url: fotoUrl,
      };

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(resData.error || "Gagal menyimpan laporan ke database MySQL.");
      }

      const finalTicketNumber = resData.ticket_number || ticketNumber;

      // Save to local device history
      saveReportToLocalHistory({
        ticket_number: finalTicketNumber,
        unit_kerja: data.unitKerja,
      });

      setSubmittedReport({
        ticketNumber: finalTicketNumber,
        namaPelapor: data.namaPelapor,
        bagian: data.bagian,
        unitKerja: data.unitKerja,
        deskripsi: data.deskripsi,
      });

      toast.success("Laporan kerusakan berhasil tercatat!", {
        description: `Nomor Tiket: ${finalTicketNumber}`,
      });
    } catch (err: unknown) {
      console.error("Error submitting report:", err);
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim laporan.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Single Card Container For Report Form */}
        <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-2xs overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm sm:text-base font-extrabold flex items-center gap-2.5 text-slate-900">
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 shrink-0">
                <FileText className="h-4 w-4 shrink-0" />
              </div>
              Formulir Laporan Kerusakan
            </CardTitle>
          </CardHeader>

          <CardContent className="p-3.5 sm:p-6 space-y-4">
            {/* Row 1: Nama Pelapor & Nomor HP (Perfectly Aligned 2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Nama Pelapor */}
              <FormField
                control={form.control}
                name="namaPelapor"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-slate-700 block">
                      Nama Pelapor <span className="text-rose-500 font-bold">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama lengkap Anda"
                        {...field}
                        className="rounded-lg h-10 text-xs sm:text-sm border-slate-200 focus-visible:ring-2 focus-visible:ring-sky-500/20 focus-visible:border-sky-500 bg-white shadow-2xs font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nomor HP / Kontak */}
              <FormField
                control={form.control}
                name="nomorHp"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-bold text-slate-700 block">
                        Nomor HP / Kontak
                      </FormLabel>
                      <span className="text-[11px] text-slate-400 font-medium">
                        (Opsional)
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="08xxxxxxxxxx"
                        {...field}
                        className="rounded-lg h-10 text-xs sm:text-sm border-slate-200 focus-visible:ring-2 focus-visible:ring-sky-500/20 focus-visible:border-sky-500 bg-white shadow-2xs font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Bagian & Unit / Bagian Kerja (Perfectly Aligned 2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Bagian */}
              <FormField
                control={form.control}
                name="bagian"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-slate-700 block">
                      Bagian <span className="text-rose-500 font-bold">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("unitKerja", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-lg h-10 text-xs sm:text-sm border-slate-200 focus-visible:ring-2 focus-visible:ring-sky-500/20 focus-visible:border-sky-500 bg-white shadow-2xs font-medium text-slate-900">
                          <SelectValue placeholder="Pilih bagian" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TUK">TUK</SelectItem>
                        <SelectItem value="Teknik">Teknik</SelectItem>
                        <SelectItem value="Pabrikasi">Pabrikasi</SelectItem>
                        <SelectItem value="Tanaman">Tanaman</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unit / Bagian Kerja */}
              <FormField
                control={form.control}
                name="unitKerja"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-slate-700 block">
                      Unit / Bagian Kerja <span className="text-rose-500 font-bold">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedBagian}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-lg h-10 text-xs sm:text-sm border-slate-200 focus-visible:ring-2 focus-visible:ring-sky-500/20 focus-visible:border-sky-500 bg-white shadow-2xs font-medium text-slate-900">
                          <SelectValue
                            placeholder={
                              !selectedBagian
                                ? "Pilih bagian terlebih dahulu"
                                : "Pilih unit / bagian kerja"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredWorkUnits.map((unit) => (
                          <SelectItem key={unit.kobag} value={unit.name}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 3: Deskripsi Kerusakan */}
            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-bold text-slate-700 block">
                    Deskripsi Kerusakan <span className="text-rose-500 font-bold">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jelaskan kondisi atau lokasi spesifik kerusakan..."
                      className="min-h-24 resize-y rounded-lg text-xs sm:text-sm border-slate-200 focus-visible:ring-2 focus-visible:ring-sky-500/20 focus-visible:border-sky-500 bg-white shadow-2xs font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 4: Foto Lampiran (Opsional) */}
            <FormField
              control={form.control}
              name="foto"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-bold text-slate-700 block">
                      Foto Lampiran Kerusakan
                    </FormLabel>
                    <span className="text-[11px] text-slate-400 font-medium">
                      (Opsional)
                    </span>
                  </div>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(file) => field.onChange(file)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-11 px-8 text-xs sm:text-sm font-bold bg-sky-700 hover:bg-sky-800 text-white rounded-xl shadow-2xs cursor-pointer transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mencatat Laporan...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Kirim Laporan Kerusakan
              </>
            )}
          </Button>
        </div>
      </form>

      {/* 🎉 Modal Dialog: Konfirmasi Sukses Pelaporan */}
      <Dialog
        open={Boolean(submittedReport)}
        onOpenChange={(open) => {
          if (!open) handleCreateNewReport();
        }}
      >
        <DialogContent className="max-w-md p-6 rounded-3xl bg-white border border-sky-100 shadow-2xl space-y-4">
          <DialogHeader className="text-center sm:text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-lg sm:text-xl font-black text-slate-900">
              Laporan Berhasil Dicatat!
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Laporan gangguan fasilitas Anda telah berhasil tersimpan ke sistem SIGAP PT Kebon Agung PG Trangkil.
            </DialogDescription>
          </DialogHeader>

          {/* Ticket Badge Box */}
          {submittedReport && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-center space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Nomor Tiket Resmi
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base sm:text-lg font-black text-sky-800 font-mono tracking-tight bg-white px-3 py-1 rounded-xl border border-sky-200 shadow-2xs">
                    {submittedReport.ticketNumber}
                  </span>
                  <button
                    type="button"
                    onClick={copyTicketNumber}
                    className="p-1.5 rounded-xl bg-white text-slate-600 hover:text-sky-700 border border-slate-200 hover:border-sky-300 shadow-2xs transition-all cursor-pointer"
                    title="Salin Nomor Tiket"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Summary Details */}
              <div className="bg-white border border-slate-100 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600 border-b border-slate-50 pb-1.5">
                  <span className="text-slate-400 font-medium">Pelapor:</span>
                  <span className="font-bold text-slate-900">{submittedReport.namaPelapor}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 border-b border-slate-50 pb-1.5">
                  <span className="text-slate-400 font-medium">Bagian / Unit:</span>
                  <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">
                    {submittedReport.bagian} - {submittedReport.unitKerja}
                  </span>
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-slate-400 font-medium block">Deskripsi:</span>
                  <p className="font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl line-clamp-3 text-[11px] leading-relaxed">
                    {submittedReport.deskripsi}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCreateNewReport}
              className="h-10 text-xs font-bold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4 text-sky-600" />
              Lapor Lagi
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/")}
              className="h-10 text-xs font-bold rounded-xl bg-sky-700 hover:bg-sky-800 text-white shadow-md shadow-sky-700/20 flex items-center justify-center gap-1.5"
            >
              <Home className="h-4 w-4" />
              Ke Beranda
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
