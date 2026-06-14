"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function EarningsError({
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
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-950 border border-rose-800">
          <AlertTriangle className="h-8 w-8 text-rose-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Failed to load earnings</h2>
          <p className="text-muted-foreground text-sm">
            Your earnings data couldn't be loaded. Please try again.
          </p>
        </div>
        <Button onClick={reset} className="gap-2">
          <RefreshCw size={14} />
          Retry
        </Button>
      </div>
    </div>
  );
}
