import { useState, useCallback, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import type { SlotMachineProps } from '../types'
import { Reel } from './Reel'
import { SpinButton } from './SpinButton'

export function SlotMachine({ reels, state, onSpin }: SlotMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [stoppedReels, setStoppedReels] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [localPrompt, setLocalPrompt] = useState(state.todaysPrompt)

  // Sync local prompt with state
  useEffect(() => {
    setLocalPrompt(state.todaysPrompt)
  }, [state.todaysPrompt])

  const handleSpin = useCallback(() => {
    if (!state.canSpin || isSpinning) return

    setIsSpinning(true)
    setStoppedReels(0)
    setShowCelebration(false)

    // Generate a random prompt from the reels
    const newWords = reels.map(reel => {
      const randomIndex = Math.floor(Math.random() * reel.words.length)
      return reel.words[randomIndex].text
    }) as [string, string, string]

    setLocalPrompt({
      id: `prompt-${Date.now()}`,
      words: newWords,
      createdAt: new Date().toISOString()
    })

    onSpin?.()
  }, [state.canSpin, isSpinning, reels, onSpin])

  const handleReelStop = useCallback((reelIndex: number) => {
    setStoppedReels(prev => {
      const newCount = prev + 1
      // All reels stopped - trigger celebration
      if (newCount === 3) {
        setTimeout(() => {
          setIsSpinning(false)
          setShowCelebration(true)
          // Hide celebration after a few seconds
          setTimeout(() => setShowCelebration(false), 3000)
        }, 200)
      }
      return newCount
    })
  }, [])

  // Calculate time until next spin
  const getTimeUntilNextSpin = () => {
    if (!state.nextSpinAt) return null
    const now = new Date()
    const next = new Date(state.nextSpinAt)
    const diff = next.getTime() - now.getTime()

    if (diff <= 0) return null

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m until next spin`
    }
    return `${minutes}m until next spin`
  }

  const timeUntilNextSpin = getTimeUntilNextSpin()

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Sparkle particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            >
              <Sparkles
                className="text-amber-400"
                style={{
                  width: `${16 + Math.random() * 24}px`,
                  height: `${16 + Math.random() * 24}px`,
                  opacity: 0.6 + Math.random() * 0.4,
                }}
              />
            </div>
          ))}

          {/* Golden glow behind machine */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
          </div>
        </div>
      )}

      {/* Slot Machine Cabinet */}
      <div className="relative w-full max-w-sm">
        {/* Cabinet top decoration */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-t-xl flex items-center justify-center shadow-lg">
          <span className="font-heading font-bold text-amber-950 text-xs tracking-widest">
            JACKPOT
          </span>
        </div>

        {/* Main cabinet body */}
        <div className="relative bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 rounded-2xl p-4 shadow-2xl">
          {/* Chrome trim */}
          <div className="absolute inset-0 rounded-2xl border border-zinc-600/50" />
          <div className="absolute inset-[3px] rounded-xl border border-zinc-500/30" />

          {/* Inner panel */}
          <div className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-xl p-4">
            {/* Decorative lights at top */}
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-3 h-3 rounded-full shadow-lg
                    ${showCelebration
                      ? 'bg-amber-400 shadow-amber-400/50 animate-pulse'
                      : isSpinning
                        ? 'bg-violet-400 shadow-violet-400/50 animate-pulse'
                        : 'bg-zinc-700 shadow-none'
                    }
                  `}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>

            {/* Reels container */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {reels.map((reel, index) => (
                <Reel
                  key={reel.id}
                  words={reel.words}
                  selectedWord={localPrompt?.words[index] || null}
                  isSpinning={isSpinning}
                  stopDelay={1000 + index * 800} // Staggered stops
                  onStop={() => handleReelStop(index)}
                />
              ))}
            </div>

            {/* Prompt display */}
            {localPrompt && !isSpinning && (
              <div
                className={`
                  text-center py-3 px-4 rounded-lg mb-4
                  bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10
                  border border-amber-500/30
                  transition-all duration-500
                  ${showCelebration ? 'scale-105' : 'scale-100'}
                `}
              >
                <p className="font-heading font-bold text-lg text-amber-100 dark:text-amber-200">
                  "{localPrompt.words.join(' ')}"
                </p>
              </div>
            )}

            {/* Placeholder when no prompt */}
            {!localPrompt && !isSpinning && (
              <div className="text-center py-3 px-4 rounded-lg mb-4 bg-zinc-800/50 border border-zinc-700">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  Tap SPIN to get today's prompt
                </p>
              </div>
            )}
          </div>

          {/* Bottom panel with button */}
          <div className="mt-4 pt-4 border-t border-zinc-700/50">
            <SpinButton
              disabled={!state.canSpin}
              isSpinning={isSpinning}
              onClick={handleSpin}
            />

            {/* Countdown timer */}
            {timeUntilNextSpin && !state.canSpin && (
              <p className="text-center text-zinc-500 dark:text-zinc-400 text-sm mt-3 font-mono">
                {timeUntilNextSpin}
              </p>
            )}
          </div>
        </div>

        {/* Cabinet side decorations */}
        <div className="absolute top-8 -left-2 w-4 h-32 bg-gradient-to-b from-zinc-600 to-zinc-800 rounded-l-lg shadow-lg" />
        <div className="absolute top-8 -right-2 w-4 h-32 bg-gradient-to-b from-zinc-600 to-zinc-800 rounded-r-lg shadow-lg" />

        {/* Cabinet base */}
        <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-b-xl" />
      </div>
    </div>
  )
}
