import { load } from "cheerio";





function scrapeVideoData(html) {
  const $ = load(html);

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

    // Poster/Thumbnail
    poster: null,

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

  // Extract video sources
  $('video source').each((i, elem) => {
    videoDetails.videoSources.push({
      src: $(elem).attr('src'),
      type: $(elem).attr('type'),
      quality: $(elem).attr('title'),
      isHD: $(elem).attr('data-fluid-hd') === 'true'
    });
  });

  // Extract poster
  videoDetails.poster = $('video').attr('poster');

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













export async function getVideos(request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ message: "Only POST requests are allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {

    const requestBody = await request.json();
    let url = requestBody.url;


    const response = await fetch(url);
    const html = await response.text();




    const scrapedData = scrapeVideoData(html);



    return new Response(JSON.stringify({
      videoDetails: scrapedData.videoDetails,
      relatedVideos: scrapedData.relatedVideos
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
