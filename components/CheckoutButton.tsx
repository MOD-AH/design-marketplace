"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler(response: RazorpayPaymentResponse): void;
  modal?: { ondismiss?(): void };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CheckoutButtonProps {
  productIds: string[];
  buyerId: string;
  buyerEmail?: string;
  buyerName?: string;
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({
  productIds,
  buyerId,
  buyerEmail,
  buyerName,
  className,
  children = "Buy Now",
}: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (document.getElementById("razorpay-checkout-js")) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setScriptReady(true);
    script.onerror = () => setError("Failed to load payment SDK");
    document.body.appendChild(script);
  }, []);

  async function handleCheckout() {
    setError(null);
    setLoading(true);

    try {
      // Step 1 — create order on server
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds, buyerId }),
      });

      if (!orderRes.ok) {
        const json = await orderRes.json().catch(() => ({}));
        throw new Error(json.error ?? "Failed to create order");
      }

      const { razorpayOrderId, amount, currency, orderId } = (await orderRes.json()) as {
        razorpayOrderId: string;
        amount: number;
        currency: string;
        orderId: string;
      };

      // Step 2 — open Razorpay modal
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "Design Marketplace",
        description: "Digital asset purchase",
        prefill: { name: buyerName, email: buyerEmail },
        theme: { color: "#6366f1" },
        handler: async (response: RazorpayPaymentResponse) => {
          // Step 3 — verify signature on server
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

          if (verifyRes.ok) {
            router.push(`/checkout/success?orderId=${orderId}`);
          } else {
            const json = await verifyRes.json().catch(() => ({}));
            setError(json.error ?? "Payment verification failed");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading || !scriptReady}
        className={className}
      >
        {loading ? "Processing…" : children}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
