"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Event bus ─────────────────────────────────────────────────────────────────

const TOAST_EVENT = "dm:toast";

export type ToastType = "success" | "error" | "loading";

export interface ToastOptions {
  type: ToastType;
  message: string;
  /** ms before auto-dismiss. Defaults to 4000. Pass Infinity to keep until dismissed. */
  duration?: number;
}

/** Call this anywhere (client-side) to fire a toast. */
export function toast(options: ToastOptions) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: options }));
}

// ── Provider ──────────────────────────────────────────────────────────────────

interface ActiveToast extends ToastOptions {
  id: string;
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastOptions>).detail;
      const id = crypto.randomUUID();

      setToasts((prev) => [...prev, { ...detail, id }]);

      const duration = detail.duration ?? (detail.type === "loading" ? Infinity : 4000);
      if (duration !== Infinity) {
        setTimeout(() => dismiss(id), duration);
      }
    };

    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 pr-3 rounded-2xl border text-sm font-medium shadow-2xl pointer-events-auto",
            "animate-in slide-in-from-bottom-4 fade-in duration-300",
            t.type === "success" && "bg-emerald-950 border-emerald-800 text-emerald-200",
            t.type === "error" && "bg-rose-950 border-rose-800 text-rose-200",
            t.type === "loading" && "bg-[#111318] border-white/10 text-white/70"
          )}
        >
          {t.type === "success" && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
          {t.type === "error" && <AlertCircle size={16} className="text-rose-400 shrink-0" />}
          {t.type === "loading" && <Loader2 size={16} className="animate-spin shrink-0 text-amber-400" />}

          <span className="flex-1">{t.message}</span>

          {t.type !== "loading" && (
            <button
              onClick={() => dismiss(t.id)}
              className="ml-1 p-1 rounded-full hover:bg-white/10 transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
