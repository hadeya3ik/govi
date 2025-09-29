import { NextRequest } from "next/server";
const url = "https://openapi.api.govee.com/router/api/v1/device/control"

export async function POST( request:NextRequest ) {
    const device = await request.json() 

    const req = await fetch(url, {
        body : JSON.stringify({
            "requestId": "uuid",
            "payload": {
            "sku": "H6008",
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
            "Govee-API-Key" : "7caf011b-ffe2-40de-a065-cdb5658b2442"
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