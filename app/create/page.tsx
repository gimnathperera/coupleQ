'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Copy, Check } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/lib/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/ui/card'
import { RoomCode } from '@/components/RoomCode'

export default function CreateRoomPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const createRoom = useMutation(api.rooms.createRoom)

  const [roomData, setRoomData] = useState<{
    roomId: string
    code: string
    playerId: string
  } | null>(null)
  const [isCreating, setIsCreating] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const name = searchParams.get('name') || ''
  const avatar = searchParams.get('avatar') || '😊'

  useEffect(() => {
    const createRoomAsync = async () => {
      try {
        const result = await createRoom({
          hostName: name,
          hostAvatar: avatar,
        })
        setRoomData(result)
        // Store the player ID in localStorage for this session
        try {
          localStorage.setItem('currentPlayerId', result.playerId)
        } catch (error) {
          console.warn('localStorage not available:', error)
        }
        setIsCreating(false)
      } catch (err) {
        console.error('Failed to create room:', err)
        setError('Failed to create room. Please try again.')
        setIsCreating(false)
      }
    }

    if (name && avatar) {
      createRoomAsync()
    } else {
      router.push('/')
    }
  }, [name, avatar, createRoom, router])

  const handleGoToRoom = () => {
    if (roomData) {
      router.push(`/r/${roomData.code}`)
    }
  }

  if (isCreating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            Creating your room...
          </h2>
          <p className="text-gray-600 mt-2">This will just take a moment</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => router.push('/')} className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!roomData) {
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
          <h1 className="text-xl font-semibold text-gray-800">Room Created!</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>

        {/* Success Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
            >
              <Users className="w-8 h-8 text-green-600" />
            </motion.div>
            <CardTitle className="text-2xl text-green-600">
              Room Ready!
            </CardTitle>
            <p className="text-gray-600">
              Share the room code with your partner to start playing
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Room Code */}
            <div className="text-center">
              <RoomCode code={roomData.code} className="justify-center" />
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">How to play:</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Share the room code with your partner</li>
                <li>2. Wait for them to join</li>
                <li>3. Both players mark as ready</li>
                <li>4. Start the game and have fun!</li>
              </ol>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleGoToRoom}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              size="lg"
            >
              <Users className="w-5 h-5" />
              <span>Go to Room</span>
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
          <p>💡 Tip: Keep this page open while waiting for your partner</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
