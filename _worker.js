export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Firebase auth proxy
    if (path.startsWith('/__/auth/')) {
      const target = new URL(path + url.search, 'https://movewell-system.firebaseapp.com');
      return fetch(new Request(target.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body
      }));
    }

    // SPA routing — map paths to HTML files
    const routes = {
      '/auth': '/auth.html',
      '/program': '/program.html',
      '/onboarding': '/onboarding.html',
      '/test': '/test.html',
      '/zones': '/zones.html',
      '/reset': '/reset.html',
      '/inventory': '/inventory.html',
      '/journal': '/journal.html',
      '/visual': '/visual.html',
      '/measure': '/measure.html',
      '/sleep': '/sleep.html',
      '/metronome': '/metronome.html',
    };

    const mapped = routes[path];
    if (mapped) {
      const newUrl = new URL(mapped, url.origin);
      return env.ASSETS.fetch(new Request(newUrl.toString(), request));
    }

    // Default — serve as-is
    return env.ASSETS.fetch(request);
  }
}
