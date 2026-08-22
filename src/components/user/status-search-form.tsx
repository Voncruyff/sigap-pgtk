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
    <Card className="border border-sky-100/90 bg-white/95 backdrop-blur-xs rounded-3xl shadow-xl shadow-sky-100/50 overflow-hidden">
      <CardContent className="pt-6 pb-8 space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ticketNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Nomor Laporan Tiket <span className="text-destructive">*</span></span>
                    <span className="text-[11px] font-mono font-normal text-sky-600">Contoh: SIGAP-20260821-001</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SIGAP-20260821-001"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      className="font-mono uppercase tracking-wider h-12 text-base rounded-xl border-sky-200 focus-visible:ring-sky-500"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500">
                    Nomor laporan diberikan otomatis setelah Anda berhasil membuat laporan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-lg shadow-sky-600/25 transition-all hover:scale-105"
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
