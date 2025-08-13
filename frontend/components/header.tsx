import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Zap } from "lucide-react"
import { DarkModeToggle } from "@/components/DarkModeToggle"

export function Header() {
  return (
    <header className="border-b bg-white px-4 py-3 lg:px-6 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-slate-700 dark:text-white">EchoMind</h1>
        </div>

        {/* Status and User Menu */}
        <div className="flex items-center gap-3 ml-auto">
          <Badge
            variant="secondary"
            className="hidden sm:flex items-center gap-1 dark:text-white"
          >
            <div className="h-2 w-2 rounded-full bg-green-500" />
            Ready
          </Badge>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5 dark:text-white" />
          </Button>
        </div>

        {/* Dark Mode Toggle */}
        <div className="ml-4">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  )
}
