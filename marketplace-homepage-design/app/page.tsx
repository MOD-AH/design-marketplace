import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CategoryStrip } from "@/components/category-strip"
import { FeaturedProducts } from "@/components/featured-products"
import { SellBanner } from "@/components/sell-banner"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <CategoryStrip />
        <FeaturedProducts />
        <SellBanner />
      </main>
      <Footer />
    </div>
  )
}
