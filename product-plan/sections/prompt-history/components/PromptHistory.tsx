import type { PromptHistoryProps } from '../types'

// Format date as relative or absolute
function formatDate(dateString: string): { relative: string; absolute: string } {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  let relative: string
  if (diffDays === 0) {
    relative = 'Today'
  } else if (diffDays === 1) {
    relative = 'Yesterday'
  } else if (diffDays < 7) {
    relative = `${diffDays} days ago`
  } else {
    relative = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const absolute = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return { relative, absolute }
}

export function PromptHistory({ prompts }: PromptHistoryProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h2 className="font-heading font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-2">
          No prompts yet
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs">
          Spin the slot machine to get your first journal prompt!
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">
            {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Prompt list */}
        <div className="space-y-3">
          {prompts.map((prompt, index) => {
            const { relative, absolute } = formatDate(prompt.createdAt)

            return (
              <article
                key={prompt.id}
                className="group relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700">
                  {/* Date */}
                  <time
                    dateTime={prompt.createdAt}
                    title={absolute}
                    className="block text-xs font-medium text-violet-600 dark:text-violet-400 mb-2 tracking-wide uppercase"
                  >
                    {relative}
                  </time>

                  {/* Prompt text */}
                  <p className="font-heading font-semibold text-lg text-zinc-900 dark:text-zinc-100 leading-snug">
                    {prompt.words.join(' ')}
                  </p>
                </div>

                {/* Subtle connector line between items */}
                {index < prompts.length - 1 && (
                  <div className="absolute left-6 top-full w-px h-3 bg-zinc-200 dark:bg-zinc-800" />
                )}
              </article>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Your journal journey started{' '}
            {formatDate(prompts[prompts.length - 1]?.createdAt || '').relative.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  )
}
