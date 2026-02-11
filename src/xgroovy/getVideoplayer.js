import { load } from "cheerio";

function scrapeVideoData(html) {
  const $ = load(html);

  let poster = null;

  $("script").each((i, el) => {
    const scriptContent = $(el).html();

    if (scriptContent && scriptContent.includes("var poster_url")) {
      const match = scriptContent.match(/var\s+poster_url\s*=\s*"([^"]+)"/);
      if (match) {
        poster = match[1];
      }
    }
  });


  // Video Details
  const videoDetails = {
    title: $('.page-title h1').text().trim(),
    duration: $('.page-title .badge.duration').text().trim(),
    quality: $('.page-title .badge.quality').text().trim(),
    views: $('.page-title .badge.views').text().trim(),


    // Tags/Keywords
    tags: [],

    // Pornstar
    pornstar: null,

    // Rating
    likes: null,
    dislikes: null,
    ratingPercentage: null,

    // Description
    description: null,

    // Video Sources
    videoSources: [],


    // Upload Info
    uploadDate: null,

    // Comments
    commentsCount: null
  };


  // Extract tags
  $('.meta-data .default-list li').each((i, elem) => {
    const $elem = $(elem);
    if ($elem.hasClass('item-model')) {
      videoDetails.pornstar = {
        name: $elem.find('a').text().replace(/\s+/g, ' ').trim().replace(/^\S+\s/, ''),
        url: $elem.find('a').attr('href'),
        count: $elem.find('.count').text().trim()
      };
    } else {
      const tag = $elem.find('a').text().trim();
      const url = $elem.find('a').attr('href');
      if (tag) {
        videoDetails.tags.push({ tag, url });
      }
    }
  });

  // Extract likes/dislikes
  videoDetails.likes = $('.rate-like span').text().trim();
  videoDetails.dislikes = $('.rate-dislike span').text().trim();

  // Extract description
  videoDetails.description = $('.block-details .info .item').text().trim();
  videoDetails.poster = poster;

  // Extract video sources
  $('video source').each((i, elem) => {
    videoDetails.videoSources.push({
      src: $(elem).attr('src'),
      type: $(elem).attr('type'),
      quality: $(elem).attr('title'),
      isHD: $(elem).attr('data-fluid-hd') === 'true'
    });
  });



  // Extract upload date from schema
  const schemaScript = $('script[type="application/ld+json"]').html();
  if (schemaScript) {
    try {
      const schema = JSON.parse(schemaScript);
      videoDetails.uploadDate = schema.uploadDate;
      videoDetails.commentsCount = schema.commentCount;
    } catch (e) {
      console.error('Error parsing schema:', e);
    }
  }

  // Related Videos
  const relatedVideos = [];

  $('#list_videos_custom_related_sphinx_videos_items .item').each((i, elem) => {
    const $item = $(elem);

    const video = {
      id: $item.attr('data-video-id'),
      title: $item.find('.title').text().trim(),
      url: $item.find('a.popito').attr('href'),
      thumbnail: $item.find('img.thumb').attr('data-jpg') || $item.find('img.thumb').attr('src'),
      duration: $item.find('.duration').text().trim(),
      views: $item.find('.views').text().trim(),
      quality: null,
      fps: null,
      rating: null,

      // Author/Channel info
      author: null,
      authorUrl: null,
      authorType: null, // 'pornstar' or 'channel'

      // Preview video
      previewVideo: $item.find('img.thumb').attr('data-preview')
    };

    // Extract quality
    const qualityBadge = $item.find('.item-quality span.is-hd').text().trim();
    if (qualityBadge) {
      video.quality = qualityBadge;
    }

    // Extract FPS
    const fpsBadge = $item.find('.item-quality span.high-fps').text().trim();
    if (fpsBadge) {
      video.fps = fpsBadge;
    }

    // Extract rating
    const ratingText = $item.find('.rating').text().trim();
    if (ratingText) {
      video.rating = ratingText;
    }

    // Extract author (pornstar or channel)
    const authorLink = $item.find('.author-link a');
    if (authorLink.length) {
      video.author = authorLink.text().replace(/\s+/g, ' ').trim().replace(/^\S+\s/, '');
      video.authorUrl = authorLink.attr('href');

      if (authorLink.find('i.mi.star').length) {
        video.authorType = 'pornstar';
      } else if (authorLink.find('i.mi.videocam').length) {
        video.authorType = 'channel';
      }
    }

    relatedVideos.push(video);
  });

  return {
    videoDetails,
    relatedVideos
  };
}

// Integrated function to resolve CDN URLs
async function resolveVideoCDN(videoSources) {
  if (!Array.isArray(videoSources) || videoSources.length === 0) {
    return videoSources;
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
      // If one fails, return original source with error flag
      return { ...source, error: "Failed to resolve" };
    }
  });

  // Execute all simultaneously
  const resolvedSources = await Promise.all(resolutionPromises);
  return resolvedSources;
}

export async function getVideoplayer(request) {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ message: "Only POST requests are allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }

  try {
    const requestBody = await request.json();
    let url = requestBody.url;

    const response = await fetch(url);
    const html = await response.text();

    const scrapedData = scrapeVideoData(html);

    // Resolve CDN URLs for video sources
    if (scrapedData.videoDetails.videoSources.length > 0) {
      scrapedData.videoDetails.videoSources = await resolveVideoCDN(scrapedData.videoDetails.videoSources);
    }

    return new Response(JSON.stringify({
      videoDetails: scrapedData.videoDetails,
      relatedVideos: scrapedData.relatedVideos,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
