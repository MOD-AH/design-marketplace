import { SellerSidebar } from "@/components/seller/SellerSidebar"

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0b0e]">
      <SellerSidebar />
      <main className="flex-1 overflow-x-hidden pt-16">
        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
