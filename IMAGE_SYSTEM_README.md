# Image System Documentation

## Overview

The CoupleQ app now uses a dynamic image system that fetches images from the internet based on answer titles, replacing the previous SVG-based approach. This provides more diverse and relevant images for each answer option.

## How It Works

### 1. Image Fetching Priority

1. **Unsplash API** (Primary) - High-quality, relevant images
2. **Picsum Photos** (Fallback) - Random placeholder images
3. **Gradient Background** (Final Fallback) - Beautiful gradient with text

### 2. Image Caching

- Images are cached to avoid repeated API calls
- Cache persists during the session
- Use `clearImageCache()` to clear cache if needed

### 3. Smart Search System

- **Keyword Mapping**: 100+ predefined keyword mappings for common answers
- **Contextual Search**: Uses question text to add relevant context
- **Enhanced Queries**: Combines answer labels with contextual keywords
- **Quality Filtering**: Uses Unsplash's content filter for high-quality results

### 4. Loading States

- Shows loading spinner while fetching images
- Graceful fallback if images fail to load
- Smooth transitions between states

## Configuration

### Environment Variables

Add to your `.env.local` file:

```bash
# Optional: Unsplash API key for high-quality images
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

### Getting Unsplash API Key

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a free account
3. Create a new application
4. Copy your Access Key
5. Add it to your environment variables

**Note**: The app works without the Unsplash API key, but will use placeholder images instead.

## API Usage

### Basic Usage

```typescript
import { getImageForAnswer } from '@/lib/image-service'

// Get image for an answer
const imageResult = await getImageForAnswer('Beach')
console.log(imageResult.url) // Image URL
console.log(imageResult.alt) // Alt text
console.log(imageResult.source) // 'unsplash', 'placeholder', or 'fallback'
```

### Contextual Search

```typescript
// Get image with question context for better relevance
const imageResult = await getImageForAnswer(
  'Beach',
  'Where would they rather go this weekend?'
)
// This will search for "beach activity" instead of just "beach"
```

### Search Examples

The system automatically enhances search queries based on context:

- **"Beach"** + **"weekend activity"** → searches for **"beach activity"**
- **"Pizza"** + **"comfort food"** → searches for **"pizza food"**
- **"Reading"** + **"relax"** → searches for **"reading relaxing"**
- **"Dog"** + **"ideal pet"** → searches for **"dog pet"**

### Preloading Images

```typescript
import { preloadAnswerImages } from '@/lib/image-service'

// Preload multiple images for better performance
const labels = ['Beach', 'Mountains', 'City', 'Home']
const results = await preloadAnswerImages(labels)
```

### Fallback Gradients

```typescript
import { getFallbackGradientClass } from '@/lib/image-service'

// Get CSS class for fallback gradient
const gradientClass = getFallbackGradientClass('Beach')
// Returns: 'from-blue-400 via-purple-500 to-pink-500'
```

## Components

### ImageOptionCard

The main component that displays answer options with images:

- Automatically fetches images based on option labels
- Shows loading state while fetching
- Handles image load errors gracefully
- Uses fallback gradients when images fail

### QuestionGrid

Manages the grid of answer options:

- Preloads images for better performance
- Shows loading skeleton while images load
- Renders ImageOptionCard components

## Performance Considerations

1. **Image Caching**: Images are cached to avoid repeated API calls
2. **Preloading**: Images are preloaded before displaying
3. **Lazy Loading**: Images load as needed
4. **Fallback System**: Multiple fallback levels ensure images always display

## Troubleshooting

### Images Not Loading

1. Check your internet connection
2. Verify Unsplash API key is correct (if using)
3. Check browser console for errors
4. Ensure environment variables are loaded

### Slow Loading

1. Images are cached after first load
2. Consider preloading images earlier in the app flow
3. Check network speed and API response times

### API Rate Limits

- Unsplash free tier: 50 requests per hour
- Picsum Photos: No rate limits
- Consider implementing request throttling for production

## Migration from SVG System

The new system is backward compatible:

1. Old SVG paths in question data are ignored
2. Images are now fetched based on answer labels
3. No changes needed to question data structure
4. Existing components automatically use new system

## Future Enhancements

Potential improvements:

1. **Multiple Image Sources**: Add more image APIs
2. **Image Optimization**: Compress and optimize images
3. **Offline Support**: Cache images for offline use
4. **Custom Images**: Allow custom image uploads
5. **AI-Generated Images**: Use AI to generate custom images
