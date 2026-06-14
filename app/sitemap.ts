import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://design-marketplace.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  const productUrls: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${APP_URL}/products/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${APP_URL}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  return [...staticUrls, ...productUrls];
}
