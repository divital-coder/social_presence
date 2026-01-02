import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { getContentFiles } from "@/lib/content"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Social Presence Hub",
  description: "Personal knowledge base and social presence dashboard",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const files = await getContentFiles()
  const navItems = files.map((f) => ({
    slug: f.slug,
    title: f.title,
    icon: f.icon,
    category: f.category,
  }))

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <Sidebar items={navItems} />
        <main className="ml-64 min-h-screen">{children}</main>
      </body>
    </html>
  )
}
