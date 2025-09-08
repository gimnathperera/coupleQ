# CoupleQ - TikTok-Style Couple Game

A fun 2-player real-time couple game built with Next.js and Convex. Players answer image-based questions to discover their compatibility!

## Features

- 🎮 **Real-time multiplayer** - Play with your partner in real-time
- 📱 **Mobile-first design** - Optimized for mobile devices
- 🎨 **Beautiful UI** - TikTok-style vertical interface with smooth animations
- 💕 **Compatibility scoring** - See how well you match with your partner
- 🖼️ **Image-based questions** - Visual questions with 4 image options each
- ⚡ **Live updates** - Real-time presence and game state updates

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Convex (real-time database and functions)
- **State Management**: Zustand
- **UI Components**: shadcn/ui with Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Convex account (free at [convex.dev](https://convex.dev))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd coupleQ
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Convex**

   ```bash
   npx convex dev
   ```

   This will:
   - Create a new Convex project
   - Set up the database schema
   - Deploy the functions
   - Generate the environment variables

4. **Set up environment variables**
   Copy the `NEXT_PUBLIC_CONVEX_URL` from the Convex output to your `.env.local` file:

   ```bash
   echo "NEXT_PUBLIC_CONVEX_URL=your_convex_url_here" > .env.local
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Play

1. **Create or Join a Room**
   - Enter your name and choose an avatar
   - Create a new room or join with a 6-character code

2. **Wait for Your Partner**
   - Share the room code with your partner
   - Both players need to mark as "Ready"

3. **Play the Game**
   - Answer 10 image-based questions
   - Select your choice and lock it in
   - Reveal answers together
   - See if you matched!

4. **View Results**
   - Get your compatibility score
   - Share your results
   - Play again to beat your score!

## Project Structure

```
coupleQ/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── create/            # Create room page
│   ├── join/              # Join room page
│   └── r/[code]/          # Game room page
├── components/            # React components
│   ├── ImageOptionCard.tsx
│   ├── QuestionGrid.tsx
│   ├── MatchBanner.tsx
│   └── ...
├── convex/               # Convex backend
│   ├── schema.ts         # Database schema
│   ├── rooms.ts          # Room functions
│   ├── players.ts        # Player functions
│   └── rounds.ts         # Round functions
├── data/                 # Game data
│   └── decks/           # Question decks
├── lib/                  # Utilities and types
├── stores/              # Zustand stores
└── public/              # Static assets
    └── decks/           # Question images
```

## Game Flow

1. **Lobby Phase**
   - Players join room with code
   - Host selects question deck
   - Both players mark as ready
   - Host starts the game

2. **Game Phase**
   - 10 rounds of questions
   - Each round: select → lock → reveal → next
   - Real-time updates between players
   - Presence indicators

3. **Results Phase**
   - Compatibility score (0-10)
   - Percentage match
   - Fun compatibility message
   - Share results option

## Customization

### Adding New Question Decks

1. Create a new JSON file in `data/decks/`
2. Follow the existing format with questions and options
3. Add corresponding images to `public/decks/[deck-name]/`
4. Update the deck registry in `data/decks/index.ts`

### Styling

The app uses TailwindCSS with custom design tokens. Key files:

- `tailwind.config.ts` - Theme configuration
- `app/globals.css` - Global styles and CSS variables
- Component files use Tailwind classes

### Animations

Framer Motion is used for smooth animations:

- Page transitions
- Card interactions
- Match celebrations
- Loading states

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Backend (Convex)

```bash
npx convex deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues:

1. Check the console for errors
2. Ensure Convex is running (`npx convex dev`)
3. Verify environment variables are set
4. Check that all dependencies are installed

---

Built with ❤️ for couples who want to have fun together!
