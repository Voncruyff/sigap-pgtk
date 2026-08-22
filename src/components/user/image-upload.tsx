"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { compressImage } from "@/lib/image-compressor";

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Format file harus berupa JPG, PNG, atau WEBP.");
      return;
    }

    setOriginalSize(file.size);
    setIsCompressing(true);

    try {
      // Compress image automatically to maximum 200KB
      const compressedFile = await compressImage(file, 200);

      onChange(compressedFile);
      const objectUrl = URL.createObjectURL(compressedFile);
      setPreview(objectUrl);
    } catch (err) {
      console.error("Gagal mengompresi gambar:", err);
      // Fallback: use original file if compression fails
      onChange(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setOriginalSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        id="foto-upload"
        disabled={isCompressing}
      />

      {isCompressing ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-sky-300 rounded-xl p-6 bg-sky-50/50 text-center">
          <Loader2 className="h-6 w-6 text-sky-600 animate-spin mb-2" />
          <span className="text-sm font-medium text-sky-900">
            Mengompresi foto (Maks. 200 KB)...
          </span>
          <span className="text-xs text-sky-600 mt-1">
            Mengoptimalkan ukuran gambar tanpa merusak kualitas
          </span>
        </div>
      ) : preview ? (
        <div className="relative rounded-xl border bg-muted/30 p-3 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview Kerusakan"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="truncate text-xs space-y-1">
              <p className="font-semibold text-slate-800 truncate">{value?.name}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" />
                  {value ? formatFileSize(value.size) : ""}
                </span>
                {originalSize && originalSize > (value?.size || 0) && (
                  <span className="text-slate-400 line-through">
                    {formatFileSize(originalSize)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Terkompresi otomatis &le; 200 KB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-lg"
          >
            <X className="h-4 w-4 mr-1" />
            Hapus
          </Button>
        </div>
      ) : (
        <label
          htmlFor="foto-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-input rounded-xl p-6 hover:bg-accent/50 cursor-pointer transition-all text-center group"
        >
          <div className="p-3 rounded-full bg-muted group-hover:bg-background transition-colors mb-2">
            <Upload className="h-5 w-5 text-muted-foreground group-hover:text-sky-600" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:text-sky-700">
            + Tambahkan Foto Kerusakan
          </span>
          <span className="text-xs text-slate-500 mt-1">
            Format: JPG, PNG, WEBP (Otomatis dikompresi &le; 200 KB)
          </span>
        </label>
      )}
    </div>
  );
}
