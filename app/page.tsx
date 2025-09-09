'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Users, ArrowRight } from 'lucide-react'
import { AvatarPicker } from '@/components/AvatarPicker'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/ui/card'
import { AVATAR_OPTIONS, Avatar } from '@/lib/types'

export default function LandingPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<Avatar>(AVATAR_OPTIONS[0])
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  const handleCreateRoom = async () => {
    if (!name.trim()) return

    setIsCreating(true)
    try {
      // This will be handled by the create room page
      router.push(
        `/create?name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(avatar)}`
      )
    } catch (error) {
      console.error('Failed to create room:', error)
      setIsCreating(false)
    }
  }

  const handleJoinRoom = () => {
    if (!name.trim()) return
    router.push(
      `/join?name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(avatar)}`
    )
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
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          >
            <Heart className="w-10 h-10 text-white fill-current" />
          </motion.div>

          <motion.h1
            className="text-4xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            CoupleQ
          </motion.h1>

          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            A fun couple game to discover how well you know each other
          </motion.p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Let&apos;s get started!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className="text-center text-lg"
              />
            </div>

            {/* Avatar Picker */}
            <AvatarPicker selectedAvatar={avatar} onSelectAvatar={setAvatar} />

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleCreateRoom}
                disabled={!name.trim() || isCreating}
                variant="gradient"
                className="w-full flex items-center justify-center gap-3 cursor-pointer"
                size="xl"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Create Room</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleJoinRoom}
                disabled={!name.trim() || isJoining}
                variant="outline"
                className="w-full flex items-center justify-center gap-3 cursor-pointer"
                size="xl"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Join Room</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <motion.div
          className="mt-8 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>🎮 10 rounds of fun questions</p>
          <p>💕 Discover your compatibility</p>
          <p>📱 Mobile-friendly design</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
