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
      let priceText = 'Free'
      let discountPercent = 0

      if (!rawGame.is_free && rawGame.price_overview) {
        priceText = rawGame.price_overview.final_formatted
        discountPercent = rawGame.price_overview.discount_percent || 0
      }

      // Check for playable demo
      const hasDemo = Array.isArray(rawGame.demos) && rawGame.demos.length > 0

      // Fetch review score
      let reviewText = null
      if (data.reviews && data.reviews.total_reviews > 0) {
        const { total_reviews: total, total_positive: positive } = data.reviews
        const scorePercent = Math.round((positive / total) * 100)
        reviewText = `${scorePercent}% Positive`
      }

      const steamGame = new Game({
        appId,
        url,
        name: rawGame.name,
        priceText,
        discountPercent,
        hasDemo,
        reviewText
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