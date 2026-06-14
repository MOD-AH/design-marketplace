"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ProductDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-950 border border-rose-800">
          <AlertTriangle className="h-8 w-8 text-rose-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Failed to load product</h1>
          <p className="text-muted-foreground text-sm">
            This product couldn't be loaded. It may have been removed or there's a temporary issue.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to products
          </Link>
          <Button onClick={reset} className="gap-2">
            <RefreshCw size={14} />
            Retry
          </Button>
        </div>
      </div>
    </main>
  );
}
