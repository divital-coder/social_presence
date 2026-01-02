"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { updateContent, verifyPassword, isApiConfigured } from "@/lib/api"
import { Pencil, Save, X, Lock, Loader2 } from "lucide-react"

interface EditorProps {
  slug: string
  initialContent: string
  title: string
  onSave?: (newContent: string) => void
}

export function Editor({ slug, initialContent, title, onSave }: EditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(initialContent)
  const [password, setPassword] = useState("")
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const apiConfigured = isApiConfigured()

  const handleEditClick = useCallback(() => {
    if (!apiConfigured) {
      setError("API not configured - editing disabled")
      return
    }

    if (isAuthenticated) {
      setIsEditing(true)
      setError(null)
    } else {
      setShowPasswordInput(true)
      setError(null)
    }
  }, [apiConfigured, isAuthenticated])

  const handlePasswordSubmit = useCallback(async () => {
    if (!password.trim()) {
      setError("Please enter a password")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const isValid = await verifyPassword(password)
      if (isValid) {
        setIsAuthenticated(true)
        setShowPasswordInput(false)
        setIsEditing(true)
      } else {
        setError("Invalid password")
      }
    } catch (err) {
      setError("Failed to verify password")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [password])

  const handleSave = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await updateContent(slug, { content }, password)
      setIsEditing(false)
      onSave?.(content)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to save changes")
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [slug, content, password, onSave])

  const handleCancel = useCallback(() => {
    setContent(initialContent)
    setIsEditing(false)
    setError(null)
  }, [initialContent])

  const handlePasswordCancel = useCallback(() => {
    setShowPasswordInput(false)
    setPassword("")
    setError(null)
  }, [])

  // Password input modal
  if (showPasswordInput) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Enter Edit Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              placeholder="Enter password..."
              className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handlePasswordSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Unlock"
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handlePasswordCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Edit mode
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="gap-1">
            <Pencil className="h-3 w-3" />
            Editing: {title}
          </Badge>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
              className="gap-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="gap-1"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[calc(100vh-350px)] min-h-[400px] p-4 bg-muted border border-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter content..."
        />
      </div>
    )
  }

  // Default view with edit button
  return (
    <div className="mb-4">
      {error && (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={handleEditClick}
        className="gap-1"
        disabled={!apiConfigured}
        title={apiConfigured ? "Edit this document" : "API not configured"}
      >
        <Pencil className="h-4 w-4" />
        Edit
      </Button>
      {!apiConfigured && (
        <span className="ml-2 text-xs text-muted-foreground">
          (API not configured)
        </span>
      )}
    </div>
  )
}
