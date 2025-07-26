import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/layout/footer" // Import the new Footer component

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Penora - Modern Blog Platform",
  description: "Share your thoughts and connect with others on Penora, a modern minimalist blog platform.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen flex-grow">{children}</main> {/* Added flex-grow for sticky footer */}
        <Toaster />
        <Footer /> {/* Add the Footer component here */}
      </body>
    </html>
  )
}
