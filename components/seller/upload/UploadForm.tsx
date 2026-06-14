"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  FileCheck,
  Layout,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FileZone } from "./FileZone";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { usePostHog } from "@/lib/posthog";
import {
  uploadDesignFile,
  uploadPreviewImage,
  createProduct,
  validateDesignFile,
  validatePreviewFile,
} from "@/lib/upload";

const STEPS = [
  { id: 1, name: "Files", icon: FileCheck },
  { id: 2, name: "Details", icon: Layout },
  { id: 3, name: "Pricing", icon: DollarSign },
  { id: 4, name: "Review", icon: CheckCircle2 },
];

const CATEGORIES = [
  { label: "Logo Templates", slug: "logo-templates" },
  { label: "Social Media", slug: "social-media" },
  { label: "Poster & Print", slug: "poster-print" },
  { label: "Merchandise", slug: "merchandise" },
  { label: "UI Kits", slug: "ui-kits" },
  { label: "Illustrations", slug: "illustrations" },
  { label: "Icons", slug: "icons" },
  { label: "Fonts & Typography", slug: "fonts-typography" },
  { label: "Presentation", slug: "presentation" },
  { label: "Motion & Video", slug: "motion-video" },
];

export function UploadForm() {
  const posthog = usePostHog();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [designFiles, setDesignFiles] = useState<File[]>([]);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [license, setLicense] = useState<"personal" | "commercial" | "extended">("commercial");
  const [productType, setProductType] = useState<"digital" | "merchandise">("digital");

  // ── Validation errors ───────────────────────────────────────────────────────
  const [designErrors, setDesignErrors] = useState<(string | null)[]>([]);
  const [previewErrors, setPreviewErrors] = useState<(string | null)[]>([]);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  // ── Upload progress (per file, 0–100 or null) ───────────────────────────────
  const [designProgresses, setDesignProgresses] = useState<(number | null)[]>([]);
  const [previewProgresses, setPreviewProgresses] = useState<(number | null)[]>([]);

  // ── File selection handlers ─────────────────────────────────────────────────

  const handleDesignFilesSelected = (files: File[]) => {
    const errs = files.map(validateDesignFile);
    const valid = files.filter((_, i) => !errs[i]);
    const invalid = errs.filter(Boolean);
    if (invalid.length) toast.error(invalid[0]!);
    // Only allow one design file; replace existing
    setDesignFiles(valid.slice(0, 1));
    setDesignErrors(valid.slice(0, 1).map(() => null));
    setDesignProgresses(valid.slice(0, 1).map(() => null));
  };

  const handlePreviewFilesSelected = (files: File[]) => {
    const combined = [...previewFiles, ...files].slice(0, 5);
    const errs = combined.map(validatePreviewFile);
    setPreviewFiles(combined);
    setPreviewErrors(errs);
    setPreviewProgresses(combined.map((_, i) =>
      i < previewProgresses.length ? (previewProgresses[i] ?? null) : null
    ));
    const firstErr = errs.find(Boolean);
    if (firstErr) toast.error(firstErr);
  };

  const removeDesignFile = (idx: number) => {
    setDesignFiles((f) => f.filter((_, i) => i !== idx));
    setDesignErrors((e) => e.filter((_, i) => i !== idx));
    setDesignProgresses((p) => p.filter((_, i) => i !== idx));
  };

  const removePreviewFile = (idx: number) => {
    setPreviewFiles((f) => f.filter((_, i) => i !== idx));
    setPreviewErrors((e) => e.filter((_, i) => i !== idx));
    setPreviewProgresses((p) => p.filter((_, i) => i !== idx));
  };

  // ── Tags ────────────────────────────────────────────────────────────────────

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (!tags.includes(tag) && tags.length < 10) setTags([...tags, tag]);
      setTagInput("");
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────────

  const validateStep = (): boolean => {
    if (currentStep === 1) {
      if (designFiles.length === 0) {
        toast.error("Please upload at least one design file.");
        return false;
      }
      if (previewFiles.length === 0) {
        toast.error("Please upload at least one preview image.");
        return false;
      }
      if (designErrors.some(Boolean) || previewErrors.some(Boolean)) {
        toast.error("Fix file errors before continuing.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!title.trim()) {
        setTitleError("Product title is required.");
        return false;
      }
      setTitleError(null);
    }
    if (currentStep === 3) {
      const p = parseFloat(price);
      if (isNaN(p) || p < 0) {
        setPriceError("Please enter a valid price (0 or more).");
        return false;
      }
      setPriceError(null);
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // 1. Upload design file (with real XHR progress)
      const uploadToastId = toast.loading("Uploading design file…");

      setDesignProgresses([0]);
      let designPath: string;
      try {
        const result = await uploadDesignFile(designFiles[0]!, (p) => {
          setDesignProgresses([p.percent]);
        });
        designPath = result.path;
        setDesignProgresses([100]);
      } catch (err) {
        setDesignProgresses([null]);
        throw new Error(`Design upload failed: ${(err as Error).message}`);
      }

      // 2. Upload preview images (watermarked via server)
      toast.loading("Processing previews…", { id: uploadToastId });

      const previewPaths: string[] = [];
      const initProgresses = previewFiles.map(() => 0);
      setPreviewProgresses(initProgresses);

      for (let i = 0; i < previewFiles.length; i++) {
        try {
          const result = await uploadPreviewImage(previewFiles[i]!, (p) => {
            setPreviewProgresses((prev) => {
              const next = [...prev];
              next[i] = p.percent;
              return next;
            });
          });
          previewPaths.push(result.path);
          setPreviewProgresses((prev) => {
            const next = [...prev];
            next[i] = 100;
            return next;
          });
        } catch (err) {
          throw new Error(
            `Preview ${i + 1} upload failed: ${(err as Error).message}`
          );
        }
      }

      // 3. Create the product row
      toast.loading("Creating your listing…", { id: uploadToastId });

      const ext = designFiles[0]!.name.split(".").pop() ?? "";

      await createProduct({
        title: title.trim(),
        description: description.trim(),
        categorySlug,
        tags,
        price: parseFloat(price) || 0,
        licenseType: license,
        productType,
        designFilePath: designPath,
        previewPaths,
        fileSizeBytes: designFiles[0]!.size,
        fileFormats: ext ? [ext.toUpperCase()] : [],
      });

      posthog.capture("design_uploaded", {
        category: categorySlug || undefined,
        license_type: license,
        product_type: productType,
        price: parseFloat(price) || 0,
        preview_count: previewPaths.length,
        tags,
      });

      toast.success("Product submitted for review! You'll be notified when it goes live.", { id: uploadToastId });

      // Brief delay so the success toast is visible before navigation
      await new Promise((r) => setTimeout(r, 800));
      router.push("/seller/products");
    } catch (err) {
      toast.error((err as Error).message);
      // Reset all progresses so user can retry
      setDesignProgresses(designFiles.map(() => null));
      setPreviewProgresses(previewFiles.map(() => null));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step rendering ──────────────────────────────────────────────────────────

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Upload your assets</h3>
              <p className="text-white/40 text-sm">
                Upload the final design file and attractive previews.
              </p>
            </div>

            <FileZone
              label="Design Source"
              description="Upload the main project file (SVG, AI, PDF, ZIP, etc.)"
              accept=".svg,.ai,.pdf,.png,.zip,.eps,.psd,.sketch,.fig,.xd"
              maxSize={50}
              onFilesSelected={handleDesignFilesSelected}
              files={designFiles}
              onRemove={removeDesignFile}
              progresses={designProgresses}
              errors={designErrors}
            />

            <FileZone
              label="Previews"
              description="Attractive JPG or PNG previews — a watermark is added automatically."
              accept="image/*"
              multiple
              maxFiles={5}
              maxSize={5}
              onFilesSelected={handlePreviewFilesSelected}
              files={previewFiles}
              onRemove={removePreviewFile}
              progresses={previewProgresses}
              errors={previewErrors}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Tell us more</h3>
              <p className="text-white/40 text-sm">
                Provide a catchy title and detailed description.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
                  Product Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); if (titleError) setTitleError(null); }}
                  placeholder="e.g. Premium 3D Abstract Icons"
                  maxLength={120}
                  aria-invalid={!!titleError}
                  className={cn(
                    "w-full bg-white/5 border rounded-2xl p-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2",
                    titleError ? "border-rose-500 focus:ring-rose-500/50" : "border-white/10 focus:ring-amber-400/50"
                  )}
                />
                {titleError && <p className="text-xs text-rose-400 px-1">{titleError}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what's included and how to use it…"
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
                    Category
                  </label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 appearance-none"
                  >
                    <option value="" className="bg-[#111318]">
                      Select Category
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug} className="bg-[#111318]">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
                    Tags <span className="text-white/20">(press Enter)</span>
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="e.g. minimal, abstract, dark"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pl-3 pr-1 py-1 gap-1">
                        {tag}
                        <button
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
                          className="p-0.5 rounded-full hover:bg-white/20 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Set your price</h3>
              <p className="text-white/40 text-sm">
                Choose how you want to license and sell your work.
              </p>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
                  Price (INR) <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => { setPrice(e.target.value); if (priceError) setPriceError(null); }}
                    placeholder="0"
                    min="0"
                    aria-invalid={!!priceError}
                    className={cn(
                      "w-full bg-white/5 border rounded-2xl p-4 pl-8 text-white placeholder:text-white/10 focus:outline-none focus:ring-2",
                      priceError ? "border-rose-500 focus:ring-rose-500/50" : "border-white/10 focus:ring-amber-400/50"
                    )}
                  />
                </div>
                {priceError
                  ? <p className="text-xs text-rose-400 px-1">{priceError}</p>
                  : <p className="text-[10px] text-white/30 px-1">Set ₹0 for a free product.</p>
                }
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
                  License Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(
                    [
                      {
                        value: "personal",
                        title: "Personal",
                        desc: "Single personal project",
                      },
                      {
                        value: "commercial",
                        title: "Commercial",
                        desc: "Unlimited client work",
                      },
                      {
                        value: "extended",
                        title: "Extended",
                        desc: "Includes SaaS / resale",
                      },
                    ] as const
                  ).map(({ value, title: t, desc }) => (
                    <button
                      key={value}
                      onClick={() => setLicense(value)}
                      className={cn(
                        "p-6 rounded-2xl border text-center transition-all",
                        license === value
                          ? "border-amber-400 bg-amber-400/10 text-white"
                          : "border-white/10 bg-white/5 text-white/40 hover:border-white/20"
                      )}
                    >
                      <p className="text-sm font-bold mb-1">{t}</p>
                      <p className="text-[10px] opacity-60">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
                  Product Type
                </label>
                <div className="flex gap-4">
                  {(["digital", "merchandise"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setProductType(type)}
                      className={cn(
                        "px-6 py-3 rounded-full border text-xs font-bold uppercase tracking-widest transition-all",
                        productType === type
                          ? "bg-white text-black border-white"
                          : "border-white/10 text-white/40 hover:border-white/20"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Final Review</h3>
              <p className="text-white/40 text-sm">
                Double-check everything before publishing.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-6">
                <div className="flex justify-between items-start border-b border-white/5 pb-6">
                  <div>
                    <Badge variant="premium" className="mb-2">
                      READY TO PUBLISH
                    </Badge>
                    <h4 className="text-2xl font-bold text-white">
                      {title || "Untitled Product"}
                    </h4>
                    <p className="text-amber-400 font-bold text-lg mt-1">
                      {parseFloat(price) > 0 ? `₹${price}` : "Free"}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-bold text-white/40 hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      Files
                    </p>
                    <p className="text-white/80">
                      {designFiles.length} source · {previewFiles.length} preview
                      {previewFiles.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      Category
                    </p>
                    <p className="text-white/80 capitalize">
                      {CATEGORIES.find((c) => c.slug === categorySlug)?.label ||
                        "Uncategorized"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      License
                    </p>
                    <p className="text-white/80 capitalize">{license}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      Tags
                    </p>
                    <p className="text-white/80 line-clamp-1">
                      {tags.join(", ") || "No tags"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-amber-400/5 border border-amber-400/20 flex items-start gap-4">
                <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-white/60 leading-relaxed">
                  By publishing, you agree to our{" "}
                  <span className="text-white font-medium underline">Seller Agreement</span>{" "}
                  and confirm you have full rights to these assets. Your product will be{" "}
                  <span className="text-amber-400 font-medium">reviewed by our team</span>{" "}
                  before going live.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto py-12">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
        {STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isDone = step.id < currentStep;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border",
                  isActive
                    ? "bg-amber-400 border-amber-400 scale-110 shadow-lg shadow-amber-400/20 text-black"
                    : isDone
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-[#111318] border-white/10 text-white/20"
                )}
              >
                <step.icon size={18} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-colors",
                  isActive ? "text-white" : "text-white/20"
                )}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">{renderStep()}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className="h-12 px-8 rounded-2xl border-white/10 text-white/60 disabled:opacity-0"
        >
          <ChevronLeft size={16} className="mr-2" /> Back
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="h-12 px-8 rounded-2xl bg-white text-black font-bold hover:bg-white/90"
          >
            Continue <ChevronRight size={16} className="ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-12 px-12 rounded-2xl bg-amber-400 text-black font-bold hover:bg-amber-300 shadow-xl shadow-amber-400/20 disabled:opacity-60"
          >
            {isSubmitting ? "Publishing…" : "Publish Product"}
          </Button>
        )}
      </div>
    </div>
  );
}
