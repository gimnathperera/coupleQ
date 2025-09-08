'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Circle, Play, Users } from 'lucide-react'
import { Player, Room } from '@/lib/types'
import { isPlayerOnline } from '@/lib/utils'
import { Button } from '@/lib/ui/button'

interface ReadyPanelProps {
  room: Room
  players: Player[]
  currentPlayerId: string
  isReady: boolean
  onToggleReady: () => void
  onStartGame: () => void
  disabled?: boolean
}

export function ReadyPanel({
  room,
  players,
  currentPlayerId,
  isReady,
  onToggleReady,
  onStartGame,
  disabled = false,
}: ReadyPanelProps) {
  const currentPlayer = players.find((p) => p._id === currentPlayerId)
  const otherPlayer = players.find((p) => p._id !== currentPlayerId)
  const allPlayersReady = players.length === 2 && players.every((p) => p.ready)
  const canStart = allPlayersReady && currentPlayerId === room.hostId

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Ready to Play?
        </h2>
        <p className="text-gray-600">
          Both players need to be ready to start the game
        </p>
      </div>

      {/* Players List */}
      <div className="space-y-4 mb-6">
        {players.map((player) => {
          const isCurrentPlayer = player._id === currentPlayerId
          const isOnline = isPlayerOnline(player.lastSeen)

          return (
            <motion.div
              key={player._id}
              className={`
                flex items-center justify-between p-4 rounded-xl border-2
                ${
                  isCurrentPlayer
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 bg-gray-50'
                }
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{player.avatar}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-semibold ${isCurrentPlayer ? 'text-primary' : 'text-gray-800'}`}
                    >
                      {player.name}
                    </span>
                    {isCurrentPlayer && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    <span className="text-xs text-gray-500">
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {player.ready ? (
                  <motion.div
                    className="flex items-center space-x-1 text-green-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Ready</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Circle className="w-5 h-5" />
                    <span className="text-sm">Not ready</span>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Ready Toggle */}
      <div className="mb-6">
        <Button
          onClick={onToggleReady}
          disabled={disabled}
          variant={isReady ? 'default' : 'outline'}
          className="w-full flex items-center justify-center gap-3"
          size="lg"
        >
          {isReady ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Ready to Play</span>
            </>
          ) : (
            <>
              <Circle className="w-5 h-5" />
              <span>Mark as Ready</span>
            </>
          )}
        </Button>
      </div>

      {/* Start Game Button */}
      {canStart && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Button
            onClick={onStartGame}
            disabled={disabled}
            variant="gradient"
            className="w-full flex items-center justify-center gap-3"
            size="lg"
          >
            <Play className="w-5 h-5" />
            <span>Start Game</span>
          </Button>
        </motion.div>
      )}

      {/* Waiting Message */}
      {!canStart && players.length === 2 && (
        <div className="text-center text-gray-500">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {allPlayersReady
              ? 'Only the host can start the game'
              : 'Waiting for all players to be ready...'}
          </p>
        </div>
      )}
    </motion.div>
  )
}
