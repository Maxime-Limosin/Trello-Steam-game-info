TrelloPowerUp.initialize({
  'card-badges': function(t, options) {
    return t.card('attachments')
      .then(function(card) {
        const steamAttachment = card.attachments.find(att => 
          att.url && att.url.includes('store.steampowered.com/app/')
        );

        if (!steamAttachment) {
          return [];
        }

        const match = steamAttachment.url.match(/\/app\/(\d+)/);
        const appId = match ? match[1] : null;

        return [
          {
            text: '19,99 € (-50%)',
            color: 'green'
          },
          {
            text: '92% Positif',
            color: 'blue'
          },
          {
            text: 'Démo dispo',
            color: 'yellow'
          }
        ];
      });
  }
});