import React, { useState } from 'react'
import { useOutlet, useOutletContext } from 'react-router-dom'

function CreateEntry() {
    const [age, setAge] = useState(null)
    const [name, setName] = useState(null)
    const [gender, setGender] = useState(null)
    const [origin, setOrigin] = useState(null)
    const [message, setMessage] = useState(null)

    const [info, setInfo] = useOutletContext()
    const subHandler = async (e) => {
        try {
            e.preventDefault()
            const refInfo = {
                Age: age, Name: name, Gender: gender, CountryOfOrigin: origin, Message: message
            }
            console.log(info)
            const res = await fetch("http://127.0.0.1:5000/api/post/refugee", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(refInfo),
            })
            const data = await res.json();
            setInfo([...info, refInfo])
        } catch (err) {
            console.log(err)
        }

    }


    return (
        <form onSubmit={subHandler} className='flex-row text-center m-auto'>
            <h1 className='font-bold text-5xl p-10 underline mt-7'>Refugee Entry</h1>
            <input type="text" placeholder='Name' onChange={e => setName(e.target.value)} className='border-black border m-5 w-[50%] block mx-auto' />
            <input type="number" placeholder='Age' onChange={e => setAge(e.target.value)} className='border-black border m-5 w-[50%] block mx-auto' />
            <input type="text" placeholder='Country of origin' onChange={e => setOrigin(e.target.value)} className='border-black border m-5 w-[50%] block mx-auto' />
            <textarea placeholder='Message' onChange={e => setMessage(e.target.value)} className='border-black border m-5 w-[50%] block mx-auto' ></textarea>
            <input type="text" placeholder="Gender" onChange={e => setGender(e.target.value)} className='border-black border m-5 w-[50%] block mx-auto' />
            <button type="submit" className='p-2 rounded-lg bg-yellow-200'>Submit</button>
            {/* <p>Please select your favorite Web language:</p> */}
            {/* <input type="radio" id="html" name="fav_language" value="HTML" />
            <label for="html">HTML</label>
            <input type="radio" id="css" name="fav_language" value="CSS" />
            <label for="css">CSS</label>
            <input type="radio" id="javascript" name="fav_language" value="JavaScript" />
            <label for="javascript">JavaScript</label>
            <button type='submit'></button> */}
        </form>
    )
}

export default CreateEntry