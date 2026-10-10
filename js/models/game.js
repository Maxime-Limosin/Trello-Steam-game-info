export class Game {
  constructor({ appId, url, name = '', priceText = 'N/A', discountPercent = 0, hasDemo = false, reviewText = null }) {
    this.appId = appId
    this.url = url
    this.name = name
    this.priceText = priceText
    this.discountPercent = discountPercent
    this.hasDemo = hasDemo
    this.reviewText = reviewText

    console.log('[SteamGame Instance Created]:', {
      appId: this.appId,
      name: this.name,
      priceBadge: this.priceBadgeText,
      hasDemo: this.hasDemo,
      reviewText: this.reviewText,
      url: this.url
    })
  }

  get isOnSale() {
    return this.discountPercent > 0
  }

  get priceBadgeText() {
    if (this.isOnSale)
      return `${this.priceText} (-${this.discountPercent}%)`
    
    return this.priceText
  }
}