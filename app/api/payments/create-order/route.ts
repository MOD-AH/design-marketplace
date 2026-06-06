import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createServerClient } from "@/lib/supabase/server";

interface CreateOrderBody {
  productIds: string[];
  buyerId: string;
}

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payment gateway not configured" }, { status: 503 });
  }

  let body: CreateOrderBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { productIds, buyerId } = body;

  if (!productIds?.length || !buyerId) {
    return NextResponse.json({ error: "productIds and buyerId are required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price, title, seller_id")
    .in("id", productIds)
    .eq("status", "published");

  if (productsError || !products?.length) {
    return NextResponse.json({ error: "Products not found" }, { status: 404 });
  }

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "One or more products are unavailable" }, { status: 400 });
  }

  const totalAmount = products.reduce((sum, p) => sum + Number(p.price), 0);
  // Razorpay amounts are in the smallest currency unit (paise for INR)
  const amountInPaise = Math.round(totalAmount * 100);

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let razorpayOrder: any;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json({ error: "Payment gateway error" }, { status: 502 });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      buyer_id: buyerId,
      status: "pending",
      total_amount: totalAmount,
      razorpay_order_id: razorpayOrder.id,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Order insert error:", orderError);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  return NextResponse.json({
    razorpayOrderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: "INR",
    orderId: order.id,
  });
}
