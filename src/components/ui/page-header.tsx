import React from "react";
import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badgeText?: string;
  badgeColor?: "sky" | "emerald" | "amber" | "purple";
  icon?: LucideIcon;
  backUrl?: string;
  backLabel?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badgeText,
  badgeColor = "sky",
  icon: Icon,
  backUrl,
  backLabel = "Kembali",
  children,
}: PageHeaderProps) {
  const badgeStyles = {
    sky: "text-sky-600 bg-sky-100/60 border-sky-200/50",
    emerald: "text-emerald-700 bg-emerald-100/70 border-emerald-200/60",
    amber: "text-amber-700 bg-amber-100/70 border-amber-200/60",
    purple: "text-purple-700 bg-purple-100/70 border-purple-200/60",
  }[badgeColor];

  return (
    <div className="space-y-3 pb-4 sm:pb-5 border-b border-sky-100/80">
      {backUrl && (
        <div>
          <Link href={backUrl}>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50/80 rounded-full font-bold text-xs"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              {backLabel}
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          {badgeText && (
            <div
              className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border mb-1.5 ${badgeStyles}`}
            >
              {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
              {badgeText}
            </div>
          )}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 sm:mt-1">
              {description}
            </p>
          )}
        </div>

        {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
      </div>
    </div>
  );
}
