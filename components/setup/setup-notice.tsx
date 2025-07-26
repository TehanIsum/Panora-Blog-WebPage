"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Database, ExternalLink, Copy, Lock, LinkIcon, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export function SetupNotice() {
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  const supabaseUrl = "https://nedokweyutodtnzrothl.supabase.co"
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZG9rd2V5dXRvZHRuenJvdGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzA0ODMsImV4cCI6MjA2OTAwNjQ4M30.Rc8-3LDoW2RTLjVMOwhOZiYxCsSjtLDitNAZa3HihTc"

  const foreignKeySql = `
ALTER TABLE public.posts
ADD CONSTRAINT posts_author_id_fkey
FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;
`.trim()

  return (
    <div className="container max-w-2xl mx-auto py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6 text-orange-600" />
              <CardTitle className="text-orange-800 dark:text-orange-200">Supabase Database Setup Required</CardTitle>
            </div>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              The "Could not find a relationship" error indicates a problem with your Supabase database schema. Please
              follow these steps carefully to ensure your database is correctly configured.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Database className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    1. Add Supabase Integration (If not already done)
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                    Click "Add Integration" in v0 and select "Supabase", then use these credentials:
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-orange-800 dark:text-orange-200">Project URL:</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="flex-1 bg-orange-100 dark:bg-orange-900 p-2 rounded text-xs font-mono break-all">
                          {supabaseUrl}
                        </code>
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(supabaseUrl, "Project URL")}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-orange-800 dark:text-orange-200">Anon Key:</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="flex-1 bg-orange-100 dark:bg-orange-900 p-2 rounded text-xs font-mono break-all">
                          {supabaseAnonKey}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(supabaseAnonKey, "Anon Key")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    2. Set Your JWT Secret in Supabase
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                    This is **critical** for Row Level Security (RLS) and relationships.
                  </p>
                  <ol className="list-decimal list-inside text-sm text-orange-700 dark:text-orange-300 space-y-1">
                    <li>
                      Go to your Supabase Dashboard:{" "}
                      <a
                        href="https://supabase.com/dashboard/project/nedokweyutodtnzrothl/settings/api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:no-underline"
                      >
                        API Settings
                      </a>
                    </li>
                    <li>Find the "JWT Secret" value and **copy it**.</li>
                    <li>In the v0 interface, open the `scripts/01-create-tables.sql` file.</li>
                    <li>
                      **Replace `'your-jwt-secret'`** in the very first line with your actual JWT secret:
                      <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-md font-mono text-xs mt-2">
                        `ALTER DATABASE postgres SET "app.jwt_secret" TO 'YOUR_ACTUAL_JWT_SECRET_HERE';`
                      </div>
                    </li>
                    <li>**Run the `scripts/01-create-tables.sql` script again** in v0.</li>
                    <li>**Run the `scripts/02-create-functions.sql` script again** in v0.</li>
                  </ol>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <LinkIcon className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    3. **CRITICAL**: Verify & Manually Add Table Relationships (If Needed)
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                    This is the most common reason for the error. You need to ensure the foreign key relationship
                    between `posts` and `users` is correctly established and recognized by Supabase.
                  </p>
                  <ol className="list-decimal list-inside text-sm text-orange-700 dark:text-orange-300 space-y-1">
                    <li>
                      Go to your Supabase Dashboard:{" "}
                      <a
                        href="https://supabase.com/dashboard/project/nedokweyutodtnzrothl/editor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:no-underline"
                      >
                        Table Editor
                      </a>
                    </li>
                    <li>Select the `posts` table.</li>
                    <li>
                      Look for the `author_id` column. It **must** show a foreign key relationship (often indicated by a
                      small key icon or a link to `public.users`).
                    </li>
                    <li>
                      **If the relationship is missing or incorrect**, it means the `01-create-tables.sql` script didn't
                      apply it correctly. You **must** manually add it using the SQL Editor:
                      <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-md font-mono text-xs mt-2">
                        <pre>{foreignKeySql}</pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(foreignKeySql, "Foreign Key SQL")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                        **Copy this SQL command and run it in your Supabase SQL Editor.**
                      </p>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RefreshCw className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    4. Force Supabase Schema Refresh (Highly Recommended)
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Even after running scripts, Supabase's internal cache can sometimes be stale. This trick often
                    forces it to re-read the schema:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-orange-700 dark:text-orange-300 space-y-1">
                    <li>
                      In the{" "}
                      <a
                        href="https://supabase.com/dashboard/project/nedokweyutodtnzrothl/editor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:no-underline"
                      >
                        Table Editor
                      </a>
                      , select any table (e.g., `posts`).
                    </li>
                    <li>Add a temporary, dummy column (e.g., `temp_col` of type `text`).</li>
                    <li>Save the changes.</li>
                    <li>Immediately delete the dummy column.</li>
                    <li>Save changes again. This often forces Supabase to re-evaluate its schema cache.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button asChild>
                <a
                  href="https://supabase.com/dashboard/project/nedokweyutodtnzrothl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Your Supabase Project</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
