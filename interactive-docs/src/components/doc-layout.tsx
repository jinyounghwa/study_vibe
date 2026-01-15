"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowLeft, Home, Menu } from "lucide-react"
import { cn } from "@/lib/utils"


export function DocLayout({ 
  children, 
  title, 
  id,
  image,
  color = "from-indigo-500 to-purple-500" // Default fallback
}: { 
  children: React.ReactNode
  title: string
  id: string
  image?: string
  color?: string 
}) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Header parallax effecft
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Progress Bar */}
      <motion.div
        className={cn("fixed top-0 left-0 right-0 h-1 bg-gradient-to-r z-50 origin-left", color)}
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="sticky top-0 w-full glass z-40 px-6 py-4 border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
              <Home size={20} className="text-slate-400 group-hover:text-white transition-colors" />
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <span className={cn("font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r", color)}>
              Chapter {id}
            </span>
            {/* Show title in nav when scrolled down */}
            <motion.h1 
              style={{ opacity: useSpring(useTransform(scrollYProgress, [0.1, 0.2], [0, 1])) }}
              className="text-sm font-bold text-slate-100 hidden md:block truncate max-w-md"
            >
              {title}
            </motion.h1>
          </div>
          <Link href="/" className="text-sm font-medium flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Link>
        </div>
      </nav>

      {/* Hero Header for Chapter */}
      <div className="relative h-64 md:h-80 overflow-hidden flex items-center justify-center">
         <Image 
           src={image || "/images/hero-bg.png"}
           alt="Chapter Background" 
           fill 
           className="object-cover opacity-30"
         />
         <div className={cn("absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 opacity-90")} />
         
         <div className="relative z-10 max-w-4xl px-6 text-center">
            <motion.div
              style={{ y: headerY, opacity: headerOpacity }}
            >
              <div className={cn(
                "inline-flex items-center justify-center px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6",
                "text-xs font-mono tracking-widest uppercase text-slate-300"
              )}>
                Chapter {id}
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 drop-shadow-lg">
                {title}
              </h1>
            </motion.div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12 relative z-10 -mt-20">
        {/* TOC Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-28 space-y-8">
             <div className="p-6 rounded-2xl glass border border-white/5 bg-slate-900/50">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                  <Menu size={12} className="mr-2" />
                  Table of Contents
                </h4>
                {/* 
                  Ideally, we recursively parse content headers here. 
                  For now, we will use a unified placeholder until we implement dynamic TOC parsing.
                */}
                <div className="space-y-3 relative border-l border-white/10 ml-1.5 pl-4">
                  <div className={cn("absolute left-0 top-0 w-0.5 h-6 -ml-[1px] bg-gradient-to-b", color)} />
                  <div className="text-sm font-bold text-white cursor-pointer">Introduction</div>
                  <div className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer pl-2">Key Concepts</div>
                  <div className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer pl-2">Implementation</div>
                  <div className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer pl-2">Best Practices</div>
                  <div className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">Summary</div>
                </div>
             </div>
             
             {/* Dynamic "Next Chapter" preview? (Optional) */}
             <div className={cn("p-1 rounded-2xl bg-gradient-to-br opacity-50", color)}>
                <div className="bg-slate-950 rounded-xl p-4">
                   <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Coming Up</div>
                   <div className="text-sm font-bold text-white">Advanced Techniques</div>
                </div>
             </div>
          </div>
        </aside>

        <main className="flex-1 max-w-4xl min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 md:p-12 rounded-3xl glass border border-white/5 bg-slate-900/80 shadow-2xl"
          >
            <article className="prose prose-invert prose-lg max-w-none 
              prose-headings:font-black prose-headings:tracking-tighter 
              prose-p:text-slate-300 prose-p:leading-8 
              prose-strong:text-white prose-strong:font-bold
              prose-code:text-indigo-300 prose-code:bg-indigo-950/30 prose-code:px-1 prose-code:rounded prose-code:font-medium
              prose-pre:bg-slate-950/50 prose-pre:border prose-pre:border-white/5
            ">
              {children}
            </article>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
