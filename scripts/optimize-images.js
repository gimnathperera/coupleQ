const fs = require('fs')
const path = require('path')

// Simple, optimized SVG template
const createOptimizedSVG = (label, color) => {
  const colors = {
    action: '#DC143C',
    adventure: '#FF6347',
    adventure2: '#FF6347',
    art: '#9370DB',
    baking: '#D2691E',
    bath: '#87CEEB',
    beach: '#F0E68C',
    beach2: '#F0E68C',
    bird: '#32CD32',
    books: '#8B4513',
    brunch: '#FFD700',
    cake: '#FFB6C1',
    cat: '#FFA500',
    chocolate: '#8B4513',
    city: '#708090',
    classical: '#4B0082',
    cloudy: '#B0C4DE',
    coffee: '#8B4513',
    comedy: '#FFD700',
    concert: '#FF1493',
    cooking: '#FF6347',
    cozy: '#DEB887',
    dance: '#FF69B4',
    date: '#FFB6C1',
    dessert: '#FFB6C1',
    dinner: '#8B4513',
    dog: '#FFA500',
    drama: '#800080',
    drive: '#4169E1',
    family: '#32CD32',
    fantasy: '#9370DB',
    flowers: '#FF69B4',
    food: '#FF6347',
    games: '#FF4500',
    garden: '#32CD32',
    gift: '#FFD700',
    hiking: '#228B22',
    horror: '#8B0000',
    house: '#DEB887',
    jazz: '#4B0082',
    kiss: '#FF69B4',
    lake: '#4169E1',
    letter: '#FFB6C1',
    love: '#FF69B4',
    massage: '#DEB887',
    movie: '#000000',
    music: '#4B0082',
    nature: '#32CD32',
    night: '#191970',
    ocean: '#4169E1',
    park: '#32CD32',
    party: '#FF1493',
    picnic: '#32CD32',
    pizza: '#FF6347',
    pop: '#FF1493',
    rain: '#4682B4',
    reading: '#8B4513',
    restaurant: '#8B4513',
    rock: '#696969',
    romance: '#FF69B4',
    romantic: '#FF69B4',
    run: '#32CD32',
    science: '#00CED1',
    shopping: '#FFD700',
    sleep: '#191970',
    snow: '#F0F8FF',
    spa: '#DEB887',
    sport: '#32CD32',
    spring: '#98FB98',
    star: '#FFD700',
    summer: '#FFD700',
    sun: '#FFD700',
    sunset: '#FF6347',
    surprise: '#FFD700',
    sweet: '#FFB6C1',
    swim: '#00CED1',
    tea: '#8B4513',
    time: '#FFD700',
    travel: '#4169E1',
    walk: '#32CD32',
    water: '#4169E1',
    winter: '#F0F8FF',
    yoga: '#32CD32'
  }

  const bgColor = colors[label] || '#6B7280'
  
  return `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="${bgColor}" rx="12"/>
  <text x="100" y="110" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${label}</text>
</svg>`
}

// Get all SVG files in the directory
const deckDir = path.join(__dirname, '../public/decks/soft-sweet-visual')
const files = fs.readdirSync(deckDir).filter(file => file.endsWith('.svg'))

console.log(`Found ${files.length} SVG files to optimize...`)

let totalSizeBefore = 0
let totalSizeAfter = 0

files.forEach(file => {
  const filePath = path.join(deckDir, file)
  const label = file.replace('.svg', '')
  
  // Get original size
  const originalSize = fs.statSync(filePath).size
  totalSizeBefore += originalSize
  
  // Create optimized SVG
  const optimizedSVG = createOptimizedSVG(label, null)
  
  // Write optimized file
  fs.writeFileSync(filePath, optimizedSVG)
  
  // Get new size
  const newSize = fs.statSync(filePath).size
  totalSizeAfter += newSize
  
  console.log(`${file}: ${originalSize}B → ${newSize}B (${Math.round((1 - newSize/originalSize) * 100)}% reduction)`)
})

console.log(`\nTotal size reduction: ${totalSizeBefore}B → ${totalSizeAfter}B`)
console.log(`Space saved: ${totalSizeBefore - totalSizeAfter}B (${Math.round((1 - totalSizeAfter/totalSizeBefore) * 100)}% reduction)`)
