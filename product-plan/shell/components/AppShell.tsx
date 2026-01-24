import { Header } from './Header'

interface AppShellProps {
  children: React.ReactNode
  currentScreen: 'slot-machine' | 'history'
  onNavigate?: (screen: 'slot-machine' | 'history') => void
}

export function AppShell({ children, currentScreen, onNavigate }: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Header currentScreen={currentScreen} onNavigate={onNavigate} />
      <main className="w-full max-w-lg mx-auto">
        {children}
      </main>
    </div>
  )
}
