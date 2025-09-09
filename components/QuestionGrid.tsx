'use client'

import { motion } from 'framer-motion'
import { Question, Player } from '@/lib/types'
import { ImageOptionCard } from './ImageOptionCard'
import { usePreloadAnswerImages } from '@/lib/preload'

interface QuestionGridProps {
  question: Question
  selectedOption: string | null
  lockedOptions: Record<string, boolean>
  revealedOptions: Record<string, string>
  players: Player[]
  currentPlayerId: string
  onSelectOption: (optionId: string) => void
  disabled?: boolean
  isRevealed?: boolean
}

export function QuestionGrid({
  question,
  selectedOption,
  lockedOptions,
  revealedOptions,
  players,
  currentPlayerId,
  onSelectOption,
  disabled = false,
  isRevealed = false,
}: QuestionGridProps) {
  // Preload images for current question using the new image service
  const imageLabels = question.options.map((opt) => opt.label)
  const { loaded } = usePreloadAnswerImages(imageLabels, question.text)

  // Helper function to get player avatar for a specific option
  const getPlayerChoice = (optionId: string) => {
    if (!isRevealed) return undefined

    // Find which player chose this option
    const playerId = Object.keys(revealedOptions).find(
      (id) => revealedOptions[id] === optionId
    )

    if (!playerId) return undefined

    const player = players.find((p) => p._id === playerId)
    return player?.avatar
  }

  // Check if current player is locked
  const isCurrentPlayerLocked = lockedOptions[currentPlayerId] || false

  if (!loaded) {
    return (
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
        {question.options.map((option) => (
          <div
            key={option.id}
            className="aspect-square bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {question.options.map((option, index) => {
        const isSelected = selectedOption === option.id
        const playerAvatar = isRevealed ? getPlayerChoice(option.id) : undefined
        const showPlayerChoice = isRevealed && playerAvatar !== undefined

        // Only show lock icon on the selected card when current player is locked
        const showLockIcon = isSelected && isCurrentPlayerLocked

        return (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <ImageOptionCard
              option={option}
              isSelected={isSelected}
              isLocked={showLockIcon}
              isRevealed={isRevealed}
              showPlayerChoice={showPlayerChoice}
              playerAvatar={playerAvatar}
              onClick={() => onSelectOption(option.id)}
              disabled={disabled || isCurrentPlayerLocked}
              questionText={question.text}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
