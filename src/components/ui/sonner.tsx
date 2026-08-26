"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group !z-[9999]"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-600 shrink-0" />,
        info: <InfoIcon className="size-4 text-sky-600 shrink-0" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600 shrink-0" />,
        error: <OctagonXIcon className="size-4 text-rose-600 shrink-0" />,
        loading: <Loader2Icon className="size-4 animate-spin text-sky-600 shrink-0" />,
      }}
      toastOptions={{
        className:
          "!font-sans !bg-white/95 !backdrop-blur-xl !border !border-slate-200/90 !text-slate-900 !shadow-2xl !shadow-slate-900/10 !rounded-2xl !p-3 !gap-2.5 !mx-auto !w-auto !max-w-[85vw] sm:!max-w-md",
        classNames: {
          title: "!text-slate-900 !font-extrabold !text-xs sm:!text-sm !tracking-tight",
          description: "!text-slate-600 !font-medium !text-[11px] sm:!text-xs !leading-relaxed !mt-0.5",
          actionButton: "!bg-sky-600 hover:!bg-sky-700 !text-white !font-bold !text-xs !rounded-xl !shadow-sm",
          cancelButton: "!bg-slate-100 !text-slate-700 !font-bold !text-xs !rounded-xl",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
