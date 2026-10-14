const VIDEO_KEY = "california-gold-rush.mp4";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/video/california-gold-rush.mp4") {
      return env.ASSETS.fetch(request);
    }

    const range = parseRange(request.headers.get("Range"));
    const object = await env.VIDEO.get(VIDEO_KEY, range ? { range } : undefined);

    if (object === null) {
      return new Response("Video not found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("accept-ranges", "bytes");
    headers.set("content-type", "video/mp4");
    headers.set("cache-control", "public, max-age=86400");

    if (range) {
      const offset = object.range?.offset ?? range.offset ?? 0;
      const length = object.range?.length ?? object.size - offset;
      headers.set("content-range", `bytes ${offset}-${offset + length - 1}/${object.size}`);
      headers.set("content-length", String(length));
      return new Response(request.method === "HEAD" ? null : object.body, {
        status: 206,
        headers,
      });
    }

    headers.set("content-length", String(object.size));
    return new Response(request.method === "HEAD" ? null : object.body, { headers });
  },
};

function parseRange(header) {
  if (!header) return undefined;
  const match = /^bytes=(\d+)-(\d*)$/.exec(header.trim());
  if (!match) return undefined;
  const offset = Number(match[1]);
  if (!Number.isFinite(offset)) return undefined;
  if (match[2] === "") return { offset };
  const end = Number(match[2]);
  if (!Number.isFinite(end) || end < offset) return undefined;
  return { offset, length: end - offset + 1 };
}
