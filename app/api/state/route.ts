import { NextRequest, NextResponse } from "next/server";
const url = "https://openapi.api.govee.com/router/api/v1/device/state"
import { cookies } from "next/headers";

export async function POST(request:NextRequest) {
    const cookieStore = await cookies();
    const api_key = cookieStore.get("govee_api_key")?.value;

    if (!api_key) {
        return NextResponse.json({ error: "Missing API key" }, { status: 401 });
    }

    const device = await request.json() 

    const response = await fetch(url, {
        method: "POST", 
        headers : {
            "Content-Type" : "application/json", 
            "Govee-API-Key" : api_key
        },

        body : JSON.stringify({
            "requestId": "uuid",
            "payload": {
                "sku": device.sku,
                "device": device.ID
            }
        })
    })

    const data = await response.json()

    return new Response(
        JSON.stringify(data), 
        {
            headers : {
                "Content-Type" : "application/json", 
            } 
        }
    )
}