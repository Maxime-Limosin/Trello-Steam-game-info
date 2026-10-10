# Trello-Steam-game-info

_Steam game info_ is a Trello Power-Up to display Steam game details on your cards to easily manage your gaming backlog.

## Architecture

```text
Trello Board ➔ Front-End (GitHub Pages) ➔ Cloudflare Worker Proxy ➔ Steam API
```

1. Trello Board: Load the Power-up _Steam game info_

2. Front-End: Static HTML/JS ES6 modules (this project) exposed by Github Pages through URL _https://maxime-limosin.github.io/Trello-Steam-game-info_

3. Proxy (Cloudflare Worker): Bypasses browser CORS restrictions, fetches Steam data, and formats responses in English (_cloudflare-proxy.js_ file)

4. Steam API: Provides a JSON when given an [_appId_](https://store.steampowered.com/api/appdetails?appids=230410)

## Local Development Setup
This is more of a reminder for myself as I guess no one will use this part. In order to run the frontend locally, you'll need
1. A server to serve files 
 ```bash
 python -m http.server 8000
 ```
 2. A way to expose your local server over HTTPS (in my case with [cloudflared](https://developers.cloudflare.com/tunnel/downloads/))
  ```bash
 .\cloudflared.exe tunnel --url http://127.0.0.1:8000
 ```
 3. Update your Power--Up (this is terribly crappy, but I haven't found a way in trello to miror the Power-up between a dev/prod environments):
  - Go to [your app dash board](https://trello.com/apps/admin)
  - Find your app
  - Change connector URL to match the one provided by cloudflared (seek for URL in the terminal)
