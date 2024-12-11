import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Jeśli jest więcej niż jeden slash z rzędu
  if (url.pathname.includes("//")) {
    // Normalizuj ścieżkę - zamień wszystkie multiple slashes na pojedynczy
    const normalizedPath = url.pathname.replace(/\/+/g, "/");

    return new Response(null, {
      status: 301,
      headers: {
        Location: `${url.origin}${normalizedPath}${url.search}`,
      },
    });
  }

  // Usuń trailing slash (ale nie dla root path)
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: `${url.origin}${url.pathname.slice(0, -1)}${url.search}`,
      },
    });
  }

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
