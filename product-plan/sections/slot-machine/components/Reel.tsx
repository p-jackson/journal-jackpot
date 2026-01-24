import { useEffect, useRef, useState } from 'react'
import type { Word } from '../types'

interface ReelProps {
  words: Word[]
  selectedWord: string | null
  isSpinning: boolean
  stopDelay: number
  onStop?: () => void
}

export function Reel({ words, selectedWord, isSpinning, stopDelay, onStop }: ReelProps) {
  const [displayedWords, setDisplayedWords] = useState<string[]>([])
  const [isStopping, setIsStopping] = useState(false)
  const [hasStopped, setHasStopped] = useState(!isSpinning)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Generate cycling words during spin
  useEffect(() => {
    if (isSpinning && !isStopping) {
      setHasStopped(false)
      // Cycle through random words rapidly
      intervalRef.current = setInterval(() => {
        const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 3)
        setDisplayedWords(shuffled.map(w => w.text))
      }, 80)

      // Schedule stop
      stopTimeoutRef.current = setTimeout(() => {
        setIsStopping(true)
      }, stopDelay)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current)
    }
  }, [isSpinning, words, stopDelay, isStopping])

  // Handle stopping animation
  useEffect(() => {
    if (isStopping && selectedWord) {
      if (intervalRef.current) clearInterval(intervalRef.current)

      // Slow down effect
      let speed = 80
      const slowDown = () => {
        speed += 40
        const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 3)
        setDisplayedWords(shuffled.map(w => w.text))

        if (speed < 300) {
          setTimeout(slowDown, speed)
        } else {
          // Final stop on selected word
          setDisplayedWords([selectedWord])
          setHasStopped(true)
          setIsStopping(false)
          onStop?.()
        }
      }
      slowDown()
    }
  }, [isStopping, selectedWord, words, onStop])

  // Initial state - show selected word or placeholder
  useEffect(() => {
    if (!isSpinning && selectedWord) {
      setDisplayedWords([selectedWord])
      setHasStopped(true)
    } else if (!isSpinning && !selectedWord) {
      // Show random words as placeholder
      const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 3)
      setDisplayedWords(shuffled.map(w => w.text))
    }
  }, [isSpinning, selectedWord, words])

  return (
    <div className="relative w-full">
      {/* Reel housing - skeuomorphic container */}
      <div className="relative bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 rounded-lg p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
        {/* Inner chrome bezel */}
        <div className="relative bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-md p-0.5">
          {/* Reel window */}
          <div
            className={`
              relative overflow-hidden bg-gradient-to-b from-amber-50 to-white
              dark:from-zinc-100 dark:to-zinc-50
              rounded shadow-[inset_0_4px_8px_rgba(0,0,0,0.15)]
              h-20 flex items-center justify-center
              ${hasStopped && selectedWord ? 'ring-2 ring-amber-400 ring-opacity-50' : ''}
            `}
          >
            {/* Spinning blur effect */}
            <div
              className={`
                absolute inset-0 bg-gradient-to-b from-transparent via-amber-100/30 to-transparent
                transition-opacity duration-300
                ${isSpinning && !hasStopped ? 'opacity-100' : 'opacity-0'}
              `}
            />

            {/* Word display */}
            <div
              className={`
                text-center px-2 font-heading font-bold text-lg sm:text-xl
                text-zinc-800 dark:text-zinc-900
                transition-all duration-200
                ${isSpinning && !hasStopped ? 'blur-[2px] scale-95' : 'blur-0 scale-100'}
                ${hasStopped && selectedWord ? 'text-violet-700 dark:text-violet-800' : ''}
              `}
            >
              {displayedWords[0] || '???'}
            </div>

            {/* Shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />

            {/* Top shadow */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />

            {/* Bottom shadow */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Side rivets for extra skeuomorphism */}
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 shadow-sm" />
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 shadow-sm" />
    </div>
  )
}
