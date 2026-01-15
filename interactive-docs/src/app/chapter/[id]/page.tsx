import fs from 'fs'
import path from 'path'
import chapters from '@/data/chapters.json'
import { DocLayout } from '@/components/doc-layout'
import { MarkdownRenderer } from '@/components/markdown-renderer'

export async function generateStaticParams() {
  return chapters.map((chapter) => ({
    id: chapter.id,
  }))
}

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const chapter = chapters.find(c => c.id === id)
  if (!chapter) return 404

  const filePath = path.join(process.cwd(), 'src/data/docs', chapter.file)
  const content = fs.readFileSync(filePath, 'utf8')

  return (
    <DocLayout title={chapter.title} id={chapter.id} color={chapter.color} image={chapter.image}>
      <MarkdownRenderer content={content} />
    </DocLayout>
  )
}
