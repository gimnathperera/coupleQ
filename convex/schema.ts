import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  rooms: defineTable({
    code: v.string(),
    status: v.string(), // 'lobby' | 'in_progress' | 'finished'
    deckId: v.string(),
    rounds: v.number(),
    createdAt: v.number(),
    hostId: v.string(),
    currentRoundIndex: v.number(),
    questionIds: v.array(v.string()),
  }).index('by_code', ['code']),

  players: defineTable({
    roomId: v.string(),
    name: v.string(),
    avatar: v.string(),
    ready: v.boolean(),
    lastSeen: v.number(),
  }).index('by_room', ['roomId']),

  rounds: defineTable({
    roomId: v.string(),
    roundIndex: v.number(),
    questionId: v.string(),
    answersLocked: v.any(), // Record<string, boolean>
    answers: v.any(), // Record<string, string>
    scoreDelta: v.number(),
    revealed: v.boolean(),
  }).index('by_room_round', ['roomId', 'roundIndex']),
})
