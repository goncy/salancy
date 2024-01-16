import type {NextRequest} from "next/server";

import {revalidatePath} from "next/cache";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  if (params.get("secret") !== process.env.SECRET) {
    return new Response("Invalid secret", {
      status: 403,
      statusText: "Forbidden",
    });
  }

  revalidatePath("/");

  return Response.json({revalidated: true});
}
