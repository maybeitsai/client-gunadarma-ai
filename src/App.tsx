import ChatPage from '@/pages/chat'
import ThemeSwitcher from '@/shared/ui/theme-switcher'

const App = () => (
  <main className="text-text-primary min-h-screen bg-background transition-colors">
    <div className="app-shell flex flex-col gap-10">
      <div className="flex items-center justify-end">
        <ThemeSwitcher />
      </div>
      <ChatPage />
    </div>
  </main>
)

export default App
