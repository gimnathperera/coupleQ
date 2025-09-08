'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, AlertCircle } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/ui/card'

export default function JoinRoomPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const joinRoom = useMutation(api.players.joinRoom)

  const [roomCode, setRoomCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const name = searchParams.get('name') || ''
  const avatar = searchParams.get('avatar') || '😊'

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || roomCode.length !== 6) {
      setError('Please enter a valid 6-character room code')
      return
    }

    setIsJoining(true)
    setError(null)

    try {
      const result = await joinRoom({
        code: roomCode.toUpperCase(),
        name,
        avatar,
      })

      // Store the player ID in localStorage for this session
      try {
        localStorage.setItem('currentPlayerId', result.playerId)
      } catch (error) {
        console.warn('localStorage not available:', error)
      }

      // Redirect to room
      router.push(`/r/${roomCode.toUpperCase()}`)
    } catch (err: any) {
      console.error('Failed to join room:', err)
      setError(
        err.message ||
          'Failed to join room. Please check the code and try again.'
      )
      setIsJoining(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinRoom()
    }
  }

  if (!name || !avatar) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Join Room</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>

        {/* Join Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
            >
              <Users className="w-8 h-8 text-blue-600" />
            </motion.div>
            <CardTitle className="text-2xl">Join a Game</CardTitle>
            <p className="text-gray-600">
              Enter the 6-character room code to join your partner
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Player Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{avatar}</span>
                <div>
                  <p className="font-semibold text-gray-800">{name}</p>
                  <p className="text-sm text-gray-600">Ready to join</p>
                </div>
              </div>
            </div>

            {/* Room Code Input */}
            <div>
              <label
                htmlFor="roomCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Room Code
              </label>
              <Input
                id="roomCode"
                type="text"
                placeholder="Enter 6-character code"
                value={roomCode}
                onChange={(e) => {
                  const value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, '')
                  if (value.length <= 6) {
                    setRoomCode(value)
                    setError(null)
                  }
                }}
                onKeyPress={handleKeyPress}
                maxLength={6}
                className="text-center text-2xl font-mono tracking-widest"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the code shared by your partner
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {/* Join Button */}
            <Button
              onClick={handleJoinRoom}
              disabled={!roomCode.trim() || roomCode.length !== 6 || isJoining}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              size="lg"
            >
              {isJoining ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  <span>Join Room</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Tips */}
        <motion.div
          className="mt-6 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>💡 Make sure you have the correct room code from your partner</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
