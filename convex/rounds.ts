import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'

export const current = query({
  args: {
    roomId: v.id('rooms'),
    roundIndex: v.number(),
  },
  handler: async (ctx, { roomId, roundIndex }) => {
    return await ctx.db
      .query('rounds')
      .withIndex('by_room_round', (q) =>
        q.eq('roomId', roomId).eq('roundIndex', roundIndex)
      )
      .first()
  },
})

export const allRounds = query({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query('rounds')
      .withIndex('by_room_round', (q) => q.eq('roomId', roomId))
      .collect()
  },
})

export const lockAnswer = mutation({
  args: {
    roomId: v.id('rooms'),
    roundIndex: v.number(),
    playerId: v.id('players'),
    optionId: v.string(),
  },
  handler: async (ctx, { roomId, roundIndex, playerId, optionId }) => {
    const round = await ctx.db
      .query('rounds')
      .withIndex('by_room_round', (q) =>
        q.eq('roomId', roomId).eq('roundIndex', roundIndex)
      )
      .first()

    if (!round) {
      throw new Error('Round not found')
    }

    if (round.revealed) {
      throw new Error('Round already revealed')
    }

    // Verify player belongs to room
    const player = await ctx.db.get(playerId)
    if (!player || player.roomId !== roomId) {
      throw new Error('Player not in room')
    }

    // Update answers and locked status
    const updatedAnswers = { ...round.answers, [playerId]: optionId }
    const updatedAnswersLocked = { ...round.answersLocked, [playerId]: true }

    await ctx.db.patch(round._id, {
      answers: updatedAnswers,
      answersLocked: updatedAnswersLocked,
    })
  },
})

export const revealRound = mutation({
  args: {
    roomId: v.id('rooms'),
    roundIndex: v.number(),
    playerA: v.id('players'),
    playerB: v.id('players'),
  },
  handler: async (ctx, { roomId, roundIndex, playerA, playerB }) => {
    const round = await ctx.db
      .query('rounds')
      .withIndex('by_room_round', (q) =>
        q.eq('roomId', roomId).eq('roundIndex', roundIndex)
      )
      .first()

    if (!round) {
      throw new Error('Round not found')
    }

    if (round.revealed) {
      throw new Error('Round already revealed')
    }

    // Check both players have locked their answers
    if (!round.answersLocked[playerA] || !round.answersLocked[playerB]) {
      throw new Error('Both players must lock their answers first')
    }

    // Calculate score delta (1 if match, 0 if not)
    const scoreDelta = round.answers[playerA] === round.answers[playerB] ? 1 : 0

    await ctx.db.patch(round._id, {
      revealed: true,
      scoreDelta,
    })

    return { scoreDelta }
  },
})

export const nextRound = mutation({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, { roomId }) => {
    const room = await ctx.db.get(roomId)
    if (!room) {
      throw new Error('Room not found')
    }

    const nextRoundIndex = room.currentRoundIndex + 1

    if (nextRoundIndex >= room.rounds) {
      // Game finished
      await ctx.db.patch(roomId, { status: 'finished' })
      return { status: 'finished' as const }
    } else {
      // Create next round
      const nextQuestionId = room.questionIds[nextRoundIndex]
      await ctx.db.insert('rounds', {
        roomId,
        roundIndex: nextRoundIndex,
        questionId: nextQuestionId,
        answersLocked: {},
        answers: {},
        scoreDelta: 0,
        revealed: false,
      })

      // Update room
      await ctx.db.patch(roomId, { currentRoundIndex: nextRoundIndex })
      return { status: 'in_progress' as const, index: nextRoundIndex }
    }
  },
})
