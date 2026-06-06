import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, DollarSign, Globe, ShieldCheck, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Sell on Designr",
  description: "Turn your design skills into income. Join thousands of creators selling on Designr.",
}

const PERKS = [
  {
    icon: DollarSign,
    title: "Keep 80% of every sale",
    description: "Industry-leading revenue share. No hidden fees.",
  },
  {
    icon: Globe,
    title: "Global reach",
    description: "Sell to buyers in 190+ countries from day one.",
  },
  {
    icon: Zap,
    title: "Instant payouts",
    description: "Earnings hit your account within 48 hours of a sale.",
  },
  {
    icon: ShieldCheck,
    title: "We handle everything",
    description: "Payments, tax, delivery, and dispute resolution — all covered.",
  },
]

export default function SellPage() {
  return (
    <main className="min-h-screen bg-[#0a0b0e] pt-24 pb-16 text-white">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-5xl font-black tracking-tight md:text-6xl">
          Turn your designs<br />
          <span className="text-amber-400">into income.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
          Join thousands of designers selling UI kits, templates, icons, and more on Designr.
          Set up your store in minutes.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="flex items-center gap-2 h-14 px-10 rounded-2xl bg-amber-400 text-black font-bold text-lg hover:bg-amber-300 transition-colors shadow-xl shadow-amber-400/20"
          >
            Start selling free <ArrowRight size={20} />
          </Link>
          <Link
            href="/products"
            className="h-14 px-10 rounded-2xl border border-white/10 text-white/70 font-semibold hover:border-white/20 hover:text-white transition-colors"
          >
            Browse the marketplace
          </Link>
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-3xl border border-white/5 bg-white/[0.03] p-6 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                <Icon className="text-amber-400" size={20} />
              </div>
              <h3 className="font-bold text-white">{title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
