import { getVideoplayer } from './getVideoplayer';
import { getVideoCDN } from './getVideoCDN';
import { getHomepageVideos } from './getHomepageVideos';
import { getVideos } from './getVideos';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/xgroovy/getVideoplayer') {
      return await getVideoplayer(request);
    } else if (path === '/xgroovy/getVideoCDN') {
      return await getVideoCDN(request);

    } else if (path === '/xgroovy/getHomepageVideos') {
      return await getHomepageVideos(request);

    } else if (path === '/xgroovy/getVideos') {
      return await getVideos(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
