export async function ensureCardCover(t, game, card) {
  if (!game || !game.headerImage)
    return

  if (card.cover && (card.cover.url || card.cover.idAttachment))
    return

  const imageAlreadyAttached = card.attachments.some(att =>
    att.url && (att.url === game.headerImage || att.name.includes('Steam Cover')))

  if (imageAlreadyAttached)
    return

  try {
    await t.attach({
      name: `${game.name} - Steam Cover`,
      url: game.headerImage
    })
  } catch (error) {
    console.error('[SteamGameInfo] Error attaching image:', error)
  }
}