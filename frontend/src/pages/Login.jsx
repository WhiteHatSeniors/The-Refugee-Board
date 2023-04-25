import React, { useState, useEffect } from "react";
// import useLogin from "../Hooks/useLogin";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { signIn, register } from "../utils/auth";
import { useQuery } from "@tanstack/react-query"
import { useLogin } from "../Hooks/useLogin";
import { useQueryClient, useMutation } from "@tanstack/react-query"
import AxFetch from "../utils/axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);
    // const signInMutation = useLogin()
    const [pw, setPw] = useState("");
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [info, setInfo, user, setUser] = useOutletContext()
    const location = useLocation();

    // useEffect(() => {
    //     console.log(user)
    //     if (location.pathname == '/login') {
    //         console.log('YOOOOOOOOOOOOO')
    //         console.log(user, JSON.parse(localStorage.getItem("id")))
    //         if (user?.CampId || JSON.parse(localStorage.getItem("id"))) navigate('/admin')
    //     }
    // }, [user])


    useEffect(() => {

        async function func() {
            const data = await AxFetch.get('/api/getId');
            const { id } = data.data;
            if (location.pathname == '/login') {
                console.log('HAHAHHAHAHAHAH ', user, id)
                if (!(user?.CampID) && id != undefined) navigate('/admin')
            }
        }

        func()
    }, [user])

    const { mutate: signInMutation, data: userData, error, isError, isLoading, isFetching, status } = useMutation({
        mutationFn: (data) => signIn(data.email, data.password),
        onSuccess: (data) => {
            console.log(data)
            if (data.status <= 299) {
                // setUser(data.data)
                console.log(data.data)
                setUser(data.data)
                localStorage.setItem("id", JSON.stringify(data.data.CampID))
                queryClient.setQueryData(['User'], data)
                setTimeout(() => {
                    navigate('/admin')
                }, 1500)
                setEmail("")
                setPw("")

            }
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { email, password: pw }
        await signInMutation(data)
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
            className="auth-form rounded-3xl flex-col justify-center items-center text-center mr-auto ml-auto mt-20 px-5 py-8 min-w-[10%] max-w-[30%] bg-gray-300"
        >
            <h3 className="font-bold text-xl mb-7 text-center">Sign In</h3>
            {/* <label htmlFor="em">Email</label> */}
            <input
                type="email"
                id="em"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="form-control block w-[75%] mx-auto px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none my-9"
                placeholder="Email address"
            />
            {/* <label htmlFor="pw">Password</label> */}
            <input
                type={passwordShown ? "text" : "password"}
                id="pw"
                onChange={(e) => setPw(e.target.value)}
                value={pw}
                className="form-control block w-[75%] mx-auto px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none my-9"
                placeholder="Password"
            />{" "}
            {passwordShown ? (
                <div className="text-center flex justify-center items-center align-middle m-0 p-0 mt-1 mb-4">
                    <span className="px-3">Hide</span>
                    <AiFillEyeInvisible
                        className=""
                        onClick={togglePassword}
                    />
                </div>
            ) : (
                <div className="text-center flex justify-center items-center align-middle m-0 p-0 mt-1 mb-4">
                    <span className="px-3">Show</span>
                    <AiFillEye
                        className=""
                        onClick={togglePassword}
                    />
                </div>
            )}
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
                Sign In
            </button>
            <Link to="/signup" className="block">
                Not yet registered?{" "}
                <span className="underline text-blue-900 hover:text-white">Signup</span>
            </Link>
            {userData?.status >= 400 && <div className="p-2 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-600" role="alert">
                <span className="font-medium">{userData?.error}</span></div>}
            {userData?.status < 299 && <div className="p-2 my-4 text-sm text-green-800 rounded-lg bg-green-50 dark:text-green-600" role="alert">
                <span className="font-medium">Succesfully Logged in!</span></div>}

            {isError && <p>Unfortunate Error encounterd {error}</p>}
        </form>
    );
}