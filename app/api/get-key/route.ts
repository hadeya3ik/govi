import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const api_key = cookieStore.get("govee_api_key")?.value || null;

  return NextResponse.json({ api_key });
}