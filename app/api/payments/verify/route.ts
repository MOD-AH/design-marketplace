import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";

const PLATFORM_FEE_RATE = 0.2;
const DESIGN_BUCKET = "designs";
const DOWNLOAD_EXPIRY_SECONDS = 24 * 60 * 60;

interface VerifyBody {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;
  productIds: string[];
}

export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Payment gateway not configured" }, { status: 503 });
  }

  let body: VerifyBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId, productIds } = body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId || !productIds?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // SECURITY: Verify Razorpay webhook signature before touching the database
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const supabase = createServerClient();

  if (expectedSignature !== razorpaySignature) {
    await supabase
      .from("orders")
      .update({
        status: "failed",
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      })
      .eq("id", orderId);

    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  // Fetch products to build order_items
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price, seller_id, file_url, title")
    .in("id", productIds);

  if (productsError || !products?.length) {
    return NextResponse.json({ error: "Products not found" }, { status: 404 });
  }

  // Generate signed download URLs valid for 24 hours
  const expiresAt = new Date(Date.now() + DOWNLOAD_EXPIRY_SECONDS * 1000).toISOString();

  const orderItems = await Promise.all(
    products.map(async (product) => {
      const price = Number(product.price);
      const platformFee = price * PLATFORM_FEE_RATE;
      const sellerPayout = price - platformFee;

      let downloadUrl: string | null = null;
      if (product.file_url) {
        const { data: signed } = await supabase.storage
          .from(DESIGN_BUCKET)
          .createSignedUrl(product.file_url, DOWNLOAD_EXPIRY_SECONDS);
        downloadUrl = signed?.signedUrl ?? null;
      }

      return {
        order_id: orderId,
        product_id: product.id,
        seller_id: product.seller_id,
        price_at_purchase: price,
        platform_fee: platformFee,
        seller_payout: sellerPayout,
        download_url: downloadUrl,
        download_expires_at: expiresAt,
      };
    })
  );

  // Mark order as completed
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "completed",
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    })
    .eq("id", orderId);

  if (updateError) {
    console.error("Order update error:", updateError);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }

  // Insert order_items
  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    console.error("Order items insert error:", itemsError);
    return NextResponse.json({ error: "Failed to create order items" }, { status: 500 });
  }

  // Send confirmation email — non-blocking, failure does not abort the response
  sendConfirmationEmail(supabase, orderId, products, orderItems).catch(console.error);

  return NextResponse.json({ success: true, orderId });
}

async function sendConfirmationEmail(
  supabase: ReturnType<typeof createServerClient>,
  orderId: string,
  products: Array<{ title: string; price: number }>,
  orderItems: Array<{ download_url: string | null }>
) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const { data: order } = await supabase
    .from("orders")
    .select("buyer_id, total_amount")
    .eq("id", orderId)
    .single();
  if (!order) return;

  const { data: buyer } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", order.buyer_id)
    .single();
  if (!buyer?.email) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const downloadLines = products
    .map(
      (p, i) =>
        `<li>${p.title}${orderItems[i]?.download_url ? ` — <a href="${orderItems[i]?.download_url}">Download</a>` : ""}</li>`
    )
    .join("");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Design Marketplace <noreply@designmarketplace.com>",
      to: buyer.email,
      subject: "Your order is confirmed!",
      html: `
        <p>Hi ${buyer.full_name ?? "there"},</p>
        <p>Your order <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> is confirmed.</p>
        <p><strong>Total paid:</strong> ₹${Number(order.total_amount).toFixed(2)}</p>
        <h3>Download links (valid for 24 hours):</h3>
        <ul>${downloadLines}</ul>
        <p><a href="${appUrl}/orders">View all your orders →</a></p>
      `,
    }),
  });
}
