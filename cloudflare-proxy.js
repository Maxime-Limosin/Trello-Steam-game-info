export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      })
    }

    const url = new URL(request.url)
    const appId = url.searchParams.get("appId")

    if (!appId) {
      return new Response(JSON.stringify({ error: "Missing appId parameter" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      })
    }

    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0 Win64 x64)"
    }

    try {
      const storeUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=english`
      const storeRes = await fetch(storeUrl, { headers })
      const storeData = await storeRes.json()

      const reviewUrl = `https://store.steampowered.com/appreviews/${appId}?json=1&language=english`
      const reviewRes = await fetch(reviewUrl, { headers })
      const reviewData = await reviewRes.json()

      const payload = {
        store: storeData[appId] || null,
        reviews: reviewData.query_summary || null
      }

      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      })
    }
  }
}