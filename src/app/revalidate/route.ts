import type {NextRequest} from "next/server";

import {revalidatePath, revalidateTag} from "next/cache";

export async function POST(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  if (params.get("secret") !== process.env.SECRET) {
    return new Response("Invalid secret", {
      status: 403,
      statusText: "Forbidden",
    });
  }

  if (params.has("tag")) {
    revalidateTag(params.get("tag")!);
  } else {
    revalidatePath("/");
  }

  return Response.json({revalidated: true});
}
