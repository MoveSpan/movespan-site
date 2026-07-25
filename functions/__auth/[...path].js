export async function onRequest(context) {
  const url = new URL(context.request.url);
  const target = new URL(
    url.pathname + url.search,
    'https://movewell-system.firebaseapp.com'
  );
  const req = new Request(target.toString(), {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
    redirect: 'follow'
  });
  const response = await fetch(req);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
