// +server.js
export function GET() {
  const data = { message: 'Hello World from SvelteKit endpoint' };
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
