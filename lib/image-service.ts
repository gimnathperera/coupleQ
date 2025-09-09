// Image service for fetching images from the internet based on answer titles
// Uses Unsplash API as the primary source with fallbacks

interface ImageSearchResult {
  url: string
  alt: string
  source: 'unsplash' | 'placeholder' | 'fallback'
}

// Image source configuration
const IMAGE_SOURCE = process.env.NEXT_PUBLIC_IMAGE_SOURCE || 'internet'

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
const UNSPLASH_BASE_URL = 'https://api.unsplash.com'

// Placeholder image service as fallback
const PLACEHOLDER_BASE_URL = 'https://picsum.photos'

// Cache for image URLs to avoid repeated API calls
const imageCache = new Map<string, ImageSearchResult>()

/**
 * Smart mapping for common answers to better search terms
 */
const ANSWER_KEYWORD_MAP: Record<string, string[]> = {
  // Activities
  beach: ['beach', 'ocean', 'seaside', 'vacation', 'summer'],
  mountains: ['mountains', 'hiking', 'nature', 'landscape', 'outdoor'],
  'city walk': ['city', 'urban', 'walking', 'street', 'downtown'],
  'stay home': ['home', 'cozy', 'comfort', 'indoor', 'relaxing'],
  'movie night': ['cinema', 'movie', 'popcorn', 'film', 'entertainment'],
  'dinner out': ['restaurant', 'dining', 'romantic', 'food', 'date'],
  concert: ['concert', 'music', 'live', 'performance', 'venue'],
  'game night': ['board games', 'gaming', 'fun', 'friends', 'entertainment'],

  // Food
  pizza: ['pizza', 'italian food', 'cheese', 'delicious'],
  'ice cream': ['ice cream', 'dessert', 'sweet', 'treat'],
  pasta: ['pasta', 'italian', 'noodles', 'creamy'],
  chocolate: ['chocolate', 'dessert', 'sweet', 'indulgent'],

  // Relaxation
  reading: ['reading', 'book', 'library', 'quiet', 'literature'],
  yoga: ['yoga', 'meditation', 'fitness', 'wellness', 'peaceful'],
  music: ['music', 'headphones', 'listening', 'audio'],
  'nature walk': ['nature', 'walking', 'forest', 'outdoor', 'peaceful'],

  // Travel
  'tropical island': ['tropical', 'island', 'paradise', 'beach', 'vacation'],
  'european city': ['europe', 'city', 'architecture', 'travel', 'historic'],
  'adventure trip': ['adventure', 'hiking', 'outdoor', 'exciting', 'travel'],
  'cultural tour': ['culture', 'museum', 'art', 'history', 'education'],

  // Morning routines
  'sleep in': ['sleep', 'bed', 'rest', 'comfort', 'morning'],
  'coffee & news': ['coffee', 'morning', 'newspaper', 'breakfast'],
  exercise: ['exercise', 'fitness', 'workout', 'gym', 'healthy'],
  meditation: ['meditation', 'mindfulness', 'peaceful', 'wellness'],

  // Seasons
  spring: ['spring', 'flowers', 'blooming', 'fresh', 'green'],
  summer: ['summer', 'sunny', 'warm', 'bright', 'outdoor'],
  fall: ['autumn', 'fall', 'leaves', 'colorful', 'cozy'],
  winter: ['winter', 'snow', 'cold', 'cozy', 'fireplace'],

  // Pets
  dog: ['dog', 'puppy', 'pet', 'cute', 'loyal'],
  cat: ['cat', 'kitten', 'pet', 'cute', 'feline'],
  bird: ['bird', 'parrot', 'colorful', 'pet', 'flying'],
  fish: ['fish', 'aquarium', 'underwater', 'colorful', 'pet'],

  // Movies
  comedy: ['comedy', 'funny', 'laughing', 'humor', 'entertainment'],
  romance: ['romance', 'love', 'couple', 'romantic', 'heart'],
  action: ['action', 'adventure', 'exciting', 'thrilling', 'movie'],
  horror: ['horror', 'scary', 'dark', 'thrilling', 'movie'],

  // Home styles
  modern: ['modern', 'contemporary', 'sleek', 'minimalist', 'design'],
  cozy: ['cozy', 'warm', 'comfortable', 'homey', 'comfort'],
  minimalist: ['minimalist', 'clean', 'simple', 'modern', 'design'],
  vintage: ['vintage', 'retro', 'classic', 'antique', 'nostalgic'],

  // Celebrations
  party: ['party', 'celebration', 'fun', 'friends', 'festive'],
  'quiet dinner': ['dinner', 'intimate', 'romantic', 'quiet', 'cozy'],
  adventure: ['adventure', 'exciting', 'outdoor', 'thrilling'],
  'gift exchange': ['gifts', 'presents', 'wrapped', 'thoughtful'],

  // Weekend activities
  brunch: ['brunch', 'breakfast', 'food', 'morning', 'delicious'],
  shopping: ['shopping', 'retail', 'boutique', 'fashion', 'store'],
  sports: ['sports', 'athletic', 'fitness', 'game', 'active'],
  'art gallery': ['art', 'gallery', 'museum', 'culture', 'exhibition'],

  // Music
  pop: ['pop music', 'popular', 'chart', 'radio', 'music'],
  jazz: ['jazz', 'smooth', 'saxophone', 'blues', 'music'],
  rock: ['rock music', 'guitar', 'band', 'loud', 'music'],
  classical: ['classical', 'orchestra', 'symphony', 'elegant', 'music'],

  // Date activities
  picnic: ['picnic', 'outdoor', 'romantic', 'food', 'nature'],
  museum: ['museum', 'art', 'culture', 'education', 'history'],
  cooking: ['cooking', 'kitchen', 'food', 'chef', 'delicious'],

  // Relaxation
  bath: ['bath', 'bubble bath', 'relaxing', 'spa', 'comfort'],
  massage: ['massage', 'spa', 'relaxing', 'wellness', 'therapy'],
  tea: ['tea', 'hot drink', 'cozy', 'relaxing', 'warm'],
  stargazing: ['stars', 'night sky', 'astronomy', 'peaceful', 'romantic'],

  // Gifts
  flowers: ['flowers', 'bouquet', 'beautiful', 'romantic', 'colorful'],
  books: ['books', 'reading', 'literature', 'knowledge', 'library'],
  jewelry: ['jewelry', 'elegant', 'beautiful', 'precious', 'gift'],
  experience: ['experience', 'adventure', 'memories', 'exciting'],

  // Weather
  sunny: ['sunny', 'bright', 'warm', 'clear sky', 'beautiful'],
  rainy: ['rain', 'rainy', 'water', 'peaceful', 'cozy'],
  snowy: ['snow', 'winter', 'cold', 'beautiful', 'peaceful'],
  cloudy: ['clouds', 'overcast', 'peaceful', 'soft', 'sky'],

  // Rainy day activities
  'movie marathon': [
    'movies',
    'marathon',
    'couch',
    'comfortable',
    'entertainment',
  ],
  baking: ['baking', 'cookies', 'kitchen', 'delicious', 'homemade'],
  puzzles: ['puzzle', 'jigsaw', 'brain', 'challenging', 'fun'],

  // Desserts
  cake: ['cake', 'birthday', 'sweet', 'celebration', 'delicious'],
  pie: ['pie', 'apple pie', 'homemade', 'dessert', 'delicious'],
  cookies: ['cookies', 'baked', 'sweet', 'homemade', 'delicious'],
  fruit: ['fruit', 'healthy', 'fresh', 'colorful', 'natural'],

  // Love expressions
  hugs: ['hugs', 'embrace', 'warm', 'comfort', 'love'],
  gifts: ['gifts', 'presents', 'thoughtful', 'love', 'surprise'],
  words: ['love letter', 'words', 'romantic', 'heartfelt', 'message'],
  time: ['quality time', 'together', 'romantic', 'love', 'connection'],
}

