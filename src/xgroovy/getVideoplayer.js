import { load } from "cheerio";
import { extractVideoThumbnailData } from "./shared-utils.js";

// CORS headers - only enabled for this API
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};


function extractPosterUrl($) {
  let poster = null;
  
  $("script").each((i, el) => {
    const scriptContent = $(el).html();
    if (scriptContent && scriptContent.includes("var poster_url")) {
      const match = scriptContent.match(/var\s+poster_url\s*=\s*"([^"]+)"/);
      if (match) {
        poster = match[1];
        return false; // Break the loop
      }
    }
  });
  
  return poster;
}


function extractSchemaData($) {
  const schemaScript = $('script[type="application/ld+json"]').html();
  if (schemaScript) {
    try {
      return JSON.parse(schemaScript);
    } catch (e) {
      console.error('Error parsing schema:', e);
    }
  }
  return {};
}


async function resolveVideoCDN(videoSources) {
  if (!Array.isArray(videoSources) || videoSources.length === 0) {
    return videoSources;
  }

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

      // Fallback for CDNs that block HEAD requests
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
        src: response.url // Replace with final CDN URL
      };
    } catch (e) {
      // Return original source with error flag if resolution fails
      return { ...source, error: "Failed to resolve" };
    }
  });

  // Execute all resolutions simultaneously
  return await Promise.all(resolutionPromises);
}

/**
 * Scrape video player page data
 * @param {string} html - HTML content
 * @returns {Object} Object containing videoDetails and relatedVideos
 */
function scrapeVideoData(html) {
  const $ = load(html);

  // Initialize video details object
  const videoDetails = {
    title: $('.page-title h1').text().trim() || null,
    duration: $('.page-title .badge.duration').text().trim() || null,
    quality: $('.page-title .badge.quality').text().trim() || null,
    views: $('.page-title .badge.views').text().trim() || null,
    tags: [],
    pornstar: null,
    likes: null,
    dislikes: null,
    ratingPercentage: null,
    description: null,
    videoSources: [],
    poster: null,
    uploadDate: null,
    commentsCount: null
  };

  // Extract poster URL
  videoDetails.poster = extractPosterUrl($);

  // Extract tags and pornstar
  $('.meta-data .default-list li').each((i, elem) => {
    const $elem = $(elem);
    
    if ($elem.hasClass('item-model')) {
      // Extract pornstar info
      const pornstarName = $elem.find('a').text().replace(/\s+/g, ' ').trim().replace(/^\S+\s/, '');
      if (pornstarName) {
        videoDetails.pornstar = {
          name: pornstarName,
          url: $elem.find('a').attr('href') || null,
          count: $elem.find('.count').text().trim() || null
        };
      }
    } else {
      // Extract tags
      const tag = $elem.find('a').text().trim();
      const url = $elem.find('a').attr('href');
      if (tag) {
        videoDetails.tags.push({ tag, url: url || null });
      }
    }
  });

  // Extract rating information
  videoDetails.likes = $('.rate-like span').text().trim() || null;
  videoDetails.dislikes = $('.rate-dislike span').text().trim() || null;

  // Calculate rating percentage
  if (videoDetails.likes && videoDetails.dislikes) {
    const likes = parseInt(videoDetails.likes.replace(/,/g, ''));
    const dislikes = parseInt(videoDetails.dislikes.replace(/,/g, ''));
    if (!isNaN(likes) && !isNaN(dislikes)) {
      const total = likes + dislikes;
      if (total > 0) {
        videoDetails.ratingPercentage = Math.round((likes / total) * 100) + '%';
      }
    }
  }

  // Extract description
  videoDetails.description = $('.block-details .info .item').text().trim() || null;

  // Extract video sources
  $('video source').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src) {
      videoDetails.videoSources.push({
        src,
        type: $(elem).attr('type') || null,
        quality: $(elem).attr('title') || null,
        isHD: $(elem).attr('data-fluid-hd') === 'true'
      });
    }
  });

  // Extract schema.org data
  const schemaData = extractSchemaData($);
  if (schemaData.uploadDate) {
    videoDetails.uploadDate = schemaData.uploadDate;
  }
  if (schemaData.commentCount !== undefined) {
    videoDetails.commentsCount = schemaData.commentCount;
  }

  // Extract related videos
  const relatedVideos = [];
  $('#list_videos_custom_related_sphinx_videos_items .item').each((i, elem) => {
    const video = extractVideoThumbnailData($, $(elem));
    if (video && video.id) {
      relatedVideos.push(video);
    }
  });

  return {
    videoDetails,
    relatedVideos
  };
}

/**
 * API endpoint to get video player details
 * Accepts POST requests with video URL
 * CORS enabled for cross-origin requests
 * @param {Request} request - Request object
 * @returns {Promise<Response>} Response with video details and related videos
 */
export async function getVideoplayer(request) {
  // Handle preflight OPTIONS request for CORS
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate request method
  if (request.method !== "POST") {
    return new Response(JSON.stringify({
      success: false,
      message: "Only POST requests are allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }

  try {
    // Parse request body
    const body = await request.json();
    const url = body.url;

    // Validate URL parameter
    if (!url) {
      return new Response(JSON.stringify({
        success: false,
        message: "URL is required in request body"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    // Fetch the video page HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Referer': 'https://xgroovy.com/',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Scrape the data
    const scrapedData = scrapeVideoData(html);

    // Resolve CDN URLs for video sources
    if (scrapedData.videoDetails.videoSources.length > 0) {
      scrapedData.videoDetails.videoSources = await resolveVideoCDN(
        scrapedData.videoDetails.videoSources
      );
    }

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      videoDetails: scrapedData.videoDetails,
      relatedVideos: scrapedData.relatedVideos,
      relatedCount: scrapedData.relatedVideos.length
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error("Error in getVideoplayer:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Internal Server Error",
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
