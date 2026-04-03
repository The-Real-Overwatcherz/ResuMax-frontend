"use client"
import { motion } from "motion/react"

type Props = { label: string; active: boolean; isAI?: boolean }

export function PipelineNode({ label, active, isAI }: Props) {
  // Glassmorphic variants matching new theme
  const activeBg = isAI ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.1)"
  const inactiveBg = "rgba(0,0,0,0.4)"

  const activeBorder = "rgba(255,255,255,0.4)"
  const inactiveBorder = "rgba(255,255,255,0.1)"

  const activeColor = "#ffffff"
  const inactiveColor = "#666666"

  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor: active ? activeBg : inactiveBg,
        borderColor: active ? activeBorder : inactiveBorder,
        color: active ? activeColor : inactiveColor,
        scale: active ? 1.05 : 1,
      }}
      transition={{ duration: 0.4 }}
      className={`w-14 h-14 flex-shrink-0 border flex items-center justify-center font-sans font-medium text-lg tracking-tight z-20 rounded-full transition-shadow duration-500 ${
        active && isAI ? "shadow-[0_0_20px_rgba(255,255,255,0.2)]" : ""
      }`}
    >
      {label}
    </motion.div>
  )
}
