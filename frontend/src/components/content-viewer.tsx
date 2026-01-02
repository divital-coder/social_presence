"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Editor } from "@/components/editor"
import { ExternalLink } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ContentViewerProps {
  slug: string
  title: string
  initialContent: string
}

export function ContentViewer({ slug, title, initialContent }: ContentViewerProps) {
  const [content, setContent] = useState(initialContent)

  const isMarkdown = content.includes("#") || content.includes("```")

  const handleSave = (newContent: string) => {
    setContent(newContent)
  }

  return (
    <div className="lg:col-span-3">
      <Editor
        slug={slug}
        title={title}
        initialContent={content}
        onSave={handleSave}
      />
      <Card>
        <CardContent className="pt-6">
          <ScrollArea className="h-[calc(100vh-350px)]">
            {isMarkdown ? (
              <article className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                      >
                        {children}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mt-6 mb-4 gradient-text">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-medium mt-4 mb-2 text-foreground">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 text-foreground leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-foreground">{children}</li>
                    ),
                    code: ({ className, children }) => {
                      const isInline = !className
                      if (isInline) {
                        return (
                          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        )
                      }
                      return (
                        <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                          {children}
                        </code>
                      )
                    },
                    pre: ({ children }) => (
                      <pre className="bg-muted rounded-lg overflow-x-auto mb-4">{children}</pre>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full">{children}</table>
                      </div>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </article>
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
                {content}
              </pre>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
