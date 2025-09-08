'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff } from 'lucide-react'
import { Player } from '@/lib/types'
import { isPlayerOnline } from '@/lib/utils'

interface PresenceOverlayProps {
  players: Player[]
}

export function PresenceOverlay({ players }: PresenceOverlayProps) {
  const offlinePlayers = players.filter((p) => !isPlayerOnline(p.lastSeen))

  if (offlinePlayers.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.div
            className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          >
            <WifiOff className="w-8 h-8 text-orange-600" />
          </motion.div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Waiting for Partner
          </h2>

          <p className="text-gray-600 mb-4">
            {offlinePlayers.length === 1
              ? `${offlinePlayers[0].name} is offline`
              : 'Some players are offline'}
          </p>

          <div className="space-y-2">
            {offlinePlayers.map((player) => (
              <div
                key={player._id}
                className="flex items-center justify-center space-x-2"
              >
                <span className="text-2xl">{player.avatar}</span>
                <span className="font-medium text-gray-800">{player.name}</span>
                <WifiOff className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>
              They&apos;ll automatically reconnect when they&apos;re back online
            </p>
          </div>

          {/* Pulsing indicator */}
          <motion.div
            className="mt-4 flex justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
