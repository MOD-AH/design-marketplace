"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
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
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">
            An unexpected error occurred. Please try again or refresh the page.
          </p>
        </div>
        <Button onClick={reset} className="gap-2">
          <RefreshCw size={14} />
          Try again
        </Button>
      </div>
    </main>
  );
}
