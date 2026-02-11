import { load } from "cheerio";
import { extractVideoThumbnailData } from "./shared-utils.js";


function scrapeHomepageVideos(html) {
  const $ = load(html);

  // Extract trending videos
  const trendingVideos = [];
  $('#list_videos_custom_top_country_videos_items .item').each((i, elem) => {
    const video = extractVideoThumbnailData($, $(elem));
    if (video && video.id) {
      trendingVideos.push(video);
    }
  });

  // Extract new videos
  const newVideos = [];
  $('#list_videos_most_recent_videos_items .item').each((i, elem) => {
    const video = extractVideoThumbnailData($, $(elem));
    if (video && video.id) {
      newVideos.push(video);
    }
  });

  return {
    trendingVideos,
    newVideos
  };
}


export async function getHomepageVideos(request) {
  // Validate request method
  if (request.method !== "GET" && request.method !== "POST") {
    return new Response(JSON.stringify({
      success: false,
      message: "Only GET and POST requests are allowed"
    }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Parse URL from request body if POST
    let url = "https://xgroovy.com/";
    if (request.method === "POST") {
      try {
        const body = await request.json();
        if (body.url) url = body.url;
      } catch (e) {
        // Use default URL if parsing fails
      }
    }

    // Fetch the homepage HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Scrape the data
    const scrapedData = scrapeHomepageVideos(html);

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      data: {
        trendingVideos: scrapedData.trendingVideos,
        trendingCount: scrapedData.trendingVideos.length,
        newVideos: scrapedData.newVideos,
        newCount: scrapedData.newVideos.length,
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error in getHomepageVideos:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Internal Server Error",
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
