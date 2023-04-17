import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
// import AuthContextProvider from "./Hooks/AuthContext"

function Root() {
    const [info, setInfo] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/get/all/refugees')
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setInfo(response);
            }).catch(error => console.log(error))

    }, [])
    return (

        <div className='text-center font-poppins'>
            <Navbar />
            <Outlet context={[info, setInfo]} />
        </div>

    )
}

export default Root
