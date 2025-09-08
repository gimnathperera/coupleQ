# Game Flow Test Plan

## Current Issues Identified:

1. **Selection Leakage**: One player's selection is visible to the other player before reveal
2. **State Interference**: Player actions are affecting each other's state
3. **Broken Flow**: Selection → Lock → Reveal → Next Round is not working properly

## Expected Flow:

1. **Selection Phase**:
   - Each player can select an answer privately
   - Other player should NOT see the selection
   - Only the selecting player should see their choice highlighted

2. **Lock Phase**:
   - Player clicks "Lock Answer"
   - Their selection becomes locked (padlock icon)
   - Other player still cannot see their choice
   - "Lock Answer" button disappears, shows "Locked 🔒"

3. **Reveal Phase**:
   - When BOTH players have locked, auto-reveal triggers
   - Both players' choices are revealed simultaneously
   - Match/mismatch banner shows
   - Player avatars appear on their chosen cards

4. **Next Round Phase**:
   - After 3 seconds, automatically advance to next round
   - Reset all state for new round
   - Load new question

## Test Cases to Verify:

- [ ] Player 1 selects answer - Player 2 should NOT see it
- [ ] Player 1 locks answer - Player 2 should NOT see the choice
- [ ] Both players lock - reveal should happen automatically
- [ ] After reveal, both players see each other's choices
- [ ] After reveal, game advances to next round automatically
- [ ] New round resets state properly
- [ ] No state interference between players
