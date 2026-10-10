import { ensureCardCover } from './coverHandler.js'

export async function getCardBadges(t, steamService) {
  const card = await t.card('attachments', 'cover')

  const steamAttachment = card.attachments.find(att =>
    att.url && att.url.includes('store.steampowered.com/app/'))

  if (!steamAttachment)
    return []

  const game = await steamService.getGameInfo(steamAttachment.url)
  if (!game)
    return []

  await ensureCardCover(t, game, card)
  return mapGameToBadges(game)
}

function mapGameToBadges(game) {
  if (!game) return []

  const badges = []

  // Price Badge
  badges.push({
    text: createPriceText(game),
    color: game.isOnSale || game.price <= 0 ? 'green' : 'light-gray'
  })

  // Review Badge
  if (game.reviewScorePercent >= 0) {
    badges.push({
      text: createReviewText(game),
      color: game.reviewScorePercent >= 70 ? 'blue' : 'red'
    })
  }

  // Demo Badge
  if (game.hasDemo) {
    badges.push({
      text: 'Demo',
      color: 'yellow'
    })
  }

  // Release date Badge
  if (!game.released) {
    badges.push({
      text: game.releaseDate,
      color: 'orange'
    })
  }

  return badges
}

function createPriceText(game) {
  if (game.price <= 0)
    return 'Free'

  if (game.isOnSale)
    return `${game.price}€ (-${game.discountPercent}%)`

  return `${game.price}€`
}

function createReviewText(game) {
  if (game.reviewScorePercent < 0)
    return ''
  return `${game.reviewScorePercent}% Positive`
}