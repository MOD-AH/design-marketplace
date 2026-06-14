import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://design-marketplace.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/seller/", "/orders", "/checkout/"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
