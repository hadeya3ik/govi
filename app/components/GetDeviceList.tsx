'use client'
import React, {useState} from 'react'
import Device from '@/app/components/Device'

function ApiKeyForm({handleChange, handleSubmit, ApiKey}) {
  return (
    <form onSubmit={handleSubmit}>
        <label htmlFor="">
          API key: 
          <input type="text" id="ApiKeyInput" value={ApiKey} onChange={handleChange} />
        </label>
        <button type="submit">fetch</button>
    </form>
  ) 
}

function GetDeviceList() {
  const [value, setValue] = useState("7caf011b-ffe2-40de-a065-cdb5658b2442")
  const [data, setData] = useState(null)

  async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const response = await fetch("/api/devices", 
        {
            body : JSON.stringify({api_key : value}),
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            }
        })
    const json = await response.json()
    console.log(json)
    setData(json.data.filter((device) => device.type === "devices.types.light"))
    console.log(data)
  } 

  const handleChange = ((e : React.ChangeEvent<HTMLInputElement>) =>{
    setValue(e.target.value);
  })


  return (
    <>
      <ApiKeyForm handleChange={handleChange} handleSubmit={handleSubmit} ApiKey={value} ></ApiKeyForm>
      <p>{value}</p>
      {data !== null && data.map((item) => <Device data={item} key={item.device} ></Device>)}
    </>
  )
}

export default GetDeviceList