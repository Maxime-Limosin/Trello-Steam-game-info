export class Game {
  constructor({ appId, url, name = '', price = -1, discountPercent = 0, hasDemo = false, reviewScorePercent = -1 }) {
    this.appId = appId
    this.url = url
    this.name = name
    this.price = price
    this.discountPercent = discountPercent
    this.hasDemo = hasDemo
    this.reviewScorePercent = reviewScorePercent
  }

  get isOnSale() {
    return this.discountPercent > 0
  }
}