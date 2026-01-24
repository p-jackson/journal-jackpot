interface SpinButtonProps {
  disabled: boolean
  isSpinning: boolean
  onClick?: () => void
}

export function SpinButton({ disabled, isSpinning, onClick }: SpinButtonProps) {
  const isDisabled = disabled || isSpinning

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative group w-full max-w-xs mx-auto
        transition-all duration-200 ease-out
        ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${!isDisabled ? 'active:scale-95' : ''}
      `}
    >
      {/* Outer shadow/glow */}
      <div
        className={`
          absolute -inset-1 rounded-2xl blur-md transition-opacity duration-300
          ${isSpinning ? 'bg-violet-500/50 opacity-100' : ''}
          ${!isDisabled && !isSpinning ? 'bg-violet-500/30 opacity-0 group-hover:opacity-100' : ''}
          ${isDisabled && !isSpinning ? 'opacity-0' : ''}
        `}
      />

      {/* Button body */}
      <div
        className={`
          relative rounded-2xl p-1 transition-all duration-200
          ${isDisabled && !isSpinning
            ? 'bg-gradient-to-b from-zinc-400 to-zinc-500 dark:from-zinc-600 dark:to-zinc-700'
            : 'bg-gradient-to-b from-violet-500 to-violet-700 dark:from-violet-600 dark:to-violet-800'
          }
          ${!isDisabled ? 'shadow-lg shadow-violet-500/30 group-hover:shadow-xl group-hover:shadow-violet-500/40' : 'shadow-md'}
        `}
      >
        {/* Inner bevel */}
        <div
          className={`
            relative rounded-xl py-4 px-8 overflow-hidden
            ${isDisabled && !isSpinning
              ? 'bg-gradient-to-b from-zinc-300 to-zinc-400 dark:from-zinc-500 dark:to-zinc-600'
              : 'bg-gradient-to-b from-violet-400 to-violet-600 dark:from-violet-500 dark:to-violet-700'
            }
          `}
        >
          {/* Top highlight */}
          <div
            className={`
              absolute top-0 left-2 right-2 h-px
              ${isDisabled && !isSpinning ? 'bg-zinc-200/50' : 'bg-white/30'}
            `}
          />

          {/* Shine effect */}
          <div
            className={`
              absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent
              ${!isDisabled ? 'group-hover:from-white/30' : ''}
              transition-all duration-200
            `}
          />

          {/* Spinning pulse effect */}
          {isSpinning && (
            <div className="absolute inset-0 bg-violet-300/20 animate-pulse" />
          )}

          {/* Button text */}
          <span
            className={`
              relative font-heading font-bold text-xl tracking-wide
              ${isDisabled && !isSpinning
                ? 'text-zinc-500 dark:text-zinc-400'
                : 'text-white'
              }
              ${isSpinning ? 'animate-pulse' : ''}
            `}
          >
            {isSpinning ? 'SPINNING...' : 'SPIN'}
          </span>

          {/* Bottom shadow line */}
          <div
            className={`
              absolute bottom-0 left-2 right-2 h-px
              ${isDisabled && !isSpinning ? 'bg-zinc-500/30' : 'bg-violet-900/30'}
            `}
          />
        </div>
      </div>

      {/* 3D depth effect */}
      <div
        className={`
          absolute -bottom-1 left-1 right-1 h-2 rounded-b-2xl -z-10
          ${isDisabled && !isSpinning
            ? 'bg-zinc-600 dark:bg-zinc-800'
            : 'bg-violet-900 dark:bg-violet-950'
          }
        `}
      />
    </button>
  )
}
