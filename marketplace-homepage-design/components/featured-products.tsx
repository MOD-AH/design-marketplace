"use client"

import { ProductCard } from "./product-card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const featuredProducts = [
  {
    title: "Minimal Brand Identity Kit",
    designer: "Sarah Chen",
    price: 79,
    rating: 4.9,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
    category: "Logos",
  },
  {
    title: "Retro Poster Collection",
    designer: "Marcus Wong",
    price: 49,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    category: "Posters",
  },
  {
    title: "Neo Geometric Font Family",
    designer: "Elena Vasquez",
    price: 129,
    rating: 5.0,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
    category: "Fonts",
  },
  {
    title: "Streetwear Mockup Bundle",
    designer: "Jordan Lee",
    price: 59,
    rating: 4.7,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=600&fit=crop",
    category: "Merchandise",
  },
  {
    title: "Essential Icon Set Pro",
    designer: "Alex Rivera",
    price: 39,
    rating: 4.9,
    reviews: 567,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
    category: "Icons",
  },
  {
    title: "Abstract 3D Shapes Pack",
    designer: "Nina Petrov",
    price: 69,
    rating: 4.8,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=600&fit=crop",
    category: "Illustrations",
  },
]

export function FeaturedProducts() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
              Featured this week
            </h2>
            <p className="mt-2 text-muted-foreground">
              Hand-picked designs from our top creators
            </p>
          </div>
          <Link
            href="#"
            className="group hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:flex"
          >
            View all products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.title} {...product} />
          ))}
        </div>

        <Link
          href="#"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:hidden"
        >
          View all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
