"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileZoneProps {
  label: string;
  description: string;
  accept: string;
  maxSize: number; // MB
  multiple?: boolean;
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  files: File[];
  onRemove: (index: number) => void;
  /** Upload progress for each file (0–100). null/undefined = not uploading. */
  progresses?: (number | null | undefined)[];
  /** Per-file validation errors (index-aligned with files). */
  errors?: (string | null | undefined)[];
}

export function FileZone({
  label,
  description,
  accept,
  maxSize,
  multiple = false,
  maxFiles = 1,
  onFilesSelected,
  files,
  onRemove,
  progresses = [],
  errors = [],
}: FileZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onFilesSelected(Array.from(e.target.files));
    // Reset so re-selecting the same file still fires onChange
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) onFilesSelected(Array.from(e.dataTransfer.files));
  };

  const isUploading = progresses.some((p) => p != null && p < 100);

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all",
          isUploading
            ? "border-amber-400/30 bg-amber-400/[0.03] cursor-not-allowed"
            : isDragging
            ? "border-amber-400 bg-amber-400/5 shadow-[0_0_20px_rgba(251,191,36,0.1)] cursor-copy"
            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07] cursor-pointer"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        <div
          className={cn(
            "w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 transition-transform",
            isDragging && "scale-110 rotate-3"
          )}
        >
          <Upload
            className={cn(isDragging ? "text-amber-400" : "text-white/40")}
            size={32}
          />
        </div>

        <h4 className="text-lg font-bold text-white mb-1">{label}</h4>
        <p className="text-sm text-white/40 max-w-xs mx-auto">{description}</p>
        <p className="text-[10px] uppercase tracking-widest text-white/20 mt-4 font-bold">
          Max {maxSize} MB{maxFiles > 1 ? ` · up to ${maxFiles} files` : ""}
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {files.map((file, idx) => {
            const progress = progresses[idx];
            const error = errors[idx];
            const isFileUploading = progress != null && progress < 100;
            const isDone = progress === 100;

            return (
              <div
                key={`${file.name}-${idx}`}
                className={cn(
                  "relative flex flex-col gap-2 p-4 rounded-2xl border transition-colors",
                  error
                    ? "border-rose-500/40 bg-rose-500/5"
                    : isDone
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-white/10 bg-white/5"
                )}
              >
                {/* File info row */}
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    {error ? (
                      <AlertCircle size={18} className="text-rose-400" />
                    ) : file.type.startsWith("image/") ? (
                      <ImageIcon size={18} className="text-amber-400/60" />
                    ) : (
                      <FileText size={18} className="text-amber-400/60" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-tighter">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  {!isFileUploading && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                      className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                {isFileUploading && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-amber-400/70 text-right font-bold">
                      {progress}%
                    </p>
                  </div>
                )}

                {/* Done indicator */}
                {isDone && (
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                    ✓ Uploaded
                  </p>
                )}

                {/* Error message */}
                {error && (
                  <p className="text-[10px] text-rose-400 leading-snug">{error}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
