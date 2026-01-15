"use client"

import { Check } from "lucide-react"
import { motion } from "framer-motion"

export function ComparisonTable({ 
  leftHeader, 
  rightHeader, 
  rows 
}: { 
  leftHeader: string
  rightHeader: string
  rows: { label: string; left: string; right: string; highlight?: 'left' | 'right' }[] 
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/5">
          <tr>
            <th className="p-4 font-semibold text-slate-200">Feature</th>
            <th className="p-4 font-semibold text-slate-200 bg-red-900/10 border-l border-white/5">{leftHeader}</th>
            <th className="p-4 font-semibold text-slate-200 bg-green-900/10 border-l border-white/5">{rightHeader}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row, i) => (
            <motion.tr 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="hover:bg-white/5 transition-colors"
            >
              <td className="p-4 text-sm font-medium text-slate-300">{row.label}</td>
              <td className={`p-4 text-sm text-slate-400 border-l border-white/5 ${row.highlight === 'left' ? 'font-bold text-red-400' : ''}`}>{row.left}</td>
              <td className={`p-4 text-sm text-slate-400 border-l border-white/5 ${row.highlight === 'right' ? 'font-bold text-green-400' : ''}`}>{row.right}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-start p-4 rounded-xl bg-slate-900/50 border border-white/10 shadow-sm hover:border-indigo-500/30 transition-colors"
        >
          <div className="flex-shrink-0 mr-3 mt-0.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
              <Check className="h-3 w-3 text-green-400" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-300">{item}</p>
        </motion.div>
      ))}
    </div>
  )
}

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DataChart({ data, title }: { data: { name: string; value: number }[], title?: string }) {
  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-900/50 border border-white/10 shadow-xl">
      {title && <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">{title}</h4>}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '12px',
                color: '#f1f5f9',
                fontSize: '12px'
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#6366f1" 
              radius={[4, 4, 0, 0]} 
              barSize={40}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
