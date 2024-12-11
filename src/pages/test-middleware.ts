// src/pages/test-middleware.ts
export async function get() {
  return new Response(
    JSON.stringify({
      message: "Test endpoint",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
