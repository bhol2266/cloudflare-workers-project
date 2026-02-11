import { getVideos } from './getVideos';
import { getVideoCDN } from './getVideoCDN';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/xgroovy/getVideos') {
      return await getVideos(request);
    } else if (path === '/xgroovy/getVideoCDN') {
      return await getVideoCDN(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
