export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return handleCors()
    }

    const url = new URL(request.url)
    const appId = url.searchParams.get("appId")
    const searchQuery = url.searchParams.get("search")

    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try {
      // Search AppId by name
      if (searchQuery)
        return await handleSearchQuery(searchQuery, headers)

      // Fetch game details by AppId
      if (appId)
        return await handleAppDetails(appId, headers)

      return jsonResponse({ error: "Missing appId or search parameter" }, 400)
    } catch (err) {
      return jsonResponse({ error: err.message }, 500)
    }
  }
}

async function handleSearchQuery(searchQuery, headers) {
  const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(searchQuery)}&l=english&cc=US`
  const searchRes = await fetch(searchUrl, { headers })
  
  if (!searchRes.ok) {
    return jsonResponse({ error: `Steam Search HTTP ${searchRes.status}` }, searchRes.status)
  }

  const searchData = await searchRes.json()

  if (searchData.items && searchData.items.length > 0) {
    const cleanQuery = searchQuery.trim().toLowerCase()
    let match = searchData.items.find(item => item.name.toLowerCase() === cleanQuery)

    if (!match) {
      match = searchData.items.find(item => 
        !item.name.toLowerCase().includes('dlc') && 
        !item.name.toLowerCase().includes('expansion') &&
        !item.name.toLowerCase().includes('soundtrack')
      )
    }

    const exactGame = match || searchData.items[0]

    return jsonResponse({
      appId: exactGame.id,
      name: exactGame.name
    })
  }

  return jsonResponse({ error: "Game not found" }, 404)
}

async function handleAppDetails(appId, headers) {
  const [storeData, reviewData] = await Promise.all([
    fetchStoreDetails(appId, headers),
    fetchReviewSummary(appId, headers)
  ])

  const payload = {
    store: storeData ? storeData[appId] || null : null,
    reviews: reviewData
  }

  return jsonResponse(payload)
}

async function fetchStoreDetails(appId, headers) {
  const storeUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=english`
  const res = await fetch(storeUrl, { headers })

  return res.ok ? await res.json() : null
}

async function fetchReviewSummary(appId, headers) {
  const reviewUrl = `https://store.steampowered.com/appreviews/${appId}?json=1&language=english`
  const res = await fetch(reviewUrl, { headers })

  if (!res.ok)
    return null

  const data = await res.json()
  return data.query_summary || null
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  })
}

function handleCors() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    }
  })
}