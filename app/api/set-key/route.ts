import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const {api_key}  = await request.json() 
  console.log("received ", api_key)
  if (!api_key) {
    return NextResponse.json({ error: "API key required" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("govee_api_key", api_key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}
