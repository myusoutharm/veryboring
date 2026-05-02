export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = request.headers.get('host') || "";
    const path = url.pathname;

    // Helper to check if the request is already pointing to a project folder
    const isProjectFolder = path.startsWith('/it-services/') || path.startsWith('/ai-and-automation/');

    // 1. Routing for southarm.ca
    if (host.includes('southarm.ca')) {
      // If root, serve it-services index
      if (path === '/' || path === '') {
        url.pathname = '/it-services/index.html';
        return env.ASSETS.fetch(url);
      }
      
      // If the request is already directed at a project folder, serve it as-is
      if (isProjectFolder) {
        return env.ASSETS.fetch(request);
      }

      // If it's a file request (has an extension) not in a folder, prefix with it-services
      if (path.includes('.')) {
        url.pathname = `/it-services${path}`;
        return env.ASSETS.fetch(url);
      }
    }

    // 2. Routing for veryboring.ai
    if (host.includes('veryboring.ai')) {
      // If root, serve ai-and-automation index
      if (path === '/' || path === '') {
        url.pathname = '/ai-and-automation/index.html';
        return env.ASSETS.fetch(url);
      }

      // If already directed at a project folder, serve as-is
      if (isProjectFolder) {
        return env.ASSETS.fetch(request);
      }

      // If it's a file request (has an extension) not in a folder, prefix with ai-and-automation
      if (path.includes('.')) {
        url.pathname = `/ai-and-automation${path}`;
        return env.ASSETS.fetch(url);
      }
    }

    // Default: serve as-is
    return env.ASSETS.fetch(request);
  }
};
