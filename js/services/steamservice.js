import { Game } from '../models/game.js'

export class SteamService {
  constructor() {
    this.cache = new Map()
    this.workerUrl = 'https://trello-steam-proxy.afougue63.workers.dev'
  }

  extractAppId(url) {
    if (!url || !url.includes('store.steampowered.com/app/')) {
      return null
    }
    const match = url.match(/\/app\/(\d+)/)
    return match ? match[1] : null
  }

  async getGameInfo(url) {
    const appId = this.extractAppId(url)
    if (!appId) return null

    if (this.cache.has(appId)) {
      return this.cache.get(appId)
    }

    try {
      const response = await fetch(`${this.workerUrl}?appId=${appId}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()

      if (!data.store || !data.store.success) return null

      const rawGame = data.store.data

      // Extract price info
      let priceEuros = -1
      let discountPercent = 0

      if (!rawGame.is_free && rawGame.price_overview) {
        priceEuros = rawGame.price_overview.final/100 // Convert raw 1999 to 19,99
        discountPercent = rawGame.price_overview.discount_percent || 0
      }

      // Check for playable demo
      const hasDemo = Array.isArray(rawGame.demos) && rawGame.demos.length > 0

      // Fetch review score
      let reviewScorePercent = -1
      if (data.reviews && data.reviews.total_reviews > 0) {
        const { total_reviews: total, total_positive: positive } = data.reviews
        reviewScorePercent = Math.round((positive / total) * 100)
      }

      // Fetch release info
      const released = !rawGame.release_date.coming_soon
      const releaseDate = rawGame.release_date.date

      const steamGame = new Game({
        appId,
        url,
        name: rawGame.name,
        price: priceEuros,
        discountPercent,
        hasDemo,
        reviewScorePercent,
        released,
        releaseDate
      })

      // Save to cache
      this.cache.set(appId, steamGame)
      return steamGame

    } catch (error) {
      console.error(`[SteamService] Error fetching data for AppID ${appId}:`, error)
      return null
    }
  }
}