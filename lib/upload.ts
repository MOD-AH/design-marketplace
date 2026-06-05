export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number; // 0–100
}

// ── Design file ───────────────────────────────────────────────────────────────
// Uses a signed upload URL so the 50 MB file goes straight
// to Supabase Storage via XHR — giving real browser progress events.

export async function uploadDesignFile(
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<{ path: string }> {
  // 1. Ask our Route Handler for a signed upload URL
  const params = new URLSearchParams({
    filename: file.name,
    size: String(file.size),
    type: file.type,
  });

  const urlRes = await fetch(`/api/upload/design-url?${params}`);
  if (!urlRes.ok) {
    const { error } = await urlRes.json().catch(() => ({ error: "Upload URL request failed" }));
    throw new Error(error);
  }

  const { signedUrl, path } = (await urlRes.json()) as { signedUrl: string; path: string };

  // 2. PUT the file directly to Storage via XHR for progress events
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress?.({
          loaded: e.loaded,
          total: e.total,
          percent: Math.round((e.loaded / e.total) * 100),
        });
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.({ loaded: file.size, total: file.size, percent: 100 });
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

    xhr.open("PUT", signedUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.setRequestHeader("x-upsert", "true");
    xhr.send(file);
  });

  return { path };
}

// ── Preview images ────────────────────────────────────────────────────────────
// Sent to our Route Handler which applies the sharp watermark then uploads.
// Progress is approximated: 10 % on start, 100 % on server response.

export async function uploadPreviewImage(
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<{ path: string; publicUrl: string }> {
  onProgress?.({ loaded: 0, total: 100, percent: 10 });

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload/preview", { method: "POST", body: formData });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Preview upload failed" }));
    throw new Error(error);
  }

  const result = (await res.json()) as { path: string; publicUrl: string };
  onProgress?.({ loaded: 100, total: 100, percent: 100 });
  return result;
}

// ── Product row ───────────────────────────────────────────────────────────────

export interface CreateProductPayload {
  title: string;
  description: string;
  categorySlug: string;
  tags: string[];
  price: number;
  licenseType: "personal" | "commercial" | "extended";
  productType: "digital" | "merchandise";
  designFilePath: string;
  previewPaths: string[];
  fileSizeBytes: number;
  fileFormats: string[];
}

export async function createProduct(payload: CreateProductPayload): Promise<{ id: string }> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Failed to create listing" }));
    throw new Error(error);
  }

  return res.json();
}

// ── Validation helpers ────────────────────────────────────────────────────────

const DESIGN_EXTS = new Set(["svg", "ai", "pdf", "png", "zip", "eps", "psd", "sketch", "fig", "xd"]);

export function validateDesignFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!DESIGN_EXTS.has(ext)) return `File type .${ext} is not accepted.`;
  if (file.size > 50 * 1024 * 1024) return `${file.name} exceeds the 50 MB limit.`;
  return null;
}

export function validatePreviewFile(file: File): string | null {
  if (!file.type.startsWith("image/")) return `${file.name} is not an image.`;
  if (file.size > 5 * 1024 * 1024) return `${file.name} exceeds the 5 MB limit.`;
  return null;
}
