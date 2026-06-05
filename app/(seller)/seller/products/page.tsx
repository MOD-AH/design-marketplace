import type { Metadata } from "next"
import { SellerProductsClient } from "./SellerProductsClient"

export const metadata: Metadata = {
  title: "My Products | Designr",
}

export default function SellerProductsPage() {
  return <SellerProductsClient />
}
