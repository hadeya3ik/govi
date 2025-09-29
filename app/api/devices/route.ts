import {NextRequest} from 'next/server'
const url = "https://openapi.api.govee.com/router/api/v1/user/devices"

export async function POST(request:NextRequest) {
    const clientResponse = await request.json() 
    const {api_key} = clientResponse
    console.log(api_key)

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