"use client";

export interface CheckoutButtonProps {
  productIds: string[];
  buyerId: string;
  buyerEmail?: string;
  buyerName?: string;
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({ className, children = "Buy Now" }: CheckoutButtonProps) {
  return (
    <div>
      <button disabled className={className} style={{ opacity: 0.5, cursor: "not-allowed" }}>
        {children}
      </button>
      <p className="mt-2 text-xs text-white/40 text-center">Payments coming soon</p>
    </div>
  );
}
