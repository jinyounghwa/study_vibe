"use client"

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { DataChart } from './content-blocks'
import { InteractiveCard } from './interactive'

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-4xl font-black mb-8 tracking-tighter text-white border-b border-white/10 pb-4">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-300 flex items-center">
            <span className="mr-3 h-1 w-6 bg-indigo-500 rounded-full" />
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mt-8 mb-4 text-slate-100">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-slate-400 leading-relaxed mb-6">
            {children}
          </p>
        ),
        table: ({ children }) => (
          <div className="my-8 overflow-hidden rounded-xl border border-white/10 shadow-lg">
            <table className="w-full border-collapse bg-slate-900/50">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-slate-800/80 text-white font-bold">{children}</thead>,
        th: ({ children }) => <th className="p-4 text-left border-b border-white/10">{children}</th>,
        td: ({ children }) => <td className="p-4 border-b border-white/5 text-slate-400">{children}</td>,
        li: ({ children, checked }: { children?: React.ReactNode, checked?: boolean | null }) => {
          if (checked !== null) {
            return (
              <div className="flex items-center space-x-3 mb-2">
                <input type="checkbox" checked={checked} readOnly className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-offset-slate-900" />
                <span className={checked ? "text-slate-500 line-through" : "text-slate-300"}>{children}</span>
              </div>
            )
          }
          return (
            <li className="flex items-start mb-3 text-slate-300 leading-relaxed group">
              <span className="mr-3 mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 group-hover:bg-indigo-400 transition-colors" />
              <span>{children}</span>
            </li>
          )
        },
        code({ inline, className, children, ...props }: { inline?: boolean, className?: string, children?: React.ReactNode } & React.ComponentPropsWithoutRef<'code'>) {
          const match = /language-(\w+)/.exec(className || '')
          if (match && match[1] === 'chart') {
            try {
              const data = JSON.parse(String(children).replace(/\n$/, ''))
              return <DataChart data={data.data} title={data.title} />
            } catch {
              return <div className="text-red-500">Error parsing chart data</div>
            }
          }
          return !inline && match ? (
            <div className="my-8 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#1e1e1e]">
              <SyntaxHighlighter
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style={atomDark as any}
                language={match[1]}
                PreTag="div"
                customStyle={{ margin: 0, background: 'transparent' }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="bg-slate-800 text-indigo-200 px-1.5 py-0.5 rounded text-sm font-mono border border-white/5" {...props}>
              {children}
            </code>
          )
        },
        blockquote: ({ children }) => (
          <InteractiveCard className="my-8 border-l-4 border-l-indigo-500 bg-slate-900/50 border-y-0 border-r-0 rounded-r-xl rounded-l-none pl-6 pr-4 py-4 italic text-slate-300">
            {children}
          </InteractiveCard>
        )
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
