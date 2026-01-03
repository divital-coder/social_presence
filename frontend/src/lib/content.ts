import fs from "fs"
import path from "path"
import { isApiConfigured, fetchContentFiles, fetchContentBySlug } from "./api"

export interface ContentFile {
  slug: string
  title: string
  content: string
  category: string
  icon: string
}

const contentDir = path.join(process.cwd(), "..")

const categoryMap: Record<string, { category: string; icon: string }> = {
  "main.md": { category: "Social Presence", icon: "globe" },
  "deadlines.md": { category: "Planning", icon: "calendar" },
  "ai_sorcery.md": { category: "AI & Tech", icon: "sparkles" },
  "tools.md": { category: "Resources", icon: "wrench" },
  "job_desc.md": { category: "Career", icon: "briefcase" },
  "dream_companies.txt": { category: "Career", icon: "building" },
  "oreilly_courses.md": { category: "Learning", icon: "book-open" },
  "comp_bio.md": { category: "Research", icon: "microscope" },
  "anticipated_projects.md": { category: "Projects", icon: "folder" },
  "strides.txt": { category: "Progress", icon: "trending-up" },
  "do_or_dda.md": { category: "Tasks", icon: "check-square" },
  "URGENT.md": { category: "Priority", icon: "alert-triangle" },
  "github_learning.md": { category: "Learning", icon: "github" },
  "neovim_bindings.md": { category: "Tools", icon: "terminal" },
  "preparations.md": { category: "Planning", icon: "clipboard" },
  "digest.md": { category: "Notes", icon: "file-text" },
  "people.txt": { category: "Network", icon: "users" },
  "concepts.txt": { category: "Ideas", icon: "lightbulb" },
  "things_to_catch_upon.txt": { category: "Tasks", icon: "list" },
}

function formatTitle(filename: string): string {
  return filename
    .replace(/\.(md|txt)$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

/**
 * Get content files from filesystem (local development)
 */
async function getContentFilesFromFs(): Promise<ContentFile[]> {
  const files: ContentFile[] = []

  try {
    const entries = fs.readdirSync(contentDir)

    for (const entry of entries) {
      if (entry.endsWith(".md") || entry.endsWith(".txt")) {
        // Skip hidden and swap files
        if (entry.startsWith(".") || entry.includes("~")) continue

        const filePath = path.join(contentDir, entry)
        const stat = fs.statSync(filePath)

        if (stat.isFile()) {
          const content = fs.readFileSync(filePath, "utf-8")
          const meta = categoryMap[entry] || { category: "Other", icon: "file" }

          files.push({
            slug: entry.replace(/\.(md|txt)$/, ""),
            title: formatTitle(entry),
            content,
            category: meta.category,
            icon: meta.icon,
          })
        }
      }
    }
  } catch (error) {
    console.error("Error reading content files:", error)
  }

  return files.sort((a, b) => {
    // Priority order for certain files
    const priority = ["main", "deadlines", "ai_sorcery", "URGENT"]
    const aIdx = priority.indexOf(a.slug)
    const bIdx = priority.indexOf(b.slug)
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
    if (aIdx !== -1) return -1
    if (bIdx !== -1) return 1
    return a.title.localeCompare(b.title)
  })
}

/**
 * Get content files - uses API if configured, otherwise filesystem
 */
export async function getContentFiles(): Promise<ContentFile[]> {
  // Use API if configured
  if (isApiConfigured()) {
    try {
      const apiFiles = await fetchContentFiles()
      // API returns list items without content, need to fetch each
      // For list view, we return minimal data
      return apiFiles.map((f) => ({
        slug: f.slug,
        title: f.title,
        content: "", // Content fetched separately
        category: f.category,
        icon: f.icon,
      }))
    } catch (error) {
      console.error("API error, falling back to filesystem:", error)
    }
  }

  // Fallback to filesystem
  return getContentFilesFromFs()
}

/**
 * Get single content file by slug - uses API if configured
 */
export async function getContentBySlug(slug: string): Promise<ContentFile | null> {
  // Use API if configured
  if (isApiConfigured()) {
    try {
      const apiFile = await fetchContentBySlug(slug)
      if (apiFile) {
        return {
          slug: apiFile.slug,
          title: apiFile.title,
          content: apiFile.content,
          category: apiFile.category,
          icon: apiFile.icon,
        }
      }
      return null
    } catch (error) {
      console.error("API error, falling back to filesystem:", error)
    }
  }

  // Fallback to filesystem
  const files = await getContentFilesFromFs()
  return files.find((f) => f.slug === slug) || null
}

export interface Deadline {
  text: string
  completed: boolean
  category: string
}

export function parseDeadlines(content: string): Deadline[] {
  const deadlines: Deadline[] = []
  const lines = content.split("\n")
  let currentCategory = "General"

  for (const line of lines) {
    // Check for category headers
    if (line.startsWith("# ")) {
      currentCategory = line.replace("# ", "").trim()
      continue
    }

    // Parse checkbox items
    const completedMatch = line.match(/^-\s*\[\s*[xX]\s*\]\s*(.+)/)
    const pendingMatch = line.match(/^-\s*\[\s*\]\s*(.+)/)
    const altPendingMatch = line.match(/^=\s*\[\s*\]\s*(.+)/)

    if (completedMatch) {
      deadlines.push({
        text: completedMatch[1].trim(),
        completed: true,
        category: currentCategory,
      })
    } else if (pendingMatch) {
      deadlines.push({
        text: pendingMatch[1].trim(),
        completed: false,
        category: currentCategory,
      })
    } else if (altPendingMatch) {
      deadlines.push({
        text: altPendingMatch[1].trim(),
        completed: false,
        category: currentCategory,
      })
    }
  }

  return deadlines
}

export interface SocialLink {
  platform: string
  handle: string
  url?: string
}

export function parseSocialLinks(content: string): Record<string, SocialLink[]> {
  const sections: Record<string, SocialLink[]> = {}
  const lines = content.split("\n")
  let currentSection = "Social"

  for (const line of lines) {
    // Check for section headers
    if (line.includes("!----") || line.includes("!-------") || line.includes("!---")) {
      const match = line.match(/!-+(.+?)-+!/)
      if (match) {
        currentSection = match[1].trim()
        sections[currentSection] = []
      }
      continue
    }

    // Skip empty lines
    if (!line.trim()) continue

    // Parse social links
    const platformMatch = line.match(/^(\w+(?:\s+\w+)?)\s+[@(].+/)
    if (platformMatch) {
      const platform = platformMatch[1].toLowerCase()
      const handleMatch = line.match(/@(\w+)/)
      const emailMatch = line.match(/"([^"]+@[^"]+)"/)

      if (!sections[currentSection]) {
        sections[currentSection] = []
      }

      sections[currentSection].push({
        platform: platformMatch[1],
        handle: handleMatch ? `@${handleMatch[1]}` : emailMatch ? emailMatch[1] : line.split(" ").slice(1).join(" "),
      })
    }
  }

  return sections
}
