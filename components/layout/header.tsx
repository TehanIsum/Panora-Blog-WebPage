"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types"
import { PenTool, Plus, UserIcon, LogOut, AlertCircle } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const [activeHash, setActiveHash] = useState("") // State to track active hash
  const { toast } = useToast()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = createClient()

        const getUser = async () => {
          const {
            data: { user: authUser },
          } = await supabase.auth.getUser()

          if (authUser) {
            const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()
            setUser(userData)
          }
          setLoading(false)
        }

        await getUser()

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()
            setUser(userData)
          } else if (event === "SIGNED_OUT") {
            setUser(null)
          }
        })

        return () => subscription.unsubscribe()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize authentication")
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Effect to update activeHash when URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash)
    }

    // Set initial hash
    setActiveHash(window.location.hash)

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  // Effect to scroll to top when navigating to the root path without a hash
  useEffect(() => {
    if (pathname === "/" && activeHash === "") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [pathname, activeHash])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
      router.push("/")
      router.refresh()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Determine active link classes
  const isHomeActive = pathname === "/" && activeHash === ""
  const isPostsActive = pathname === "/" && activeHash === "#latest-posts"
  const isContactActive = pathname === "/" && activeHash === "#contact-section"

  if (error) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <PenTool className="h-6 w-6" />
            <span className="text-xl font-bold">Penora</span>
          </Link>

          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Configuration Error</span>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2 ml-4">
          <PenTool className="h-6 w-6" />
          <span className="text-xl font-bold">Penora</span>
        </Link>

        {/* Center: Main Navigation Links */}
        <nav className="flex items-center space-x-4 mx-auto">
          <Link
            href="/"
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${isHomeActive ? "text-primary" : ""}`}
          >
            Home
          </Link>

          <Link
            href="/#latest-posts"
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${isPostsActive ? "text-primary" : ""}`}
          >
            Posts
          </Link>

          <Link
            href="/#contact-section"
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${isContactActive ? "text-primary" : ""}`}
          >
            Contact
          </Link>
        </nav>

        {/* Right: User/Auth Buttons */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/create">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {user.avatar_url ? (
                        <AvatarImage
                          src={user.avatar_url || "/placeholder.svg"}
                          alt={user.name}
                          key={user.id || "header-user-avatar"}
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <AvatarFallback>
                          <UserIcon className="h-5 w-5 text-muted-foreground" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
