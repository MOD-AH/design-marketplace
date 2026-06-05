"use client"

import { useState } from "react"
import { Loader2, Wallet, AlertTriangle, CheckCircle2 } from "lucide-react"
import { requestPayout } from "./actions"

type State = "idle" | "confirming" | "loading" | "success" | "error"

interface PayoutButtonProps {
  available: number
  hasPendingPayout: boolean
}

export function PayoutButton({ available, hasPendingPayout }: PayoutButtonProps) {
  const [state, setState] = useState<State>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const disabled = available <= 0 || hasPendingPayout

  async function handleConfirm() {
    setState("loading")
    const result = await requestPayout(available)
    if (result.error) {
      setErrorMsg(result.error)
      setState("error")
    } else {
      setState("success")
    }
  }

  if (state === "success") {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-400">
        <CheckCircle2 size={16} />
        Payout requested — processing soon
      </div>
    )
  }

  if (state === "confirming") {
    return (
      <div className="space-y-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
          <AlertTriangle size={15} />
          Confirm payout of ₹{available.toLocaleString("en-IN")}?
        </div>
        <p className="text-xs text-white/40">
          This creates a pending payout request. Processing takes 3–5 business days.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setState("idle")}
            className="flex-1 rounded-xl border border-white/10 py-2 text-xs font-medium text-white/50 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-400 py-2 text-xs font-bold text-black hover:bg-amber-300"
          >
            Confirm
          </button>
        </div>
      </div>
    )
  }

  if (state === "loading") {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-amber-400/10 px-5 py-3 text-sm font-semibold text-amber-400">
        <Loader2 size={15} className="animate-spin" />
        Submitting request…
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="space-y-2">
        <p className="text-xs text-rose-400">{errorMsg}</p>
        <button
          onClick={() => setState("idle")}
          className="text-xs font-medium text-white/40 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setState("confirming")}
      disabled={disabled}
      className="flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
    >
      <Wallet size={15} />
      {hasPendingPayout ? "Payout pending" : "Request Payout"}
    </button>
  )
}
