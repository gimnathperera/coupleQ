'use client'

import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { Room, Player } from '@/lib/types'
import { isPlayerOnline } from '@/lib/utils'
import { Progress } from '@/lib/ui/progress'
import { RoomCode } from './RoomCode'

interface RoomHeaderProps {
  room: Room
  players: Player[]
  currentPlayerId: string
}

export function RoomHeader({
  room,
  players,
  currentPlayerId,
}: RoomHeaderProps) {
  const currentPlayer = players.find((p) => p._id === currentPlayerId)
  const otherPlayer = players.find((p) => p._id !== currentPlayerId)
  const progress =
    room.status === 'in_progress'
      ? ((room.currentRoundIndex + 1) / room.rounds) * 100
      : 0

  return (
    <motion.header
      className="w-full p-4 bg-white/90 backdrop-blur-sm border-b border-gray-200"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md mx-auto">
        {/* Room Code */}
        <div className="flex items-center justify-between mb-4">
          <RoomCode
            code={room.code}
            layout="horizontal"
            showLabel={true}
            className="flex-1"
          />
        </div>

        {/* Progress */}
        {room.status === 'in_progress' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Round {room.currentRoundIndex + 1} of {room.rounds}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Players */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              {players.length}/2 players
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {players.map((player) => {
              const isOnline = isPlayerOnline(player.lastSeen)
              const isCurrentPlayer = player._id === currentPlayerId

              return (
                <motion.div
                  key={player._id}
                  className="flex items-center space-x-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-2xl">{player.avatar}</span>
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-medium ${isCurrentPlayer ? 'text-primary' : 'text-gray-600'}`}
                    >
                      {player.name}
                    </span>
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
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
