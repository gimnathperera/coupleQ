'use client'

import { motion } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MatchBannerProps {
  isMatch: boolean
  isVisible: boolean
  onClose: () => void
}

export function MatchBanner({ isMatch, isVisible, onClose }: MatchBannerProps) {
  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Banner */}
      <motion.div
        className={cn(
          'relative bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl',
          'border-4',
          isMatch ? 'border-green-500' : 'border-orange-500'
        )}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <motion.div
          className={cn(
            'w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center',
            isMatch ? 'bg-green-100' : 'bg-orange-100'
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          {isMatch ? (
            <Heart className="w-10 h-10 text-green-600 fill-current" />
          ) : (
            <X className="w-10 h-10 text-orange-600" />
          )}
        </motion.div>

        {/* Message */}
        <motion.h2
          className={cn(
            'text-2xl font-bold mb-2',
            isMatch ? 'text-green-600' : 'text-orange-600'
          )}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isMatch ? 'Perfect Match! 💕' : 'Close Call! 😅'}
        </motion.h2>

        <motion.p
          className="text-gray-600 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isMatch
            ? 'You both chose the same answer!'
            : 'You chose different answers this time.'}
        </motion.p>

        {/* Confetti for matches */}
        {isMatch && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-pink-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: 360,
                  y: [0, -100],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
