import Link from "next/link"
import { PenTool } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact-section" className="border-t bg-background py-8">
      {" "}
      {/* Added id for scrolling */}
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center space-x-2">
            <PenTool className="h-6 w-6" />
            <span className="text-xl font-bold">Penora</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Tehan Isum From AIGenX Labs.Visit Our Web{" "}
            <Link
              href="https://www.aigenxlabs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              AIGenX Labs
            </Link>
            .
          </p>
        </div>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:underline underline-offset-4">
            About
          </Link>
          <Link href="/contact" className="hover:underline underline-offset-4">
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  )
}
