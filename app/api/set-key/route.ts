// app/api/set-key/route.ts
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const { key } = await req.json()

  if (!key) {
    return Response.json({ error: "No API key provided" }, { status: 400 })
  }

  cookies().set("govee_api_key", key, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  })

  return Response.json({ message: "API key saved successfully" })
}

