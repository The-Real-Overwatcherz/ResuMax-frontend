"use client"
import { motion } from "motion/react"

export function Connector({ filled }: { filled: boolean }) {
  return (
    <div className="h-[2px] bg-[#1a1a1a] relative w-full rounded-full overflow-hidden transform-gpu" style={{ transform: "translateZ(0)" }}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: filled ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute left-0 top-0 h-full w-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] origin-left"
      />
    </div>
  )
}
