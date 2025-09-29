import { NextRequest } from "next/server";
const url = "https://openapi.api.govee.com/router/api/v1/device/state"

export async function POST(request:NextRequest) {
    const device = await request.json() 

    const response = await fetch(url, {
        method: "POST", 
        headers : {
            "Content-Type" : "application/json", 
            "Govee-API-Key" : "7caf011b-ffe2-40de-a065-cdb5658b2442"
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