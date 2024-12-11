import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Usuń multiple slashes
  if (url.pathname.includes("//")) {
    const cleanPath = url.pathname.replace(/\/+/g, "/");
    return new Response(null, {
      status: 301,
      headers: {
        Location: `${url.origin}${cleanPath}`,
      },
    });
  }

  // Usuń trailing slash (jeśli nie jest to root URL)
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: `${url.origin}${url.pathname.slice(0, -1)}${url.search}`,
      },
    });
  }

  return next();
});
