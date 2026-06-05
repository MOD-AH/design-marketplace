import Link from "next/link"
import { Mail, Globe, MessageCircle, Send } from "lucide-react"

const footerLinks = {
  marketplace: [
    { name: "Browse All", href: "#" },
    { name: "Categories", href: "#" },
    { name: "Collections", href: "#" },
    { name: "New Arrivals", href: "#" },
    { name: "Top Sellers", href: "#" },
  ],
  sellers: [
    { name: "Start Selling", href: "#" },
    { name: "Seller Dashboard", href: "#" },
    { name: "Seller Guidelines", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Resources", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press", href: "#" },
    { name: "Contact", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "License", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Refund Policy", href: "#" },
  ],
}

const socialLinks = [
  { name: "Email", icon: Mail, href: "#" },
  { name: "Website", icon: Globe, href: "#" },
  { name: "Chat", icon: MessageCircle, href: "#" },
  { name: "Newsletter", icon: Send, href: "#" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">D</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">DesignMarket</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The premier marketplace for premium design assets. Discover unique creations from talented designers worldwide.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Marketplace</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.marketplace.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Sellers</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.sellers.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 DesignMarket. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
