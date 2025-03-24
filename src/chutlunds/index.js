
import { getVideos } from './getVideos';
import { getHomepageVideos } from './getHomepageVideos';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/chutlunds/getVideos') {
      return await getVideos();
    } else if (path === '/chutlunds/getHomepageVideos') {
      return await getHomepageVideos();
    }

    return new Response('Not Found', { status: 404 });
  }
};