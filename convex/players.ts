import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'

export const joinRoom = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    avatar: v.string(),
  },
  handler: async (ctx, { code, name, avatar }) => {
    const room = await ctx.db
      .query('rooms')
      .withIndex('by_code', (q) => q.eq('code', code))
      .first()

    if (!room) {
      throw new Error('Room not found')
    }

    if (room.status !== 'lobby') {
      throw new Error('Game already started')
    }

    const existingPlayers = await ctx.db
      .query('players')
      .withIndex('by_room', (q) => q.eq('roomId', room._id))
      .collect()

    if (existingPlayers.length >= 2) {
      throw new Error('Room is full')
    }

    // Check if name is already taken
    if (existingPlayers.some((p) => p.name === name)) {
      throw new Error('Name already taken')
    }

    const playerId = await ctx.db.insert('players', {
      roomId: room._id,
      name,
      avatar,
      ready: false,
      lastSeen: Date.now(),
    })

    return { roomId: room._id, playerId }
  },
})

export const setReady = mutation({
  args: {
    playerId: v.id('players'),
    ready: v.boolean(),
  },
  handler: async (ctx, { playerId, ready }) => {
    await ctx.db.patch(playerId, { ready })
  },
})

export const heartbeat = mutation({
  args: { playerId: v.id('players') },
  handler: async (ctx, { playerId }) => {
    await ctx.db.patch(playerId, { lastSeen: Date.now() })
  },
})

export const inRoom = query({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query('players')
      .withIndex('by_room', (q) => q.eq('roomId', roomId))
      .collect()
  },
})