/**
 * Generate enhanced search query from answer label
 */
function generateSearchQuery(label: string): string {
  const lowerLabel = label.toLowerCase().trim()

  // Check if we have specific keywords for this answer
  if (ANSWER_KEYWORD_MAP[lowerLabel]) {
    // Use the first keyword as primary, add context
    const keywords = ANSWER_KEYWORD_MAP[lowerLabel]
    return keywords.slice(0, 2).join(' ') // Use first 2 keywords
  }

  // For answers not in our map, clean and optimize the label
  return label
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
}

/**
 * Fetch image from Unsplash API with enhanced search
 */
async function fetchFromUnsplash(
  query: string,
  questionText?: string
): Promise<ImageSearchResult | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    return null
  }

  try {
    const searchQuery = getContextualSearchQuery(query, questionText)

    // Enhanced search parameters for better results
    const searchParams = new URLSearchParams({
      query: searchQuery,
      per_page: '3', // Get 3 results to have options
      orientation: 'landscape',
      content_filter: 'high', // High quality content
      order_by: 'relevant', // Most relevant first
    })

    const response = await fetch(
      `${UNSPLASH_BASE_URL}/search/photos?${searchParams}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      // Try to find the best image from the results
      const image = data.results[0]

      // Use high-quality image URL
      const imageUrl = image.urls.regular || image.urls.small

      return {
        url: imageUrl,
        alt: image.alt_description || `${query} image`,
        source: 'unsplash',
      }
    }
  } catch (error) {
    console.warn('Failed to fetch from Unsplash:', error)
  }

  return null
}

/**
 * Generate placeholder image URL
 */
function getPlaceholderImage(query: string): ImageSearchResult {
  const searchQuery = generateSearchQuery(query)
  const seed = searchQuery
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return {
    url: `${PLACEHOLDER_BASE_URL}/400/400?random=${seed}`,
    alt: `${query} placeholder image`,
    source: 'placeholder',
  }
}

/**
 * Get fallback gradient background based on query
 */
function getFallbackGradient(query: string): string {
  const colors = [
    'from-purple-400 via-pink-500 to-red-500',
    'from-blue-400 via-purple-500 to-pink-500',
    'from-green-400 via-blue-500 to-purple-500',
    'from-yellow-400 via-red-500 to-pink-500',
    'from-indigo-400 via-purple-500 to-pink-500',
    'from-pink-400 via-red-500 to-yellow-500',
    'from-cyan-400 via-blue-500 to-indigo-500',
    'from-emerald-400 via-teal-500 to-blue-500',
  ]

  const seed = query
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[seed % colors.length]
}

/**
 * Get contextual search query based on question and answer
 */
function getContextualSearchQuery(
  label: string,
  questionText?: string
): string {
  const baseQuery = generateSearchQuery(label)

  if (!questionText) {
    return baseQuery
  }

  // Add context from question text to improve search relevance
  const questionContext = questionText.toLowerCase()

  // Add relevant context keywords based on question type
  if (
    questionContext.includes('weekend') ||
    questionContext.includes('activity')
  ) {
    return `${baseQuery} activity`
  }
  if (
    questionContext.includes('date') ||
    questionContext.includes('romantic')
  ) {
    return `${baseQuery} romantic`
  }
  if (
    questionContext.includes('food') ||
    questionContext.includes('eat') ||
    questionContext.includes('meal')
  ) {
    return `${baseQuery} food`
  }
  if (questionContext.includes('relax') || questionContext.includes('unwind')) {
    return `${baseQuery} relaxing`
  }
  if (
    questionContext.includes('vacation') ||
    questionContext.includes('travel')
  ) {
    return `${baseQuery} travel`
  }
  if (
    questionContext.includes('morning') ||
    questionContext.includes('routine')
  ) {
    return `${baseQuery} morning`
  }
  if (
    questionContext.includes('season') ||
    questionContext.includes('weather')
  ) {
    return `${baseQuery} season`
  }
  if (questionContext.includes('pet') || questionContext.includes('animal')) {
    return `${baseQuery} pet`
  }
  if (questionContext.includes('movie') || questionContext.includes('film')) {
    return `${baseQuery} movie`
  }
  if (questionContext.includes('home') || questionContext.includes('house')) {
    return `${baseQuery} home`
  }
  if (
    questionContext.includes('celebrate') ||
    questionContext.includes('party')
  ) {
    return `${baseQuery} celebration`
  }
  if (questionContext.includes('music') || questionContext.includes('song')) {
    return `${baseQuery} music`
  }
  if (questionContext.includes('gift') || questionContext.includes('present')) {
    return `${baseQuery} gift`
  }

  return baseQuery
}

/**
 * Get local SVG image path for an answer option
 */
function getLocalSvgImage(label: string): ImageSearchResult {
  // Map common labels to their SVG file names
  const svgMapping: Record<string, string> = {
    beach: 'beach.svg',
    mountains: 'mountains.svg',
    'city walk': 'city.svg',
    'stay home': 'home.svg',
    'movie night': 'movie.svg',
    'dinner out': 'restaurant.svg',
    concert: 'concert.svg',
    'game night': 'games.svg',
    pizza: 'pizza.svg',
    'ice cream': 'icecream.svg',
    pasta: 'pasta.svg',
    chocolate: 'chocolate.svg',
    reading: 'reading.svg',
    yoga: 'yoga.svg',
    music: 'music.svg',
    'nature walk': 'nature.svg',
    'tropical island': 'island.svg',
    'european city': 'europe.svg',
    'adventure trip': 'adventure.svg',
    'cultural tour': 'culture.svg',
    'sleep in': 'sleep.svg',
    'coffee & news': 'coffee.svg',
    exercise: 'exercise.svg',
    meditation: 'meditation.svg',
    spring: 'spring.svg',
    summer: 'summer.svg',
    fall: 'fall.svg',
    winter: 'winter.svg',
    dog: 'dog.svg',
    cat: 'cat.svg',
    bird: 'bird.svg',
    fish: 'fish.svg',
    comedy: 'comedy.svg',
    romance: 'romance.svg',
    action: 'action.svg',
    horror: 'horror.svg',
    modern: 'modern.svg',
    cozy: 'cozy.svg',
    minimalist: 'minimalist.svg',
    vintage: 'vintage.svg',
    party: 'party.svg',
    'quiet dinner': 'dinner.svg',
    adventure: 'adventure2.svg',
    'gift exchange': 'gifts.svg',
    brunch: 'brunch.svg',
    shopping: 'shopping.svg',
    sports: 'sports.svg',
    'art gallery': 'art.svg',
    pop: 'pop.svg',
    jazz: 'jazz.svg',
    rock: 'rock.svg',
    classical: 'classical.svg',
    picnic: 'picnic.svg',
    museum: 'museum.svg',
    cooking: 'cooking.svg',
    bath: 'bath.svg',
    massage: 'massage.svg',
    tea: 'tea.svg',
    stargazing: 'stars.svg',
    flowers: 'flowers.svg',
    books: 'books.svg',
    jewelry: 'jewelry.svg',
    experience: 'experience.svg',
    sunny: 'sunny.svg',
    rainy: 'rainy.svg',
    snowy: 'snowy.svg',
    cloudy: 'cloudy.svg',
    'movie marathon': 'marathon.svg',
    baking: 'baking.svg',
    puzzles: 'puzzles.svg',
    cake: 'cake.svg',
    pie: 'pie.svg',
    cookies: 'cookies.svg',
    fruit: 'fruit.svg',
    hugs: 'hugs.svg',
    gifts: 'gifts2.svg',
    words: 'words.svg',
    time: 'time.svg',
  }

  const svgFile = svgMapping[label.toLowerCase()] || 'placeholder.svg'
  const svgPath = `/decks/soft-sweet-visual/${svgFile}`

  return {
    url: svgPath,
    alt: `${label} image`,
    source: 'fallback', // Using fallback source for local SVGs
  }
}

/**
 * Main function to get image for an answer option
 */
export async function getImageForAnswer(
  label: string,
  questionText?: string
): Promise<ImageSearchResult> {
  // If using local images, return SVG path immediately
  if (IMAGE_SOURCE === 'local') {
    return getLocalSvgImage(label)
  }

  // Create cache key that includes question context
  const cacheKey = questionText ? `${label}|${questionText}` : label

  // Check cache first
  const cached = imageCache.get(cacheKey)
  if (cached) {
    return cached
  }

  let result: ImageSearchResult

  // Try Unsplash first with contextual search
  const unsplashResult = await fetchFromUnsplash(label, questionText)
  if (unsplashResult) {
    result = unsplashResult
  } else {
    // Fallback to placeholder
    result = getPlaceholderImage(label)
  }

  // Cache the result
  imageCache.set(cacheKey, result)

  return result
}

/**
 * Get fallback gradient class for when images fail to load
 */
export function getFallbackGradientClass(label: string): string {
  return getFallbackGradient(label)
}

/**
 * Preload multiple images for better performance
 */
export async function preloadAnswerImages(
  labels: string[],
  questionText?: string
): Promise<ImageSearchResult[]> {
  const results = await Promise.all(
    labels.map((label) => getImageForAnswer(label, questionText))
  )

  // For local images, we don't need to preload as they're already available
  if (IMAGE_SOURCE === 'local') {
    return results
  }

  // Preload the actual images for internet sources
  const preloadPromises = results.map((result) => {
    return new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => resolve() // Don't fail if image doesn't load
      img.src = result.url
    })
  })

  await Promise.all(preloadPromises)

  return results
}

/**
 * Clear image cache (useful for testing or memory management)
 */
export function clearImageCache(): void {
  imageCache.clear()
}
