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

  const categoryUrls: MetadataRoute.Sitemap = [
    {
      url: `${APP_URL}/categories/logo-templates-small-business-india`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${APP_URL}/categories/buy-design-templates-india`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${APP_URL}/categories/merchandise-design-marketplace`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${APP_URL}/categories/business-card-templates-india`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${APP_URL}/categories/social-media-templates-india`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${APP_URL}/categories/flyer-templates-india`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${APP_URL}/categories/brand-identity-kit-india`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${APP_URL}/categories/pitch-deck-templates-india`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
