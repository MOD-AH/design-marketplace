import type { Metadata } from "next"
import { User } from "lucide-react"

export const metadata: Metadata = { title: "Profile | Designr" }

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#0a0b0e] pt-24 pb-16 px-6">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">My Profile</h1>
          <p className="mt-1 text-white/40">Manage your public profile and account details.</p>
        </div>

        <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <User className="text-white/40" size={28} />
          </div>
          <h2 className="text-xl font-bold text-white">Coming soon</h2>
          <p className="text-white/40 text-sm max-w-xs">
            Avatar, bio, username, and purchase history will live here.
          </p>
        </div>
      </div>
    </main>
  )
}
