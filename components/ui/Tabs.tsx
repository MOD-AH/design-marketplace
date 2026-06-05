"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  tabs: {
    id: string
    label: string
    content: React.ReactNode
  }[]
  defaultValue?: string
  className?: string
}

export function Tabs({ tabs, defaultValue, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0]?.id)

  return (
    <div className={cn("w-full", className)}>
      <div className="flex border-b border-white/10 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-4 text-sm font-medium transition-all relative",
              activeTab === tab.id
                ? "text-white"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
            )}
          </button>
        ))}
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}
