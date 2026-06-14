"use client";

import { usePostHog } from "@/lib/posthog";

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
  price,
  className,
  children = "Buy Now",
}: CheckoutButtonProps) {
  const posthog = usePostHog();
  function handleClick() {
    posthog.capture("checkout_started", {
      product_ids: productIds,
      price,
    });
    // Razorpay integration goes here
  }

  return (
    <div>
      <button onClick={handleClick} className={className}>
        {children}
      </button>
    </div>
  );
}
