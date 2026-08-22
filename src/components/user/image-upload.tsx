"use client";

import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert("Format file harus berupa JPG, PNG, atau WEBP.");
        return;
      }
      onChange(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      />

      {preview ? (
        <div className="relative rounded-lg border bg-muted/30 p-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden border bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview Kerusakan"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="truncate text-xs text-muted-foreground">
              <p className="font-medium text-foreground truncate">{value?.name}</p>
              <p>{value ? (value.size / 1024 / 1024).toFixed(2) + " MB" : ""}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-destructive hover:text-destructive shrink-0"
          >
            <X className="h-4 w-4 mr-1" />
            Hapus
          </Button>
        </div>
      ) : (
        <label
          htmlFor="foto-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-input rounded-lg p-6 hover:bg-accent/50 cursor-pointer transition-colors text-center group"
        >
          <div className="p-3 rounded-full bg-muted group-hover:bg-background transition-colors mb-2">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">
            + Tambahkan Foto
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            Format: JPG, PNG, WEBP (Maksimal 1 foto)
          </span>
        </label>
      )}
    </div>
  );
}
