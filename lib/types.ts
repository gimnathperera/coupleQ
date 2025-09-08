import { Id } from '@/convex/_generated/dataModel'

// Question types
export type QType = 'image-mcq'

export interface Option {
  id: string
  label: string
  image: string
  alt?: string
}

export interface Question {
  id: string
  deckId: string
  type: QType
  text: string
  options: [Option, Option, Option, Option] // exactly 4
}

// Room types
export interface Room {
  _id: Id<'rooms'>
  code: string
  status: string // 'lobby' | 'in_progress' | 'finished'
  deckId: string
  rounds: number
  createdAt: number
  hostId: string
  currentRoundIndex: number
  questionIds: string[]
}

// Player types
export interface Player {
  _id: Id<'players'>
  roomId: string
  name: string
  avatar: string
  ready: boolean
  lastSeen: number
}

// Round types
export interface Round {
  _id: Id<'rounds'>
  roomId: string
  roundIndex: number
  questionId: string
  answersLocked: Record<string, boolean>
  answers: Record<string, string>
  scoreDelta: number
  revealed: boolean
}

// Game state types
export interface GameState {
  room: Room | null
  players: Player[]
  currentRound: Round | null
  currentQuestion: Question | null
  selectedOption: string | null
  isLocked: boolean
  isRevealed: boolean
  totalScore: number
}

// UI state types
export interface UIState {
  isLoading: boolean
  error: string | null
  showMatchBanner: boolean
  matchResult: 'match' | 'mismatch' | null
}

// Avatar options
export const AVATAR_OPTIONS = [
  '😊',
  '😍',
  '🥰',
  '😘',
  '🤗',
  '😎',
  '🤩',
  '🥳',
  '😇',
  '🤠',
  '😋',
  '🤤',
  '😴',
  '🤯',
  '🥺',
  '😤',
  '🤔',
  '🤫',
  '🤭',
  '😏',
  '😌',
  '😑',
  '🙄',
  '😬',
  '🤐',
  '🤢',
  '🤮',
  '🤧',
  '🥵',
  '🥶',
  '😵',
  '🤪',
] as const

export type Avatar = (typeof AVATAR_OPTIONS)[number]
