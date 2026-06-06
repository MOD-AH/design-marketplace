import type { Metadata } from "next"
import { Settings } from "lucide-react"

export const metadata: Metadata = { title: "Settings | Designr" }

export default function SellerSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-white/40">Manage your account, payout, and notification preferences.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
          <Settings className="text-white/40" size={28} />
        </div>
        <h2 className="text-xl font-bold text-white">Coming soon</h2>
        <p className="text-white/40 text-sm max-w-xs">
          Profile details, Stripe Connect onboarding, and notification settings will live here.
        </p>
      </div>
    </div>
  )
}
