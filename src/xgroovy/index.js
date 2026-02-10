import { getVideos } from './getVideos';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/xgroovy/getVideos') {
      return await getVideos(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
