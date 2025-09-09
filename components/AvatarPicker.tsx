'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AVATAR_OPTIONS, Avatar } from '@/lib/types'

interface AvatarPickerProps {
  selectedAvatar: Avatar
  onSelectAvatar: (avatar: Avatar) => void
}

export function AvatarPicker({
  selectedAvatar,
  onSelectAvatar,
}: AvatarPickerProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
        Choose your avatar
      </h3>
      <div className="grid grid-cols-8 gap-3 max-w-sm mx-auto">
        {AVATAR_OPTIONS.map((avatar) => (
          <motion.button
            key={avatar}
            className={`
              w-12 h-12 rounded-full text-2xl flex items-center justify-center
              transition-all duration-200 border-2 touch-manipulation
              ${
                selectedAvatar === avatar
                  ? 'border-primary bg-primary/10 scale-110 shadow-glow'
                  : 'border-border hover:border-primary/40 hover:scale-105 hover:shadow-soft'
              }
            `}
            onClick={() => onSelectAvatar(avatar)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {avatar}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
