'use client'

import { motion } from 'framer-motion'
import { Button } from '@/lib/ui/button'

interface BottomBarProps {
  selectedOption: string | null
  isLocked: boolean
  isRevealed: boolean
  bothPlayersLocked: boolean
  onLockAnswer: () => void
  onReveal: () => void
  onNextRound: () => void
  disabled?: boolean
}

export function BottomBar({
  selectedOption,
  isLocked,
  isRevealed,
  bothPlayersLocked,
  onLockAnswer,
  onReveal,
  onNextRound,
  disabled = false,
}: BottomBarProps) {
  // Determine which buttons to show
  const showLockButton = selectedOption && !isLocked && !isRevealed
  const showRevealButton = bothPlayersLocked && !isRevealed
  const showNextButton = isRevealed

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md mx-auto flex justify-center">
        {showLockButton && (
          <Button
            onClick={onLockAnswer}
            disabled={disabled}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Lock Answer
          </Button>
        )}

        {showRevealButton && (
          <Button
            onClick={onReveal}
            disabled={disabled}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Reveal Answers
          </Button>
        )}

        {showNextButton && (
          <Button
            onClick={onNextRound}
            disabled={disabled}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Next Round
          </Button>
        )}

        {isLocked && !isRevealed && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-lg">🔒</span>
            <span className="font-medium">Locked</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
