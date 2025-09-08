import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'

export const createRoom = mutation({
  args: {
    hostName: v.string(),
    hostAvatar: v.string(),
  },
  handler: async (ctx, { hostName, hostAvatar }) => {
    // Generate 6-character room code
    const code = generateRoomCode()

    // Create room
    const roomId = await ctx.db.insert('rooms', {
      code,
      status: 'lobby',
      deckId: 'soft-sweet-visual',
      rounds: 10,
      createdAt: Date.now(),
      hostId: '', // Will be set after creating player
      currentRoundIndex: 0,
      questionIds: [],
    })

    // Create host player
    const playerId = await ctx.db.insert('players', {
      roomId,
      name: hostName,
      avatar: hostAvatar,
      ready: false,
      lastSeen: Date.now(),
    })

    // Update room with hostId
    await ctx.db.patch(roomId, { hostId: playerId })

    return { roomId, code, playerId }
  },
})

export const byCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const room = await ctx.db
      .query('rooms')
      .withIndex('by_code', (q) => q.eq('code', code))
      .first()

    if (!room) return null

    const players = await ctx.db
      .query('players')
      .withIndex('by_room', (q) => q.eq('roomId', room._id))
      .collect()

    return { room, players }
  },
})

export const startGame = mutation({
  args: {
    roomId: v.id('rooms'),
    questionIds: v.array(v.string()),
    deckId: v.string(),
  },
  handler: async (ctx, { roomId, questionIds, deckId }) => {
    const room = await ctx.db.get(roomId)
    if (!room) throw new Error('Room not found')

    if (room.status !== 'lobby') {
      throw new Error('Game already started')
    }

    const players = await ctx.db
      .query('players')
      .withIndex('by_room', (q) => q.eq('roomId', roomId))
      .collect()

    if (players.length !== 2) {
      throw new Error('Need exactly 2 players')
    }

    if (!players.every((p) => p.ready)) {
      throw new Error('All players must be ready')
    }

    if (questionIds.length !== 10) {
      throw new Error('Need exactly 10 questions')
    }

    // Update room
    await ctx.db.patch(roomId, {
      status: 'in_progress',
      deckId,
      questionIds,
      currentRoundIndex: 0,
    })

    // Create first round
    await ctx.db.insert('rounds', {
      roomId,
      roundIndex: 0,
      questionId: questionIds[0],
      answersLocked: {},
      answers: {},
      scoreDelta: 0,
      revealed: false,
    })
  },
})

function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
