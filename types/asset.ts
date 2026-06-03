export type AssetCategory =
  | "ui-kit"
  | "template"
  | "icon-set"
  | "illustration"
  | "font"
  | "mockup"
  | "other";

export type AssetStatus = "draft" | "pending_review" | "published" | "rejected";

export interface Asset {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: AssetCategory;
  status: AssetStatus;
  priceInCents: number;
  previewImageUrl: string;
  downloadUrl: string;
  sellerId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
