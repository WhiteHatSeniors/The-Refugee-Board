import React, { useState, useEffect } from "react";
// import useLogin from "../Hooks/useLogin";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { adminSignIn } from "../utils/auth";
import { useLogin } from "../Hooks/useLogin";
import AxFetch from "../utils/axios";
import SucMessage from "../components/SucMessage";
import ErrMessage from "../components/ErrMessage";

export default function Login() {
    const [username, setUsername] = useState("");
    const [pw, setPw] = useState("");
    const navigate = useNavigate()
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false)
    const [userData, setUserData] = useState({})


    useEffect(() => {

        async function func() {
            const data = await AxFetch.get('/api/getAdminId');
            const { id } = data.data;
            if (location.pathname == '/admin-login') {
                console.log('HAHAHHAHAHAHAH ', id)
                if (id != undefined) navigate('/admin-dashboard')
            }
        }

        func()
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const data = await adminSignIn(username, pw)
        console.log(data)
        setUserData(data)
        if (data.error) setIsLoading(false)
        else setTimeout(() => {
            // queryClient.setQueryData(['User'], data)
            console.log("In set timeout")
            setIsLoading(false)
            setUsername("")
            setPw("")
            navigate('/admin-dashboard')
        }, 1500)

        // setTimeout(() => {
        //     navigate("/attendance");
        // }, 1500);
    };

    console.log("ERRRRR ", userData?.error)
    console.log("isLoading ", isLoading);
    return (
        <form
            onSubmit={handleSubmit}
            className="auth-form rounded-3xl flex-col justify-center items-center text-center mr-auto ml-auto mt-20 px-5 py-8 min-w-[10%] max-w-[30%] bg-gray-300 font-mono"
        >
            <h3 className="font-bold text-xl mb-7 text-center">Admin Log In</h3>
            {/* <label htmlFor="em">username</label> */}
            <input
                type="text"
                id="em"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className="form-control block w-[75%] mx-auto px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none my-9"
                placeholder="Username"
            />
            {/* <label htmlFor="pw">Password</label> */}
            <input
                type="password"
                id="pw"
                onChange={(e) => setPw(e.target.value)}
                value={pw}
                className="form-control block w-[75%] mx-auto px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none my-9"
                placeholder="Password"
            />{" "}
            <button
                // disabled={isLoading}
                // onClick={(e) => {
                //     setTimeout(() => {
                //         navigate('/admin')
                //     }, 1000)
                // }}
                className={isLoading ? "inline-block px-7 py-3 w-[75%] bg-slate-500 text-black" : "inline-block px-7 py-3 w-[75%] bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mb-8"}
                disabled={isLoading ? true : false}
                type="submit"
            >
                Log In
            </button>
            {userData?.status >= 400 && <ErrMessage>{userData?.error}</ErrMessage>}
            {userData?.status < 299 && <SucMessage>Succesfully Logged in!</SucMessage>}
            <Link to='/' className="block underline text-blue-700 hover:text-white mt-5" >Return to home page</Link>

            {/* {error && <p>Unfortunate Error encounterd {error}</p>} */}
        </form>
    );
}