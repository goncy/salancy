import type {NextRequest} from "next/server";

import {revalidateTag} from "next/cache";

export async function POST(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  if (params.get("secret") !== process.env.SECRET) {
    return new Response("Invalid secret", {
      status: 403,
      statusText: "Forbidden",
    });
  }

  revalidateTag(params.get("tag") || "/");

  return Response.json({revalidated: true});
}
