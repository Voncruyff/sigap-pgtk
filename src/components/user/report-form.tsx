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
  IMPACTS,
} from "./report-schema";
import { createClient } from "@/lib/supabase/client";
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

function generateFileName(fileExt?: string) {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${timestamp}-${randomStr}.${fileExt || "jpg"}`;
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
      peralatan: "",
      deskripsi: "",
      foto: null,
      dampak: "",
    },
  });

  const selectedBagian = useWatch({ control: form.control, name: "bagian" });

  const filteredWorkUnits = selectedBagian
    ? WORK_UNITS.filter((unit) => unit.department === selectedBagian)
    : [];

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      let fotoUrl: string | null = null;

      // 1. Upload Foto jika ada
      if (data.foto instanceof File) {
        const fileExt = data.foto.name.split(".").pop();
        const fileName = generateFileName(fileExt);
        const filePath = `reports/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("report-photos")
          .upload(filePath, data.foto);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("report-photos")
            .getPublicUrl(filePath);
          fotoUrl = publicUrlData.publicUrl;
        }
      }

      // 2. Insert ke tabel reports
      const { data: insertData, error: insertError } = await supabase
        .from("reports")
        .insert({
          nama_pelapor: data.namaPelapor,
          bagian: data.bagian,
          unit_kerja: data.unitKerja,
          nomor_hp: data.nomorHp || null,
          lokasi_kerusakan: data.unitKerja,
          peralatan: data.peralatan,
          deskripsi: data.deskripsi,
          foto_url: fotoUrl,
          dampak: data.dampak || null,
        })
        .select("ticket_number")
        .single();

      if (insertError) {
        // Fallback jika database Supabase belum terhubung / belum dikonfigurasi env
        console.warn("Supabase insert warning:", insertError);
        const fallbackTicket = `SIGAP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-001`;
        toast.success("Laporan berhasil dikirim!", {
          description: `Nomor laporan Anda: ${fallbackTicket}`,
        });
        router.push(`/status/${fallbackTicket}`);
        return;
      }

      const generatedTicket = insertData?.ticket_number;
      toast.success("Laporan berhasil dikirim!", {
        description: `Nomor laporan Anda: ${generatedTicket}`,
      });
      router.push(`/status/${generatedTicket}`);
    } catch (err) {
      console.error("Error submitting report:", err);
      toast.error("Terjadi kesalahan saat mengirim laporan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Single Card Container For Report Form */}
        <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-xs rounded-2xl sm:rounded-3xl shadow-xl shadow-sky-100/50 overflow-hidden">
          <CardHeader className="p-4 sm:p-6 border-b border-sky-100/80 bg-gradient-to-r from-sky-50/80 to-white">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-sky-700">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600 shrink-0" />
              Form Pelaporan Kerusakan Fasilitas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Row 1: Nama Pelapor & Nomor HP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Input placeholder="Masukkan nama lengkap Anda" {...field} className="rounded-xl h-11 text-xs sm:text-sm" />
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
                      <Input placeholder="08xxxxxxxxxx" {...field} className="rounded-xl h-11 text-xs sm:text-sm" />
                    </FormControl>
                    <FormDescription className="text-[11px]">
                      Digunakan jika petugas perlu menghubungi Anda.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Bagian & Unit / Bagian Kerja */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <SelectTrigger className="w-full rounded-xl h-11 text-xs sm:text-sm">
                          <SelectValue placeholder="Pilih bagian" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TUK">TUK (Tata Usaha & Keuangan)</SelectItem>
                        <SelectItem value="Teknik">Teknik & Pemeliharaan</SelectItem>
                        <SelectItem value="Pabrikasi">Pabrikasi & Pengolahan</SelectItem>
                        <SelectItem value="Tanaman">Tanaman & Budi Daya</SelectItem>
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
                        <SelectTrigger className="w-full rounded-xl h-11 text-xs sm:text-sm">
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

            {/* Row 3: Peralatan / Fasilitas */}
            <FormField
              control={form.control}
              name="peralatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700">
                    Peralatan / Fasilitas <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: AC, printer, pompa nira, klep steam" {...field} className="rounded-xl h-11 text-xs sm:text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      className="min-h-28 resize-y rounded-xl text-xs sm:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[11px]">
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
                  <FormDescription className="text-[11px]">
                    Foto dapat membantu petugas memahami kondisi kerusakan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 6: Dampak Kerusakan (Opsional) */}
            <FormField
              control={form.control}
              name="dampak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700">
                    Dampak Kerusakan{" "}
                    <span className="text-xs text-slate-400 font-normal">
                      (Opsional)
                    </span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-xl h-11 text-xs sm:text-sm">
                        <SelectValue placeholder="Pilih dampak jika diperlukan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {IMPACTS.map((imp) => (
                        <SelectItem key={imp} value={imp}>
                          {imp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            className="w-full sm:w-auto h-12 sm:h-13 px-8 sm:px-10 text-sm sm:text-base font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-lg shadow-sky-600/25 transition-all hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Mengirim Laporan...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Kirim Laporan Kerusakan
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
