import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from "../assets/TRB.png"
import { logout } from "../utils/auth"
console.log(logo)
function Navbar({ user, setUser }) {

    const navigate = useNavigate()
    return (
        <nav className='bg-yellow-100 flex justify-evenly items-center p-4'>
            <Link to='/' className='font-bold text-2xl'>trb<span className='font-extrabold text-4xld'>.</span></Link>
            {user && <Link to='/admin'>Dashboard</Link>}
            <Link to='/about'>About us</Link>
            {!user && <Link to='/login'>Login</Link>}
            {user && <Link type='button' onClick={async (e) => {
                e.preventDefault()
                try {
                    await logout();
                    setUser(null)
                    navigate('/')
                } catch (err) {
                    console.log(err)
                }

            }} >Logout</Link>}
            <Link to='/contact'>Contact</Link>
        </nav>
    )
}

export default Navbar