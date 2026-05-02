export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = request.headers.get('host') || "";

    // 1. Routing for southarm.ca
    if (host.includes('southarm.ca')) {
      // If the request is for the root, serve the it-services index
      if (url.pathname === '/' || url.pathname === '') {
        url.pathname = '/it-services/index.html';
        return env.ASSETS.fetch(url);
      }
      
      // If the request is already for /it-services/..., serve it as-is
      if (url.pathname.startsWith('/it-services/')) {
        return env.ASSETS.fetch(request);
      }

      // Optional: If you want southarm.ca/pricing.html to work by looking in it-services/
      // we check if it's an asset (has an extension) and prefix it
      if (url.pathname.includes('.')) {
        // Try to serve from it-services folder
        const itServicesUrl = new URL(url);
        itServicesUrl.pathname = `/it-services${url.pathname}`;
        return env.ASSETS.fetch(itServicesUrl);
      }
    }

    // 2. Routing for veryboring.ai
    if (host.includes('veryboring.ai')) {
      // If the request is for the root, serve the ai-and-automation index
      if (url.pathname === '/' || url.pathname === '') {
        url.pathname = '/ai-and-automation/index.html';
        return env.ASSETS.fetch(url);
      }

      // If the request is already for /ai-and-automation/..., serve it as-is
      if (url.pathname.startsWith('/ai-and-automation/')) {
        return env.ASSETS.fetch(request);
      }

      // Optional: Prefix assets
      if (url.pathname.includes('.')) {
        const aiUrl = new URL(url);
        aiUrl.pathname = `/ai-and-automation${url.pathname}`;
        return env.ASSETS.fetch(aiUrl);
      }
    }

    // Default: serve the request as-is from the static files
    return env.ASSETS.fetch(request);
  }
};
