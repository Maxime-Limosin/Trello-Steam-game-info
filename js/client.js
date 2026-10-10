import { SteamService } from './services/steamservice.js'
import { getCardBadges } from './handlers/cardBadgesHandler.js'

const steamService = new SteamService()

// Bind handlers to Trello
TrelloPowerUp.initialize({
  'card-badges': function(t, options) {
    return getCardBadges(t, steamService)
  }
})