"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      richColors
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-600 shrink-0" />,
        info: <InfoIcon className="size-4 text-sky-600 shrink-0" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600 shrink-0" />,
        error: <OctagonXIcon className="size-4 text-rose-600 shrink-0" />,
        loading: <Loader2Icon className="size-4 animate-spin text-sky-600 shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "cn-toast font-sans bg-white border border-slate-200/90 text-slate-900 shadow-xl shadow-slate-900/10 rounded-2xl p-3 sm:p-3.5 gap-2.5 max-w-[92vw] sm:max-w-md mx-auto",
          title: "text-slate-900 font-extrabold text-xs sm:text-sm tracking-tight",
          description: "text-slate-600 font-semibold text-[11px] sm:text-xs leading-relaxed mt-0.5 opacity-100",
          actionButton: "bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm",
          cancelButton: "bg-slate-100 text-slate-700 font-bold text-xs rounded-xl",
          error:
            "bg-rose-50/95 border-rose-200 text-rose-950 [&_[data-title]]:text-rose-950 [&_[data-description]]:text-rose-800",
          success:
            "bg-emerald-50/95 border-emerald-200 text-emerald-950 [&_[data-title]]:text-emerald-950 [&_[data-description]]:text-emerald-800",
          warning:
            "bg-amber-50/95 border-amber-200 text-amber-950 [&_[data-title]]:text-amber-950 [&_[data-description]]:text-amber-800",
          info:
            "bg-sky-50/95 border-sky-200 text-sky-950 [&_[data-title]]:text-sky-950 [&_[data-description]]:text-sky-800",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
