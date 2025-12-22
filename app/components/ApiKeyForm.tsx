'use client'
import { useState, useEffect } from "react";

export default function ApiKeyForm({setAuth}: {setAuth : React.Dispatch<React.SetStateAction<number>>}) {
  const [formInput, setFormInput] = useState<string>("") 
  const [hasCookies, setHasCookies] = useState<boolean>(false) 
  const [showForm, setShowForm] = useState<boolean>(false); 

  async function getCookies() {
    const request = await fetch("/api/get-key")
    const json = await request.json()
    if (json.api_key !== null) {
      setHasCookies(true)
      setAuth((version : number) => version + 1)
    } else {
      setShowForm(true)
    }
  }
  
  async function setCookies(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const request = await fetch("/api/set-key", {
      method : "POST",
      body : JSON.stringify({
        api_key : formInput
      }),
      headers : {
        "Content-Type" : "application/json",
      }
    }) 

    setHasCookies(true)
    setShowForm(false)
    const json = await request.json()
    if (json.success === true) {
      setAuth((version : number) => version + 1)
    } 
  }

  useEffect(() => {
      getCookies()
    }, [])

  return (
    <div>
        <>
          { hasCookies ? 
            <button onClick={() => setShowForm(!showForm)}>
              change API key?
            </button>
            :
            <div> 
              <p>Insert API key</p>
            </div>
          }
          {showForm && <form onSubmit={setCookies}>
            <label htmlFor="ApiKeyInput">
              API key: 
              <input type="text" id="ApiKeyInput" value={formInput} onChange={(e) => {setFormInput(e.target.value)}} />
            </label>
              <button type="submit">fetch</button>
          </form>}
        </>
    </div>
  );
}