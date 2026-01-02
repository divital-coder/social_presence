import { getContentFiles, parseDeadlines } from "@/lib/content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  ArrowRight,
  Clock,
  Target,
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

export default async function HomePage() {
  const files = await getContentFiles()
  const deadlinesFile = files.find((f) => f.slug === "deadlines")
  const deadlines = deadlinesFile ? parseDeadlines(deadlinesFile.content) : []
  const pendingDeadlines = deadlines.filter((d) => !d.completed)
  const completedCount = deadlines.filter((d) => d.completed).length

  const featured = files.filter((f) =>
    ["main", "ai_sorcery", "deadlines", "URGENT"].includes(f.slug)
  )

  const categories = files.reduce(
    (acc, file) => {
      if (!acc[file.category]) {
        acc[file.category] = []
      }
      acc[file.category].push(file)
      return acc
    },
    {} as Record<string, typeof files>
  )

  return (
    <div className="p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Social Presence</span> Hub
        </h1>
        <p className="text-muted-foreground text-lg">
          Your personal knowledge base, social links, and task tracker in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="glow">
          <CardHeader className="pb-2">
            <CardDescription>Total Documents</CardDescription>
            <CardTitle className="text-3xl">{files.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <FileText className="h-3 w-3 mr-1" />
              Knowledge articles
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-3xl">{Object.keys(categories).length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Folder className="h-3 w-3 mr-1" />
              Organized sections
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Tasks</CardDescription>
            <CardTitle className="text-3xl">{pendingDeadlines.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Deadlines to complete
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Target className="h-3 w-3 mr-1" />
              Tasks finished
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Featured Content
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((file) => {
            const Icon = iconMap[file.icon] || File
            return (
              <Link key={file.slug} href={`/content/${file.slug}`}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{file.title}</CardTitle>
                        <CardDescription className="text-xs">{file.category}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {file.content.slice(0, 100)}...
                    </p>
                    <div className="flex items-center gap-1 text-xs text-primary mt-3 group-hover:gap-2 transition-all">
                      Read more <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Deadlines
          </h2>
          <Link href="/dashboard" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {pendingDeadlines.slice(0, 5).map((deadline, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="mt-0.5">
                    <div className="h-4 w-4 rounded border-2 border-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{deadline.text}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {deadline.category}
                    </Badge>
                  </div>
                </div>
              ))}
              {pendingDeadlines.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No pending deadlines - you&apos;re all caught up!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(categories).map(([category, items]) => (
            <Card key={category} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{category}</CardTitle>
                <CardDescription className="text-xs">
                  {items.length} {items.length === 1 ? "document" : "documents"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {items.slice(0, 3).map((item) => (
                    <Link key={item.slug} href={`/content/${item.slug}`}>
                      <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-primary/20">
                        {item.title.slice(0, 12)}{item.title.length > 12 ? "..." : ""}
                      </Badge>
                    </Link>
                  ))}
                  {items.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{items.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
