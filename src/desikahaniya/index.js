import { getVideos } from "./getVideos";


export default {
    async fetch(request) {
      const url = new URL(request.url);
      const path = url.pathname;
  
      if (path === '/desikahaniya/getVideos') {
        return await getVideos();
      }
      // Add more endpoints as needed
  
      return new Response('Not Found', { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
