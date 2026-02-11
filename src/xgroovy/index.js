import { getVideoplayer } from './getVideoplayer';
import { getVideoCDN } from './getVideoCDN';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/xgroovy/getVideoplayer') {
      return await getVideoplayer(request);
    } else if (path === '/xgroovy/getVideoCDN') {
      return await getVideoCDN(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
