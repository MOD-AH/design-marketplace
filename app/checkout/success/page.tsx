import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { CheckCircle, Download, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { createServerClient } from "@/lib/supabase/server";
import { PurchaseTracker } from "@/components/PurchaseTracker";

interface PageProps {
  searchParams: { orderId?: string };
}

interface OrderItemWithProduct {
  id: string;
  price_at_purchase: number;
  download_url: string | null;
  download_expires_at: string | null;
  products: {
    title: string;
    preview_urls: string[];
  } | null;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  // ── Auth check ────────────────────────────────────────────────────────────
  const firebaseUid = cookies().get("firebase-session")?.value;
  if (!firebaseUid) redirect(`/login?from=/checkout/success${searchParams.orderId ? `?orderId=${searchParams.orderId}` : ""}`);

  const orderId = searchParams.orderId;

  if (!orderId) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">No order ID provided.</p>
      </main>
    );
  }

  const supabase = createServerClient();

  // Resolve the logged-in user's Supabase profile UUID
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("firebase_uid", firebaseUid)
    .single();

  if (!profile) redirect("/login");

  const [{ data: order }, { data: rawItems }] = await Promise.all([
    supabase
      .from("orders")
      // Include buyer_id so we can verify ownership below
      .select("id, buyer_id, total_amount, status, created_at")
      .eq("id", orderId)
      .single(),
    supabase
      .from("order_items")
      .select("id, price_at_purchase, download_url, download_expires_at, products(title, preview_urls)")
      .eq("order_id", orderId),
  ]);

  const items = (rawItems ?? []) as unknown as OrderItemWithProduct[];

  // Order not found, wrong status, or belongs to a different user
  if (!order || order.status !== "completed") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 font-medium">Order not found or payment still processing.</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 underline text-sm">
            Back to marketplace
          </Link>
        </div>
      </main>
    );
  }

  // Ownership check — prevent other users viewing this order via orderId guessing
  if (order.buyer_id !== profile.id) {
    redirect("/orders");
  }

  const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const expiresAt = items[0]?.download_expires_at
    ? new Date(items[0].download_expires_at).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <main className="min-h-screen bg-[#0a0b0e] py-24 px-4 text-white">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Payment Successful<span className="text-amber-400">.</span></h1>
          <p className="mt-4 text-white/40 font-medium">
            Order{" "}
            <span className="font-mono text-amber-400/80">
              #{orderId.slice(0, 8).toUpperCase()}
            </span>{" "}
            · {orderDate}
          </p>
        </div>

        {/* Order summary */}
        <div className="rounded-3xl border border-white/5 bg-[#111318] shadow-2xl overflow-hidden divide-y divide-white/5">
          {/* Items */}
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-6 p-6 group hover:bg-white/[0.02] transition-colors">
              {item.products?.preview_urls?.[0] ? (
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={item.products.preview_urls[0]}
                    alt={item.products.title ?? "Product preview"}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                  🎨
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg text-white truncate">
                  {item.products?.title ?? "Product"}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-amber-400">
                    ₹{Number(item.price_at_purchase).toLocaleString("en-IN")}
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase border-white/10 text-white/40">
                    Digital Asset
                  </Badge>
                </div>
              </div>
              {item.download_url ? (
                <a
                  href={item.download_url}
                  download
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black hover:bg-white/90 transition-all active:scale-95 flex-shrink-0 shadow-lg shadow-white/5"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              ) : (
                <span className="text-xs text-white/20 flex-shrink-0 italic">Link pending</span>
              )}
            </div>
          ))}

          {/* Total */}
          <div className="flex items-center justify-between px-8 py-6 bg-white/[0.02]">
            <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Total Paid</span>
            <span className="text-2xl font-black text-white">
              ₹{Number(order.total_amount).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Expiry notice */}
        {expiresAt && (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-amber-400/10 bg-amber-400/5 px-6 py-4 text-sm text-amber-400/80">
            <Clock className="h-5 w-5 flex-shrink-0" />
            <p className="font-medium">Download links are valid until <span className="font-bold text-amber-400">{expiresAt}</span>. Please save your files before they expire.</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all active:scale-95"
          >
            Order History
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-8 py-4 text-sm font-bold text-black hover:bg-amber-300 transition-all active:scale-95 shadow-xl shadow-amber-400/10"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    <PurchaseTracker orderId={orderId} total={Number(order.total_amount)} productCount={items.length} />
    </main>
  );
}
