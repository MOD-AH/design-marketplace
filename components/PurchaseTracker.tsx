"use client";

import { useEffect } from "react";
import { usePostHog } from "@/lib/posthog";

interface Props {
  orderId: string;
  total: number;
  productCount: number;
}

export function PurchaseTracker({ orderId, total, productCount }: Props) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("purchase_completed", {
      order_id: orderId,
      total,
      product_count: productCount,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
