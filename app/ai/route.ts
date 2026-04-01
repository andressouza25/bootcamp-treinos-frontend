import { NextResponse } from "next/server";

const hopByHopHeaders = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

export async function POST(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }

  const requestHeaders = new Headers();

  request.headers.forEach((value, key) => {
    if (hopByHopHeaders.has(key.toLowerCase())) {
      return;
    }

    requestHeaders.set(key, value);
  });

  const response = await fetch(`${apiUrl}/ai/`, {
    body: request.body,
    duplex: "half",
    headers: requestHeaders,
    method: "POST",
  } as RequestInit & { duplex: "half" });

  const responseHeaders = new Headers();

  response.headers.forEach((value, key) => {
    if (hopByHopHeaders.has(key.toLowerCase())) {
      return;
    }

    responseHeaders.set(key, value);
  });

  return new Response(response.body, {
    headers: responseHeaders,
    status: response.status,
    statusText: response.statusText,
  });
}
