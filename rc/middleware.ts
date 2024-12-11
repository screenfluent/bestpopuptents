import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Normalizuj ścieżkę - usuń multiple slashes i trailing slash
  const normalizedPath = url.pathname
    .replace(/\/+/g, "/") // zamień multiple slashes na pojedynczy
    .replace(/\/$/, ""); // usuń trailing slash (jeśli nie jest to root)

  // Jeśli ścieżka została zmieniona, zrób redirect
  if (url.pathname !== normalizedPath && url.pathname !== "/") {
    return new Response(null, {
      status: 301,
      headers: {
        Location: `${url.origin}${normalizedPath}${url.search}`,
      },
    });
  }

  // Dodaj security headers
  const response = await next();
  const newHeaders = new Headers(response.headers);
  newHeaders.set("X-Content-Type-Options", "nosniff");
  newHeaders.set("X-Frame-Options", "DENY");
  newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
});
