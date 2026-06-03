import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover premium design assets, templates, and resources.",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-white px-4 py-24 text-center">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Design{" "}
          <span className="text-brand-600">Marketplace</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-gray-600">
          Discover, buy, and sell premium design assets — UI kits, templates, icons,
          illustrations, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/browse"
            className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Browse Assets
          </a>
          <a
            href="/sell"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Start Selling
          </a>
        </div>
      </section>

      {/* Feature grid */}
      <section className="container-page py-20">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Why Design Marketplace?
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer placeholder */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Design Marketplace. All rights reserved.
      </footer>
    </main>
  );
}

const FEATURES = [
  {
    icon: "🎨",
    title: "Premium Quality",
    description: "Every asset is reviewed for quality and usability before it goes live.",
  },
  {
    icon: "⚡",
    title: "Instant Download",
    description: "Purchase and download in seconds. No waiting, no friction.",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    description: "Industry-standard encryption keeps every transaction safe.",
  },
  {
    icon: "🌍",
    title: "Global Community",
    description: "Connect with thousands of designers and creators worldwide.",
  },
  {
    icon: "💼",
    title: "Commercial License",
    description: "All assets include a commercial license so you can ship with confidence.",
  },
  {
    icon: "🛠️",
    title: "Creator Tools",
    description: "Powerful dashboard to upload, manage, and monetize your work.",
  },
];
