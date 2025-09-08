'use client'

import { motion } from 'framer-motion'
import { Trophy, Heart, RotateCcw, Share2 } from 'lucide-react'
import { Room, Player } from '@/lib/types'
import { getMatchMessage, getMatchPercentage } from '@/lib/scoring'
import { Button } from '@/lib/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/ui/card'

interface GameResultsProps {
  room: Room
  players: Player[]
  totalScore: number
  onRematch: () => void
}

export function GameResults({
  room,
  players,
  totalScore,
  onRematch,
}: GameResultsProps) {
  // Add error handling to prevent crashes
  if (!room || !players || typeof totalScore !== 'number') {
    return (
      <div className="w-full max-w-md mx-auto text-center p-6">
        <div className="text-red-600 mb-4">Error loading results</div>
        <Button onClick={onRematch} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  const percentage = getMatchPercentage(totalScore, room.rounds)
  const message = getMatchMessage(totalScore, room.rounds)

  const handleShare = async () => {
    const shareText = `We just played CoupleQ and scored ${totalScore}/${room.rounds} (${percentage}%)! ${message}`
    const shareUrl = window.location.origin

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CoupleQ Results',
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        // You could show a toast here
      } catch (err) {
        console.error('Failed to copy to clipboard')
      }
    }
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <CardTitle className="text-3xl text-gray-800">
            Game Complete!
          </CardTitle>
          <p className="text-gray-600">Here&apos;s how you did together</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <motion.div
              className="text-6xl font-bold text-primary mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.3,
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
            >
              {totalScore}/{room.rounds}
            </motion.div>
            <div className="text-2xl font-semibold text-gray-700 mb-1">
              {percentage}%
            </div>
            <div className="text-lg text-gray-600">{message}</div>
          </div>

          {/* Players */}
          <div className="flex justify-center space-x-8">
            {players.map((player) => (
              <motion.div
                key={player._id}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-4xl mb-2">{player.avatar}</div>
                <div className="font-semibold text-gray-800">{player.name}</div>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Compatibility</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onRematch}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              size="lg"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
              size="lg"
            >
              <Share2 className="w-5 h-5" />
              <span>Share Results</span>
            </Button>
          </div>

          {/* Fun Stats */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 text-center">
              Fun Facts
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                🎯 You matched on {totalScore} out of {room.rounds} questions
              </p>
              <p>
                💕{' '}
                {percentage >= 70
                  ? 'You have great compatibility!'
                  : percentage >= 40
                    ? 'You have good compatibility!'
                    : 'Opposites attract!'}
              </p>
              <p>🎮 Play again to beat your score!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
