"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePostHog } from "@/lib/posthog";
import { cn } from "@/lib/utils";

export interface CheckoutButtonProps {
  productIds: string[];
  buyerId: string;
  buyerEmail?: string;
  buyerName?: string;
  /** Price in INR — used for analytics only */
  price?: number;
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({
  productIds,
  buyerId,
  buyerEmail,
  buyerName,
  price,
  className,
  children = "Buy Now",
}: CheckoutButtonProps) {
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    try {
      posthog.capture("checkout_started", { product_ids: productIds, price });

      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds, buyerId }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Failed to create order" }));
        throw new Error(error ?? "Failed to create order");
      }

      const { razorpayOrderId, amount, currency, orderId } = await res.json();

      const Razorpay = (window as any).Razorpay;
      if (!Razorpay) throw new Error("Payment gateway not loaded. Please refresh and try again.");

      const rzp = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "Design Marketplace",
        description: "Design asset purchase",
        prefill: { email: buyerEmail, name: buyerName },
        theme: { color: "#0ea5e9" },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId,
                productIds,
              }),
            });

            if (!verifyRes.ok) throw new Error("Payment verification failed");

            posthog.capture("checkout_completed", { product_ids: productIds, price });
            window.location.href = `/checkout/success?orderId=${orderId}`;
          } catch {
            toast.error("Payment verified but order update failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment cancelled.");
          },
        },
      });

      rzp.open();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn("flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed", className)}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}
