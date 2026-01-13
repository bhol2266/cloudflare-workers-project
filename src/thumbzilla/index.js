
import { getVideoPlayer } from './getVideoPlayer';
import { getHomePageVideos } from './getHomepageVideos.js';
import { getChannelVideos } from './getChannelVideos';
import { getTrendingChannels } from './getTrendingChannels';
import { getTrendingSearchTags } from './getTrendingSearchTags.js';
import { getPornstarVideos } from './getPornstarVideos';
import { getCreators } from './getCreators.js';
import {getCreatorsPage} from './getCreatorsPage.js';
import { getTrendingPornstars } from './getTrendingPornstars.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/thumbzilla/getVideoPlayer') {
  
      return await getVideoPlayer(request);
    } else if (path === '/thumbzilla/getHomePageVideos') {
      return await getHomePageVideos(request);

    } else if (path === '/thumbzilla/getChannelVideos') {
      return await getChannelVideos(request);
    
    } else if (path === '/thumbzilla/getTrendingChannels') {
      return await getTrendingChannels(request);
    }
    else if (path === '/thumbzilla/getTrendingSearchTags') {
      return await getTrendingSearchTags(request);
    }
    else if (path === '/thumbzilla/getPornstarVideos') {
      return await getPornstarVideos(request);
    }
    else if (path === '/thumbzilla/getCreators') {
      return await getCreators(request);
    }
    else if (path === '/thumbzilla/getCreatorsPage') {
      return await getCreatorsPage(request);
    }
    else if (path === '/thumbzilla/getTrendingPornstars') {
      return await getTrendingPornstars(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};