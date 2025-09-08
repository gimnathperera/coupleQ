'use client'

import { motion } from 'framer-motion'
import { isPlayerOnline } from '@/lib/utils'

interface PresenceDotProps {
  lastSeen: number
  size?: 'sm' | 'md' | 'lg'
}

export function PresenceDot({ lastSeen, size = 'md' }: PresenceDotProps) {
  const isOnline = isPlayerOnline(lastSeen)

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  return (
    <motion.div
      className={`
        ${sizeClasses[size]} rounded-full
        ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
      `}
      animate={{
        scale: isOnline ? [1, 1.2, 1] : 1,
        opacity: isOnline ? [1, 0.7, 1] : 0.6,
      }}
      transition={{
        duration: 2,
        repeat: isOnline ? Infinity : 0,
        ease: 'easeInOut',
      }}
    />
  )
}
