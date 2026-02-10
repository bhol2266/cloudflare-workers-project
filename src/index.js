import chutlundsRouter from './chutlunds/index.js';
import thumbzillaRouter from './thumbzilla/index.js';
import desikahanyaRouter from './desikahaniya/index.js';
import xgroovyRouter from './xgroovy/index.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Route requests based on path prefix
      if (path.startsWith('/chutlunds')) {
        return await chutlundsRouter.fetch(request);
      } if (path.startsWith('/thumbzilla')) {
        return await thumbzillaRouter.fetch(request);
      } else if (path.startsWith('/desikahaniya')) {
        return await desikahanyaRouter.fetch(request);
      } else if (path.startsWith('/xgroovy')) {
        return await xgroovyRouter.fetch(request);
      }

      return new Response('Not Found', {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};