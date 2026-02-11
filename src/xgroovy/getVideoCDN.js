export async function getVideoCDN(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  try {
    const body = await request.json();
    const videoSources = body.videoSources;

    if (!Array.isArray(videoSources)) {
      throw new Error("Invalid input: videoSources must be an array");
    }

    // Map each source to a resolution promise
    const resolutionPromises = videoSources.map(async (source) => {
      try {
        // Attempt fast HEAD request first
        let response = await fetch(source.src, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://xgroovy.com/',
          },
          redirect: 'follow',
        });

        // Fallback for CDNs that block HEAD
        if (response.status === 405 || response.status === 403) {
          response = await fetch(source.src, {
            method: 'GET',
            headers: { 'Range': 'bytes=0-0' },
            redirect: 'follow',
          });
          if (response.body) await response.body.cancel();
        }

        return {
          ...source,
          src: response.url // Replace original URL with the final CDN URL
        };
      } catch (e) {
        // If one fails, return original or null to keep the array intact
        return { ...source, error: "Failed to resolve" };
      }
    });

    // EXECUTE ALL SIMULTANEOUSLY
    const resolvedSources = await Promise.all(resolutionPromises);

    return new Response(JSON.stringify({ 
      success: true, 
      videoSources: resolvedSources 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=1800", // Cache results for 30 mins
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}