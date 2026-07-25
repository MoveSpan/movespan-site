export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/__/auth/')) {
      const target = new URL(url.pathname + url.search, 'https://movewell-system.firebaseapp.com');
      return fetch(new Request(target.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body
      }));
    }
    
    return env.ASSETS.fetch(request);
  }
}
