import { Round } from './types'

export function calculateTotalScore(rounds: Round[]): number {
  if (!rounds || !Array.isArray(rounds)) return 0
  return rounds.reduce((total, round) => {
    if (round && typeof round.scoreDelta === 'number') {
      return total + round.scoreDelta
    }
    return total
  }, 0)
}

export function getMatchPercentage(score: number, totalRounds: number): number {
  if (
    typeof score !== 'number' ||
    typeof totalRounds !== 'number' ||
    totalRounds === 0
  ) {
    return 0
  }
  return Math.round((score / totalRounds) * 100)
}

export function getMatchMessage(score: number, totalRounds: number): string {
  const percentage = getMatchPercentage(score, totalRounds)

  if (percentage >= 80) return 'Perfect match! 💕'
  if (percentage >= 60) return 'Great connection! 😍'
  if (percentage >= 40) return 'Good compatibility! 😊'
  if (percentage >= 20) return 'Some similarities! 🤔'
  return 'Opposites attract! 😄'
}
