import { ChevronLeft, History } from 'lucide-react'

interface HeaderProps {
  currentScreen: 'slot-machine' | 'history'
  onNavigate?: (screen: 'slot-machine' | 'history') => void
}

export function Header({ currentScreen, onNavigate }: HeaderProps) {
  const isHome = currentScreen === 'slot-machine'

  return (
    <header className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left side */}
        {isHome ? (
          <h1 className="font-heading font-bold text-lg text-zinc-900 dark:text-zinc-100">
            Journal Jackpot
          </h1>
        ) : (
          <button
            onClick={() => onNavigate?.('slot-machine')}
            className="flex items-center gap-1 text-violet-600 dark:text-violet-400 font-medium -ml-2 px-2 py-1 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        )}

        {/* Center title (only on history screen) */}
        {!isHome && (
          <h1 className="absolute left-1/2 -translate-x-1/2 font-heading font-bold text-lg text-zinc-900 dark:text-zinc-100">
            History
          </h1>
        )}

        {/* Right side */}
        {isHome ? (
          <button
            onClick={() => onNavigate?.('history')}
            className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 font-medium px-2 py-1 -mr-2 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950 transition-colors"
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
        ) : (
          <div className="w-20" /> // Spacer for balance
        )}
      </div>
    </header>
  )
}
