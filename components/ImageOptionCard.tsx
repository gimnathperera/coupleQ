'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Check } from 'lucide-react'
import { Option } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ImageOptionCardProps {
  option: Option
  isSelected: boolean
  isLocked: boolean
  isRevealed: boolean
  showPlayerChoice?: boolean
  playerAvatar?: string
  onClick: () => void
  disabled?: boolean
}

export function ImageOptionCard({
  option,
  isSelected,
  isLocked,
  isRevealed,
  showPlayerChoice = false,
  playerAvatar,
  onClick,
  disabled = false,
}: ImageOptionCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <motion.button
      className={cn(
        'relative w-full aspect-square rounded-2xl overflow-hidden group',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'transition-all duration-200 touch-manipulation',
        isSelected &&
          !disabled &&
          'ring-4 ring-primary ring-offset-2 shadow-glow',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'hover:scale-105 active:scale-95 hover:shadow-medium'
      )}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image or Fallback */}
      {!imageError ? (
        <img
          src={option.image}
          alt={option.alt || option.label}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{option.label}</span>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="text-white font-semibold text-lg drop-shadow-lg">
          {option.label}
        </span>
      </div>

      {/* Selection State */}
      {isSelected && !isRevealed && (
        <motion.div
          className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-2 shadow-soft"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Check className="w-4 h-4" />
        </motion.div>
      )}

      {/* Locked State */}
      {isLocked && (
        <motion.div
          className="absolute top-3 right-3 bg-success text-success-foreground rounded-full p-2 shadow-soft"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Lock className="w-4 h-4" />
        </motion.div>
      )}

      {/* Player Choice Indicator */}
      {showPlayerChoice && playerAvatar && (
        <motion.div
          className="absolute top-3 left-3 bg-white/95 rounded-full p-2 shadow-soft"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          <span className="text-2xl">{playerAvatar}</span>
        </motion.div>
      )}

      {/* Match Indicator */}
      {isRevealed && isSelected && (
        <motion.div
          className="absolute inset-0 bg-success/20 border-4 border-success rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
      )}
    </motion.button>
  )
}
