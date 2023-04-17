import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/TRB.png"
console.log(logo)
function Navbar() {
    return (
        <nav className='bg-yellow-100 flex justify-evenly items-center p-4'>
            <Link to='/' className='font-bold text-2xl'>trb<span className='font-extrabold text-4xld'>.</span></Link>
            <Link to='/admin'>Dashboard</Link>
            <Link to='/about'>About us</Link>
            <Link to='/login'>Login</Link>
            <Link to='/contact'>Contact</Link>
        </nav>
    )
}

export default Navbar