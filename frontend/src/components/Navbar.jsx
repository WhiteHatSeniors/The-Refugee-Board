import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from "../assets/TRB.png"
import { logout } from "../utils/auth"
import { deleteAcc } from '../utils/extras'
console.log(logo)
function Navbar({ user, setUser }) {

    const navigate = useNavigate()
    return (
        <nav className='bg-yellow-100 flex justify-evenly items-center p-4 font-mono'>
            <Link to='/' className='font-bold text-2xl'>trb<span className='font-extrabold text-4xld'>.</span></Link>
            {user && <Link to='/camp-dashboard'>Dashboard</Link>}
            <Link to='/about'>About us</Link>
            <Link to='/contact'>Contact</Link>
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
            <div>
                {user && <Link to='/edit-profile' className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-green-600 dark:hover:bg-green-700 mx-3" type='button' state={user} >Edit Profile</Link>}
                {user && <Link className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 mx-3" type='button' onClick={async (e) => {
                    // e.preventDefault()
                    try {
                        const con1 = confirm("Do you want to delete the camp?")
                        if (con1) {
                            const con2 = confirm("This action is irreversible. Are you sure you want to delete the Camp?")
                            if (con2) {
                                await deleteAcc();
                                setUser(null)
                                navigate('/')
                            }

                        }
                    } catch (err) {
                        console.log(err)
                    }

                }} >Delete Camp</Link>}
            </div>


        </nav>
    )
}

export default Navbar