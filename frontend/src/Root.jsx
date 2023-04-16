import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
// import AuthContextProvider from "./Hooks/AuthContext"

function Root() {
    const [info, setInfo] = useState(null);
    return (

        <div className='text-center font-poppins'>
            <Navbar />
            <Outlet context={[info, setInfo]} />
        </div>

    )
}

export default Root
