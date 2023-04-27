import React, { useState, useEffect } from "react";
// import useLogin from "../Hooks/useLogin";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"
import { useLogin } from "../Hooks/useLogin";
import { useQueryClient, useMutation } from "@tanstack/react-query"
import AxFetch from "../utils/axios";
import SucMessage from "../components/SucMessage";
import ErrMessage from "../components/ErrMessage";
import { forgotPw } from "../utils/extras";

export default function Login() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate()
    const [info, setInfo, user, setUser] = useOutletContext()

    useEffect(() => {

        async function func() {
            const data = await AxFetch.get('/api/getId');
            const { id } = data.data;
            if (location.pathname == '/forgot-password') {
                console.log('HAHAHHAHAHAHAH ', user, id)
                if (id != undefined) navigate('/admin')
            }
        }

        func()
    }, [user])

    const { mutate: forgotPwMutation, data: userData, error, isError, isLoading, isFetching, status } = useMutation({
        mutationFn: (email) => forgotPw(email),
        onSuccess: (data) => {
            console.log(data)
            if (data.status <= 299) {
                console.log(data.data)
                setEmail("")
            }
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await forgotPwMutation(email)
        // setTimeout(() => {
        //     navigate("/attendance");
        // }, 1500);
    };

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    console.log("ERRRRR ", error, isError)
    console.log("isLoading ", isLoading, "status", status);
    return (
        <form
            onSubmit={handleSubmit}
            className="auth-form rounded-3xl flex-col justify-center items-center text-center mr-auto ml-auto mt-20 px-5 py-8 min-w-[10%] max-w-[30%] bg-gray-300 font-mono"
        >
            <h3 className="font-bold text-xl mb-7 text-center">Forgot Password?</h3>
            {/* <label htmlFor="em">Email</label> */}
            <input
                type="email"
                id="em"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="form-control block w-[75%] mx-auto px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none my-9"
                placeholder="Email address"
            />
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
                Send me an Email!
            </button>
            <p className='text-gray-800 text-sm mb-2'>Note: The Reset Password URL will expire in 5 minutes.</p>
            {userData?.status >= 400 && <ErrMessage>{userData?.error}</ErrMessage>}
            {userData?.status < 299 && <SucMessage>{userData?.data}</SucMessage>}

            {isError && <p>Unfortunate Error encounterd {error}</p>}
        </form>
    );
}