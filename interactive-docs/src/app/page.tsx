"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import * as Icons from "lucide-react"
import chapters from "@/data/chapters.json"
import { InteractiveCard } from "@/components/interactive"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <main className="min-h-screen relative bg-slate-950 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
         <Image 
           src="/images/hero-bg.png" 
           alt="Background" 
           fill 
           className="object-cover opacity-40 blur-sm"
           priority
         />
         <div className="absolute inset-0 bg-slate-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
        <header className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-30" />
            <h1 className="relative text-7xl md:text-9xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 drop-shadow-2xl">
              Study Vibe
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-3xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            The ultimate guide to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-bold">Vibe Coding</span> for senior developers.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chapters.map((chapter, i) => {
            const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[chapter.icon] || Icons.Book;
            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/chapter/${chapter.id}`}>
                  <div className="group relative h-full">
                    {/* Hover Glow */}
                    <div className={cn(
                      "absolute -inset-0.5 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition duration-500 blur-lg",
                      chapter.color
                    )} />
                    
                    <InteractiveCard className="h-full relative bg-slate-900/40 border-white/10 overflow-hidden backdrop-blur-md hover:bg-slate-900/60 transition-colors">
                      <div className="absolute top-0 right-0 p-4 opacity-50">
                        <span className="text-6xl font-black text-white/5 font-mono select-none">
                          {chapter.id}
                        </span>
                      </div>
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br shadow-lg",
                          chapter.color
                        )}>
                          <IconComponent size={24} className="text-white" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                          {chapter.title}
                        </h3>
                        <div className="w-12 h-1 bg-white/10 rounded-full mb-4 group-hover:w-full transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-white/20 group-hover:to-transparent" />
                        
                        <p className="text-sm text-slate-400 mt-auto font-mono">
                          {chapter.file.replace('.md', '').split('_').slice(1).join(' ')}
                        </p>
                      </div>
                    </InteractiveCard>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
