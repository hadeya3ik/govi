import {NextRequest, NextResponse} from 'next/server'
const url = "https://openapi.api.govee.com/router/api/v1/user/devices"
import { cookies } from 'next/headers'

export async function GET(request:NextRequest) {
    const cookieStore = await cookies();
    const api_key = cookieStore.get("govee_api_key")?.value;

    if (!api_key) {
        return NextResponse.json({ error: "Missing API key" }, { status: 401 });
    }
    // const clientResponse = await request.json() 
    // const {api_key} = clientResponse
    // console.log(api_key)

    const serverRequest = await fetch( 
        url,
        {
            method : "GET", 
            headers : {
                "Content-Type" : "application/json", 
                "Govee-API-Key" : api_key
            }
        }
    )

    const serverResponse = await serverRequest.json()
    console.log(serverResponse)

    return new Response(
        JSON.stringify(serverResponse), 
        {headers : {
            "Content-Type" : "application/json"
        }}
    )
}