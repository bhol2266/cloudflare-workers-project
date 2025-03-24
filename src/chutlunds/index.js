
import { getVideos } from './getVideos';
import { getHomePageVideos } from './getHomePageVideos';
import { getChannelVideos } from './getChannelVideos';
import { getTrendingChannels } from './getTrendingChannels';
import { getTrendingSearchTags } from './getTrendingSearchTags.js';
import { getPornstarVideos } from './getPornstarVideos';


export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/chutlunds/getVideos') {
  
      return await getVideos(request);
    } else if (path === '/chutlunds/getHomePageVideos') {
      return await getHomePageVideos(request);

    } else if (path === '/chutlunds/getChannelVideos') {
      return await getChannelVideos(request);
    
    } else if (path === '/chutlunds/getTrendingChannels') {
      return await getTrendingChannels(request);
    }
    else if (path === '/chutlunds/getTrendingSearchTags') {
      return await getTrendingSearchTags(request);
    }
    else if (path === '/chutlunds/getPornstarVideos') {
      return await getPornstarVideos(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};