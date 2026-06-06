"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Plus, Pencil, Trash2, EyeOff, AlertTriangle,
  X, Loader2, ImageOff, ChevronDown,
} from "lucide-react"
import { useAuth } from "@/components/AuthProvider"
import { supabaseBrowser } from "@/lib/supabase/client"
import type { ProductRow, ProductStatus, LicenseType } from "@/types/database"

// ── Types ─────────────────────────────────────────────────────────────────────

type EditForm = {
  title: string
  description: string
  price: string
  status: ProductStatus
  license_type: LicenseType
  tags: string           // comma-separated; split on save
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ProductStatus,
  { label: string; classes: string }
> = {
  published:      { label: "Published",   classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  pending_review: { label: "In Review",   classes: "bg-amber-500/15  text-amber-400  border-amber-500/30"  },
  draft:          { label: "Draft",       classes: "bg-white/5       text-white/50   border-white/10"       },
  rejected:       { label: "Rejected",    classes: "bg-rose-500/15   text-rose-400   border-rose-500/30"    },
  unpublished:    { label: "Unpublished", classes: "bg-white/5       text-white/30   border-white/10"       },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`
}

function StatusBadge({ status }: { status: ProductStatus }) {
  const { label, classes } = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${classes}`}>
      {label}
    </span>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
      <div className="grid grid-cols-[64px_1fr_120px_100px_80px_110px_120px] gap-4 border-b border-white/5 px-6 py-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-3 animate-pulse rounded bg-white/5" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[64px_1fr_120px_100px_80px_110px_120px] items-center gap-4 border-b border-white/5 px-6 py-4 last:border-0"
        >
          <div className="aspect-[4/3] w-16 animate-pulse rounded-lg bg-white/5" />
          <div className="space-y-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
            <div className="h-2.5 w-1/2 animate-pulse rounded bg-white/5" />
          </div>
          {Array.from({ length: 5 }).map((_, j) => (
            <div key={j} className="h-3 animate-pulse rounded bg-white/5" />
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

const EDITABLE_STATUSES: ProductStatus[] = ["draft", "pending_review", "unpublished"]
const LICENSE_OPTIONS: LicenseType[] = ["personal", "commercial", "extended"]

interface EditModalProps {
  form: EditForm
  saving: boolean
  onChange: (patch: Partial<EditForm>) => void
  onSave: () => void
  onClose: () => void
}

function EditModal({ form, saving, onChange, onSave, onClose }: EditModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl animate-in fade-in zoom-in-95 rounded-3xl border border-white/10 bg-[#111318] shadow-2xl duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <h2 className="text-lg font-bold text-white">Edit Product</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 overflow-y-auto p-6" style={{ maxHeight: "70vh" }}>
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
              placeholder="Product title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
              placeholder="Describe your product…"
            />
          </div>

          {/* Price + Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
                Price (₹) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-white/30">₹</span>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => onChange({ price: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-8 pr-4 text-sm text-white placeholder-white/20 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
                Status
              </label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={(e) => onChange({ status: e.target.value as ProductStatus })}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-8 text-sm text-white focus:border-amber-400/50 focus:outline-none"
                >
                  {EDITABLE_STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-[#111318]">
                      {STATUS_CONFIG[s].label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>
          </div>

          {/* License */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
              License Type
            </label>
            <div className="flex gap-2">
              {LICENSE_OPTIONS.map((lic) => (
                <button
                  key={lic}
                  type="button"
                  onClick={() => onChange({ license_type: lic })}
                  className={`flex-1 rounded-xl border py-2.5 text-xs font-semibold capitalize transition-all ${
                    form.license_type === lic
                      ? "border-amber-400/50 bg-amber-400/10 text-amber-400"
                      : "border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  {lic}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
              Tags
              <span className="ml-1.5 font-normal normal-case tracking-normal text-white/20">
                (comma-separated)
              </span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => onChange({ tags: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
              placeholder="ui, dark, minimal, figma"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/5 px-6 py-5">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving || !form.title.trim() || !form.price}
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-amber-300 disabled:opacity-40"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirmation Dialog ─────────────────────────────────────────────────

interface DeleteDialogProps {
  productTitle: string
  deleting: boolean
  onConfirm: () => void
  onClose: () => void
}

function DeleteDialog({ productTitle, deleting, onConfirm, onClose }: DeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 rounded-3xl border border-white/10 bg-[#111318] p-8 shadow-2xl duration-200">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10">
          <AlertTriangle size={26} className="text-rose-400" />
        </div>

        <h2 className="mb-2 text-xl font-bold text-white">Delete product?</h2>
        <p className="mb-1 text-sm text-white/50">
          You're about to permanently delete:
        </p>
        <p className="mb-6 text-sm font-semibold text-white">
          "{productTitle}"
        </p>
        <p className="mb-8 text-xs text-white/30">
          This cannot be undone. Existing orders will not be affected.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-500 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-400 disabled:opacity-40"
          >
            {deleting && <Loader2 size={14} className="animate-spin" />}
            {deleting ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

const EMPTY_FORM: EditForm = {
  title: "",
  description: "",
  price: "",
  status: "draft",
  license_type: "commercial",
  tags: "",
}

export function SellerProductsClient() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [products, setProducts]       = useState<ProductRow[]>([])
  const [fetching, setFetching]       = useState(true)
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<ProductRow | null>(null)
  const [form, setForm]               = useState<EditForm>(EMPTY_FORM)
  const [saving, setSaving]           = useState(false)
  const [deleting, setDeleting]       = useState(false)
  const [actionId, setActionId]       = useState<string | null>(null) // row being inline-updated

  // ── Auth guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace("/login"); return }
    if (profile && !profile.is_seller) router.replace("/")
  }, [authLoading, user, profile, router])

  // ── Fetch seller's products ──────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    if (!profile?.id) return
    setFetching(true)
    const { data } = await supabaseBrowser
      .from("products")
      .select("*")
      .eq("seller_id", profile.id)
      .order("created_at", { ascending: false })
    setProducts((data as ProductRow[]) ?? [])
    setFetching(false)
  }, [profile?.id])

  useEffect(() => {
    if (profile?.id) fetchProducts()
  }, [profile?.id, fetchProducts])

  // ── Edit handlers ────────────────────────────────────────────────────────
  function openEdit(product: ProductRow) {
    setEditProduct(product)
    setForm({
      title: product.title,
      description: product.description ?? "",
      price: String(product.price),
      status: product.status,
      license_type: product.license_type,
      tags: product.tags.join(", "),
    })
  }

  async function handleSave() {
    if (!editProduct || !profile?.id) return
    setSaving(true)
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const { error } = await supabaseBrowser
      .from("products")
      .update({
        title: form.title.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        status: form.status,
        license_type: form.license_type,
        tags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editProduct.id)
      .eq("seller_id", profile.id)   // safety: can only update own products

    setSaving(false)
    if (!error) {
      setEditProduct(null)
      fetchProducts()
    }
  }

  // ── Unpublish inline action ──────────────────────────────────────────────
  async function handleUnpublish(product: ProductRow) {
    if (!profile?.id) return
    setActionId(product.id)
    await supabaseBrowser
      .from("products")
      .update({ status: "unpublished", updated_at: new Date().toISOString() })
      .eq("id", product.id)
      .eq("seller_id", profile.id)
    setActionId(null)
    fetchProducts()
  }

  // ── Delete handlers ──────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteProduct || !profile?.id) return
    setDeleting(true)
    const { error } = await supabaseBrowser
      .from("products")
      .delete()
      .eq("id", deleteProduct.id)
      .eq("seller_id", profile.id)   // safety: can only delete own products
    setDeleting(false)
    if (!error) {
      setDeleteProduct(null)
      setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id))
    }
  }

  // ── Loading / auth states ────────────────────────────────────────────────
  if (authLoading || !profile) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-44 animate-pulse rounded-xl bg-white/5" />
            <div className="h-4 w-36 animate-pulse rounded-lg bg-white/5" />
          </div>
          <div className="h-11 w-36 animate-pulse rounded-2xl bg-white/5" />
        </div>
        <TableSkeleton />
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-8">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">My Products</h1>
            <p className="mt-1 font-medium text-white/40">Manage your listed assets.</p>
          </div>
          <Link
            href="/seller/upload"
            className="flex h-11 items-center gap-2 rounded-2xl bg-amber-400 px-6 text-sm font-bold text-black shadow-lg shadow-amber-400/20 transition-colors hover:bg-amber-300"
          >
            <Plus size={16} /> New Product
          </Link>
        </div>

        {/* Table / states */}
        {fetching ? (
          <TableSkeleton />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] py-32 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10">
              <ImageOff className="text-amber-400" size={28} />
            </div>
            <h2 className="text-xl font-bold text-white">No products yet</h2>
            <p className="max-w-xs text-sm text-white/40">
              Upload your first design to start selling.
            </p>
            <Link
              href="/seller/upload"
              className="mt-2 text-sm font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300"
            >
              Upload your first product →
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-white/5 lg:block">
              {/* Column headers */}
              <div className="grid grid-cols-[72px_1fr_130px_100px_80px_120px_140px] gap-4 border-b border-white/5 bg-white/[0.02] px-5 py-3">
                {["", "Product", "Status", "Price", "Sales", "Listed", "Actions"].map(
                  (h) => (
                    <span key={h} className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
                      {h}
                    </span>
                  ),
                )}
              </div>

              {/* Rows */}
              {products.map((product) => {
                const thumb = product.preview_urls[0] ?? null
                const isPending = actionId === product.id

                return (
                  <div
                    key={product.id}
                    className="grid grid-cols-[72px_1fr_130px_100px_80px_120px_140px] items-center gap-4 border-b border-white/5 px-5 py-4 last:border-0 hover:bg-white/[0.02]"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[4/3] w-[72px] overflow-hidden rounded-lg bg-white/5">
                      {thumb ? (
                        <Image src={thumb} alt={product.title} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/10">
                          <ImageOff size={18} />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {product.title}
                      </p>
                      <p className="mt-0.5 text-xs text-white/30 capitalize">
                        {product.product_type} · {product.license_type}
                      </p>
                    </div>

                    {/* Status */}
                    <StatusBadge status={product.status} />

                    {/* Price */}
                    <span className="text-sm font-semibold text-white">
                      {formatPrice(product.price)}
                    </span>

                    {/* Sales */}
                    <span className="text-sm text-white/60">
                      {product.total_sales.toLocaleString()}
                    </span>

                    {/* Date */}
                    <span className="text-xs text-white/40">
                      {formatDate(product.created_at)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {/* Edit */}
                      <button
                        onClick={() => openEdit(product)}
                        title="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-all hover:bg-white/5 hover:text-white"
                      >
                        <Pencil size={14} />
                      </button>

                      {/* Unpublish — only when published */}
                      {product.status === "published" && (
                        <button
                          onClick={() => handleUnpublish(product)}
                          disabled={isPending}
                          title="Unpublish"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-all hover:bg-white/5 hover:text-amber-400 disabled:opacity-40"
                        >
                          {isPending ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <EyeOff size={14} />
                          )}
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteProduct(product)}
                        title="Delete"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-all hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 lg:hidden">
              {products.map((product) => {
                const thumb = product.preview_urls[0] ?? null
                const isPending = actionId === product.id
                return (
                  <div
                    key={product.id}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                  >
                    <div className="flex gap-3">
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
                        {thumb ? (
                          <Image src={thumb} alt={product.title} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/10">
                            <ImageOff size={16} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{product.title}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <StatusBadge status={product.status} />
                          <span className="text-xs font-semibold text-white">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-xs text-white/30">
                            {product.total_sales} sales
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-white/25">
                          {formatDate(product.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2 border-t border-white/5 pt-3">
                      <button
                        onClick={() => openEdit(product)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs font-medium text-white/60 hover:bg-white/5"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      {product.status === "published" && (
                        <button
                          onClick={() => handleUnpublish(product)}
                          disabled={isPending}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs font-medium text-white/60 hover:bg-white/5 disabled:opacity-40"
                        >
                          {isPending ? <Loader2 size={12} className="animate-spin" /> : <EyeOff size={12} />}
                          Unpublish
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteProduct(product)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/5"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-center text-xs text-white/20">
              {products.length} product{products.length !== 1 ? "s" : ""} total
            </p>
          </>
        )}
      </div>

      {/* Edit modal */}
      {editProduct && (
        <EditModal
          form={form}
          saving={saving}
          onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
          onSave={handleSave}
          onClose={() => setEditProduct(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteProduct && (
        <DeleteDialog
          productTitle={deleteProduct.title}
          deleting={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleteProduct(null)}
        />
      )}
    </>
  )
}
