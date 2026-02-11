import { load } from "cheerio";

/**
 * Extract video thumbnail details from a video item element
 * Used across different API endpoints to maintain consistency
 * @param {CheerioStatic} $ - Cheerio instance
 * @param {Cheerio} $item - Video item element
 * @returns {Object} Video data object with thumbnail details
 */
export function extractVideoThumbnailData($, $item) {
  const video = {
    id: $item.attr('data-video-id') || null,
    title: $item.find('.title').text().trim() || null,
    url: $item.find('a.popito').attr('href') || null,
    thumbnail: $item.find('img.thumb').attr('data-jpg') || $item.find('img.thumb').attr('src') || null,
    duration: $item.find('.duration').text().trim() || null,
    views: $item.find('.views').text().trim() || null,
    quality: null,
    fps: null,
    rating: null,
    author: null,
    authorUrl: null,
    authorType: null, // 'pornstar' or 'channel'
    previewVideo: $item.find('img.thumb').attr('data-preview') || null
  };

  // Extract quality (720p, 1080p, etc.)
  const qualityBadge = $item.find('.item-quality span.is-hd').text().trim();
  if (qualityBadge) {
    video.quality = qualityBadge;
  }

  // Extract FPS
  const fpsBadge = $item.find('.item-quality span.high-fps').text().trim();
  if (fpsBadge) {
    video.fps = fpsBadge;
  }

  // Extract rating - clean up the percentage
  const ratingText = $item.find('.rating').text().trim();
  if (ratingText) {
    video.rating = ratingText.replace(/\s+/g, ''); // Remove extra spaces
  }

  // Extract author (pornstar or channel)
  const authorLink = $item.find('.author-link a');
  if (authorLink.length) {
    // Clean up author name by removing icon text
    const rawAuthorText = authorLink.text().replace(/\s+/g, ' ').trim();
    video.author = rawAuthorText.replace(/^\S+\s/, ''); // Remove first word (icon text)
    video.authorUrl = authorLink.attr('href');

    // Determine author type based on icon
    if (authorLink.find('i.mi.star').length) {
      video.authorType = 'pornstar';
    } else if (authorLink.find('i.mi.videocam').length) {
      video.authorType = 'channel';
    }
  }

  return video;
}
