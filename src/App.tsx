import { Info } from 'lucide-react'
import ChatPage from '@/pages/chat'
import ThemeSwitcher from '@/shared/ui/theme-switcher'
import { Button } from '@/shared/ui/button'

const App = () => (
  <main className="text-text-primary min-h-screen bg-background transition-colors">
    <div className="app-shell flex flex-col gap-10">
      <header className="flex flex-col gap-4 border-b border-border/60 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-text-muted text-xs uppercase tracking-[0.3em]">Gunadarma University</p>
          <h1 className="text-display-sm text-text-primary">AI Guidance Center</h1>
          <p className="text-text-secondary mt-1 text-sm">
            Asisten percakapan dengan sentuhan desain premium ala ChatGPT.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <a href="https://www.gunadarma.ac.id" target="_blank" rel="noreferrer">
              <Info className="h-4 w-4" />
              About
            </a>
          </Button>
          <ThemeSwitcher />
        </div>
      </header>
      <ChatPage />
    </div>
  </main>
)

export default App
