"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function InteractiveCard({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/5",
        "hover:bg-slate-800/60 hover:border-white/10 transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export function Timeline({ 
  steps 
}: { 
  steps: { title: string; duration: string; description: string }[] 
}) {
  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-indigo-500/20 before:to-transparent">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-slate-950 text-indigo-400 shadow-lg shadow-indigo-900/20 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 overflow-hidden relative">
            <div className="absolute inset-0 bg-indigo-500/10" />
            <span className="relative z-10 font-bold font-mono">{index + 1}</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[45%] p-5 rounded-xl bg-slate-900/60 border border-white/5 shadow-lg transition-all hover:bg-slate-800/80 hover:border-indigo-500/30">
            <div className="flex items-center justify-between space-x-2 mb-2">
              <div className="font-bold text-slate-100">{step.title}</div>
              <div className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {step.duration}
              </div>
            </div>
            <div className="text-slate-400 text-sm leading-relaxed">{step.description}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
