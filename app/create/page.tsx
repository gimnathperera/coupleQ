'use client'

import { RoomCode } from '@/components/RoomCode'
import { api } from '@/convex/_generated/api'
import { Button } from '@/lib/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/ui/card'
import { useMutation } from 'convex/react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-foreground">
            Creating your room...
          </h2>
          <p className="text-muted-foreground mt-2">
            This will just take a moment
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm sm:max-w-md shadow-strong">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button
              onClick={() => router.push('/')}
              className="w-full"
              size="lg"
            >
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
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="w-full max-w-sm sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h1 className="text-xl font-semibold text-foreground">
            Room Created!
          </h1>
          <div className="w-16" /> {/* Spacer */}
        </div>
        {/* Success Card */}
        <Card className="shadow-strong">
          <CardHeader className="text-center items-center">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-6 shadow-glow"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
            >
              <Users className="w-8 h-8 text-success" />
            </motion.div>
            <CardTitle className="text-2xl sm:text-3xl text-success">
              Room Ready!
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Share the room code with your partner to start playing
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Room Code */}
            <div className="text-center">
              <RoomCode
                code={roomData.code}
                className="justify-center bg-transparent"
              />
            </div>

            {/* Instructions */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <h3 className="font-semibold text-primary mb-3 text-lg">
                How to play:
              </h3>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li>1. Share the room code with your partner</li>
                <li>2. Wait for them to join</li>
                <li>3. Both players mark as ready</li>
                <li>4. Start the game and have fun!</li>
              </ol>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleGoToRoom}
              variant="gradient"
              className="w-full flex items-center justify-center gap-3"
              size="lg"
            >
              <Users className="w-5 h-5" />
              <span>Go to Room</span>
            </Button>
          </CardContent>
        </Card>

        {/* Tips */}
        <motion.div
          className="mt-8 text-center text-sm text-muted-foreground"
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
