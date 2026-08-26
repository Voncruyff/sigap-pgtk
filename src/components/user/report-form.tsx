"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, FileText, Loader2 } from "lucide-react";

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
  FormDescription,
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

      toast.success("Laporan berhasil terkirim ke Database!", {
        description: `Nomor tiket resmi: ${finalTicketNumber}`,
      });

      router.push(`/status/${finalTicketNumber}`);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Single Card Container For Report Form */}
        <Card className="border border-sky-100/90 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-sky-100/60 overflow-hidden">
          <CardHeader className="p-5 sm:p-6 border-b border-sky-100/80 bg-gradient-to-r from-sky-50/80 via-white to-white">
            <CardTitle className="text-base sm:text-lg font-extrabold flex items-center gap-2.5 text-slate-900">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <FileText className="h-5 w-5 text-sky-600 shrink-0" />
              </div>
              Form Pelaporan Kerusakan Fasilitas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-7 space-y-4 sm:space-y-5">
            {/* Row 1: Nama Pelapor & Nomor HP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Nama Pelapor */}
              <FormField
                control={form.control}
                name="namaPelapor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700">
                      Nama Pelapor <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap Anda" {...field} className="rounded-xl h-11 text-xs sm:text-sm border-sky-200/90 focus-visible:ring-sky-500" />
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
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700">
                      Nomor HP / Kontak{" "}
                      <span className="text-xs text-slate-400 font-normal">
                        (Opsional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="08xxxxxxxxxx" {...field} className="rounded-xl h-11 text-xs sm:text-sm border-sky-200/90 focus-visible:ring-sky-500" />
                    </FormControl>
                    <FormDescription className="text-[11px] text-slate-500">
                      Digunakan jika petugas perlu menghubungi Anda.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Bagian & Unit / Bagian Kerja */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Bagian */}
              <FormField
                control={form.control}
                name="bagian"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700">
                      Bagian <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("unitKerja", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl h-11 text-xs sm:text-sm border-sky-200/90 focus-visible:ring-sky-500">
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
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700">
                      Unit / Bagian Kerja <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedBagian}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl h-11 text-xs sm:text-sm border-sky-200/90 focus-visible:ring-sky-500">
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



            {/* Row 4: Deskripsi Kerusakan */}
            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700">
                    Deskripsi Kerusakan <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jelaskan kondisi atau kerusakan yang terjadi..."
                      className="min-h-28 resize-y rounded-xl text-xs sm:text-sm border-sky-200/90 focus-visible:ring-sky-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-slate-500">
                    Jelaskan kondisi kerusakan secara singkat dan jelas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 5: Foto Kerusakan (Opsional) */}
            <FormField
              control={form.control}
              name="foto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700">
                    Foto Kerusakan{" "}
                    <span className="text-xs text-slate-400 font-normal">
                      (Opsional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(file) => field.onChange(file)}
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-slate-500">
                    Foto dapat membantu petugas memahami kondisi kerusakan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-13 px-9 text-sm sm:text-base font-bold bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-full shadow-lg shadow-sky-600/30 transition-all hover:scale-105 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Mengirim Laporan...
              </>
            ) : (
              <>
                <Send className="mr-2.5 h-5 w-5" />
                Kirim Laporan Kerusakan
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
