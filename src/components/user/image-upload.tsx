"use client";

import React, { useState, useRef } from "react";
import {
  Camera,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { compressImage } from "@/lib/image-compressor";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);

  // Modal selector for Native Camera vs Gallery
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  // Process selected or captured file with compression
  const processImageFile = async (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type) && !file.type.startsWith("image/")) {
      toast.error("Format berkas harus berupa gambar (JPG, PNG, WEBP).");
      return;
    }

    setOriginalSize(file.size);
    setIsCompressing(true);

    try {
      // Compress image automatically to maximum 50KB
      const compressedFile = await compressImage(file, 50);

      onChange(compressedFile);
      const objectUrl = URL.createObjectURL(compressedFile);
      setPreview(objectUrl);
      toast.success("Foto berhasil diambil & dioptimalkan!", {
        description: `Ukuran kompresi: ${formatFileSize(compressedFile.size)}`,
      });
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Open Native Gallery / File Picker
  const handleOpenGallery = () => {
    setIsOptionModalOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Open Native Device Camera App (Kamera Asli Perangkat)
  const handleOpenNativeCamera = () => {
    setIsOptionModalOpen(false);
    if (nativeCameraInputRef.current) {
      nativeCameraInputRef.current.value = "";
      nativeCameraInputRef.current.click();
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setOriginalSize(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (nativeCameraInputRef.current) nativeCameraInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-3">
      {/* Hidden File Inputs */}
      {/* 1. File Picker / Gallery */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileInputChange}
        className="hidden"
        id="foto-upload-file"
        disabled={isCompressing}
      />

      {/* 2. Direct Native Device Camera Capture (Kamera Asli HP / Perangkat) */}
      <input
        type="file"
        ref={nativeCameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
        id="foto-upload-camera"
        disabled={isCompressing}
      />

      {/* State 1: Compressing State */}
      {isCompressing ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-sky-300 rounded-2xl p-6 bg-sky-50/60 text-center animate-pulse">
          <div className="p-3 rounded-full bg-sky-100 text-sky-600 mb-2">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <span className="text-sm font-black text-sky-900">
            Mengompresi Foto Kerusakan...
          </span>
          <span className="text-xs text-sky-600 mt-1 font-medium">
            Mengoptimalkan foto hasil kamera menjadi &le; 50 KB secara instan
          </span>
        </div>
      ) : preview ? (
        /* State 2: Uploaded Preview with Actions */
        <div className="relative rounded-2xl border border-sky-100 bg-white p-3.5 sm:p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3.5 overflow-hidden">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden border border-sky-100 bg-slate-100 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview Kerusakan"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="truncate text-xs space-y-1">
              <p className="font-bold text-slate-900 truncate text-xs sm:text-sm">{value?.name}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 text-[11px]">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  {value ? formatFileSize(value.size) : ""}
                </span>
                {originalSize && originalSize > (value?.size || 0) && (
                  <span className="text-slate-400 line-through text-[11px]">
                    {formatFileSize(originalSize)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Terkompresi otomatis &le; 50 KB (Siap diunggah)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOptionModalOpen(true)}
              className="h-8 text-xs px-3 rounded-xl border-sky-200 text-sky-700 hover:bg-sky-50 font-bold"
            >
              Ganti
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-8 text-xs px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl font-bold"
            >
              <X className="h-4 w-4 mr-1" />
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        /* State 3: Interactive Trigger Box */
        <button
          type="button"
          onClick={() => setIsOptionModalOpen(true)}
          className="w-full flex flex-col items-center justify-center border-2 border-dashed border-sky-200 hover:border-sky-400 bg-white/80 hover:bg-sky-50/40 rounded-2xl p-6 sm:p-7 cursor-pointer transition-all text-center group shadow-2xs"
        >
          <div className="p-3.5 rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-100 group-hover:scale-110 transition-all duration-200 mb-3 shadow-xs">
            <Camera className="h-6 w-6" />
          </div>
          <span className="text-sm font-extrabold text-slate-800 group-hover:text-sky-700 flex items-center gap-1.5">
            <Upload className="h-4 w-4 text-sky-600" />
            Ambil / Upload Foto Kerusakan
          </span>
          <span className="text-xs text-slate-500 mt-1 font-medium">
            Klik untuk membuka <b>Kamera HP</b> atau <b>Galeri / Berkas</b>
          </span>
        </button>
      )}

      {/* 📱 Modal: Option Modal (Kamera Asli HP vs Galeri) */}
      <Dialog open={isOptionModalOpen} onOpenChange={setIsOptionModalOpen}>
        <DialogContent className="max-w-sm sm:max-w-md p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <Camera className="h-4 w-4" />
              </div>
              Pilih Sumber Foto Kerusakan
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Gunakan kamera asli perangkat Anda untuk hasil foto paling jelas atau pilih dari galeri.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Option 1: Kamera Asli Perangkat */}
            <button
              type="button"
              onClick={handleOpenNativeCamera}
              className="p-4 rounded-2xl border-2 border-sky-100 hover:border-sky-500 bg-sky-50/40 hover:bg-sky-50 text-slate-800 hover:text-sky-800 transition-all flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer shadow-2xs group"
            >
              <div className="p-3 rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/30 group-hover:scale-110 transition-transform">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <span className="text-sm font-extrabold block">Kamera Perangkat</span>
                <span className="text-[11px] text-slate-500 font-medium">Buka aplikasi kamera HP</span>
              </div>
            </button>

            {/* Option 2: Galeri / File Manager */}
            <button
              type="button"
              onClick={handleOpenGallery}
              className="p-4 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/40 text-slate-800 hover:text-emerald-800 transition-all flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer shadow-2xs group"
            >
              <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-sm font-extrabold block">Galeri / File</span>
                <span className="text-[11px] text-slate-500 font-medium">Pilih dari memori perangkat</span>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
