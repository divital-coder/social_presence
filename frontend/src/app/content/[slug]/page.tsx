import { getContentFiles, getContentBySlug } from "@/lib/content"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ContentViewer } from "@/components/content-viewer"
import Link from "next/link"
import {
  Globe,
  Calendar,
  Sparkles,
  Wrench,
  Briefcase,
  Building,
  BookOpen,
  Microscope,
  Folder,
  TrendingUp,
  CheckSquare,
  AlertTriangle,
  Github,
  Terminal,
  Clipboard,
  FileText,
  Users,
  Lightbulb,
  List,
  File,
  ArrowLeft,
  ExternalLink,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  calendar: Calendar,
  sparkles: Sparkles,
  wrench: Wrench,
  briefcase: Briefcase,
  building: Building,
  "book-open": BookOpen,
  microscope: Microscope,
  folder: Folder,
  "trending-up": TrendingUp,
  "check-square": CheckSquare,
  "alert-triangle": AlertTriangle,
  github: Github,
  terminal: Terminal,
  clipboard: Clipboard,
  "file-text": FileText,
  users: Users,
  lightbulb: Lightbulb,
  list: List,
  file: File,
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const files = await getContentFiles()
  return files.map((file) => ({
    slug: file.slug,
  }))
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params
  const file = await getContentBySlug(slug)

  if (!file) {
    notFound()
  }

  const Icon = iconMap[file.icon] || File

  // Extract links from content
  const urlRegex = /(https?:\/\/[^\s\])"]+)/g
  const links = file.content.match(urlRegex) || []
  const uniqueLinks = [...new Set(links)].slice(0, 10)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-muted">
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{file.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{file.category}</Badge>
              <span className="text-sm text-muted-foreground">
                {file.content.split("\n").length} lines
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content with Editor */}
        <ContentViewer
          slug={file.slug}
          title={file.title}
          initialContent={file.content}
        />

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Document Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span>{file.category}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lines</span>
                <span>{file.content.split("\n").length}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Characters</span>
                <span>{file.content.length.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Links</span>
                <span>{uniqueLinks.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* External Links */}
          {uniqueLinks.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Links in Document
                </CardTitle>
                <CardDescription className="text-xs">
                  External resources referenced
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {uniqueLinks.map((link, i) => {
                    const domain = new URL(link).hostname.replace("www.", "")
                    return (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-xs group"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0 group-hover:text-primary" />
                        <span className="truncate">{domain}</span>
                      </a>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
