import { Question } from '@/lib/types'

// Deck registry
export const DECKS = {
  'soft-sweet-visual': {
    id: 'soft-sweet-visual',
    name: 'Soft & Sweet Visual',
    description: 'Romantic and cozy questions with beautiful imagery',
    questions: [] as Question[], // Will be loaded dynamically
  },
} as const

export type DeckId = keyof typeof DECKS

// Load deck questions synchronously
export function loadDeck(deckId: string): { questions: Question[] } | null {
  try {
    // For now, we'll load the soft-sweet-visual deck directly
    if (deckId === 'soft-sweet-visual') {
      const questions = require('./soft-sweet-visual.json')
      return { questions }
    }
    return null
  } catch (error) {
    console.error(`Failed to load deck ${deckId}:`, error)
    return null
  }
}

// Load deck questions dynamically
export async function loadDeckQuestions(deckId: DeckId): Promise<Question[]> {
  try {
    const deck = await import(`./${deckId}.json`)
    return deck.default || deck
  } catch (error) {
    console.error(`Failed to load deck ${deckId}:`, error)
    return []
  }
}

// Get random questions from a deck
export function getRandomQuestions(
  deckId: DeckId,
  count: number = 10
): Promise<Question[]> {
  return loadDeckQuestions(deckId).then((questions) => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  })
}
