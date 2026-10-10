import { SteamService } from './services/steamservice.js'

// Initialize the service instance
const steamService = new SteamService()

function mapGameToBadges(game) {
  if (!game) return []

  const badges = []

  // Price Badge
  badges.push({
    text: game.priceBadgeText,
    color: game.isOnSale ? 'green' : 'gray'
  })

  // Review Badge
  if (game.reviewText) {
    badges.push({
      text: game.reviewText,
      color: 'blue'
    })
  }

  // Demo Badge
  if (game.hasDemo) {
    badges.push({
      text: 'Démo dispo',
      color: 'yellow'
    })
  }

  return badges
}

// Register Trello Power-Up capabilities
TrelloPowerUp.initialize({
  'card-badges': function(t, options) {
    return t.card('attachments')
      .then(async function(card) {
        // Find the first Steam attachment link on the card
        const steamAttachment = card.attachments.find(att => 
          att.url && att.url.includes('store.steampowered.com/app/')
        )

        if (!steamAttachment) return []

        const game = await steamService.getGameInfo(steamAttachment.url)
        return mapGameToBadges(game)
      })
  }
})