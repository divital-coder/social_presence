"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  Home,
  LayoutDashboard,
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

interface NavItem {
  slug: string
  title: string
  icon: string
  category: string
}

interface SidebarProps {
  items: NavItem[]
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname()

  const grouped = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, NavItem[]>
  )

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
          <Globe className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold gradient-text">Social Presence</h1>
          <p className="text-[10px] text-muted-foreground">Knowledge Hub</p>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)] px-3 py-4">
        <div className="space-y-1 pb-4">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === "/"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === "/dashboard"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>

        <Separator className="my-2" />

        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category} className="py-2">
            <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {category}
            </h2>
            <div className="space-y-1">
              {categoryItems.map((item) => {
                const Icon = iconMap[item.icon] || File
                const isActive = pathname === `/content/${item.slug}`

                return (
                  <Link
                    key={item.slug}
                    href={`/content/${item.slug}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        <div className="pb-8" />
      </ScrollArea>
    </aside>
  )
}
