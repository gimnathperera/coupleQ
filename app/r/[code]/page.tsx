'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Question, Player, Round } from '@/lib/types'
import { loadDeck } from '@/data/decks'
import { calculateTotalScore } from '@/lib/scoring'
import { RoomHeader } from '@/components/RoomHeader'
import { QuestionGrid } from '@/components/QuestionGrid'
import { MatchBanner } from '@/components/MatchBanner'
import { BottomBar } from '@/components/BottomBar'
import { ReadyPanel } from '@/components/ReadyPanel'
import { GameResults } from '@/components/GameResults'
import { PresenceOverlay } from '@/components/PresenceOverlay'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function GameRoomPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  // Get current player ID from localStorage
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null)

  // Load current player ID on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('currentPlayerId')
      if (stored) {
        setCurrentPlayerId(stored)
      }
    } catch (error) {
      console.error('Failed to get currentPlayerId from localStorage:', error)
    }
  }, [])

  // Convex queries
  const roomData = useQuery(api.rooms.byCode, { code })
  const playersData = useQuery(
    api.players.inRoom,
    roomData?.room?._id ? { roomId: roomData.room._id as Id<'rooms'> } : 'skip'
  )
  const currentRoundData = useQuery(
    api.rounds.current,
    roomData?.room?._id && roomData.room.currentRoundIndex !== undefined
      ? {
          roomId: roomData.room._id as Id<'rooms'>,
          roundIndex: roomData.room.currentRoundIndex,
        }
      : 'skip'
  )
  const allRoundsData = useQuery(
    api.rounds.allRounds,
    roomData?.room?._id ? { roomId: roomData.room._id as Id<'rooms'> } : 'skip'
  )

  // Convex mutations
  const setReady = useMutation(api.players.setReady)
  const startGame = useMutation(api.rooms.startGame)
  const lockAnswer = useMutation(api.rounds.lockAnswer)
  const revealRound = useMutation(api.rounds.revealRound)
  const nextRound = useMutation(api.rounds.nextRound)
  const heartbeat = useMutation(api.players.heartbeat)

  // Local state
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [showMatchBanner, setShowMatchBanner] = useState(false)
  const [matchResult, setMatchResult] = useState<'match' | 'mismatch' | null>(
    null
  )

  // Load questions when room data is available
  useEffect(() => {
    if (roomData?.room?.deckId) {
      const deck = loadDeck(roomData.room.deckId)
      if (deck) {
        setQuestions(deck.questions)
      }
    }
  }, [roomData?.room?.deckId])

  // Update current question when round changes
  useEffect(() => {
    if (currentRoundData && questions.length > 0) {
      const question = questions.find(
        (q) => q.id === currentRoundData.questionId
      )
      if (question) {
        setCurrentQuestion(question)
      }
    }
  }, [currentRoundData, questions])

  // Reset state when round changes
  useEffect(() => {
    if (currentRoundData) {
      const roundIndex = currentRoundData.roundIndex

      // Reset UI state for new round
      setIsRevealed(false)
      setShowMatchBanner(false)
      setMatchResult(null)

      // Check if current player has already locked their answer
      if (
        currentPlayerId &&
        currentRoundData.answersLocked?.[currentPlayerId]
      ) {
        // Player already locked - restore their state
        setIsLocked(true)
        if (currentRoundData.answers?.[currentPlayerId]) {
          setSelectedOption(currentRoundData.answers[currentPlayerId])
        }
      } else {
        // Player hasn't locked - reset selection state
        setSelectedOption(null)
        setIsLocked(false)
      }
    }
  }, [currentRoundData?.roundIndex, currentPlayerId])

  // Calculate derived state
  const room = roomData?.room
  const players = playersData || []
  const currentRound = currentRoundData
  const allRounds = allRoundsData || []
  const currentPlayer = players.find((p) => p._id === currentPlayerId)
  const isHost = currentPlayerId === room?.hostId
  const totalScore = calculateTotalScore(allRounds)

  // Check if both players have locked their answers
  const bothPlayersLocked =
    currentRound &&
    currentRound.answersLocked &&
    Object.keys(currentRound.answersLocked).length === 2

  // Heartbeat effect
  useEffect(() => {
    if (!currentPlayerId) return

    const interval = setInterval(async () => {
      try {
        await heartbeat({ playerId: currentPlayerId as Id<'players'> })
      } catch (error) {
        console.error('Heartbeat failed:', error)
      }
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [currentPlayerId])

  // Auto-reveal when both players lock
  useEffect(() => {
    if (
      bothPlayersLocked &&
      !isRevealed &&
      currentRound &&
      currentPlayerId &&
      room
    ) {
      const otherPlayer = players.find((p) => p._id !== currentPlayerId)
      if (otherPlayer) {
        const timer = setTimeout(async () => {
          try {
            const result = await revealRound({
              roomId: room._id as Id<'rooms'>,
              roundIndex: currentRound.roundIndex,
              playerA: currentPlayerId as Id<'players'>,
              playerB: otherPlayer._id as Id<'players'>,
            })

            setIsRevealed(true)
            setShowMatchBanner(true)
            setMatchResult(result.scoreDelta === 1 ? 'match' : 'mismatch')
          } catch (error) {
            console.error('Auto-reveal failed:', error)
          }
        }, 1000)

        return () => clearTimeout(timer)
      }
    }
  }, [
    bothPlayersLocked,
    isRevealed,
    currentRound,
    currentPlayerId,
    players,
    room,
    revealRound,
  ])

  // Auto-advance to next round after reveal
  useEffect(() => {
    if (isRevealed && room && room.status === 'in_progress') {
      const timer = setTimeout(async () => {
        try {
          const result = await nextRound({ roomId: room._id as Id<'rooms'> })

          // Game finished - the room status will change to 'finished' and the results will show automatically
        } catch (error) {
          console.error('Auto-advance failed:', error)
        }
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isRevealed, room, nextRound, router, code])

  // Event handlers
  const handleSetReady = async (ready: boolean) => {
    if (!currentPlayerId) return
    try {
      await setReady({ playerId: currentPlayerId as Id<'players'>, ready })
    } catch (error) {
      console.error('Failed to set ready:', error)
    }
  }

  const handleStartGame = async () => {
    if (!room || questions.length === 0) return
    try {
      // Get 10 random questions from the deck
      const shuffled = [...questions].sort(() => Math.random() - 0.5)
      const questionIds = shuffled.slice(0, 10).map((q) => q.id)

      await startGame({
        roomId: room._id as Id<'rooms'>,
        deckId: room.deckId,
        questionIds,
      })
    } catch (error) {
      console.error('Failed to start game:', error)
    }
  }

  const handleSelectOption = (optionId: string) => {
    if (isLocked || isRevealed) return
    setSelectedOption(optionId)
  }

  const handleLockAnswer = async () => {
    if (!selectedOption || !currentRound || !currentPlayerId || !room) return

    try {
      await lockAnswer({
        roomId: room._id as Id<'rooms'>,
        roundIndex: currentRound.roundIndex,
        playerId: currentPlayerId as Id<'players'>,
        optionId: selectedOption,
      })

      setIsLocked(true)
    } catch (error) {
      console.error('Failed to lock answer:', error)
    }
  }

  const handleReveal = async () => {
    if (!currentRound || !currentPlayerId || !room) return

    const otherPlayer = players.find((p) => p._id !== currentPlayerId)
    if (!otherPlayer) return

    try {
      const result = await revealRound({
        roomId: room._id as Id<'rooms'>,
        roundIndex: currentRound.roundIndex,
        playerA: currentPlayerId as Id<'players'>,
        playerB: otherPlayer._id as Id<'players'>,
      })

      setIsRevealed(true)
      setShowMatchBanner(true)
      setMatchResult(result.scoreDelta === 1 ? 'match' : 'mismatch')
    } catch (error) {
      console.error('Failed to reveal round:', error)
    }
  }

  const handleNextRound = async () => {
    if (!room) return

    try {
      const result = await nextRound({ roomId: room._id as Id<'rooms'> })

      // Game finished - the room status will change to 'finished' and the results will show automatically
    } catch (error) {
      console.error('Failed to advance to next round:', error)
    }
  }

  const handleRematch = () => {
    router.push('/')
  }

  // Loading state
  if (!room || !currentPlayerId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    )
  }

  // Room not found
  if (!roomData?.room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Room not found
          </h1>
          <p className="text-gray-600 mb-6">
            The room code &quot;{code}&quot; doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // Lobby state
  if (room.status === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <RoomHeader
            room={room}
            players={players}
            currentPlayerId={currentPlayerId || ''}
          />

          <div className="max-w-md mx-auto mt-8">
            <ReadyPanel
              room={room}
              players={players}
              currentPlayerId={currentPlayerId || ''}
              isReady={currentPlayer?.ready || false}
              onToggleReady={() => handleSetReady(!currentPlayer?.ready)}
              onStartGame={handleStartGame}
            />
          </div>
        </div>
      </div>
    )
  }

  // Results state
  if (room.status === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <ErrorBoundary fallback={<div>Error loading results</div>}>
            <GameResults
              room={room}
              players={players}
              totalScore={totalScore}
              onRematch={handleRematch}
            />
          </ErrorBoundary>
        </div>
      </div>
    )
  }

  // Game state
  if (room.status === 'in_progress' && currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <RoomHeader
            room={room}
            players={players}
            currentPlayerId={currentPlayerId || ''}
          />

          <div className="max-w-md mx-auto mt-8 space-y-6">
            {/* Question */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQuestion.text}
              </h2>
            </motion.div>

            {/* Question Grid */}
            <QuestionGrid
              question={currentQuestion}
              selectedOption={selectedOption}
              lockedOptions={currentRound?.answersLocked || {}}
              revealedOptions={currentRound?.answers || {}}
              players={players}
              currentPlayerId={currentPlayerId}
              onSelectOption={handleSelectOption}
              disabled={isLocked}
              isRevealed={isRevealed}
            />

            {/* Match Banner */}
            {showMatchBanner && matchResult && (
              <MatchBanner
                isMatch={matchResult === 'match'}
                isVisible={showMatchBanner}
                onClose={() => setShowMatchBanner(false)}
              />
            )}

            {/* Bottom Bar */}
            <BottomBar
              selectedOption={selectedOption}
              isLocked={isLocked}
              isRevealed={isRevealed}
              bothPlayersLocked={bothPlayersLocked}
              onLockAnswer={handleLockAnswer}
              onReveal={handleReveal}
              onNextRound={handleNextRound}
            />
          </div>

          {/* Presence Overlay */}
          <PresenceOverlay players={players} />
        </div>
      </div>
    )
  }

  // Loading game state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Starting game...</p>
      </div>
    </div>
  )
}
