export class Game {
  constructor({ appId, url, name = '', price = -1, discountPercent = 0, hasDemo = false, reviewScorePercent = -1, released = false, releaseDate = '' }) {
    this.appId = appId
    this.url = url
    this.name = name
    this.price = price
    this.discountPercent = discountPercent
    this.hasDemo = hasDemo
    this.reviewScorePercent = reviewScorePercent
    this.released = released
    this.releaseDate = releaseDate
  }

  get isOnSale() {
    return this.discountPercent > 0
  }
}