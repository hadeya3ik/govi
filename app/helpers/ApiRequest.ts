export async function sendControlRequest(
    ID : string,
    sku : string, 
    value : number,
    instance : string, 
    type : string) 
  {

  await fetch("/api/control", 
    {
      method : "POST",
      body : JSON.stringify({
        ID,
        sku,
        value,
        instance, 
        type
      }),
      headers : {
        "Content-Type" : "application/json",
      }
    })
}

export async function ControlDevices(
  Ids : string[],
  sku : string, 
  value : number,
  instance : string, 
  type : string) 
  {
  await Promise.all(
    Ids.map(id => {
      sendControlRequest(
        id,
        sku,
        value,
        instance,
        type
      )
    })
  )
}

