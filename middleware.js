export default function middleware(req) {
  const auth = req.headers.get('Authorization') || '';
  const [scheme, encoded] = auth.split(' ');

  if (scheme === 'Basic' && encoded) {
    try {
      const decoded = atob(encoded);
      const colonIdx = decoded.indexOf(':');
      const user = decoded.substring(0, colonIdx);
      const pass = decoded.substring(colonIdx + 1);

      if (user === process.env.UDI && pass === process.env.UDIPW) {
        return; // ✅ Authenticated — serve the static file
      }
    } catch (_) {}
  }

  // ❌ Not authenticated — prompt browser login dialog
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="The Marketing Cloud", charset="UTF-8"',
    },
  });
}

export const config = {
  // Protect all routes except Vercel internals
  matcher: ['/((?!_vercel|_next|favicon.ico).*)'],
};
