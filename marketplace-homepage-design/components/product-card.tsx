"use client"

import { Star, Heart } from "lucide-react"
import Image from "next/image"

interface ProductCardProps {
  title: string
  designer: string
  price: number
  rating: number
  reviews: number
  image: string
  category: string
}

export function ProductCard({
  title,
  designer,
  price,
  rating,
  reviews,
  image,
  category,
}: ProductCardProps) {
  return (
    <article className="group relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-all hover:bg-background hover:text-foreground group-hover:opacity-100">
          <Heart className="h-4 w-4" />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-tight text-foreground line-clamp-1">
            {title}
          </h3>
          <span className="shrink-0 font-semibold text-foreground">${price}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">by {designer}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviews})</span>
          </div>
        </div>
      </div>
    </article>
  )
}
