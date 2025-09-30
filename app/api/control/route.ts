import { NextRequest, NextResponse } from "next/server";
const url = "https://openapi.api.govee.com/router/api/v1/device/control"
import { cookies } from "next/headers";

export async function POST( request:NextRequest ) {
    const cookieStore = await cookies();
    const api_key = cookieStore.get("govee_api_key")?.value;

    if (!api_key) {
        return NextResponse.json({ error: "Missing API key" }, { status: 401 });
    }
    
    const device = await request.json() 

    const req = await fetch(url, {
        body : JSON.stringify({
            "requestId": "uuid",
            "payload": {
            "sku": device.sku,
            "device": device.ID,
              "capability": {
                "type": device.type,
                "instance": device.instance,
                "value": device.value
              }
            }
          }),
        method : "POST",
        headers: {
            "Content-Type" : "application/json", 
            "Govee-API-Key" : api_key
        }, 
    })

    const data = await req.json()
    console.log(data)

    return new Response(
        JSON.stringify({a : "successful"}), 
        {
            headers : {
                "Content-Type" : "application/json", 
            } 
        }
    )
}