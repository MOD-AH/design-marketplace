"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessError({
  error,
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
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-950 border border-amber-800">
          <AlertTriangle className="h-8 w-8 text-amber-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Order confirmation unavailable</h1>
          <p className="text-muted-foreground text-sm">
            Your payment may have been processed. Check your orders page for download links or contact support.
          </p>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          View my orders
          <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  );
}
