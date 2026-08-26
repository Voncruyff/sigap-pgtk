"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  RefreshCw,
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

  // Modal selector for Camera vs Gallery
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

  // Live Camera Dialog State (Webcam)
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<"environment" | "user">("environment");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement>(null);

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
      toast.success("Foto berhasil diproses & dikompresi!", {
        description: `Ukuran dioptimalkan menjadi ${formatFileSize(compressedFile.size)}`,
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

  // Open Gallery / File Picker
  const handleOpenGallery = () => {
    setIsOptionModalOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Open Direct Camera
  const handleOpenCamera = async () => {
    setIsOptionModalOpen(false);

    // Check if live camera stream is supported in browser
    if (typeof navigator !== "undefined" && typeof navigator.mediaDevices?.getUserMedia === "function") {
      setIsLiveCameraOpen(true);
      startLiveCamera("environment");
    } else {
      // Fallback for native mobile camera input
      if (mobileCameraInputRef.current) {
        mobileCameraInputRef.current.value = "";
        mobileCameraInputRef.current.click();
      }
    }
  };

  // Start Live WebCam Video Stream
  const startLiveCamera = async (mode: "environment" | "user") => {
    setIsCameraStarting(true);
    stopLiveCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Gagal mengakses live stream kamera, beralih ke input kamera bawaan:", err);
      setIsLiveCameraOpen(false);
      // Fallback to standard capture input
      if (mobileCameraInputRef.current) {
        mobileCameraInputRef.current.click();
      }
    } finally {
      setIsCameraStarting(false);
    }
  };

  // Stop Live Camera Stream
  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Switch between back & front camera
  const toggleCameraFacing = () => {
    const nextMode = cameraFacingMode === "environment" ? "user" : "environment";
    setCameraFacingMode(nextMode);
    startLiveCamera(nextMode);
  };

  // Take Snapshot from Live Camera Stream
  const captureSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const capturedFile = new File([blob], `kamera_${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          stopLiveCamera();
          setIsLiveCameraOpen(false);
          processImageFile(capturedFile);
        }
      },
      "image/jpeg",
      0.85
    );
  };

  // Cleanup camera stream when unmounting or closing dialog
  useEffect(() => {
    return () => {
      stopLiveCamera();
    };
  }, []);

  const handleRemove = () => {
    onChange(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setOriginalSize(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (mobileCameraInputRef.current) mobileCameraInputRef.current.value = "";
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
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        id="foto-upload-file"
        disabled={isCompressing}
      />

      {/* 2. Direct Mobile Camera Capture */}
      <input
        type="file"
        ref={mobileCameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
        id="foto-upload-camera"
        disabled={isCompressing}
      />

      {/* Hidden Canvas for Live Snapshot */}
      <canvas ref={canvasRef} className="hidden" />

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
            Mengoptimalkan ukuran berkas menjadi &le; 50 KB secara instan
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
            Klik untuk memilih antara <b>Kamera Langsung</b> atau <b>Galeri / Berkas</b>
          </span>
        </button>
      )}

      {/* 📱 Modal 1: Option Modal (Kamera vs Galeri) */}
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
              Ambil gambar secara langsung menggunakan kamera atau pilih dari galeri berkas Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Option 1: Kamera Langsung */}
            <button
              type="button"
              onClick={handleOpenCamera}
              className="p-4 rounded-2xl border-2 border-sky-100 hover:border-sky-500 bg-sky-50/40 hover:bg-sky-50 text-slate-800 hover:text-sky-800 transition-all flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer shadow-2xs group"
            >
              <div className="p-3 rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/30 group-hover:scale-110 transition-transform">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <span className="text-sm font-extrabold block">Buka Kamera</span>
                <span className="text-[11px] text-slate-500 font-medium">Foto langsung di lokasi</span>
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
                <span className="text-[11px] text-slate-500 font-medium">Pilih dari memori HP/Laptop</span>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 📸 Modal 2: Live Camera Viewfinder Dialog */}
      <Dialog
        open={isLiveCameraOpen}
        onOpenChange={(open) => {
          if (!open) stopLiveCamera();
          setIsLiveCameraOpen(open);
        }}
      >
        <DialogContent className="max-w-md sm:max-w-lg p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-black text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-sky-600" />
                Kamera Langsung
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleCameraFacing}
                className="h-8 text-xs font-bold rounded-xl border-sky-200 text-sky-700 hover:bg-sky-50"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Ganti Kamera
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center border border-slate-800 shadow-inner">
            {isCameraStarting ? (
              <div className="text-center text-white space-y-2 p-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-sky-400" />
                <p className="text-xs font-medium text-slate-300">Menghubungkan ke kamera perangkat...</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                stopLiveCamera();
                setIsLiveCameraOpen(false);
              }}
              className="h-10 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={captureSnapshot}
              className="h-10 px-6 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-md shadow-sky-600/25 flex items-center gap-2 cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              Ambil Gambar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
