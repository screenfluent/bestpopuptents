import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  console.log("🔍 URL:", context.url.pathname);

  // Jeśli URL zawiera multiple slashes
  if (context.url.pathname.includes("//")) {
    const cleanPath = context.url.pathname.replace(/\/+/g, "/");
    return new Response(null, {
      status: 301,
      headers: {
        Location: `${context.url.origin}${cleanPath}`,
      },
    });
  }

  // Dodaj debug info do locals
  context.locals.debug = {
    timestamp: new Date().toISOString(),
    path: context.url.pathname,
  };

  // Kontynuuj do następnego middleware/handlera
  const response = await next();

  // Dodaj security headers
  const newHeaders = new Headers(response.headers);
  newHeaders.set("X-Content-Type-Options", "nosniff");
  newHeaders.set("X-Frame-Options", "DENY");
  newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
});
