"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const statusSearchSchema = z.object({
  ticketNumber: z
    .string()
    .min(1, { message: "Nomor laporan wajib diisi" })
    .regex(/^SIGAP-\d{8}-\d{3}$/, {
      message: "Format nomor laporan tidak valid. Contoh: SIGAP-20260821-001",
    }),
});

type StatusSearchFormValues = z.infer<typeof statusSearchSchema>;

export function StatusSearchForm() {
  const router = useRouter();

  const form = useForm<StatusSearchFormValues>({
    resolver: zodResolver(statusSearchSchema),
    defaultValues: {
      ticketNumber: "",
    },
  });

  const onSubmit = (data: StatusSearchFormValues) => {
    const formattedTicket = data.ticketNumber.trim().toUpperCase();
    router.push(`/status/${formattedTicket}`);
  };

  return (
    <Card className="border border-sky-100/90 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-sky-100/60 overflow-hidden">
      <CardContent className="p-6 sm:p-8 space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="ticketNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700 flex items-center justify-between flex-wrap gap-1">
                    <span>Nomor Laporan Tiket <span className="text-destructive">*</span></span>
                    <span className="text-[11px] font-mono font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      Contoh: SIGAP-20260821-001
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="SIGAP-20260821-001"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        className="font-mono uppercase tracking-wider h-13 text-base sm:text-lg rounded-2xl border-sky-200/90 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500 bg-white/80 shadow-inner pl-4 pr-11 font-bold text-slate-900"
                      />
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-500 pointer-events-none" />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500 font-medium">
                    Nomor laporan diberikan otomatis setelah Anda berhasil membuat laporan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-13 px-8 text-base font-bold bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-full shadow-lg shadow-sky-600/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Search className="mr-2 h-4 w-4" />
              Cek Status Penanganan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
