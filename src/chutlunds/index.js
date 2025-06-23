
import { getVideos } from './getVideos';
import { getHomePageVideos } from './getHomepageVideos.js';
import { getChannelVideos } from './getChannelVideos';
import { getTrendingChannels } from './getTrendingChannels';
import { getTrendingSearchTags } from './getTrendingSearchTags.js';
import { getPornstarVideos } from './getPornstarVideos';
import { getCreators } from './getCreators.js';
import {getCreatorsPage} from './getCreatorsPage.js';

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
    else if (path === '/chutlunds/getCreators') {
      return await getCreators(request);
    }
    else if (path === '/chutlunds/getCreatorsPage') {
      return await getCreatorsPage(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};