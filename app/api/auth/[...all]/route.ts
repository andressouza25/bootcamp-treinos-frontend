import { NextRequest } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getProxyUrl = (request: NextRequest, pathSegments?: string[]) => {
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const authPath = pathSegments?.join("/") ?? "";
  const targetUrl = new URL(`/api/auth/${authPath}`, apiUrl);
  targetUrl.search = request.nextUrl.search;

  return targetUrl;
};

const proxyAuthRequest = async (
  request: NextRequest,
  pathSegments?: string[],
) => {
  const targetUrl = getProxyUrl(request, pathSegments);
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("host", targetUrl.host);

  const response = await fetch(targetUrl, {
    body: request.body,
    cache: "no-store",
    duplex: "half",
    headers: requestHeaders,
    method: request.method,
    redirect: "manual",
  });

  return new Response(response.body, {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  });
};

type RouteContext = {
  params: Promise<{ all?: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { all } = await context.params;

  return proxyAuthRequest(request, all);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { all } = await context.params;

  return proxyAuthRequest(request, all);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { all } = await context.params;

  return proxyAuthRequest(request, all);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { all } = await context.params;

  return proxyAuthRequest(request, all);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { all } = await context.params;

  return proxyAuthRequest(request, all);
}

export async function OPTIONS(request: NextRequest, context: RouteContext) {
  const { all } = await context.params;

  return proxyAuthRequest(request, all);
}
