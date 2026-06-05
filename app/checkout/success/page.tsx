import Link from "next/link";
import { CheckCircle, Download, Clock, ArrowRight } from "lucide-react";
import { createServerClient } from "@/lib/supabase";

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
  const orderId = searchParams.orderId;

  if (!orderId) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">No order ID provided.</p>
      </main>
    );
  }

  const supabase = createServerClient();

  const [{ data: order }, { data: rawItems }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total_amount, status, created_at")
      .eq("id", orderId)
      .single(),
    supabase
      .from("order_items")
      .select("id, price_at_purchase, download_url, download_expires_at, products(title, preview_urls)")
      .eq("order_id", orderId),
  ]);

  const items = (rawItems ?? []) as unknown as OrderItemWithProduct[];

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
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Order{" "}
            <span className="font-mono font-medium text-gray-700">
              #{orderId.slice(0, 8).toUpperCase()}
            </span>{" "}
            · {orderDate}
          </p>
        </div>

        {/* Order summary */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
          {/* Items */}
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-5">
              {item.products?.preview_urls?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.products.preview_urls[0]}
                  alt={item.products.title ?? "Product preview"}
                  className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {item.products?.title ?? "Product"}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  ₹{Number(item.price_at_purchase).toFixed(2)}
                </p>
              </div>
              {item.download_url ? (
                <a
                  href={item.download_url}
                  download
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors flex-shrink-0"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              ) : (
                <span className="text-xs text-gray-400 flex-shrink-0">No file</span>
              )}
            </div>
          ))}

          {/* Total */}
          <div className="flex items-center justify-between px-5 py-4 bg-gray-50 rounded-b-2xl">
            <span className="font-medium text-gray-700">Total paid</span>
            <span className="font-bold text-gray-900 text-lg">
              ₹{Number(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Expiry notice */}
        {expiresAt && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <Clock className="h-4 w-4 flex-shrink-0" />
            Download links expire on {expiresAt}. Save your files now.
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/orders"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View order history
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
