/**
 * API client for Social Presence Backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

export interface ApiContentFile {
  slug: string
  title: string
  content: string
  category: string
  icon: string
  file_extension: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface ApiContentFileListItem {
  slug: string
  title: string
  category: string
  icon: string
  is_featured: boolean
  updated_at: string
}

export interface ApiFilesResponse {
  files: ApiContentFileListItem[]
}

/**
 * Check if API is configured
 */
export function isApiConfigured(): boolean {
  return Boolean(API_URL)
}

/**
 * Fetch all content files from API
 */
export async function fetchContentFiles(): Promise<ApiContentFileListItem[]> {
  if (!API_URL) {
    throw new Error("API URL not configured")
  }

  const res = await fetch(`${API_URL}/api/files`, {
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch files: ${res.status}`)
  }

  const data: ApiFilesResponse = await res.json()
  return data.files
}

/**
 * Fetch a single content file by slug
 */
export async function fetchContentBySlug(slug: string): Promise<ApiContentFile | null> {
  if (!API_URL) {
    throw new Error("API URL not configured")
  }

  const res = await fetch(`${API_URL}/api/files/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  })

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch file: ${res.status}`)
  }

  return res.json()
}

/**
 * Update a content file
 */
export async function updateContent(
  slug: string,
  data: { content?: string; title?: string; category?: string },
  password: string
): Promise<ApiContentFile> {
  if (!API_URL) {
    throw new Error("API URL not configured")
  }

  const res = await fetch(`${API_URL}/api/files/${encodeURIComponent(slug)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Edit-Password": password,
    },
    body: JSON.stringify(data),
  })

  if (res.status === 401) {
    throw new Error("Invalid password")
  }

  if (!res.ok) {
    throw new Error(`Failed to update file: ${res.status}`)
  }

  return res.json()
}

/**
 * Create a new content file
 */
export async function createContent(
  data: {
    slug: string
    title: string
    content: string
    category: string
    icon?: string
  },
  password: string
): Promise<ApiContentFile> {
  if (!API_URL) {
    throw new Error("API URL not configured")
  }

  const res = await fetch(`${API_URL}/api/files`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Edit-Password": password,
    },
    body: JSON.stringify(data),
  })

  if (res.status === 401) {
    throw new Error("Invalid password")
  }

  if (res.status === 409) {
    throw new Error("File with this slug already exists")
  }

  if (!res.ok) {
    throw new Error(`Failed to create file: ${res.status}`)
  }

  return res.json()
}

/**
 * Delete a content file
 */
export async function deleteContent(slug: string, password: string): Promise<void> {
  if (!API_URL) {
    throw new Error("API URL not configured")
  }

  const res = await fetch(`${API_URL}/api/files/${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: {
      "X-Edit-Password": password,
    },
  })

  if (res.status === 401) {
    throw new Error("Invalid password")
  }

  if (!res.ok) {
    throw new Error(`Failed to delete file: ${res.status}`)
  }
}

/**
 * Verify edit password
 */
export async function verifyPassword(password: string): Promise<boolean> {
  if (!API_URL) {
    throw new Error("API URL not configured")
  }

  const res = await fetch(`${API_URL}/api/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  })

  if (!res.ok) {
    return false
  }

  const data = await res.json()
  return data.valid === true
}
